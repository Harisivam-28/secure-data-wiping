import React, { useState } from 'react';
import { Briefcase, PlusCircle, Search, Filter, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function Cases({ cases = [], onCreateCase, onSelectCase, isCreateModalOpen, setIsCreateModalOpen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Form State
  const [name, setName] = useState('');
  const [investigator, setInvestigator] = useState('Sgt. Vikram Singh');
  const [organization, setOrganization] = useState('Central Digital Forensics Lab (CDFL)');
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState('Forensic Investigation');

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || c.caseType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onCreateCase({
      name,
      investigator,
      organization,
      description,
      caseType
    });
    setName('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Case Management</h2>
          <p className="text-xs text-slate-500">
            Case-based cryptographic audit container for evidence and sanitization tasks
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Case
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search cases by Case ID, name, investigator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Category:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Forensic Investigation">Forensic Investigation</option>
            <option value="Data Sanitization">Data Sanitization</option>
            <option value="Combined">Combined</option>
          </select>
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-3 gap-5">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-xs">
                  {c.id}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                  {c.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">{c.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{c.description}</p>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-slate-800">{c.caseType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Investigator:</span>
                  <span className="font-medium text-slate-800">{c.investigator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-slate-600">{new Date(c.createdDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectCase(c.id)}
              className="mt-5 w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>View Case Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Create Case Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">CREATE NEW CASE CONTAINER</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Financial Fraud Hard Drive Carving"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Investigator Name</label>
                  <input
                    type="text"
                    value={investigator}
                    onChange={(e) => setInvestigator(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Case Category</label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Forensic Investigation">Forensic Investigation</option>
                    <option value="Data Sanitization">Data Sanitization</option>
                    <option value="Combined">Combined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization / Unit</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief details of forensic scope or sanitization compliance rules..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[11px] leading-relaxed">
                Unique Case ID will be generated automatically (e.g. CASE-2026-0003). All evidence hashes, carving ops, and audit logs will be cryptographically linked.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
