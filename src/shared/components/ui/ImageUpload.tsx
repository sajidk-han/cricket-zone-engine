"use client"

import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { UploadCloud, Image as ImageIcon, X, Loader2, AlertCircle } from 'lucide-react'

export interface ImageUploadHandle {
  upload: (dynamicFolderPath?: string, dynamicFileName?: string) => Promise<string | null>;
  hasFile: () => boolean;
  getFile: () => Blob | null;
}

export type ImageUploadProps = {
  bucketName: string
  folderPath?: string // Optional if using manual trigger
  fileName?: string // e.g. `logo.webp`
  autoUpload?: boolean // Defaults to false
  serverUploadAction?: (formData: FormData) => Promise<{ success: boolean; publicUrl: string }>
  onUploadSuccess?: (publicUrl: string) => void
  onUploadError?: (error: string) => void
  onRemove?: () => void
  currentImageUrl?: string | null
  className?: string
  variant?: 'default' | 'avatar'
}

export const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(({ 
  bucketName, 
  folderPath, 
  fileName = 'logo.webp',
  autoUpload = false,
  serverUploadAction,
  onUploadSuccess, 
  onUploadError,
  onRemove,
  currentImageUrl,
  className = "",
  variant = 'default'
}, ref) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    upload: async (dynamicFolderPath?: string, dynamicFileName?: string) => {
      if (!selectedFile) return null;
      return await performUpload(selectedFile, dynamicFolderPath, dynamicFileName);
    },
    hasFile: () => selectedFile !== null,
    getFile: () => selectedFile
  }));

  // Maximum allowed sizes
  const MAX_INPUT_SIZE_MB = 5
  const MAX_INPUT_BYTES = MAX_INPUT_SIZE_MB * 1024 * 1024
  const TARGET_MAX_BYTES = 50 * 1024 // 50KB
  const MAX_DIMENSION = 400

  const processAndUploadImage = async (file: File) => {
    setError(null)

    // 1. Validate Input File
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file (PNG, JPG, WEBP).")
      return
    }

    if (file.size > MAX_INPUT_BYTES) {
      setError(`File is too large. Maximum allowed size is ${MAX_INPUT_SIZE_MB}MB.`)
      return
    }

    setIsCompressing(true)

    try {
      // 2. Read and Resize via Canvas
      const optimizedBlob = await compressImage(file)
      
      if (optimizedBlob.size > TARGET_MAX_BYTES) {
        throw new Error("Image could not be compressed under 50KB. Please select a simpler or smaller image.")
      }

      // Create a local preview
      const localPreviewUrl = URL.createObjectURL(optimizedBlob)
      setPreviewUrl(localPreviewUrl)
      setSelectedFile(optimizedBlob)
      setIsCompressing(false)

      if (autoUpload) {
        await performUpload(optimizedBlob, folderPath, fileName)
      }

    } catch (err: any) {
      setIsCompressing(false)
      const errorMsg = err.message || "Failed to process image."
      setError(errorMsg)
      if (onUploadError) onUploadError(errorMsg)
      setPreviewUrl(currentImageUrl || null)
      setSelectedFile(null)
    }
  }

  const performUpload = async (blob: Blob, path?: string, name?: string) => {
    setIsUploading(true)
    setError(null)
    try {
      const activePath = path || folderPath
      const activeName = name || fileName
      if (!activePath) throw new Error("Folder path is required for upload")

      if (serverUploadAction) {
        // Use server action for upload (secure, uses service role key)
        const parts = activePath.split('/')
        const orgId = parts[0]
        const entityId = parts[1] // Can be teamId, playerId, etc.
        
        const uploadFormData = new FormData()
        uploadFormData.append('orgId', orgId)
        uploadFormData.append('teamId', entityId) // For backwards compatibility with teams
        uploadFormData.append('entityId', entityId)
        uploadFormData.append('bucketName', bucketName)
        uploadFormData.append('file', blob, activeName)
        
        const result = await serverUploadAction(uploadFormData)
        
        setIsUploading(false)
        if (onUploadSuccess) onUploadSuccess(result.publicUrl)
        return result.publicUrl
      }

      throw new Error('No upload action configured')

    } catch (err: any) {
      setIsUploading(false)
      const errorMsg = err.message || "Failed to upload image."
      setError(errorMsg)
      if (onUploadError) onUploadError(errorMsg)
      throw err
    }
  }

  // --- HTML5 Canvas Compression Logic ---
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.onload = (e) => {
        const img = new window.Image()
        img.onerror = () => reject(new Error("Invalid image file"))
        img.onload = () => {
          let width = img.width
          let height = img.height

          // Calculate aspect ratio and target dimensions
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error("Failed to get canvas context"))

          // Preserve transparency by not filling background for PNG/WEBP
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to WebP (quality 0.7 for 400x400 should easily fit 50KB)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error("Compression failed"))
              }
            },
            'image/webp',
            0.7
          )
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  // --- Drag & Drop Handlers ---
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }, [isDragging])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndUploadImage(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAndUploadImage(e.target.files[0])
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPreviewUrl(null)
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (onRemove) onRemove()
  }

  const triggerSelect = () => {
    if (isUploading || isCompressing) return
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
        aria-label="Upload Image"
      />

      <div 
        onClick={triggerSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={variant === 'avatar' ? `
          relative w-full h-full rounded-full overflow-hidden cursor-pointer group flex items-center justify-center
          ${isDragging ? 'ring-4 ring-brand-primary/50 bg-black/40' : 'hover:bg-black/20'}
          ${(isUploading || isCompressing) ? 'pointer-events-none' : ''}
          ${className}
        ` : `
          relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all
          min-h-[160px] cursor-pointer group focus-within:ring-2 focus-within:ring-brand-primary outline-none
          ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-bg-elevated bg-bg-surface hover:border-brand-primary/50 hover:bg-bg-base'}
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
          ${(isUploading || isCompressing) ? 'pointer-events-none opacity-80' : ''}
          ${className}
        `}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            triggerSelect()
          }
        }}
        role="button"
        aria-disabled={isUploading || isCompressing}
      >
        {variant === 'avatar' ? (
          <>
            {previewUrl && !error ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-text-muted opacity-50" />
              </div>
            )}
            
            {/* Hover overlay with camera icon */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <UploadCloud className="w-8 h-8 text-white drop-shadow-md" />
            </div>

            {/* Status Overlays */}
            {isCompressing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-6 h-6 text-brand-primary animate-spin mb-1" />
                <span className="text-[10px] font-bold text-white uppercase">Opt...</span>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                <UploadCloud className="w-6 h-6 text-brand-primary animate-bounce mb-1" />
                <span className="text-[10px] font-bold text-white uppercase">Up...</span>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Preview Mode */}
        {previewUrl && !error ? (
          <div className="relative w-full flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-bg-elevated shadow-md mb-4 bg-black/20 flex items-center justify-center">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            
            {/* Status Overlays */}
            {isCompressing && (
              <div className="absolute inset-0 bg-bg-surface/80 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-2" />
                <span className="text-xs font-bold text-text-secondary uppercase">Optimizing...</span>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-bg-surface/80 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
                <UploadCloud className="w-8 h-8 text-brand-primary animate-bounce mb-2" />
                <span className="text-xs font-bold text-text-secondary uppercase">Uploading...</span>
              </div>
            )}

            {!isUploading && !isCompressing && (
              <div className="flex gap-4 items-center">
                <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors">
                  <UploadCloud size={14} /> Change Image
                </span>
                <button 
                  onClick={handleRemove}
                  className="text-xs font-bold text-red-400 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-colors"
                  aria-label="Remove image"
                >
                  <X size={14} /> Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Initial Mode */
          <div className="flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-brand-primary text-bg-base shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-bg-elevated text-text-muted group-hover:bg-brand-primary/20 group-hover:text-brand-primary'}`}>
              <ImageIcon size={24} />
            </div>
            
            {error ? (
              <div className="flex flex-col items-center">
                <AlertCircle size={20} className="text-red-500 mb-2" />
                <span className="text-sm font-bold text-red-500 max-w-[250px] leading-tight">{error}</span>
                <span className="text-xs text-text-muted mt-2 underline">Click to try again</span>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-text-primary mb-1">
                  <span className="text-brand-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-muted">
                  PNG, JPG, WEBP (Max 5MB)
                </p>
                <p className="text-[10px] text-text-muted/60 mt-2">
                  Auto-optimizes to ~500KB WEBP
                </p>
              </>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  )
})
