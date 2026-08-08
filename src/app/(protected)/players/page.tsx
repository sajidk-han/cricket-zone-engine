import React from 'react'
import { fetchOrganizationPlayers } from '@/app/actions/players'
import { PlayersDirectoryClient } from './client'

export default async function PlayersDirectoryPage() {
  const players = await fetchOrganizationPlayers()

  return (
    <PlayersDirectoryClient initialPlayers={players || []} />
  )
}
