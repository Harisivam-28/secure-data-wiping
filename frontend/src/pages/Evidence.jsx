import React, { useState } from 'react';
import { FolderLock, ShieldCheck, RefreshCw, Lock, HardDrive, FileCode, CheckCircle2, AlertTriangle, PlusCircle, X } from 'lucide-react';

export default function Evidence({ evidence = [], cases = [], activeCaseId, onAddEvidence, onVerifyIntegrity }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sourceName, setSourceName] = useState('sample_drive.img');
  const [type, setType] = useState('Forensic Disk Image (.img)');
  const [verifyingId, setVerifyingId] = useState(null);

  const activeCaseEvidence = evidence.filter(e => !activeCaseId || e.caseId === activeCaseId);

  const handleVerify = async (evdId) => {
    setVerifyingId(evdId);
    await onVerifyIntegrity(evdId);
    setVerifyingId(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddEvidence({
      caseId: activeCaseId || cases[0]?.id || 'CASE-2026-0001',
      sourceName,
      type
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Evidence Management</h2>
          <p className="text-xs text-slate-500">
            Cryptographic SHA-256 integrity verification & Read-Only evidence acquisition workspace
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add Forensic Evidence
        </button>
      </div>

      {/* Read-Only Safety Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Forensic Read-Only Lock Enforced</h4>
            <p className="text-xs text-slate-300">
              All registered evidence sources are mounted in strict READ-ONLY mode. Source bits will never be altered during analysis.
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded bg-slate-800 text-emerald-400 font-extrabold text-xs border border-slate-700">
          PROTECTION: ACTIVE
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FolderLock className="w-4 h-4 text-blue-600" />
            Registered Evidence Items ({activeCaseEvidence.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Evidence ID</th>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Source Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
                <th className="py-2.5 px-3">Integrity</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeCaseEvidence.map((evd) => (
                <tr key={evd.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-blue-600">{evd.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{evd.caseId}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{evd.sourceName}</td>
                  <td className="py-3 px-3">{evd.type}</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {(evd.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-600 max-w-[200px] truncate" title={evd.originalHash}>
                    {evd.originalHash}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit text-[10px] ${
                      evd.integrityStatus === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {evd.integrityStatus === 'VERIFIED' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-red-600" />}
                      {evd.integrityStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleVerify(evd.id)}
                      disabled={verifyingId === evd.id}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 ml-auto transition"
                    >
                      <RefreshCw className={`w-3 h-3 ${verifyingId === evd.id ? 'animate-spin text-blue-600' : ''}`} />
                      {verifyingId === evd.id ? 'Calculating...' : 'Re-Verify SHA-256'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">ADD FORENSIC EVIDENCE ITEM</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Case ID</label>
                <input
                  type="text"
                  readOnly
                  value={activeCaseId || cases[0]?.id || 'CASE-2026-0001'}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence Source File / Image Name</label>
                <input
                  type="text"
                  required
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="Forensic Disk Image (.img)">Forensic Disk Image (.img)</option>
                  <option value="E01 Expert Witness Image">E01 Expert Witness Image</option>
                  <option value="USB Physical Image">USB Physical Image</option>
                  <option value="SD Card Image">SD Card Image</option>
                  <option value="Sample Dataset Folder">Sample Dataset Folder</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>SHA-256 cryptographic fingerprint will be computed automatically upon acquisition and stored in the tamper-evident audit log.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Register Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
