# Tournaments Module

This module handles the core lifecycle of Cricket Tournaments within an Organization. It adheres to the Enterprise Architecture Governance standards.

## Features
- Tournament Creation & Management
- Team Enrollment
- Match Scheduling (Future)
- Live Scoring & Leaderboards (Future)

## Standards
- Strict Zod validation
- RLS and RBAC enforced
- Soft Delete only
- Workspace Routing Paradigm (`/tournaments/[id]/*`)
