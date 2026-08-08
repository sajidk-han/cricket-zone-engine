"use client"

import { useState, useEffect } from "react"
import { Button } from "@/shared/components/ui/Button"

interface BowlerSelectionDrawerProps {
  isOpen: boolean
  onClose?: () => void
  onConfirm: (bowlerId: string) => void
  availableBowlers: any[]
  currentBowlerId?: string
  isMandatory?: boolean
}

export function BowlerSelectionDrawer({
  isOpen,
  onClose,
  onConfirm,
  availableBowlers,
  currentBowlerId,
  isMandatory = false
}: BowlerSelectionDrawerProps) {
  const [selectedBowlerId, setSelectedBowlerId] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      setSelectedBowlerId("")
    }
  }, [isOpen])

  if (!isOpen) return null

  // Filter out the bowler who just bowled the previous over, unless they are the only option
  const selectableBowlers = availableBowlers.filter(b => b.player.id !== currentBowlerId || availableBowlers.length === 1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Select Bowler</h2>
        <p className="text-sm text-slate-400 mb-6">
          {isMandatory ? "The over is complete. Please select a new bowler." : "Select a new bowler to continue."}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Select Bowler</label>
            <select
              value={selectedBowlerId}
              onChange={(e) => setSelectedBowlerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary"
            >
              <option value="" disabled className="bg-slate-800 text-white">-- Select Bowler --</option>
              {selectableBowlers.map((b) => (
                <option key={b.player.id} value={b.player.id} className="bg-slate-800 text-white">
                  {b.player.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            {!isMandatory && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              className="flex-1"
              disabled={!selectedBowlerId}
              onClick={() => onConfirm(selectedBowlerId)}
            >
              Confirm Bowler
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
