import React from 'react';
import { Layers, CheckCircle2, ArrowRight, X, Cpu } from 'lucide-react';

export default function ReconstructionModal({ isOpen, onClose, file }) {
  if (!isOpen || !file) return null;

  const fragments = [
    { id: 'Fragment 1', offset: '0x00030000', size: '64 KB', status: 'VALIDATED (PNG Magic 89 50 4E 47)' },
    { id: 'Fragment 2', offset: '0x00038000', size: '128 KB', status: 'VALIDATED (IDAT Compressed Stream)' },
    { id: 'Fragment 3', offset: '0x00040000', size: '32 KB', status: 'VALIDATED (IEND Trailer 49 45 4E 44)' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">FRAGMENTED FILE RECONSTRUCTION</h3>
              <p className="text-[11px] text-slate-400">{file.filename}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reconstruction Details */}
        <div className="p-6 space-y-6">
          {/* Status Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] text-slate-500">Confidence</div>
              <div className="text-base font-extrabold text-blue-600 mt-0.5">{file.confidenceScore || 87}%</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] text-slate-500">Fragment Count</div>
              <div className="text-base font-extrabold text-slate-800 mt-0.5">3</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] text-slate-500">Missing</div>
              <div className="text-base font-extrabold text-emerald-600 mt-0.5">0</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[11px] text-slate-500">Integrity</div>
              <div className="text-xs font-bold text-emerald-700 mt-1">VALIDATED</div>
            </div>
          </div>

          {/* Visual Sequence Assembly */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              Fragment Reassembly Sequence Pipeline
            </div>

            <div className="space-y-2">
              {fragments.map((frag, idx) => (
                <React.Fragment key={frag.id}>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-800">{frag.id}</div>
                        <div className="text-[11px] text-slate-500">Offset: {frag.offset} • Size: {frag.size}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      {frag.status}
                    </span>
                  </div>
                  {idx < fragments.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <ArrowRight className="w-4 h-4 text-blue-500 rotate-90" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Reconstruction 100% complete. Byte continuity verified across 3 non-contiguous clusters.</span>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
          >
            Close Pipeline View
          </button>
        </div>
      </div>
    </div>
  );
}
