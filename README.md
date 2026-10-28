# DataShield Forensics 🛡️
### Integrated Secure Data Erasure & Advanced File Recovery Tool for Digital Forensics and Data Sanitization
**Smart India Hackathon 2026 – Problem Statement #26149**

> **Tagline:** Secure. Recover. Verify. Report.  
> **Core Differentiator:** Evidence-Aware Intelligent Data Lifecycle Engine

---

## 📌 Executive Summary
**DataShield Forensics** is an enterprise-grade digital forensics and data sanitization platform designed for law enforcement, defense cyber agencies, and forensic investigators. It resolves the traditional gap between data recovery and data destruction by connecting both workflows into one unified **Evidence-Aware Intelligent Data Lifecycle Engine**.

Destructive physical disk operations are isolated behind explicit safety controls (**Safe Demo Mode** & **Pre-Erasure Safety Guard**), ensuring real storage devices are never modified or destroyed without authorization.

---

## ⚡ Key Features & Highlights

1. **Evidence-Aware Intelligent Data Lifecycle Engine**
   - Automatically determines whether a case is in `FORENSIC_RECOVERY`, `DATA_SANITIZATION`, or `COMBINED` mode.
   - Enforces Read-Only locks on evidence files and prevents accidental sanitization of unacquired forensic evidence.

2. **Pre-Erasure Safety Guard**
   - Scans target devices prior to sanitization.
   - Pops a high-priority alert if recoverable files are detected on an unacquired target (`WARNING: X potentially recoverable files detected. Forensic acquisition has NOT been completed`).

3. **Advanced Signature File Carving & Fragment Reconstruction Engine**
   - Signature database for JPEG, PNG, PDF, ZIP, DOCX, MP4.
   - Scans binary disk images (`sample_drive.img`) for header/footer signatures.
   - Multi-fragment reconstruction pipeline assembling non-contiguous clusters.

4. **Explainable Confidence Scoring**
   - Itemized transparent scoring (0-99%) with explicit criteria checkmarks:
     - `[✓] Valid magic header signature detected`
     - `[✓] Valid file footer signature detected`
     - `[✓] Expected file size boundary verified`
     - `[✓] Fragment sequence continuity verified`

5. **Tamper-Evident Cryptographic Audit Log**
   - Uses SHA-256 cryptographic hash chaining (`Hash(n) = SHA256(Event(n) + Hash(n-1))`).
   - One-click Audit Chain Integrity Verification tool to detect any modified log entries.

6. **Device Analysis & Media Intelligence Panel**
   - Controller-aware media detection (HDD, SSD, NVMe, USB, SD Card).
   - Prevents applying traditional block overwrites to NAND Flash (SSDs) and recommends ATA/NVMe Sanitize firmware commands + TRIM verification.

7. **Dedicated Verification Center**
   - System-wide status matrix testing Evidence Integrity, Erasure Zero-Verification, Recovery Structure, and Audit Chain Integrity.

8. **Professional Forensic Report Generator**
   - Compiles Forensic Recovery Reports, Sanitization Certificates, Case Audit Reports, and Evidence Integrity Reports with real PDF, JSON, and CSV exports.

---

## 📂 Project Architecture

```
/erase SIH
├── frontend/                     # Modern React + Vite + Tailwind CSS User Interface
│   ├── src/
│   │   ├── components/          # TopBar, Sidebar, PreErasureModal, ConfidenceModal, ReconstructionModal
│   │   ├── pages/               # Dashboard, Cases, Evidence, DeviceAnalysis, SecureErasure, FileRecovery, Verification, AuditLogs, Reports, Settings
│   │   ├── App.jsx              # Main React Application
│   │   └── index.css            # Cyber Forensic Styling Rules
│   └── vite.config.js           # Vite server configuration & backend proxy
├── backend/                     # Modular Node.js / Express Backend Server
│   ├── core/                    # Lifecycle Engine & Pre-Erasure Safety Guard
│   ├── evidence/                # SHA-256 Integrity Engine & Acquisition
│   ├── device/                  # Media Intelligence & Device Scanner
│   ├── recovery/                # Signature Carving & Fragment Reconstruction
│   ├── erasure/                 # Safe Demo Mode Eraser & 3-Pass File Eraser
│   ├── integrity/               # Centralized Verification Center Engine
│   ├── audit/                   # Cryptographic Hash Chaining Audit Engine
│   ├── reports/                 # PDFkit Report Generator
│   ├── database/                # SQLite Database Layer & Pre-Populated Data
│   ├── tests/                   # Automated Test Runner
│   └── server.js                # Express REST API Server
├── sample_data/                 # Forensic Sample Raw Disk Images & Sandbox Files
│   ├── sample_drive.img         # 2MB raw disk image containing real JPEG, PDF, ZIP, PNG signatures
│   └── sandbox/                 # Sandbox files for File Erasure demonstration
├── README.md
├── ARCHITECTURE.md
└── API.md
```

---

## 🚀 How to Run the Application Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Step 1: Start Backend REST API Server
```bash
cd backend
npm start
```
*Server will start on `http://localhost:5001` with Safe Demo Mode ENABLED.*

### Step 2: Start Frontend Application
In a separate terminal window:
```bash
cd frontend
npm run dev
```
*Open `http://localhost:3000` in your web browser.*

---

## 🧪 Running Automated Backend Tests

To run the automated verification test suite:
```bash
cd backend
npm test
```
*Tests SHA-256 hash generation, case creation, file carving, explainable confidence scoring, cryptographic audit chain integrity, and PDF report compilation.*

---

## 🛡️ Safe Demo Mode & Security

By default, **Safe Demo Mode** is active. All destructive physical device formatting operations are simulated with real-time sector wiping progress bars, zero-entropy verification, and sanitization certificate generation without modifying real physical hard disks.

Sandbox file erasure operates exclusively on files inside `sample_data/sandbox/` using real 3-pass DoD 5220.22-M zero/ones/random byte overwriting.
