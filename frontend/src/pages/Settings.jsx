import React from 'react';
import { Settings, ShieldCheck, User, Lock, AlertTriangle, Database, Info } from 'lucide-react';

export default function SettingsPage({
  user,
  setUser,
  safeDemoMode,
  setSafeDemoMode,
  users = []
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings & Role-Based Access</h2>
          <p className="text-xs text-slate-500">
            Configure investigator privileges, Safe Demo Mode controls, and database connection parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Role-Based Access Control (RBAC) */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-blue-600" />
            Role-Based Access Control (RBAC) Switcher
          </h3>

          <div className="grid grid-cols-3 gap-3 text-xs">
            {users.map((u) => {
              const isSelected = user?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setUser(u)}
                  className={`p-4 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-blue-500'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{u.name}</div>
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-300' : 'text-blue-600 font-semibold'}`}>
                    {u.role}
                  </div>
                  <div className={`text-[10px] mt-2 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    {u.email}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <span className="font-bold text-slate-800 block">RBAC Privileges Matrix:</span>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div>
                <strong className="text-slate-800">Administrator:</strong> Full access to erasure, configuration, carving, and audit ledger.
              </div>
              <div>
                <strong className="text-slate-800">Investigator:</strong> Access to cases, evidence, recovery, and report compilation.
              </div>
              <div>
                <strong className="text-slate-800">Viewer:</strong> Read-only access to compiled reports and case timelines.
              </div>
            </div>
          </div>
        </div>

        {/* Safe Demo Mode & System Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Safety Safeguard Controls
            </h4>

            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <div className="font-bold text-slate-900">Safe Demo Mode</div>
                <div className="text-[10px] text-slate-500">Isolates destructive physical disk writes</div>
              </div>
              <button
                onClick={() => setSafeDemoMode(!safeDemoMode)}
                className={`px-3 py-1 rounded font-bold text-xs transition ${
                  safeDemoMode
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {safeDemoMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 shadow-xs space-y-2 text-xs">
            <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              System Environment
            </h4>
            <div className="space-y-1 text-slate-300 text-[11px] font-mono">
              <div>App: DataShield Forensics v1.0.0</div>
              <div>SIH Problem Statement: #26149</div>
              <div>Database: Lightweight SQLite Engine</div>
              <div>Cryptographic Suite: SHA-256 Chaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
