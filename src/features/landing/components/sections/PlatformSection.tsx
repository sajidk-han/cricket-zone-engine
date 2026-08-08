import React from 'react'
import { Smartphone, CheckCircle2 } from 'lucide-react'
import { LogoIcon } from '@/shared/components/LogoIcon'

export function PlatformSection() {
  return (
    <section className="py-24 lg:py-32 relative bg-brand-primary/5 border-t border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Visual / Mockup */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-brand-accent/20 blur-3xl rounded-full"></div>
          <div className="relative flex justify-center">
             {/* Abstract Phone + Play Store Mock */}
             <div className="w-64 h-[500px] bg-black border-8 border-[#1b2559] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                  <div className="w-32 h-6 bg-[#1b2559] rounded-b-xl"></div>
                </div>
                <div className="flex-1 bg-gradient-to-b from-[#09090b] to-[#121215] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 bg-white rounded-xl mb-4 flex items-center justify-center shadow-sm">
                    <LogoIcon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">CricketZone</h3>
                  <p className="text-xs text-[#8f9bba] mb-8">Official Fan Zone & Scorer App</p>
                  
                  <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
                    <div className="bg-emerald-500 w-[100%] h-full rounded-full"></div>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mb-8">Installed</div>

                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                    <div className="w-2 h-2 rounded-full bg-[#1b2559]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#1b2559]"></div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wider">
            <Smartphone size={16} />
            Mobile Ready
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            Built for the App Store. <br/> Available everywhere.
          </h2>
          
          <p className="text-lg text-[#a3aed1] leading-relaxed">
            CricketZone is engineered as a Progressive Web App (PWA) with native-like performance. It's ready for Google Play Store and Apple App Store deployment for your specific organization.
          </p>

          <ul className="space-y-4">
            <ListItem text="Native App Installation via Browser (PWA)" />
            <ListItem text="Push Notifications for Live Matches" />
            <ListItem text="White-label ready for District Associations" />
            <ListItem text="Seamless Organization Onboarding" />
          </ul>
        </div>

      </div>
    </section>
  )
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-[#a3aed1]">
      <CheckCircle2 size={20} className="text-brand-primary" />
      <span className="font-medium text-white">{text}</span>
    </li>
  )
}
