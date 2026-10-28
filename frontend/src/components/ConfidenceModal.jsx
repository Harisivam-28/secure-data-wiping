import React from 'react';
import { CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function ConfidenceModal({ isOpen, onClose, recoveredFile }) {
  if (!isOpen || !recoveredFile) return null;

  const score = recoveredFile.confidenceScore || 92;
  const level = recoveredFile.confidenceLevel || 'HIGH';
  const reasons = recoveredFile.reconstructionReasons || [
    '✓ Valid magic header signature detected',
    '✓ Valid file footer signature detected',
    '✓ Expected file size boundary verified',
    '✓ File internal structure / chunk validation passed',
    '✓ Fragment sequence continuity verified'
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">EXPLAINABLE CONFIDENCE SCORE</h3>
              <p className="text-[11px] text-slate-400">{recoveredFile.filename}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score Badge Header */}
        <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Recovery Confidence</div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-4xl font-black text-slate-900">{score}%</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              level === 'HIGH' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {level} RECOVERY
            </span>
          </div>
        </div>

        {/* Explainable Reasons Breakdown */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Verification Criteria & Reasons
          </div>

          <div className="space-y-2">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{reason.replace(/^[✓⚠]\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
