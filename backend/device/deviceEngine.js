import { execSync } from 'child_process';
import os from 'os';
import { db } from '../database/db.js';

/**
 * Parses simple Apple Plist XML dictionary into a JS object.
 */
function parsePlistDict(xml) {
  const obj = {};
  const regex = /<key>([^<]+)<\/key>\s*(?:<(string|integer)>([^<]*)<\/\2>|<(true|false)\/>)/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const key = match[1];
    if (match[4] === 'true') {
      obj[key] = true;
    } else if (match[4] === 'false') {
      obj[key] = false;
    } else if (match[2] === 'integer') {
      obj[key] = parseInt(match[3], 10);
    } else {
      obj[key] = match[3] || '';
    }
  }
  return obj;
}

/**
 * Formats byte size into human readable capacity string (GB/TB/MB).
 */
function formatBytes(bytes) {
  if (!bytes || isNaN(bytes) || bytes <= 0) return 'Unknown';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Detects real physical connected storage hardware using native macOS diskutil commands.
 */
export function detectRealHardwareDevices() {
  const detectedDevices = [];

  try {
    const platform = os.platform();

    if (platform === 'darwin') {
      // 1. Get whole disk list using diskutil list -plist
      const listOutput = execSync('diskutil list -plist', { encoding: 'utf8', timeout: 5000 });
      
      // Extract whole disk identifiers (disk0, disk1, disk2, etc.)
      const wholeDiskMatches = [...listOutput.matchAll(/<key>WholeDisks<\/key>\s*<array>([\s\S]*?)<\/array>/g)];
      const wholeDisks = [];
      
      if (wholeDiskMatches.length > 0) {
        const diskStrMatches = [...wholeDiskMatches[0][1].matchAll(/<string>([^<]+)<\/string>/g)];
        diskStrMatches.forEach(m => wholeDisks.push(m[1]));
      }

      // If wholeDisks couldn't be parsed, fallback to disk0..disk9 probe
      const diskList = wholeDisks.length > 0 ? wholeDisks : ['disk0', 'disk1', 'disk2', 'disk3'];

      diskList.forEach(diskId => {
        try {
          const infoOutput = execSync(`diskutil info -plist ${diskId}`, { encoding: 'utf8', timeout: 3000 });
          const info = parsePlistDict(infoOutput);

          if (!info.DeviceIdentifier) return;

          const devicePath = info.DeviceNode || `/dev/${info.DeviceIdentifier}`;
          const mediaName = info.MediaName || info.IORegistryEntryName || `Storage Drive (${diskId})`;
          const sizeBytes = info.TotalSize || info.Size || 0;
          const capacityStr = formatBytes(sizeBytes);
          const busProtocol = info.BusProtocol || (info.Internal ? 'Internal' : 'USB / External');
          const isSolidState = Boolean(info.SolidState);
          const isRemovable = Boolean(info.Removable || info.RemovableMediaOrExternalDevice || info.Ejectable);
          const isInternal = Boolean(info.Internal);
          const mountPoint = info.MountPoint || '';

          // Determine if this is an internal macOS system/boot disk or container
          const isSystemDisk = isInternal || (
            diskId === 'disk0' ||
            mountPoint === '/' ||
            mountPoint.includes('/System/Volumes') ||
            Boolean(info.OSInternalMedia) ||
            (info.VolumeName && (info.VolumeName.includes('Macintosh HD') || info.VolumeName.includes('System')))
          );

          // Determine Storage Media Type
          let typeStr = 'HDD';
          if (isSolidState && busProtocol.toUpperCase().includes('NVME')) {
            typeStr = 'NVMe SSD';
          } else if (isSolidState) {
            typeStr = 'SATA SSD';
          } else if (busProtocol.toUpperCase().includes('USB') || isRemovable) {
            typeStr = 'USB Flash / Removable Storage';
          }

          let recommendedWorkflow = 'NIST 800-88 Clear: 2-Pass Zero-Fill + Pattern Overwrite';
          if (isSystemDisk) {
            recommendedWorkflow = 'SYSTEM DISK PROTECTED - Data Sanitization Blocked';
          } else if (isSolidState) {
            recommendedWorkflow = 'NIST 800-88 Purge: NVMe Cryptographic Sanitize / Block Erase + TRIM';
          } else if (!isRemovable) {
            recommendedWorkflow = 'Multi-Pass DoD 5220.22-M Overwrite (3 Passes)';
          }

          const deviceRecord = {
            id: `DEV-HW-${diskId}`,
            name: mediaName,
            devicePath,
            type: typeStr,
            capacity: capacityStr,
            capacityBytes: sizeBytes,
            filesystem: info.Content || info.FilesystemName || (isSystemDisk ? 'APFS (System)' : 'ExFAT / FAT32 / NTFS'),
            partitionInfo: `${info.Content || 'GUID_partition_scheme'} (${busProtocol})`,
            sectorSize: `${info.DeviceBlockSize || 512} bytes`,
            mountStatus: mountPoint ? `Mounted (${mountPoint})` : 'Unmounted',
            readOnlyStatus: Boolean(isSystemDisk || info.Writable === false),
            removable: isRemovable,
            isSystemDisk,
            busProtocol,
            smartStatus: info.SMARTStatus || 'Verified',
            recommendedWorkflow
          };

          detectedDevices.push(deviceRecord);
        } catch (e) {
          // Skip non-existent disk devices
        }
      });
    } else if (platform === 'linux') {
      const output = execSync('lsblk -J -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT,RO,MODEL', { encoding: 'utf8', timeout: 3000 });
      const parsed = JSON.parse(output);
      if (parsed && parsed.blockdevices) {
        parsed.blockdevices.forEach(dev => {
          detectedDevices.push({
            id: `DEV-HW-${dev.name}`,
            name: dev.model || `Linux Storage Device (/dev/${dev.name})`,
            devicePath: `/dev/${dev.name}`,
            type: dev.type === 'disk' ? 'HDD / SSD' : 'Partition',
            capacity: dev.size,
            filesystem: dev.fstype || 'EXT4 / NTFS',
            partitionInfo: `Mount: ${dev.mountpoint || 'Unmounted'}`,
            sectorSize: '512 bytes',
            mountStatus: dev.mountpoint ? 'Mounted' : 'Unmounted',
            readOnlyStatus: Boolean(dev.ro),
            removable: dev.name.startsWith('sd') || dev.name.startsWith('mmc'),
            isSystemDisk: dev.mountpoint === '/',
            recommendedWorkflow: 'NIST 800-88 Standard Overwrite'
          });
        });
      }
    }
  } catch (err) {
    console.warn('[!] Real hardware detection notice:', err.message);
  }

  // Sync real detected hardware devices into the database
  if (detectedDevices.length > 0) {
    detectedDevices.forEach(hwDev => {
      const existing = db.getById('devices', hwDev.id);
      if (!existing) {
        db.insert('devices', hwDev);
      } else {
        db.update('devices', hwDev.id, hwDev);
      }
    });
  }

  return detectedDevices;
}

/**
 * Device Analysis & Media Intelligence Engine
 */
export function analyzeDevice(deviceId) {
  detectRealHardwareDevices();

  const device = db.getById('devices', deviceId);
  if (!device) {
    throw new Error(`Device ${deviceId} not found`);
  }

  let mediaIntelligence = {};

  if (device.isSystemDisk) {
    mediaIntelligence = {
      mediaClass: 'PRIMARY MACOS SYSTEM BOOT DISK (PROTECTED)',
      recommendedSanitization: 'BLOCKED: System disk sanitization is prohibited to prevent OS destruction.',
      wearLevelingWarning: 'System disk contains active macOS system partitions, recovery containers, and boot volumes.',
      forensicAcquisitionNote: 'Live volume imaging or read-only targeted evidence extraction supported.'
    };
  } else {
    switch ((device.type || '').toUpperCase()) {
      case 'NVME SSD':
      case 'SATA SSD':
      case 'SSD':
        mediaIntelligence = {
          mediaClass: 'Solid State Drive (NAND Flash)',
          recommendedSanitization: 'NIST 800-88 Purge: NVMe Format (Sanitize / Crypto Erase) + TRIM Command',
          wearLevelingWarning: 'Traditional multi-pass block overwriting is INEFFECTIVE on SSDs due to Wear-Leveling controller mappings. Use ATA/NVMe Sanitize firmware commands.',
          forensicAcquisitionNote: 'Use hardware write-blocker to prevent background TRIM/Garbage Collection from destroying unallocated space.'
        };
        break;

      case 'HDD':
        mediaIntelligence = {
          mediaClass: 'Magnetic Platter (HDD)',
          recommendedSanitization: 'NIST 800-88 Clear/Purge: DoD 5220.22-M 3-Pass Overwrite or Gutmann 35-Pass Algorithm',
          wearLevelingWarning: 'Magnetic platter supports direct sector overwrite. Pass 1: 0x00, Pass 2: 0xFF, Pass 3: Random + Verification.',
          forensicAcquisitionNote: 'Direct bitstream imaging (dd / E01) recommended.'
        };
        break;

      default:
        mediaIntelligence = {
          mediaClass: 'Removable Storage Media (USB Flash / SanDisk / SD Card / External Drive)',
          recommendedSanitization: '2-Pass Overwrite (Zero-Fill + Pseudorandom Pattern)',
          wearLevelingWarning: 'Basic controller wear-leveling present. Overwrite entire user addressable logical block addresses (LBA).',
          forensicAcquisitionNote: 'Ensure physical write-protect switch is engaged if available.'
        };
    }
  }

  return {
    device,
    mediaIntelligence,
    analysisTime: new Date().toISOString()
  };
}
