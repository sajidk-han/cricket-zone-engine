# API Contract

Server actions return a consistent signature:
```typescript
{
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  code?: string;
}
```

## Actions
- `createTournament(data)`: Creates a new tournament. Enforces Zod and RLS.
- `getTournaments()`: Retrieves active tournaments for the org.
- `getTournamentById(id)`: Retrieves a single tournament.
- `enrollTeam(tournamentId, teamId)`: Adds a team to a tournament. Ensures no duplicates.
- `getTournamentTeams(tournamentId)`: Retrieves enrolled teams.
