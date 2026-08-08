# Enterprise Architecture Governance

These rules are strictly mandatory for all modules built in this workspace. 

## 1. No Temporary Solutions
Never implement shortcuts, temporary code, duplicate logic, or MVP-only solutions. Every feature must be production-ready and future-proof.

## 2. Architecture First
No UI should be built before confirming: Database Schema, SQL Migration, API Contract, Business Rules, RBAC, RLS, Validation, Components, and Routing. UI is the final step.

## 3. Future Compatibility
Design everything so future modules (Live Scoring, Brackets, Mobile Apps, AI) can plug in without redesigning existing tables.

## 4. Database Standards
- Tables must have: `id`, `org_id`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`.
- All foreign keys indexed.
- Use CHECK constraints.
- Soft Delete only (never physical deletes).

## 5. API Standards
Server Actions must: Validate via Zod, Verify Auth, Verify Org, Verify RBAC.
Standard response format: `{ success, message, data, error, code }`

## 6. State Machine Rules
Entities with lifecycles (Tournaments, Matches) must use a controlled state machine. Reject illegal transitions on the backend.

## 7. UI Standards
Every page must have: Loading State (Skeleton), Empty State, Error State, Success State, Responsive State, Disabled State. No blank screens.

## 8. Performance Standards
- No SELECT *
- Pagination & Lazy Loading
- Optimistic UI & Server Components
- Route Prefetching & Virtualization
- Compatible with Supabase Free Plan

## 9. Security Standards
Mandatory: RLS, RBAC, `org_id` isolation, Rate Limiting, Zod Validation, Sanitization.

## 10. Component & Module Contract
- Reusable components must support: Loading, Empty, Error, Disabled, Mobile, Dark Mode, Keyboard Nav.
- Modules must follow standard folder structure: `components/`, `hooks/`, `api/`, `schemas/`, `types/`, `utils/`. No business logic inside UI.

## 11. Workspace Paradigm
Major entities (Tournament, Match, Team, Player) have their own Workspaces (e.g. `/tournaments/[id]`). Avoid flat CRUD pages.

## 12. Premium UX Rules
Inspiration: Linear, Vercel, Stripe.
Requirements: Premium spacing, glassmorphism only where useful, minimal clicks, drawers > modals, smooth animations.

## 13. Testing Standards
Manual Verification, Validation, Responsive, RBAC, RLS, and Performance tests are mandatory before a module is considered done.

## 14. Mandatory Module Documentation (CRITICAL)
No feature may be considered complete unless it is documented.
Every module (e.g., `src/features/tournaments`) must contain:
- `README.md` (module overview)
- `ARCHITECTURE.md` (technical design)
- `API.md` (server actions/endpoints)
- `CHANGELOG.md` (module changes)
