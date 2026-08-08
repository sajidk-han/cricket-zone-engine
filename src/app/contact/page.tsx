import React from 'react'
import { StaticPageLayout } from '@/features/landing/components/layouts/StaticPageLayout'
import { Button } from '@/shared/components/ui/Button'

export default function ContactPage() {
  return (
    <StaticPageLayout 
      title="Contact Us" 
      subtitle="We're here to help you digitize your cricket organization."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        <div>
          <h2 className="mt-0">Get in Touch</h2>
          <p>
            Whether you have a question about features, pricing, or need technical support, our team is ready to answer all your questions.
          </p>
          
          <div className="mt-8 space-y-4">
            <div>
              <strong>Sales Inquiries</strong>
              <p className="mt-1">sales@cricketzone.com</p>
            </div>
            <div>
              <strong>Technical Support</strong>
              <p className="mt-1">support@cricketzone.com</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#050505] border border-bg-elevated p-8 rounded-2xl not-prose">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Name</label>
              <input type="text" className="w-full bg-bg-surface border border-bg-elevated rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-brand-primary" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Email</label>
              <input type="email" className="w-full bg-bg-surface border border-bg-elevated rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-brand-primary" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Message</label>
              <textarea rows={4} className="w-full bg-bg-surface border border-bg-elevated rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-brand-primary" placeholder="How can we help?"></textarea>
            </div>
            <Button variant="primary" className="w-full rounded-lg">Send Message</Button>
          </form>
        </div>
      </div>
    </StaticPageLayout>
  )
}
