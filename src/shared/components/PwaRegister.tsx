"use client"
import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registration successful.');
          },
          (err) => {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }

    // 2. Listen for Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      // Update UI notify the user they can install the PWA
      setShowInstallPrompt(true)
    })

    // 3. Listen for successful install
    window.addEventListener('appinstalled', () => {
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      console.log('PWA was installed')
    })
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-brand-primary text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 border border-brand-primary/50">
      <div className="flex flex-col">
        <span className="font-bold text-sm">Install CricketZone</span>
        <span className="text-xs opacity-80">Add to home screen for faster access</span>
      </div>
      <button 
        onClick={handleInstallClick}
        className="bg-white text-brand-primary px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:bg-gray-100 transition-colors flex items-center gap-2"
      >
        <Download size={16} />
        Install
      </button>
      <button onClick={() => setShowInstallPrompt(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors ml-2">
        <X size={16} />
      </button>
    </div>
  )
}
