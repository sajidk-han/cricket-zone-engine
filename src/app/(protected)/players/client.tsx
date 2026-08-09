"use client"

import React, { useState, useTransition } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Table, TableHeader, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table'
import { Badge } from '@/shared/components/ui/Badge'
import Link from 'next/link'
import { CreatePlayerDrawer } from '@/features/players/components/CreatePlayerDrawer'
import { OptimizedImage } from '@/features/fanzone/components/OptimizedImage'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function PlayersDirectoryClient({ initialPlayers }: { initialPlayers: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Filter logic
  const filteredPlayers = initialPlayers.filter(player => {
    const matchesSearch = player.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || player.id.includes(searchQuery)
    const matchesRole = roleFilter === 'All Roles' || player.batting_style === roleFilter || player.bowling_style === roleFilter
    return matchesSearch && matchesRole
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
            <option value="Right-hand bat">Right-hand bat</option>
            <option value="Left-hand bat">Left-hand bat</option>
            <option value="Right-arm fast">Right-arm fast</option>
            <option value="Right-arm spin">Right-arm spin</option>
          </select>
        </CardContent>
      </Card>

      {/* Players Table */}
      <Card className="overflow-hidden border-bg-elevated">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-bg-elevated bg-bg-base hover:bg-bg-base">
                <TableHead className="w-[300px] text-xs font-bold text-text-secondary">PLAYER</TableHead>
                <TableHead className="text-xs font-bold text-text-secondary">ROLE</TableHead>
                <TableHead className="text-xs font-bold text-text-secondary">BATTING</TableHead>
                <TableHead className="text-xs font-bold text-text-secondary">BOWLING</TableHead>
                <TableHead className="text-right text-xs font-bold text-text-secondary">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredPlayers.map((player) => (
                <TableRow key={player.id} className="border-bg-elevated hover:bg-bg-elevated/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-sm font-bold text-text-primary overflow-hidden relative">
                        <OptimizedImage
                          src={player.avatar_url}
                          alt={player.full_name}
                          fallbackInitials={player.full_name.charAt(0)}
                          fill
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-text-primary">{player.full_name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-text-secondary border-bg-elevated capitalize">
                      {player.primary_role || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-text-secondary border-bg-elevated">
                      {player.batting_style || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-text-secondary border-bg-elevated">
                      {player.bowling_style || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/players/${player.id}`} className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                        Profile
                      </Link>
                      <button 
                        onClick={async () => {
                          if(confirm('Are you sure you want to delete this player?')) {
                            const { deletePlayer } = await import('@/app/actions/players')
                            const res = await deletePlayer(player.id)
                            if(res.success) {
                              toast.success('Player deleted successfully')
                              startTransition(() => {
                                router.refresh()
                              })
                            } else {
                              toast.error(res.message)
                            }
                          }
                        }}
                        disabled={isPending}
                        className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredPlayers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-text-secondary">
                    No players found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
