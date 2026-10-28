import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import PreErasureModal from './components/PreErasureModal';

// Pages
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Evidence from './pages/Evidence';
import DeviceAnalysis from './pages/DeviceAnalysis';
import SecureErasure from './pages/SecureErasure';
import FileRecovery from './pages/FileRecovery';
import Verification from './pages/Verification';
import AuditLogs from './pages/AuditLogs';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

const API_BASE = 'http://localhost:5001/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCaseId, setActiveCaseId] = useState('CASE-2026-0001');

  // Core Data States
  const [cases, setCases] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [devices, setDevices] = useState([]);
  const [recoveredFiles, setRecoveredFiles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [reports, setReports] = useState([]);
  const [verificationData, setVerificationData] = useState(null);
  const [sanitizationMethods, setSanitizationMethods] = useState([]);
  const [signatureDatabase, setSignatureDatabase] = useState([]);

  // Safety & RBAC
  const [safeDemoMode, setSafeDemoMode] = useState(true);
  const [user, setUser] = useState({
    id: 'usr_1',
    name: 'Sgt. Vikram Singh',
    role: 'Administrator',
    email: 'v.singh@cyberforensics.gov.in'
  });

  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [preErasureSafetyData, setPreErasureSafetyData] = useState(null);

  // Initial Data Fetch from Backend
  useEffect(() => {
    fetchAllData();
  }, [activeCaseId]);

  const fetchAllData = async () => {
    try {
      const [resCases, resEvd, resDev, resRec, resAudit, resRpt, resMeth, resSig, resVrf] = await Promise.all([
        fetch(`${API_BASE}/cases`),
        fetch(`${API_BASE}/evidence`),
        fetch(`${API_BASE}/devices`),
        fetch(`${API_BASE}/recovery/files`),
        fetch(`${API_BASE}/audit`),
        fetch(`${API_BASE}/reports`),
        fetch(`${API_BASE}/erasure/methods`),
        fetch(`${API_BASE}/recovery/signatures`),
        fetch(`${API_BASE}/verification`)
      ]);

      if (resCases.ok) setCases(await resCases.json());
      if (resEvd.ok) setEvidence(await resEvd.json());
      if (resDev.ok) setDevices(await resDev.json());
      if (resRec.ok) setRecoveredFiles(await resRec.json());
      if (resAudit.ok) setAuditLogs(await resAudit.json());
      if (resRpt.ok) setReports(await resRpt.json());
      if (resMeth.ok) setSanitizationMethods(await resMeth.json());
      if (resSig.ok) setSignatureDatabase(await resSig.json());
      if (resVrf.ok) setVerificationData(await resVrf.json());
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  };

  // API Call Handlers
  const handleCreateCase = async (newCaseData) => {
    try {
      const res = await fetch(`${API_BASE}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCaseData)
      });
      if (res.ok) {
        const created = await res.json();
        setCases(prev => [created, ...prev]);
        setActiveCaseId(created.id);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEvidence = async (evdData) => {
    try {
      const res = await fetch(`${API_BASE}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evdData)
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyIntegrity = async (evidenceId) => {
    try {
      const res = await fetch(`${API_BASE}/evidence/${evidenceId}/verify`, { method: 'POST' });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeDevice = async (deviceId) => {
    const res = await fetch(`${API_BASE}/devices/${deviceId}/analyze`);
    return await res.json();
  };

  const handleRunCarving = async (evidenceId) => {
    const res = await fetch(`${API_BASE}/recovery/carve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evidenceId })
    });
    if (res.ok) {
      fetchAllData();
    }
  };

  const handleRunPreCheck = async (caseId) => {
    const res = await fetch(`${API_BASE}/erasure/pre-check?caseId=${caseId}`);
    return await res.json();
  };

  const handleExecuteDriveErasure = async (erasureData) => {
    const res = await fetch(`${API_BASE}/erasure/drive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(erasureData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erasure failed');
    }
    const cert = await res.json();
    fetchAllData();
    return cert;
  };

  const handleExecuteFileErasure = async (fileData) => {
    const res = await fetch(`${API_BASE}/erasure/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'File erasure failed');
    }
    const result = await res.json();
    fetchAllData();
    return result;
  };

  const handleVerifyAuditChain = async () => {
    const res = await fetch(`${API_BASE}/audit/verify`);
    return await res.json();
  };

  const handleRunVerification = async (caseId) => {
    const res = await fetch(`${API_BASE}/verification?caseId=${caseId}`);
    if (res.ok) {
      const v = await res.json();
      setVerificationData(v);
      return v;
    }
  };

  const handleGenerateReport = async (rptData) => {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rptData)
    });
    if (res.ok) {
      fetchAllData();
    }
  };

  const demoUsers = [
    { id: 'usr_1', name: 'Dr. Rajesh Verma', role: 'Administrator', email: 'admin@datashield.gov.in' },
    { id: 'usr_2', name: 'Sgt. Vikram Singh', role: 'Investigator', email: 'v.singh@cyberforensics.gov.in' },
    { id: 'usr_3', name: 'Ananya Sharma', role: 'Viewer', email: 'a.sharma@cybercell.in' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* TopBar Header */}
      <TopBar
        cases={cases}
        activeCaseId={activeCaseId}
        setActiveCaseId={setActiveCaseId}
        user={user}
        safeDemoMode={safeDemoMode}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Workspace */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              cases={cases}
              evidence={evidence}
              auditLogs={auditLogs}
              reports={reports}
              setActiveTab={setActiveTab}
              onOpenCreateCaseModal={() => setIsCreateCaseModalOpen(true)}
            />
          )}

          {activeTab === 'cases' && (
            <Cases
              cases={cases}
              onCreateCase={handleCreateCase}
              onSelectCase={(id) => { setActiveCaseId(id); setActiveTab('dashboard'); }}
              isCreateModalOpen={isCreateCaseModalOpen}
              setIsCreateModalOpen={setIsCreateCaseModalOpen}
            />
          )}

          {activeTab === 'evidence' && (
            <Evidence
              evidence={evidence}
              cases={cases}
              activeCaseId={activeCaseId}
              onAddEvidence={handleAddEvidence}
              onVerifyIntegrity={handleVerifyIntegrity}
            />
          )}

          {activeTab === 'device-analysis' && (
            <DeviceAnalysis
              devices={devices}
              onAnalyzeDevice={handleAnalyzeDevice}
            />
          )}

          {activeTab === 'secure-erasure' && (
            <SecureErasure
              devices={devices}
              cases={cases}
              activeCaseId={activeCaseId}
              sanitizationMethods={sanitizationMethods}
              onExecuteDriveErasure={handleExecuteDriveErasure}
              onExecuteFileErasure={handleExecuteFileErasure}
              onRunPreCheck={handleRunPreCheck}
              onTriggerPreErasureModal={(data) => setPreErasureSafetyData(data)}
              safeDemoMode={safeDemoMode}
            />
          )}

          {activeTab === 'file-recovery' && (
            <FileRecovery
              evidence={evidence}
              recoveredFiles={recoveredFiles}
              signatureDatabase={signatureDatabase}
              activeCaseId={activeCaseId}
              onRunCarving={handleRunCarving}
            />
          )}

          {activeTab === 'verification' && (
            <Verification
              activeCaseId={activeCaseId}
              verificationData={verificationData}
              onRunVerification={handleRunVerification}
            />
          )}

          {activeTab === 'audit-logs' && (
            <AuditLogs
              auditLogs={auditLogs}
              onVerifyAuditChain={handleVerifyAuditChain}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              cases={cases}
              activeCaseId={activeCaseId}
              reports={reports}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              user={user}
              setUser={setUser}
              safeDemoMode={safeDemoMode}
              setSafeDemoMode={setSafeDemoMode}
              users={demoUsers}
            />
          )}
        </main>
      </div>

      {/* Pre-Erasure Safety Guard Modal */}
      <PreErasureModal
        isOpen={!!preErasureSafetyData}
        onClose={() => setPreErasureSafetyData(null)}
        onCreateAcquisition={() => {
          setPreErasureSafetyData(null);
          setActiveTab('evidence');
        }}
        onProceedSanitization={() => {
          setPreErasureSafetyData(null);
          alert('Pre-Erasure warning bypassed. Proceeding to explicit drive confirmation modal.');
        }}
        safetyCheckData={preErasureSafetyData}
      />
    </div>
  );
}
