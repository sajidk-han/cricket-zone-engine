"use client"

import React, { useRef, useState } from 'react'
import { ImageUpload, ImageUploadHandle } from '@/shared/components/ui/ImageUpload'
import { uploadPlayerAvatar, updatePlayer, removePlayerAvatar } from '@/app/actions/players'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

type EditableAvatarProps = {
  playerId: string
  orgId: string
  currentAvatarUrl: string | null
  playerName: string
}

export function EditableAvatar({ playerId, orgId, currentAvatarUrl, playerName }: EditableAvatarProps) {
  const imageUploadRef = useRef<ImageUploadHandle>(null)
  const router = useRouter()
  const [avatar, setAvatar] = useState(currentAvatarUrl)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleUploadSuccess = async (publicUrl: string) => {
    try {
      // Create formData with the new avatar URL
      const formData = new FormData()
      formData.append('avatarUrl', publicUrl)
      
      const res = await updatePlayer(playerId, formData)
      if (res.success) {
        toast.success('Profile picture updated successfully')
        setAvatar(publicUrl)
        router.refresh()
      } else {
        toast.error('Failed to update profile picture')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleRemove = async () => {
    if (!avatar) return
    setIsRemoving(true)
    try {
      const res = await removePlayerAvatar(orgId, playerId)
      if (res.success) {
        // Also update the database to set avatar_url to null
        const formData = new FormData()
        formData.append('avatarUrl', '') // passing empty string will be handled by backend
        
        const updateRes = await updatePlayer(playerId, formData)
        if (updateRes.success) {
          toast.success('Profile picture removed')
          setAvatar(null)
          router.refresh()
        } else {
          toast.error('Failed to update player record')
        }
      } else {
        toast.error('Failed to remove image')
      }
    } catch (error) {
      toast.error('An error occurred while removing')
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="relative group">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-bg-elevated flex items-center justify-center text-4xl md:text-5xl font-black text-text-primary shadow-2xl border-4 border-bg-base relative">
        <ImageUpload
          ref={imageUploadRef}
          bucketName="player-avatars"
          folderPath={`${orgId}/${playerId}`}
          serverUploadAction={uploadPlayerAvatar}
          currentImageUrl={avatar}
          autoUpload={true}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(err) => toast.error(err)}
          variant="avatar"
          className="w-full h-full"
        />
      </div>
      
      {/* Remove Button Overlay */}
      {avatar && (
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove Avatar"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
