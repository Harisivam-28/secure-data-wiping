import React, { useState, useEffect } from 'react';
import { HardDrive, Cpu, ShieldCheck, AlertCircle, ArrowRight, Activity, Zap } from 'lucide-react';

export default function DeviceAnalysis({ devices = [], onAnalyzeDevice }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || 'DEV-001');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDeviceId) {
      loadAnalysis(selectedDeviceId);
    }
  }, [selectedDeviceId]);

  const loadAnalysis = async (id) => {
    setLoading(true);
    try {
      const data = await onAnalyzeDevice(id);
      setAnalysisData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Device Analysis & Media Intelligence</h2>
          <p className="text-xs text-slate-500">
            Hardware controller inspection, partition structure detection, and media-aware sanitization routing
          </p>
        </div>
      </div>

      {/* Device Selector Cards */}
      <div className="grid grid-cols-3 gap-4">
        {devices.map((dev) => {
          const isSelected = dev.id === selectedDeviceId;
          return (
            <button
              key={dev.id}
              onClick={() => setSelectedDeviceId(dev.id)}
              className={`p-4 rounded-xl border text-left transition ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-blue-500'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <HardDrive className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-blue-900 text-blue-300 border border-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {dev.type}
                </span>
              </div>
              <div className="font-bold text-xs line-clamp-1">{dev.name}</div>
              <div className={`text-[11px] mt-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                {dev.capacity} • {dev.filesystem}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Analysis View */}
      {selectedDevice && (
        <div className="grid grid-cols-3 gap-6">
          {/* Device Technical Specs Table */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedDevice.name}</h3>
                  <p className="text-[11px] text-slate-500">Device ID: {selectedDevice.id}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                selectedDevice.readOnlyStatus
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {selectedDevice.mountStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Storage Technology</span>
                <span className="font-bold text-slate-900 text-sm">{selectedDevice.type}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Capacity</span>
                <span className="font-bold text-slate-900 text-sm">{selectedDevice.capacity}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Filesystem</span>
                <span className="font-bold text-slate-900 text-sm">{selectedDevice.filesystem}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Sector Size</span>
                <span className="font-bold text-slate-900 text-sm">{selectedDevice.sectorSize}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="text-slate-400 font-semibold block">Partition Scheme</span>
              <span className="font-medium text-slate-800">{selectedDevice.partitionInfo}</span>
            </div>
          </div>

          {/* Media Intelligence Panel (Differentiator!) */}
          <div className="bg-slate-900 text-white rounded-xl shadow-md p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Media Intelligence Engine
              </div>

              <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700 mb-4 space-y-1">
                <div className="text-[11px] text-slate-400">Detected Controller Hardware:</div>
                <div className="text-xs font-extrabold text-blue-400">
                  {analysisData?.mediaIntelligence?.mediaClass || 'Solid State / Magnetic Storage'}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Recommended Sanitization Method:</span>
                  <p className="text-amber-300 font-bold bg-amber-950/60 p-2.5 rounded border border-amber-800/70 text-[11px] leading-relaxed">
                    {analysisData?.mediaIntelligence?.recommendedSanitization || selectedDevice.recommendedWorkflow}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Wear-Leveling & Technology Note:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {analysisData?.mediaIntelligence?.wearLevelingWarning || 'Media-aware routing prevents ineffective block overwriting.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target Technology Routing</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                OPTIMIZED
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
