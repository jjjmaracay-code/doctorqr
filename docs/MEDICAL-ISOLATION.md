# Patient identity isolation — 2026-10-25

Companion backend change in doctorqr-backend/docs/MEDICAL-ISOLATION.md.

Device medical profiles and QR image caches must have an explicit account owner and matching immutable identity. Old unowned local data is discarded on upgrade. Login/register clear old patient material when changing accounts; logout clears medical profile, QR cache, consent and ID. Stale tabs are hidden and redirected on session changes; form save/load rejects delayed results for another session. QR generation after an edit requires server acceptance of that save.

Public cards use only an exact ID-bound verified server response. They never substitute the scanner's localStorage profile, unsigned URL fields, or a legacy compressed patient payload. Loss of server access produces an error rather than a different patient. Previously generated self-contained legacy QR artifacts need regeneration. Public readers already offline on an older installed release cannot be retroactively updated.

The server quarantines identity-inconsistent stored profiles instead of exposing them. Re-enter medical fields from the correct account if a warning appears, review them, save successfully, and generate new QRs. No mass deletion of server records was performed. This prevents the reproduced software substitution paths, not false medical information deliberately entered by an account owner or scanning a different person's physical QR.

Validation: node --test tests/medical-isolation.cjs (two fictional patients, account switching, storage race, offline scan fallback, wrong-ID response, missing profile).
