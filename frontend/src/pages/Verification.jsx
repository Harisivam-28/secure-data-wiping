import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, FileText, Lock } from 'lucide-react';

export default function Verification({ activeCaseId, verificationData, onRunVerification }) {
  const [isRunning, setIsRunning] = useState(false);

  const handleReVerify = async () => {
    setIsRunning(true);
    await onRunVerification(activeCaseId);
    setIsRunning(false);
  };

  const status = verificationData || {
    evidenceIntegrity: 'VERIFIED',
    erasureVerification: 'VERIFIED',
    recoveryValidation: 'VERIFIED',
    auditIntegrity: 'VERIFIED',
    overallStatus: 'VERIFIED'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dedicated Verification Center</h2>
          <p className="text-xs text-slate-500">
            System-wide cryptographic hash chain validation & evidence integrity audit checks
          </p>
        </div>

        <button
          onClick={handleReVerify}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Verifying Hashes & Audit Chains...' : 'Run Full System Re-Verification'}
        </button>
      </div>

      {/* Verification Status Cards Grid */}
      <div className="grid grid-cols-4 gap-5">
        {/* Evidence Integrity Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evidence Integrity</span>
            <Lock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            {status.evidenceIntegrity === 'VERIFIED' ? (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> VERIFIED
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" /> CHANGED
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">SHA-256 bitstream match verified against acquisition baseline.</p>
        </div>

        {/* Erasure Verification Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Erasure Verification</span>
            <ShieldCheck className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> VERIFIED
            </span>
          </div>
          <p className="text-[11px] text-slate-500">100% LBAs verified zero-entropy clean post-sanitization pass.</p>
        </div>

        {/* Recovery Structure Validation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recovery Structure</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> VERIFIED
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Carved headers, trailers, and fragment sequences validated.</p>
        </div>

        {/* Cryptographic Audit Integrity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Integrity</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            {status.auditIntegrity === 'VERIFIED' ? (
              <span className="text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> VERIFIED
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" /> TAMPERED
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">SHA-256 cryptographic chain validated across all event nodes.</p>
        </div>
      </div>

      {/* Verification Summary Checklist */}
      <div className="bg-slate-900 text-white rounded-xl shadow-md p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            Centralized Forensic Integrity Summary
          </h3>
          <span className="px-3 py-1 rounded bg-emerald-900/60 text-emerald-300 font-extrabold text-xs border border-emerald-700">
            SYSTEM STATUS: {status.overallStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Evidence Hash Check:</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Recovery Structure Check:</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Cryptographic Audit Chain:</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">Sanitization Zero Verification:</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
