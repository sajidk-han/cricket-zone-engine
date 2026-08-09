"use client"
import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface DeleteEntityButtonProps {
  id: string
  onDelete: (id: string) => Promise<{ success: boolean; message: string }>
  confirmMessage?: string
  className?: string
  iconOnly?: boolean
}

export function DeleteEntityButton({ 
  id, 
  onDelete, 
  confirmMessage = "Are you sure you want to delete this?", 
  className = "", 
  iconOnly = false 
}: DeleteEntityButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm(confirmMessage)) {
      setIsDeleting(true)
      try {
        const res = await onDelete(id)
        if (res.success) {
          toast.success(res.message)
          router.refresh()
        } else {
          toast.error(res.message)
        }
      } catch (err: any) {
        toast.error("Failed to delete")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex items-center justify-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title="Delete"
    >
      <Trash2 size={iconOnly ? 18 : 16} className={!iconOnly ? "mr-2" : ""} />
      {!iconOnly && <span className="font-medium text-sm">Delete</span>}
    </button>
  )
}
