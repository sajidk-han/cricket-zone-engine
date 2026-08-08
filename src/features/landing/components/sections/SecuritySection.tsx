import React from 'react'
import { ShieldCheck, Lock, Database, FileCheck } from 'lucide-react'

export function SecuritySection() {
  return (
    <section className="py-24 lg:py-32 relative border-t border-[#1b2559] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold uppercase tracking-wider">
              <ShieldCheck size={16} />
              Enterprise Security
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Bank-grade security for your organization's data.
            </h2>
            
            <p className="text-lg text-[#a3aed1] leading-relaxed">
              CricketZone is built on a zero-trust architecture. Your tournament data, player statistics, and organizational records are encrypted at rest and in transit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <SecurityFeature icon={<Lock />} title="Role-Based Access" desc="Granular RBAC ensures only authorized scorers can modify match data." />
              <SecurityFeature icon={<Database />} title="Encrypted Storage" desc="All data is encrypted using AES-256 standard at rest." />
              <SecurityFeature icon={<FileCheck />} title="Audit Logging" desc="Comprehensive logs of all administrative actions for accountability." />
              <SecurityFeature icon={<ShieldCheck />} title="Offline Sync" desc="Secure local storage that synchronizes automatically when online." />
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-3xl rounded-full"></div>
             <div className="relative bg-[#111c44] border border-[#1b2559] rounded-2xl p-8 shadow-2xl">
               <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#1b2559]">
                 <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                   <Lock size={24} />
                 </div>
                 <div>
                   <div className="font-bold text-white text-lg">Access Control</div>
                   <div className="text-sm text-[#8f9bba]">Manage permissions</div>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <PermissionRow role="Super Admin" access="Full Access" active />
                 <PermissionRow role="Tournament Manager" access="Manage Tournaments" active />
                 <PermissionRow role="Official Scorer" access="Score Matches Only" active />
                 <PermissionRow role="Team Manager" access="Manage Roster" active={false} />
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function SecurityFeature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-emerald-500 mb-2">{icon}</div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-sm text-[#a3aed1]">{desc}</p>
    </div>
  )
}

function PermissionRow({ role, access, active }: { role: string, access: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#1b2559]/50">
      <div>
        <div className="font-bold text-white text-sm">{role}</div>
        <div className="text-xs text-[#8f9bba]">{access}</div>
      </div>
      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-emerald-500' : 'bg-[#1b2559]'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
    </div>
  )
}
