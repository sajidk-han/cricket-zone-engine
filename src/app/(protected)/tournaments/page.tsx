import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table'
import Link from 'next/link'
import { fetchTournaments } from '@/app/actions/tournaments'

export default async function TournamentsList() {
  const tournaments = await fetchTournaments()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Tournaments</h1>
          <p className="text-text-secondary mt-1">Manage all your tournaments across the organization.</p>
        </div>
        <Link href="/tournaments/new">
          <Button variant="primary">
            <span className="mr-2">➕</span> Create Tournament
          </Button>
        </Link>
      </div>

      {/* Filters & Search (UI Only) */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <select className="bg-bg-base border border-bg-elevated rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
            <option>All Statuses</option>
            <option>Ongoing</option>
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Draft</option>
          </select>
        </CardContent>
      </Card>

      {/* List */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tournament Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          {tournaments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-text-secondary">
                No tournaments found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            tournaments.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-900/40 flex items-center justify-center text-xl">🏆</div>
                    <div>
                      <p className="font-bold text-text-primary">{t.name}</p>
                      <p className="text-xs text-text-secondary">{t.location || 'No location'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={t.status === 'scheduled' ? 'warning' : 'success'} className="uppercase">
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {t.start_date ? new Date(t.start_date).toLocaleDateString() : 'TBD'}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/tournaments/${t.id}`}>
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}

