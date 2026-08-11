"use client"

import { useState } from "react"
type Player = any

interface WicketResolutionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (wicketType: string, incomingBatterId: string | null, dismissedPlayerId: string) => void
  availableBatters: Player[]
  striker: { id: string, name: string }
  nonStriker: { id: string, name: string }
  dismissedPlayers?: string[]
}

export function WicketResolutionDrawer({
  isOpen,
  onClose,
  onConfirm,
  availableBatters,
  striker,
  nonStriker,
  dismissedPlayers = []
}: WicketResolutionDrawerProps) {
  const [wicketType, setWicketType] = useState<string>("bowled")
  const [incomingBatterId, setIncomingBatterId] = useState<string>("")
  const [dismissedPlayerId, setDismissedPlayerId] = useState<string>(striker.id)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-red-500 mb-6">Wicket Resolution</h2>

        <div className="space-y-4">
          {/* Dismissal Type */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Dismissal Type</label>
            <select
              value={wicketType}
              onChange={(e) => setWicketType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value="bowled" className="bg-slate-800 text-white">Bowled</option>
              <option value="caught" className="bg-slate-800 text-white">Caught</option>
              <option value="lbw" className="bg-slate-800 text-white">LBW</option>
              <option value="run_out" className="bg-slate-800 text-white">Run Out</option>
              <option value="stumped" className="bg-slate-800 text-white">Stumped</option>
              <option value="hit_wicket" className="bg-slate-800 text-white">Hit Wicket</option>
            </select>
          </div>

          {/* Out Batter */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Who Got Out?</label>
            <select
              value={dismissedPlayerId || striker.id}
              onChange={(e) => setDismissedPlayerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
            >
              <option value={striker.id} className="bg-slate-800 text-white">{striker.name} (Striker)</option>
              <option value={nonStriker.id} className="bg-slate-800 text-white">{nonStriker.name} (Non-Striker)</option>
            </select>
          </div>

          {/* Incoming Batter */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Incoming Batter</label>
            <select
              value={incomingBatterId}
              onChange={(e) => setIncomingBatterId(e.target.value)}
              disabled={availableBatters.length === 0}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 disabled:opacity-50"
            >
              {availableBatters.length === 0 ? (
                <option value="" disabled className="bg-slate-800 text-slate-400">No Batters Remaining (All Out)</option>
              ) : (
                <option value="" disabled className="bg-slate-800 text-slate-400">Select Next Batter</option>
              )}
              {availableBatters.map((p) => {
                const isOut = dismissedPlayers.includes(p.id)
                return (
                  <option key={p.id} value={p.id} disabled={isOut} className={isOut ? "bg-slate-800 text-red-500 line-through" : "bg-slate-800 text-white"}>
                    {isOut ? "🔴 " : ""}{p.full_name || p.name} {isOut ? "(OUT)" : ""}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!incomingBatterId && availableBatters.length > 0) {
                alert("Please select the incoming batter.")
                return
              }
              onConfirm(wicketType, incomingBatterId || null, dismissedPlayerId || striker.id)
            }}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Confirm Wicket
          </button>
        </div>
      </div>
    </div>
  )
}
