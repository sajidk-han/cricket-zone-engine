"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/Button"

interface BatterSelectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (batterToReplaceId: string, incomingBatterId: string) => void
  availableBatters: any[]
  striker: { id: string, name: string }
  nonStriker: { id: string, name: string }
  dismissedPlayers?: string[]
}

export function BatterSelectionDrawer({
  isOpen,
  onClose,
  onConfirm,
  availableBatters,
  striker,
  nonStriker,
  dismissedPlayers = []
}: BatterSelectionDrawerProps) {
  const [batterToReplaceId, setBatterToReplaceId] = useState<string>(striker.id)
  const [incomingBatterId, setIncomingBatterId] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      setBatterToReplaceId(striker.id)
      setIncomingBatterId("")
    }
  }, [isOpen, striker.id])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Change Batter</h2>
        <p className="text-sm text-slate-400 mb-6">
          Manually replace a batter (e.g. Retired Hurt).
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Who is leaving the crease?</label>
            <select
              value={batterToReplaceId}
              onChange={(e) => setBatterToReplaceId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
            >
              <option value={striker.id} className="bg-slate-800 text-white">{striker.name} (Striker)</option>
              <option value={nonStriker.id} className="bg-slate-800 text-white">{nonStriker.name} (Non-Striker)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Incoming Batter</label>
            <select
              value={incomingBatterId}
              onChange={(e) => setIncomingBatterId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
            >
              <option value="" disabled className="bg-slate-800 text-white">-- Select Batter --</option>
              {availableBatters.map((b) => {
                const isOut = dismissedPlayers.includes(b.id)
                return (
                  <option key={b.id} value={b.id} disabled={isOut} className={isOut ? "bg-slate-800 text-red-500 line-through" : "bg-slate-800 text-white"}>
                    {b.full_name || b.name} {isOut ? "(Out)" : ""}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!incomingBatterId || !batterToReplaceId}
              onClick={() => onConfirm(batterToReplaceId, incomingBatterId)}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
