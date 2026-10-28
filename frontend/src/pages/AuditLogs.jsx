import React, { useState } from 'react';
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Lock, Link as LinkIcon } from 'lucide-react';

export default function AuditLogs({ auditLogs = [], onVerifyAuditChain }) {
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    const result = await onVerifyAuditChain();
    setVerificationResult(result);
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tamper-Evident Audit Logs</h2>
          <p className="text-xs text-slate-500">
            Cryptographic SHA-256 hash chaining (Event(n) + Hash(n-1) → Hash(n)) for complete tamper protection
          </p>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={isVerifying}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
          {isVerifying ? 'Validating Hash Chain...' : 'Verify Cryptographic Audit Chain'}
        </button>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs ${
          verificationResult.isValid
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <div className="flex items-center gap-3">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-xs">
                {verificationResult.isValid ? 'CRYPTOGRAPHIC AUDIT CHAIN VERIFIED' : 'TAMPER DETECTED IN AUDIT LOG'}
              </h4>
              <p className="text-xs text-slate-600">
                {verificationResult.isValid
                  ? `All ${verificationResult.totalEvents} audit log entries cryptographically validated against SHA-256 hash chain.`
                  : verificationResult.reason}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded text-xs font-extrabold ${
            verificationResult.isValid ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
          }`}>
            {verificationResult.status}
          </span>
        </div>
      )}

      {/* Cryptographic Hash Chaining Explainer Box */}
      <div className="bg-slate-900 text-white rounded-xl shadow-md p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <LinkIcon className="w-4 h-4" />
          Cryptographic Hash Chaining Architecture
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
            <div className="text-[10px] text-blue-400 font-bold mb-1">Event 1 Node</div>
            <div className="text-slate-400 text-[11px]">prevHash: 000000000000...</div>
            <div className="text-emerald-400 font-semibold mt-1">Hash 1 = SHA256(Event 1 + prevHash)</div>
          </div>
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
            <div className="text-[10px] text-blue-400 font-bold mb-1">Event 2 Node</div>
            <div className="text-slate-400 text-[11px]">prevHash: Hash 1</div>
            <div className="text-emerald-400 font-semibold mt-1">Hash 2 = SHA256(Event 2 + Hash 1)</div>
          </div>
          <div className="p-3 bg-slate-950/80 rounded border border-slate-800">
            <div className="text-[10px] text-blue-400 font-bold mb-1">Event 3 Node</div>
            <div className="text-slate-400 text-[11px]">prevHash: Hash 2</div>
            <div className="text-emerald-400 font-semibold mt-1">Hash 3 = SHA256(Event 3 + Hash 2)</div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Audit Events Ledger ({auditLogs.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Event Details</th>
                <th className="py-2.5 px-3">Cryptographic SHA-256 Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-blue-600">{log.id}</td>
                  <td className="py-3 px-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{log.user}</td>
                  <td className="py-3 px-3 font-medium">{log.caseId}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 max-w-[250px] truncate">{log.details}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-600 max-w-[180px] truncate" title={`prevHash: ${log.prevHash}`}>
                    {log.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
