import React from 'react'
import { Check, X } from 'lucide-react'

export function ComparisonSection() {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
            Why choose CricketZone?
          </h2>
          <p className="text-lg text-[#a3aed1]">
            See how we compare against traditional methods and basic scoring apps.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#1b2559] bg-[#050505]">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#1b2559]">
                <th className="p-6 font-bold text-[#8f9bba] uppercase tracking-widest text-xs w-1/3">Feature</th>
                <th className="p-6 font-black text-brand-primary text-lg w-1/3 bg-brand-primary/5">CricketZone Enterprise</th>
                <th className="p-6 font-bold text-[#8f9bba] text-sm w-1/3">Traditional Apps / Paper</th>
              </tr>
            </thead>
            <tbody className="divide-y -[#1b2559]">
              <ComparisonRow feature="Multi-Organization Management" cz={true} other={false} />
              <ComparisonRow feature="Granular Role-Based Access" cz={true} other={false} />
              <ComparisonRow feature="Offline-First Architecture" cz={true} other={false} />
              <ComparisonRow feature="Live Fan Zone Broadcasting" cz={true} other={false} />
              <ComparisonRow feature="Enterprise Data Security" cz={true} other={false} />
              <ComparisonRow feature="Basic Match Scoring" cz={true} other={true} />
            </tbody>
          </table>
        </div>

      </div>
    </section>
  )
}

function ComparisonRow({ feature, cz, other }: { feature: string, cz: boolean, other: boolean }) {
  return (
    <tr className="hover:bg-[#1b2559]/20 transition-colors">
      <td className="p-6 text-sm font-semibold text-white">{feature}</td>
      <td className="p-6 bg-brand-primary/5 text-brand-primary">
        {cz ? <Check className="mx-auto" /> : <X className="mx-auto text-[#8f9bba] opacity-50" />}
      </td>
      <td className="p-6 text-[#8f9bba]">
        {other ? <Check className="mx-auto" /> : <X className="mx-auto opacity-50" />}
      </td>
    </tr>
  )
}
