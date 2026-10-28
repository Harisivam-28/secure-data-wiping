import React, { useState, useEffect } from 'react';
import {
  Trash2,
  ShieldAlert,
  AlertTriangle,
  Lock,
  CheckCircle2,
  RefreshCw,
  FileText,
  FileCheck,
  HardDrive,
  FolderLock,
  X,
  Play
} from 'lucide-react';

export default function SecureErasure({
  devices = [],
  cases = [],
  activeCaseId,
  sanitizationMethods = [],
  onExecuteDriveErasure,
  onExecuteFileErasure,
  onRunPreCheck,
  onTriggerPreErasureModal,
  safeDemoMode
}) {
  const [activeSubTab, setActiveSubTab] = useState('drive'); // 'drive' | 'files'

  // Drive Eraser State
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || 'DEV-001');
  const [selectedMethodId, setSelectedMethodId] = useState('DOD_5220_22_M');
  const [confirmationPhraseInput, setConfirmationPhraseInput] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [erasureProgress, setErasureProgress] = useState(null); // null | { pass, percentage, currentSector, status }
  const [issuedCertificate, setIssuedCertificate] = useState(null);

  // File Eraser State
  const [sandboxFiles, setSandboxFiles] = useState([]);
  const [selectedFilePaths, setSelectedFilePaths] = useState([]);
  const [fileErasureResult, setFileErasureResult] = useState(null);

  useEffect(() => {
    fetchSandboxFiles();
  }, []);

  const fetchSandboxFiles = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/sandbox/files');
      if (res.ok) {
        const data = await res.json();
        setSandboxFiles(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const targetCaseId = activeCaseId || cases[0]?.id || 'CASE-2026-0001';
  const requiredPhrase = `PERMANENTLY ERASE DEVICE ${targetCaseId}`;

  // Start Drive Erasure flow with Safety Pre-Check
  const handleInitiateDriveErasure = async () => {
    const preCheck = await onRunPreCheck(targetCaseId);
    if (preCheck?.requiresWarning) {
      onTriggerPreErasureModal(preCheck);
      return;
    }
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmDriveErasure = async () => {
    if (confirmationPhraseInput !== requiredPhrase) return;
    setIsConfirmationModalOpen(false);

    // Start simulated wiping sequence with real-time sector animation
    setErasureProgress({ pass: 1, percentage: 5, currentSector: '0x00000000', status: 'Pass 1: Zero Fill Overwrite' });

    for (let p = 10; p <= 100; p += 15) {
      await new Promise(r => setTimeout(r, 300));
      let currentPass = 1;
      let passStatus = 'Pass 1: Zero Fill (0x00)';
      if (p > 35 && p <= 70) {
        currentPass = 2;
        passStatus = 'Pass 2: Ones Fill (0xFF)';
      } else if (p > 70) {
        currentPass = 3;
        passStatus = 'Pass 3: Random Pattern & Verification';
      }

      setErasureProgress({
        pass: currentPass,
        percentage: Math.min(100, p),
        currentSector: `0x${(p * 0x10000).toString(16).padStart(8, '0')}`,
        status: passStatus
      });
    }

    // Call Backend API to register completion and issue certificate
    try {
      const cert = await onExecuteDriveErasure({
        caseId: targetCaseId,
        deviceId: selectedDeviceId,
        methodId: selectedMethodId,
        confirmationPhrase: confirmationPhraseInput,
        safeDemoMode
      });
      setIssuedCertificate(cert);
    } catch (err) {
      alert(err.message);
    } finally {
      setErasureProgress(null);
      setConfirmationPhraseInput('');
    }
  };

  // File Eraser Handler
  const handleToggleFileSelect = (path) => {
    if (selectedFilePaths.includes(path)) {
      setSelectedFilePaths(selectedFilePaths.filter(p => p !== path));
    } else {
      setSelectedFilePaths([...selectedFilePaths, path]);
    }
  };

  const handleExecuteFileErasure = async () => {
    if (selectedFilePaths.length === 0) return;
    try {
      const result = await onExecuteFileErasure({
        caseId: targetCaseId,
        filePaths: selectedFilePaths,
        methodId: selectedMethodId
      });
      setFileErasureResult(result);
      setSelectedFilePaths([]);
      fetchSandboxFiles();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Secure Data Erasure Module</h2>
          <p className="text-xs text-slate-500">
            NIST 800-88 & DoD 5220.22-M compliant sanitization engine with Safe Demo Mode controls
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex bg-slate-200 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('drive')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
              activeSubTab === 'drive' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            A. Secure Drive Eraser
          </button>
          <button
            onClick={() => setActiveSubTab('files')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
              activeSubTab === 'files' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            B. Secure File & Folder Eraser
          </button>
        </div>
      </div>

      {/* Safe Demo Mode Alert */}
      <div className="bg-amber-500 text-slate-950 p-4 rounded-xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-slate-950" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">SAFE DEMO MODE ENABLED</h4>
            <p className="text-xs font-medium text-slate-900">
              Destructive physical disk operations are isolated behind demo safety controls. Hardware storage remains untouched.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-slate-950 text-amber-400 font-extrabold text-xs rounded border border-slate-800">
          DEMO SAFE
        </span>
      </div>

      {/* SECTION A: DRIVE ERASER */}
      {activeSubTab === 'drive' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Target & Method Form */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <HardDrive className="w-4 h-4 text-orange-600" />
              Drive Sanitization Workflow Configuration
            </h3>

            {/* Step 1: Select Target Device */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Target Media Device
              </label>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500"
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id} - {d.name} ({d.capacity}, {d.type}, {d.filesystem})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Sanitization Algorithm */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Sanitization Method & Algorithm
              </label>
              <div className="space-y-2">
                {sanitizationMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      selectedMethodId === m.id
                        ? 'bg-orange-50/70 border-orange-300 ring-1 ring-orange-400'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sanitizationMethod"
                      checked={selectedMethodId === m.id}
                      onChange={() => setSelectedMethodId(m.id)}
                      className="mt-0.5 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">{m.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Safety Warning & Action Button */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs space-y-2">
              <div className="font-bold flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                CRITICAL WARNING
              </div>
              <p>
                This operation will trigger sector overwriting routines under Case <strong>{targetCaseId}</strong>. Data recovery will be impossible once initiated.
              </p>
            </div>

            <button
              onClick={handleInitiateDriveErasure}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Play className="w-4 h-4 fill-white" />
              Initiate Drive Sanitization Routine
            </button>
          </div>

          {/* Device Summary & Certificate View */}
          <div className="space-y-4">
            {/* Target Specs Summary */}
            {selectedDevice && (
              <div className="bg-slate-900 text-white rounded-xl shadow-xs p-5 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Target Device Snapshot</h4>
                <div className="text-sm font-bold">{selectedDevice.name}</div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Capacity: <strong className="text-white">{selectedDevice.capacity}</strong></div>
                  <div>Filesystem: <strong className="text-white">{selectedDevice.filesystem}</strong></div>
                  <div>Sector Size: <strong className="text-white">{selectedDevice.sectorSize}</strong></div>
                  <div>Read-Only: <strong className="text-emerald-400">LOCKED</strong></div>
                </div>
              </div>
            )}

            {/* Progress Visualizer */}
            {erasureProgress && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-orange-600 animate-spin" />
                    {erasureProgress.status}
                  </span>
                  <span>{erasureProgress.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-orange-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${erasureProgress.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono text-center">
                  Sector: {erasureProgress.currentSector} • Pass {erasureProgress.pass}/3
                </div>
              </div>
            )}

            {/* Issued Certificate Box */}
            {issuedCertificate && (
              <div className="bg-emerald-950 text-emerald-100 rounded-xl border border-emerald-800 p-5 shadow-sm space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <FileCheck className="w-4 h-4" />
                  Sanitization Certificate Issued
                </div>
                <div className="text-xs font-mono bg-emerald-900/60 p-2.5 rounded border border-emerald-800/80 space-y-1">
                  <div>Cert ID: {issuedCertificate.certificateId}</div>
                  <div>Result: {issuedCertificate.verificationResult}</div>
                  <div>Method: {issuedCertificate.sanitizationMethod}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION B: FILE & FOLDER ERASER */}
      {activeSubTab === 'files' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-orange-600" />
                Safe Sandbox File & Folder Eraser
              </h3>
              <p className="text-xs text-slate-500">
                Batch select files from the safe demo sandbox directory to perform real 3-pass DoD/NIST overwrites
              </p>
            </div>

            <button
              onClick={handleExecuteFileErasure}
              disabled={selectedFilePaths.length === 0}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
                selectedFilePaths.length > 0
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Sanitize Selected Files ({selectedFilePaths.length})
            </button>
          </div>

          {/* Sandbox Files Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10">Select</th>
                  <th className="py-2.5 px-3">File Name</th>
                  <th className="py-2.5 px-3">Sandbox Path</th>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Current SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sandboxFiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      Sandbox directory empty or all files sanitized.
                    </td>
                  </tr>
                ) : (
                  sandboxFiles.map((f) => (
                    <tr key={f.path} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={selectedFilePaths.includes(f.path)}
                          onChange={() => handleToggleFileSelect(f.path)}
                          className="rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{f.filename}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">{f.path}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{f.sizeBytes} bytes</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500 max-w-[180px] truncate">{f.hash}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* File Erasure Result Banner */}
          {fileErasureResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Sanitization Completed Cleanly
              </div>
              <p>
                Successfully executed 3-pass DoD overwriting on {fileErasureResult.erasedCount} file(s). Audit log cryptographically updated.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-sm">EXPLICIT DESTRUCTIVE CONFIRMATION</h3>
              </div>
              <button onClick={() => setIsConfirmationModalOpen(false)} className="p-1 text-white hover:bg-red-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700">
                To confirm drive erasure under <strong>{targetCaseId}</strong>, please type the exact phrase below:
              </p>

              <div className="p-3 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-center text-slate-900 select-all">
                {requiredPhrase}
              </div>

              <input
                type="text"
                placeholder="Type phrase here..."
                value={confirmationPhraseInput}
                onChange={(e) => setConfirmationPhraseInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 font-mono text-xs"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsConfirmationModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDriveErasure}
                  disabled={confirmationPhraseInput !== requiredPhrase}
                  className={`px-4 py-2 rounded-lg font-bold text-white transition ${
                    confirmationPhraseInput === requiredPhrase
                      ? 'bg-red-600 hover:bg-red-700 shadow-xs'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  Final Confirm & Wipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
