"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table'
import { Badge } from '@/shared/components/ui/Badge'
import Link from 'next/link'
import { CreatePlayerDrawer } from '@/features/players/components/CreatePlayerDrawer'

export default function PlayersDirectory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [teamFilter, setTeamFilter] = useState('All Teams')

  // Dummy players data
  const players = [
    { id: '101', name: 'Babar Azam', role: 'Batsman', teams: ['Eagles', 'Falcons'], avg: 51.2, strikeRate: 129.5 },
    { id: '102', name: 'Shaheen Afridi', role: 'Bowler', teams: ['Eagles'], avg: 14.5, strikeRate: 15.2 },
    { id: '103', name: 'Virat Kohli', role: 'Batsman', teams: ['Tigers'], avg: 52.7, strikeRate: 137.9 },
    { id: '104', name: 'Jasprit Bumrah', role: 'Bowler', teams: ['Tigers', 'Lions'], avg: 20.3, strikeRate: 18.5 },
    { id: '105', name: 'Rashid Khan', role: 'All Rounder', teams: ['Panthers'], avg: 15.6, strikeRate: 145.2 },
  ]

  // Filter logic
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) || player.id.includes(searchQuery)
    const matchesRole = roleFilter === 'All Roles' || player.role === roleFilter
    const matchesTeam = teamFilter === 'All Teams' || player.teams.includes(teamFilter)
    return matchesSearch && matchesRole && matchesTeam
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Players Directory</h1>
          <p className="text-text-secondary mt-1">Manage all players registered in your organization.</p>
        </div>
        <CreatePlayerDrawer />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-bg-base border border-bg-elevated rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="All Roles">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All Rounder">All Rounder</option>
            <option value="Wicket Keeper">Wicket Keeper</option>
          </select>
          <select 
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="bg-bg-base border border-bg-elevated rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="All Teams">All Teams</option>
            <option value="Eagles">Eagles</option>
            <option value="Tigers">Tigers</option>
            <option value="Lions">Lions</option>
            <option value="Panthers">Panthers</option>
            <option value="Falcons">Falcons</option>
          </select>
        </CardContent>
      </Card>

      {/* Directory Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Associated Teams</TableHead>
            <TableHead className="text-right">Career Avg</TableHead>
            <TableHead className="text-right">Career SR</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          {filteredPlayers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-text-secondary">
                No players found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            filteredPlayers.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs border border-bg-elevated text-text-secondary uppercase">
                      {p.name.charAt(0)}
                    </div>
                    <span className="font-bold text-white">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-text-secondary">{p.role}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.teams.map((t, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] py-0">{t}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{p.avg}</TableCell>
                <TableCell className="text-right font-medium">{p.strikeRate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-text-muted hover:text-white">Profile</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
    </div>
  )
}
