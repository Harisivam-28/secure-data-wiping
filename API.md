# DataShield Forensics - REST API Reference

Base URL: `http://localhost:5001/api`

---

## 1. System & Health
- `GET /api/status`
  - Returns backend health, Safe Demo Mode status, connected cases, and active evidence.

---

## 2. Case Management
- `GET /api/cases`
  - List all cases.
- `GET /api/cases/:id`
  - Returns case details, associated evidence, recovered files, audit logs, and lifecycle status.
- `POST /api/cases`
  - Create a new case container (`CASE-2026-XXXX`).

---

## 3. Evidence Management
- `GET /api/evidence?caseId=CASE-2026-0001`
  - List registered evidence items for a case.
- `POST /api/evidence`
  - Register new evidence source file / disk image and compute initial SHA-256 hash.
- `POST /api/evidence/:id/verify`
  - Re-verify SHA-256 hash against original baseline.

---

## 4. Device Analysis & Media Intelligence
- `GET /api/devices`
  - List detected hardware devices.
- `GET /api/devices/:id/analyze`
  - Run Media Intelligence scan and fetch recommended media-aware sanitization workflow.

---

## 5. File Recovery & Carving
- `GET /api/recovery/signatures`
  - Fetch active file-signature database.
- `GET /api/recovery/files?caseId=CASE-2026-0001`
  - List carved and reconstructed evidence files.
- `POST /api/recovery/carve`
  - Trigger binary offset signature carving scan on target evidence.
- `POST /api/recovery/reconstruct`
  - Reassemble fragmented file chunks.

---

## 6. Secure Erasure & Safety Guard
- `GET /api/erasure/methods`
  - Fetch supported sanitization standards (DoD 5220.22-M, NIST 800-88 Purge, Gutmann 35-Pass, Zero Fill).
- `GET /api/erasure/pre-check?caseId=CASE-2026-0001`
  - Execute Pre-Erasure Safety Guard check.
- `POST /api/erasure/drive`
  - Execute Drive Sanitization routine (Safe Demo Mode simulation + Certificate issuance).
- `GET /api/sandbox/files`
  - List files in safe sandbox directory.
- `POST /api/erasure/files`
  - Execute real 3-pass DoD overwriting on selected sandbox files.

---

## 7. Verification & Audit
- `GET /api/verification?caseId=CASE-2026-0001`
  - Execute centralized system integrity audit.
- `GET /api/audit?caseId=CASE-2026-0001`
  - Fetch tamper-evident audit log ledger.
- `GET /api/audit/verify`
  - Cryptographically validate SHA-256 audit log hash chain.

---

## 8. Reports & Timeline
- `GET /api/reports?caseId=CASE-2026-0001`
  - List compiled case reports.
- `POST /api/reports/generate`
  - Compile new report document.
- `GET /api/reports/:id/pdf`
  - Stream downloadable PDF report.
