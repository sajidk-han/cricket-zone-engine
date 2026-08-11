"use client"

import React, { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Drawer } from '@/shared/components/ui/Drawer'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { inviteUserWithPassword } from '@/app/actions/invite'
import { Eye, EyeOff } from 'lucide-react'

export function InviteUserDrawer({ 
  trigger,
  open,
  onOpenChange
}: { 
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()

  const isOpen = open !== undefined ? open : internalIsOpen
  const setIsOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val)
    setInternalIsOpen(val)
  }

  // Password strength hint logic
  const hasMinLength = password.length >= 8
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isStrong = hasMinLength && hasLower && hasUpper && hasNumber

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!isStrong) {
      toast.error('Please enter a strong password.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const res = await inviteUserWithPassword(formData)
      
      if (res.success) {
        toast.success(res.message)
        setIsOpen(false)
        setPassword('')
        router.refresh()
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error('Failed to send invite')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button variant="primary">
            <Mail size={16} className="mr-2" /> Invite User
          </Button>
        )}
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Invite Team Member"
        position="right"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                name="email" 
                type="email" 
                required
                placeholder="colleague@example.com"
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Temporary Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Strong password"
                  className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password Strength Hint */}
              <div className="mt-2 text-xs space-y-1">
                <p className={`${hasMinLength ? 'text-green-500' : 'text-text-muted'}`}>• At least 8 characters</p>
                <p className={`${hasUpper && hasLower ? 'text-green-500' : 'text-text-muted'}`}>• Uppercase & lowercase letters</p>
                <p className={`${hasNumber ? 'text-green-500' : 'text-text-muted'}`}>• At least one number</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Role
              </label>
              <select 
                name="role" 
                className="w-full bg-bg-base border border-bg-elevated rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-primary"
              >
                <option value="organizer">Organizer (Teams & Players only)</option>
                <option value="manager">Manager</option>
                <option value="scorer">Scorer</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 rounded-lg">
              <p className="text-xs text-brand-primary/90">
                <strong>Warning:</strong> You are creating credentials directly. Please ensure you share this temporary password securely with the user.
              </p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-bg-elevated flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Create User
            </Button>
          </div>
        </form>
      </Drawer>
    </>
  )
}
