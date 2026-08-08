import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Calendar, Users, ListOrdered, BarChart2 } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('name, description')
    .eq('slug', slug)
    .in('visibility', ['public', 'unlisted'])
    .single()

  if (!tournament) return { title: 'Tournament Not Found' }

  return {
    title: `${tournament.name} | CricketZone`,
    description: tournament.description || `Official portal for ${tournament.name}`,
    openGraph: {
      title: tournament.name,
      description: tournament.description,
      type: 'website',
    }
  }
}

export default async function TournamentLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ slug: string, orgSlug: string }>
}) {
  const { slug, orgSlug } = await params
  const supabase = await createClient()
  
  // 1. Fetch Tournament Context
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('*, seasons(name)')
    .eq('slug', slug)
    .in('visibility', ['public', 'unlisted'])
    .single()

  if (error || !tournament) {
    notFound()
  }

  const navItems = [
    { name: 'Overview', href: `/fanzone/${orgSlug}/tournaments/${slug}`, icon: Trophy },
    { name: 'Fixtures & Results', href: `/fanzone/${orgSlug}/tournaments/${slug}/matches`, icon: Calendar },
    { name: 'Standings', href: `/fanzone/${orgSlug}/tournaments/${slug}/standings`, icon: ListOrdered },
    { name: 'Statistics', href: `/fanzone/${orgSlug}/tournaments/${slug}/stats`, icon: BarChart2 },
    // Future: Teams, Players, Gallery
  ]

  return (
    <div className="min-h-screen bg-bg-base font-sans selection:bg-brand-primary/30">
      {/* Tournament Header */}
      <div className="bg-bg-panel border-b border-border-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shrink-0">
                {tournament.logo_url ? (
                  <img src={tournament.logo_url} alt={tournament.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <Trophy className="w-10 h-10 text-brand-primary" />
                )}
              </div>
              <div>
                <div className="text-brand-primary text-sm font-semibold tracking-wider uppercase mb-1">
                  {tournament.seasons?.name || 'Tournament'}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight">
                  {tournament.name}
                </h1>
                {tournament.description && (
                  <p className="text-text-secondary mt-2 max-w-2xl text-lg">
                    {tournament.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-sm font-medium">
                {tournament.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 overflow-x-auto no-scrollbar border-t border-border-dim/50 pt-2 pb-[-1px]">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="flex items-center gap-2 py-4 px-1 border-b-2 border-transparent hover:border-brand-primary hover:text-brand-primary text-text-secondary whitespace-nowrap transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
