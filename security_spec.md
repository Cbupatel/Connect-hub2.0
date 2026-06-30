# Security Blueprint & Zero-Trust Access Analysis

This document describes the security spec, data invariants, and defensive tests built into the Firestore Rules for the **ConnectHub** grassroots soccer recruitment platform.

## 1. Data Invariants & Zero-Trust Gates
1.  **Immutable Identity**: A registered coach or player user cannot spoof or alter their primary `id` field.
2.  **Verified Specialty**: A coach must belong strictly to one of the authorized license specialties: `Elite Scout`, `Goalkeeping`, `Strength & Cond.`, or `Tactical Expert`.
3.  **Strict Performance Bound**: Grassroots athletic metric values must exist inside the valid physical bounds of `0` to `100`. No overflow or denial-of-wallet payload allowed.
4.  **Immutability of Inquiries**: Dispatched scouting proposals or bookings on `connectRequests` are read-only historic records that cannot be revised or deleted post-submission.

## 2. The "Dirty Dozen" Payloads (Anti-Hacking Specs)
The security rules have been audited to block and return `PERMISSION_DENIED` for the following payloads:
1.  **Identity Spoofing**: Attempt to update a coach profile where `id` changes.
2.  **Ghost Field Injection**: Adding custom roles like `role: 'admin'` or `isScout: true`.
3.  **OutOfBound Metrics**: Submitting a player profile with `pace: 9999`.
4.  **License Forging**: Registering as a coach with an empty license or unknown specialty like `Supreme Selector`.
5.  **Proposal Erasure**: Attempt to run `deleteDoc` on a `connectRequests` document.
6.  **Unsigned Write**: Attempt to register a profile while `request.auth` is null.
7.  **Unverified Inflow**: Write with spoofed email claims.
8.  **Empty Payload**: Writing a coach record without mandatory fields like `fees` or `license`.
9.  **Junk Path Injection**: Submitting a document ID containing special backslashes or oversized text.
10. **Query Scraping**: Attempting to query someone else's connection data without an active signed-in session.
11. **Negative Valuation**: Registering a player with age `-5` or pace `-50`.
12. **Tampering with Rating**: Direct client increment of coach rating without review workflow.

These invariants are fully enforced inside `/firestore.rules`.
