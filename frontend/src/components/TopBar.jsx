import React from 'react';
import { ShieldCheck, Database, HardDrive, User, Bell, ChevronDown, Activity, AlertTriangle } from 'lucide-react';

export default function TopBar({
  cases = [],
  activeCaseId,
  setActiveCaseId,
  user,
  safeDemoMode,
  systemStatus
}) {
  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-md z-20">
      {/* Brand & App Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-white flex items-center gap-2">
              DataShield Forensics
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-semibold tracking-wider uppercase border border-blue-700">
                SIH 2026 #26149
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Secure. Recover. Verify. Report.</p>
          </div>
        </div>

        {/* Case Switcher */}
        <div className="h-6 w-px bg-slate-700 mx-2" />

        <div className="relative flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 hover:border-slate-600 transition">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-slate-400">Case ID:</span>
          <select
            value={activeCaseId || ''}
            onChange={(e) => setActiveCaseId(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none cursor-pointer pr-2"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.id} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="flex items-center gap-5">
        {/* Status Pill */}
        <div className="flex items-center gap-2 text-xs bg-slate-800/60 border border-slate-700/80 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">Engine: <strong className="text-emerald-400">ONLINE</strong></span>
        </div>

        {/* Safe Demo Mode Badge */}
        {safeDemoMode && (
          <div className="flex items-center gap-1.5 text-xs bg-orange-950/80 text-orange-300 border border-orange-800/80 px-3 py-1 rounded-full font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <span>Safe Demo Mode</span>
          </div>
        )}

        {/* Storage Info */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <HardDrive className="w-4 h-4 text-slate-400" />
          <span>Storage: <strong className="text-slate-100">2.0 MB Mounted</strong></span>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200">{user?.name || 'Sgt. Vikram Singh'}</div>
            <div className="text-[10px] text-blue-400 font-medium">{user?.role || 'Administrator'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
