"use client"

import React, { useTransition } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Play } from 'lucide-react'
import { proceedToToss } from '@/app/actions/matches'
import { toast } from 'react-hot-toast'

export function ProceedToTossButton({ matchId }: { matchId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleProceed = () => {
    startTransition(async () => {
      const res = await proceedToToss(matchId)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <Button 
      variant="primary" 
      onClick={handleProceed}
      isLoading={isPending}
      className="h-12 px-8 text-lg font-bold gap-2 rounded-full shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)]"
    >
      {!isPending && <Play size={20} fill="currentColor"/>}
      Proceed to Toss
    </Button>
  )
}
