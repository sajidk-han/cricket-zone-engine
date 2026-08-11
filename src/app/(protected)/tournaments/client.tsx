"use client"

import React, { useTransition } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Calendar, ArrowRight, MoreVertical, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import { deleteTournament } from '@/app/actions/tournaments'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function TournamentCard({ 
  t,
  userMemberships = {},
  currentUserId = null
}: { 
  t: any,
  userMemberships?: Record<string, string>,
  currentUserId?: string | null
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this tournament? This will hide it from all views.')) {
      const res = await deleteTournament(t.id)
      if (res.success) {
        toast.success(res.message)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(res.message)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: any = {
      draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      registration_open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      scheduled: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      ongoing: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
      completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      archived: 'bg-slate-800 text-slate-500 border-slate-700'
    }
    const formattedStatus = status.replace('_', ' ').toUpperCase()
    const style = styles[status] || styles.draft

    return (
      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${style}`}>
        {formattedStatus}
      </span>
    )
  }

  const roleInOrg = userMemberships[t.org_id] || 'viewer';
  const canDelete = 
    roleInOrg === 'owner' || 
    roleInOrg === 'admin' || 
    roleInOrg === 'super_admin' || 
    (roleInOrg === 'organizer' && t.created_by === currentUserId && currentUserId);

  return (
    <Card className="group hover:border-green-400/50 transition-all duration-300 bg-bg-surface border-bg-elevated hover:shadow-xl hover:shadow-green-400/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Dropdown for Actions (Simple implementation for MVP) */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {/* We can add an edit button later, linking to an edit page */}
        {canDelete && (
          <button 
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 bg-bg-elevated/50 hover:bg-red-500/20 text-text-muted hover:text-red-400 rounded-md transition-colors disabled:opacity-50"
            title="Delete Tournament"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <CardContent className="p-6 relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4 pr-12">
          {getStatusBadge(t.status)}
          <span className="text-xs font-medium text-text-muted bg-bg-elevated px-2 py-1 rounded-md">
            {t.settings?.match_format?.toUpperCase() || 'T20'}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-1 pr-8">{t.name}</h3>
        
        <div className="flex flex-col gap-2 mb-6 flex-1">
          {t.start_date && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar size={14} className="opacity-70" />
              <span>{new Date(t.start_date).toLocaleDateString()} - {t.end_date ? new Date(t.end_date).toLocaleDateString() : 'TBD'}</span>
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-bg-elevated/50 flex justify-center items-center w-full mt-auto">
          <Link href={`/tournaments/${t.id}/dashboard`} className="w-full">
            <button className="w-full h-11 bg-brand-primary hover:bg-brand-primary/90 text-bg-base font-bold text-sm rounded-lg transition-all duration-200 shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
              Manage Workspace
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
