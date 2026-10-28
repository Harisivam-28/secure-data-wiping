import React from 'react';
import { AlertTriangle, ShieldAlert, FileCheck, ArrowRight, X } from 'lucide-react';

export default function PreErasureModal({
  isOpen,
  onClose,
  onProceedSanitization,
  onCreateAcquisition,
  safetyCheckData
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 text-slate-950 px-6 py-4 flex items-center justify-between border-b border-amber-600">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-slate-950" />
            <div>
              <h3 className="font-bold text-base tracking-wide">PRE-ERASURE SAFETY GUARD</h3>
              <p className="text-xs font-semibold text-slate-900">Lifecycle Engine Evidence Protection Alert</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-amber-600/30 rounded text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs leading-relaxed space-y-2">
            <div className="font-bold flex items-center gap-2 text-amber-950 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Potential Forensic Evidence Loss Warning
            </div>
            <p>
              {safetyCheckData?.warningMessage || 'Potentially recoverable forensic data detected on target media. Forensic acquisition has not been completed.'}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Recoverable Files</div>
              <div className="text-lg font-extrabold text-amber-600 mt-0.5">
                {safetyCheckData?.estimatedRecoverableFiles || 1240}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Evidence Size</div>
              <div className="text-lg font-extrabold text-slate-800 mt-0.5">
                {safetyCheckData?.evidenceSizeFormatted || '2.0 MB'}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Acquisition Status</div>
              <div className="text-xs font-bold text-red-600 mt-1">
                {safetyCheckData?.acquisitionCompleted ? 'COMPLETED' : 'NOT ACQUIRED'}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Proceeding directly to sanitization without evidence acquisition will permanently erase these recoverable artifacts from the investigation record.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col gap-2">
          <button
            onClick={onCreateAcquisition}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
          >
            <FileCheck className="w-4 h-4" />
            Create Evidence Acquisition First (Recommended)
          </button>
          
          <div className="flex gap-2 mt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={onProceedSanitization}
              className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition"
            >
              <span>Continue to Sanitization</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
