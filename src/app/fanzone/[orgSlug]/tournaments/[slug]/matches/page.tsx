import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Calendar } from 'lucide-react'
import MatchCard from '@/features/match-engine/components/MatchCard'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tournament } = await supabase.from('tournaments').select('name').eq('slug', slug).single()
  return { title: `Matches - ${tournament?.name || 'Tournament'} | CricketZone` }
}

export default async function TournamentMatches({ params }: { params: Promise<{ slug: string, orgSlug: string }> }) {
  const { slug, orgSlug } = await params
  const supabase = await createClient()
  
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (error || !tournament) notFound()

  const { data: matches } = await supabase
    .from('live_match_view')
    .select('*')
    .eq('tournament_id', tournament.id)
    .order('start_time', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-brand-primary" />
        <h2 className="text-2xl font-bold text-text-primary">Fixtures & Results</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches && matches.length > 0 ? matches.map((m: any) => (
          <Link key={m.id} href={`/fanzone/${orgSlug}/matches/${m.id}`} className="block transition-transform hover:-translate-y-1">
             <MatchCard match={m} />
          </Link>
        )) : (
          <div className="col-span-full p-12 text-center bg-bg-panel border border-border-dim rounded-2xl">
            <p className="text-text-secondary text-lg">No matches scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
