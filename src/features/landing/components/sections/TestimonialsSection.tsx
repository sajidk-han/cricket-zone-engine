import React from 'react'

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "CricketZone completely transformed how we run our district tournaments. We went from paper scoresheets to a fully digital live broadcast in 3 days.",
      author: "Zaman Khan",
      role: "Director",
      org: "North District Cricket Association"
    },
    {
      quote: "The multi-tenant architecture is perfect. We manage 14 different clubs under one dashboard, with granular access control for every scorer.",
      author: "Sarah Ahmed",
      role: "Operations Head",
      org: "Premier Corporate League"
    },
    {
      quote: "Our fans love the public portal. The live scoring is instantaneous, and the player profiles keep everyone engaged throughout the season.",
      author: "Ali Raza",
      role: "Tournament Manager",
      org: "Elite Cricket Academy"
    }
  ]

  return (
    <section className="py-24 lg:py-32 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            Trusted by the best.
          </h2>
          <p className="text-lg text-[#a3aed1]">
            See how professional organizations are scaling their operations with CricketZone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#111c44]/50 border border-[#1b2559] p-8 rounded-2xl flex flex-col justify-between hover:border-brand-primary/30 transition-colors">
              <div className="mb-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  ))}
                </div>
                <p className="text-[#a3aed1] leading-relaxed font-medium italic">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1b2559] rounded-full flex items-center justify-center text-white font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{t.author}</div>
                  <div className="text-xs text-[#8f9bba]">{t.role}, {t.org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
