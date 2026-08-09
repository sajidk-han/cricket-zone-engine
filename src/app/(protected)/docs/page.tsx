import React from 'react'
import { BookOpen, Trophy, Users, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Documentation | CricketZone',
}

const guides = [
  {
    title: 'Creating a Tournament',
    description: 'Learn how to set up your first cricket tournament, configure formats, and manage dates.',
    icon: Trophy,
    color: 'text-brand-primary'
  },
  {
    title: 'Managing Teams & Players',
    description: 'Add teams to your tournament, approve player registrations, and organize squads.',
    icon: Users,
    color: 'text-blue-400'
  },
  {
    title: 'Live Scoring Basics',
    description: 'Understand the live scoring engine, ball-by-ball tracking, and auto-generated standings.',
    icon: Activity,
    color: 'text-red-400'
  }
]

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-brand-primary" /> Documentation
        </h1>
        <p className="text-text-secondary text-lg">
          Welcome to the CricketZone Organizer Documentation. Here you will find guides and resources to help you manage your cricket events.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {guides.map((guide, idx) => (
          <div key={idx} className="bg-bg-surface border border-border-dim rounded-2xl p-6 hover:border-brand-primary/50 transition-colors group cursor-pointer">
            <div className={`w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center mb-4 ${guide.color}`}>
              <guide.icon size={24} />
            </div>
            <h3 className="text-white font-bold mb-2 group-hover:text-brand-primary transition-colors">{guide.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              {guide.description}
            </p>
            <div className="flex items-center text-sm font-semibold text-text-secondary group-hover:text-white transition-colors mt-auto">
              Read Guide <ChevronRight size={16} className="ml-1 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,126,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        <h2 className="text-2xl font-black text-white mb-4 relative z-10">Detailed API & Developer Docs Coming Soon</h2>
        <p className="text-text-secondary max-w-2xl mx-auto mb-6 relative z-10">
          We are currently building our comprehensive developer portal at <strong>docs.cricketzone.com</strong> which will include full API references, Webhook setups, and advanced tournament configurations.
        </p>
        <Link href="/tournaments" className="inline-block relative z-10">
          <button className="bg-brand-primary text-white font-bold px-6 py-3 rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20">
            Go back to Tournaments
          </button>
        </Link>
      </div>
    </div>
  )
}
