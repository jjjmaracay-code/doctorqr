# Birthdate display and registration confirmation

Date-only values remain ISO YYYY-MM-DD end to end. The previous registration implementation sent input[type=date].value directly; the exact step where the reported date became February 9 instead of September 2 cannot be established from a screenshot. No automatic swap of existing birthdates is safe.

Registration now shows the date with a spelled-out month and asks for explicit confirmation before sending registration. Invalid/impossible/future dates cannot proceed through that confirmation. The locked profile displays the full date using UTC calendar formatting while preserving a hidden ISO value for form serialization and existing account/profile identity checks. No authentication, payment or QR payload changes.

This release does not alter any stored identity. The affected account's canonical birthdate must be corrected by an authorized database administrator to 1976-09-02, after verifying the exact account email. Log out and back in after that correction. Any medical profile that no longer matches the corrected canonical identity remains quarantined under the existing identity checks; re-enter/review that profile before publishing new QRs. Never bulk-swap dates across users.

Tests: node --test tests/birthdate.cjs tests/medical-isolation.cjs. Registration confirmation and full-profile DOM verified with fictional account data in jsdom, plus public-card online/offline checks.
