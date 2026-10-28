import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  FolderLock,
  HardDrive,
  Trash2,
  FileSearch,
  CheckCircle2,
  FileText,
  FileBarChart,
  Settings
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cases', label: 'Cases', icon: Briefcase },
  { id: 'evidence', label: 'Evidence', icon: FolderLock },
  { id: 'device-analysis', label: 'Device Analysis', icon: HardDrive },
  { id: 'secure-erasure', label: 'Secure Erasure', icon: Trash2 },
  { id: 'file-recovery', label: 'File Recovery', icon: FileSearch },
  { id: 'verification', label: 'Verification', icon: CheckCircle2 },
  { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Forensic Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Lifecycle Engine Status Banner */}
      <div className="p-4 m-3 rounded-lg bg-slate-800/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Data Lifecycle Engine
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Forensic Read-Only Lock & Pre-Erasure Safety Guard active.
        </p>
      </div>
    </aside>
  );
}
