"use client"
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQSection() {
  const faqs = [
    {
      q: "Can I manage multiple tournaments simultaneously?",
      a: "Yes, our multi-tenant architecture allows you to run unlimited concurrent tournaments. You can switch between them seamlessly within your dashboard."
    },
    {
      q: "How does the offline scoring work?",
      a: "The scoring app uses local storage (PWA capabilities). If you lose internet connection, you can continue scoring. Once connection is restored, it automatically syncs ball-by-ball data to the cloud."
    },
    {
      q: "Is there a limit on the number of teams or players?",
      a: "No, CricketZone is an enterprise platform designed to scale. There are no hard limits on the number of teams, players, or matches you can register."
    },
    {
      q: "Do fans need to download an app to view live scores?",
      a: "No, fans can access the Fan Zone instantly via any web browser. However, they can choose to 'Install' the PWA to their home screen for a native app experience without going through the App Store."
    },
    {
      q: "Can I assign different scorers to different matches?",
      a: "Yes, Role-Based Access Control (RBAC) allows you to invite officials and restrict their access to only score specific assigned matches, ensuring data integrity."
    }
  ]

  return (
    <section className="py-24 lg:py-32 relative bg-[#111c44]/30 border-y border-[#1b2559]">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#a3aed1]">
            Everything you need to know about the platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>

      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-[#1b2559] rounded-xl bg-[#09090b] overflow-hidden transition-colors hover:border-brand-primary/30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
      >
        <span className="font-bold text-white pr-8">{question}</span>
        <ChevronDown className={`w-5 h-5 text-[#8f9bba] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 pt-0 text-[#a3aed1] leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  )
}
