# Technical Architecture

## Database Integration
The module primarily interacts with:
- `tournaments`
- `tournament_teams`

## State Machine
Tournament Statuses:
- `draft`: Initial creation.
- `registration_open`: Teams can be enrolled.
- `registration_closed`: Enrollment locked. Matches can be scheduled.
- `upcoming`: Ready to start.
- `live`: Active matches.
- `completed`: Read-only.
- `archived`: Hidden from main views.

## Future Proofing
The architecture uses a flexible `settings` JSONB column to prevent schema migrations when new tournament formats or configurations are requested.
