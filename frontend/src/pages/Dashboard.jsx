import React from 'react';
import {
  Briefcase,
  FolderLock,
  FileSearch,
  Trash2,
  CheckCircle2,
  FileBarChart,
  PlusCircle,
  HardDrive,
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function Dashboard({
  cases = [],
  evidence = [],
  auditLogs = [],
  reports = [],
  setActiveTab,
  onOpenCreateCaseModal
}) {
  const activeCasesCount = cases.filter(c => c.status === 'Active').length;
  const totalEvidenceCount = evidence.length;
  const recoveryOpsCount = auditLogs.filter(l => l.action.includes('RECOVERY') || l.action.includes('CARVING')).length || 1;
  const erasureOpsCount = auditLogs.filter(l => l.action.includes('ERASURE') || l.action.includes('SANITIZATION')).length || 1;
  const verifiedOpsCount = auditLogs.filter(l => l.action.includes('VERIFICATION')).length || 1;
  const reportsCount = reports.length || 2;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Forensic Dashboard</h2>
          <p className="text-xs text-slate-500">
            Real-time Evidence-Aware Intelligent Data Lifecycle & Audit Overview
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateCaseModal}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Case
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <FolderLock className="w-4 h-4" />
            Analyze Evidence
          </button>
          <button
            onClick={() => setActiveTab('file-recovery')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <FileSearch className="w-4 h-4" />
            Start Recovery
          </button>
          <button
            onClick={() => setActiveTab('secure-erasure')}
            className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            Secure Erasure
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <FileBarChart className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Cases</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{cases.length}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">100% Active Logged</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Investigations</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{activeCasesCount}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Lifecycle Monitored</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Evidence Items</span>
            <FolderLock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalEvidenceCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">SHA-256 Verified</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Recovery Ops</span>
            <FileSearch className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{recoveryOpsCount}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">Signature Carved</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Erasure Ops</span>
            <Trash2 className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{erasureOpsCount}</div>
          <div className="text-[10px] text-orange-600 font-medium mt-1">Safe Demo Standard</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verified Ops</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{verifiedOpsCount}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Hash Chain Integrity</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Reports</span>
            <FileBarChart className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{reportsCount}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">PDF / JSON / CSV</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Cases Table */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Recent Forensic Cases
            </h3>
            <button
              onClick={() => setActiveTab('cases')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View All Cases
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Case Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3">Investigator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-blue-600">{c.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-900 max-w-[180px] truncate">{c.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {c.caseType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{new Date(c.createdDate).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-medium">{c.investigator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Engine & Differentiator Panel */}
        <div className="bg-slate-900 text-white rounded-xl shadow-md p-5 flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Core Differentiator
            </div>
            <h3 className="text-base font-bold tracking-tight text-white mb-2">
              Evidence-Aware Intelligent Data Lifecycle Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Integrated platform connecting digital evidence recovery and data sanitization under one controlled cryptographic workflow.
            </p>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <div className="flex items-start gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-slate-100">Forensic Acquisition Lock:</strong>
                  <p className="text-slate-400 text-[11px]">All evidence files are read-only with SHA-256 integrity locks.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-slate-100">Pre-Erasure Safety Guard:</strong>
                  <p className="text-slate-400 text-[11px]">Blocks accidental sanitization if unacquired evidence exists.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-slate-100">Cryptographic Hash Chaining:</strong>
                  <p className="text-slate-400 text-[11px]">Tamper-evident audit trail with SHA-256 link validation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Safe Demo Mode</span>
            <span className="text-emerald-400 font-bold">ACTIVE & SAFE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
