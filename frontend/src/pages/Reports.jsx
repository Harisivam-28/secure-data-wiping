import React, { useState } from 'react';
import { FileBarChart, Download, FileText, Clock, CheckCircle2, PlusCircle, Calendar } from 'lucide-react';

export default function Reports({ cases = [], activeCaseId, reports = [], onGenerateReport }) {
  const [selectedCaseId, setSelectedCaseId] = useState(activeCaseId || cases[0]?.id || 'CASE-2026-0001');
  const [reportType, setReportType] = useState('Forensic Recovery Report');
  const [format, setFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeReports = reports.filter(r => r.caseId === selectedCaseId);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    await onGenerateReport({
      caseId: selectedCaseId,
      reportType,
      format
    });
    setIsGenerating(false);
  };

  const timelineEvents = [
    { time: '09:30 AM', title: 'Case Created', desc: 'Case CASE-2026-0001 initialized by Sgt. Vikram Singh.' },
    { time: '09:32 AM', title: 'Evidence Added', desc: 'sample_drive.img registered with READ-ONLY lock.' },
    { time: '09:33 AM', title: 'SHA-256 Generated', desc: 'Cryptographic hash computed: 8de9c0f89d96f062...' },
    { time: '09:35 AM', title: 'Device Analyzed', desc: 'Raw disk image structure analyzed: 2MB capacity.' },
    { time: '09:40 AM', title: 'Recovery Started', desc: 'Signature carving initiated with 6 active signature plugins.' },
    { time: '09:45 AM', title: '4 Files Recovered', desc: 'Carved JPEG, PDF, ZIP, and reconstructed PNG image.' },
    { time: '09:47 AM', title: 'Verification Completed', desc: 'Cryptographic hash and audit chain verified.' },
    { time: '09:50 AM', title: 'Report Generated', desc: 'Forensic Investigation PDF Report compiled & signed.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Forensic Report Generator & Case Timeline</h2>
          <p className="text-xs text-slate-500">
            Export certified forensic reports (PDF / JSON / CSV) and inspect case operational timeline
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Report Generator Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileBarChart className="w-4 h-4 text-purple-600" />
            Generate New Forensic Report
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Case ID</label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Report Document Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none"
              >
                <option value="Forensic Recovery Report">1. Forensic Recovery Report</option>
                <option value="Sanitization Certificate">2. Sanitization Certificate</option>
                <option value="Case Audit Report">3. Case Audit Report</option>
                <option value="Evidence Integrity Report">4. Evidence Integrity Report</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {['PDF', 'JSON', 'CSV'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`py-2 rounded-lg font-bold text-xs border transition ${
                      format === f
                        ? 'bg-purple-600 text-white border-purple-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <FileText className="w-4 h-4" />
              {isGenerating ? 'Compiling Report...' : 'Compile & Issue Report'}
            </button>
          </form>
        </div>

        {/* Case Timeline Visualizer */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            Case Operational Timeline - {selectedCaseId}
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg w-full text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{evt.title}</strong>
                    <span className="text-[10px] text-slate-400 font-medium">{evt.time}</span>
                  </div>
                  <p className="text-slate-600">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <FileBarChart className="w-4 h-4 text-purple-600" />
          Issued Report Archive ({activeReports.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Report ID</th>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Report Title</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Generated Date</th>
                <th className="py-2.5 px-3 text-right">Download Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeReports.map((rpt) => (
                <tr key={rpt.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-bold text-purple-600">{rpt.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{rpt.caseId}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{rpt.title}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
                      {rpt.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{new Date(rpt.generatedAt).toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={`/api/reports/${rpt.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded font-bold text-xs inline-flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-600" />
                      Download PDF
                    </a>
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
