"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/Tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table'
import { Badge } from '@/shared/components/ui/Badge'
import Link from 'next/link'

export default function TeamWorkspace() {
  const { id } = useParams()
  
  // Dummy team roster data
  const players = [
    { id: '101', name: 'Babar Azam', role: 'Batsman', jersey: 56, isCaptain: true },
    { id: '102', name: 'Shaheen Afridi', role: 'Bowler', jersey: 10, isCaptain: false },
    { id: '103', name: 'Mohammad Rizwan', role: 'Wicket Keeper', jersey: 16, isCaptain: false },
    { id: '104', name: 'Shadab Khan', role: 'All Rounder', jersey: 7, isCaptain: false },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/teams" className="text-text-secondary hover:text-white transition-colors">
              &larr; Teams
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-bg-base border border-bg-elevated flex items-center justify-center text-3xl">🦅</div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary tracking-tight">Eagles</h1>
              <p className="text-text-secondary mt-1">EAG • Manager: John Doe</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Edit Team</Button>
        </div>
      </div>

      <Tabs defaultValue="roster">
        <TabsList className="max-w-md">
          <TabsTrigger value="roster">Roster (15)</TabsTrigger>
          <TabsTrigger value="history">Match History</TabsTrigger>
          <TabsTrigger value="stats">Team Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="roster">
          <div className="mt-6 flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Current Roster</h2>
            <Button variant="secondary" size="sm">Add Player</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Jersey</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {players.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-bold text-white flex items-center gap-2">
                      {p.name}
                      {p.isCaptain && <Badge variant="warning">Captain</Badge>}
                      {p.role === 'Wicket Keeper' && <Badge variant="default">WK</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">{p.role}</TableCell>
                  <TableCell>{p.jersey}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-text-muted hover:text-white">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TabsContent>

        <TabsContent value="history">
          <div className="mt-6">
            <Card>
              <CardContent className="p-10 text-center">
                <span className="text-4xl mb-4 block">📈</span>
                <p className="text-lg font-bold">Match History</p>
                <p className="text-text-secondary">Previous tournament matches will appear here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
