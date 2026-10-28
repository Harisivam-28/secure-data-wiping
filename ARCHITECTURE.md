# DataShield Forensics - System Architecture Document

## 1. System Overview
DataShield Forensics is architected around an **Evidence-Aware Intelligent Data Lifecycle Engine**. The platform unifies forensic acquisition, file signature carving, multi-fragment reconstruction, media-aware sanitization, cryptographic audit logging, and PDF report compilation.

---

## 2. Core Subsystems

```
                                +-----------------------------------+
                                |     Frontend (React + Vite)       |
                                +-----------------------------------+
                                                  | REST API
                                                  v
                                +-----------------------------------+
                                |    Express REST API Router       |
                                +-----------------------------------+
                                                  |
     +--------------------+-----------------------+-----------------------+--------------------+
     |                    |                       |                       |                    |
     v                    v                       v                       v                    v
+----------+    +-------------------+   +--------------------+  +------------------+  +------------------+
|Lifecycle |    |  Evidence Engine  |   | File Recovery      |  | Erasure Engine   |  | Audit Engine     |
|Engine    |    |  (SHA-256 Lock)   |   | (Carving & Recon)  |  | (Safe Demo Mode) |  | (Hash Chaining)  |
+----------+    +-------------------+   +--------------------+  +------------------+  +------------------+
```

### A. Lifecycle & Safety Subsystem (`/backend/core`)
- Evaluates case type: `Forensic Investigation`, `Data Sanitization`, or `Combined`.
- Enforces Pre-Erasure Safety Guard checks prior to any destructive operation.

### B. Evidence & Hashing Subsystem (`/backend/evidence`)
- Computes real cryptographic SHA-256 hashes using streaming Node.js crypto.
- Maintains `originalHash` baseline and `currentHash` re-verification.

### C. File Recovery & Carving Subsystem (`/backend/recovery`)
- **Binary Signature Scanner**: Scans evidence images (`sample_drive.img`) for magic headers and trailers (JPEG, PNG, PDF, ZIP).
- **Explainable Confidence Scoring**: Evaluates header, trailer, size boundary, structure integrity, and fragment sequence continuity.
- **Fragmented File Reconstruction**: Re-assembles multi-fragment PNG streams across non-contiguous clusters.

### D. Erasure & Media Intelligence Subsystem (`/backend/erasure`, `/backend/device`)
- **Media Intelligence Router**: Maps device hardware type (SSD, NVMe, HDD, USB) to optimal sanitization standard (NIST 800-88 Purge vs DoD 5220.22-M 3-Pass).
- **Safe Demo Mode**: Simulates sector overwriting, verification, and certificate generation.
- **File Sandbox Eraser**: Real 3-pass byte overwriting (0x00, 0xFF, Random) on sandbox files.

### E. Cryptographic Audit Subsystem (`/backend/audit`)
- **Hash Chaining**: `Hash(n) = SHA256(id + timestamp + user + caseId + action + details + Hash(n-1))`.
- **Chain Verifier**: Re-calculates every hash in sequence to detect log tampering.

### F. Report Generator Subsystem (`/backend/reports`)
- Compiles structured JSON/CSV data and renders downloadable PDF certificates using `pdfkit`.
