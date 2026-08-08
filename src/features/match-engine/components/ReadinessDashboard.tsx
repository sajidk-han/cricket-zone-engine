"use client"

import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { CheckCircle2, Circle, AlertCircle, Play, ShieldCheck } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateMatchLifecycle } from '@/app/actions/scoring'

type ReadinessChecklistProps = {
  matchId: string;
  teamsConfirmed: boolean;
  playingXiSubmitted: boolean;
  tossCompleted: boolean;
  venueAssigned: boolean;
  umpireAssigned: boolean;
  scorerConnected: boolean;
  onMatchStart: () => void;
}

export function ReadinessDashboard({
  matchId,
  teamsConfirmed,
  playingXiSubmitted,
  tossCompleted,
  venueAssigned,
  umpireAssigned,
  scorerConnected,
  onMatchStart
}: ReadinessChecklistProps) {
  
  const checks = [
    { label: "Teams Confirmed", isComplete: teamsConfirmed, optional: false },
    { label: "Playing XI Submitted", isComplete: playingXiSubmitted, optional: false },
    { label: "Toss Completed", isComplete: tossCompleted, optional: false },
    { label: "Venue Assigned", isComplete: venueAssigned, optional: true },
    { label: "Umpire Assigned", isComplete: umpireAssigned, optional: true },
    { label: "Scorer Connected", isComplete: scorerConnected, optional: false },
  ];

  const allMandatoryComplete = checks.filter(c => !c.optional).every(c => c.isComplete);

  const handleStartMatch = async () => {
    if (!allMandatoryComplete) {
      toast.error("Please complete all mandatory checks before starting the match.");
      return;
    }
    
    // Transition to Live State
    const res = await updateMatchLifecycle(matchId, 'live');
    if (res.success) {
      toast.success(res.message);
      onMatchStart();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Card className="bg-[#0f0f11] border-bg-elevated max-w-2xl mx-auto mt-10">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-bg-elevated">
          <ShieldCheck size={32} className="text-brand-primary" />
          <div>
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Tournament Readiness</h2>
            <p className="text-text-muted text-sm">Pre-match operations checklist</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between bg-bg-surface p-4 rounded-lg border border-bg-elevated">
              <div className="flex items-center gap-3">
                {check.isComplete ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <Circle size={20} className="text-text-muted" />
                )}
                <span className={`font-medium ${check.isComplete ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {check.label} {check.optional && <span className="text-xs text-text-muted ml-2">(Optional)</span>}
                </span>
              </div>
              {!check.isComplete && !check.optional && (
                <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20">
                  Required
                </span>
              )}
            </div>
          ))}
        </div>

        {!allMandatoryComplete && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-lg mb-6">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">
              Mandatory operations are pending. The match cannot be started until all required pre-match steps are completed.
            </p>
          </div>
        )}

        <Button 
          variant={allMandatoryComplete ? 'primary' : 'outline'}
          className={`w-full h-14 text-lg font-bold uppercase tracking-wider ${allMandatoryComplete ? 'bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]' : 'opacity-50 cursor-not-allowed'}`}
          onClick={handleStartMatch}
          disabled={!allMandatoryComplete}
        >
          <Play size={20} className="mr-2" /> Start Live Scoring
        </Button>
      </CardContent>
    </Card>
  )
}
