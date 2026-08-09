import { SupabaseClient } from '@supabase/supabase-js'

export type ImageEntity = 'team-logos' | 'player-avatars' | 'tournament-logos' | 'org-logos'

interface UploadParams {
  supabase: SupabaseClient
  bucket: ImageEntity
  orgId: string
  entityId: string // e.g., team_id or player_id
  file: File | Blob
  fileName?: string
}

interface DeleteParams {
  supabase: SupabaseClient
  bucket: ImageEntity
  orgId: string
  entityId: string
  fileName?: string
}

export const ImageStorageService = {
  /**
   * Generates a standard storage path for an entity image
   * Format: {orgId}/{entityId}/[fileName].webp
   */
  generatePath(orgId: string, entityId: string, fileName: string = 'avatar.webp'): string {
    return `${orgId}/${entityId}/${fileName}`
  },

  /**
   * Uploads an optimized image to Supabase Storage
   * Automatically replaces existing file if it has the same name
   */
  async uploadImage({ supabase, bucket, orgId, entityId, file, fileName = 'avatar.webp' }: UploadParams): Promise<{ publicUrl: string; error: string | null }> {
    try {
      const path = this.generatePath(orgId, entityId, fileName)
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
          contentType: file.type || 'image/webp',
          cacheControl: '3600'
        })

      if (error) {
        console.error(`[ImageStorage] Upload Error (${bucket}):`, error)
        return { publicUrl: '', error: error.message }
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      // Add a timestamp query param to bust cache immediately on update
      const publicUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`

      return { publicUrl, error: null }
    } catch (err: any) {
      console.error(`[ImageStorage] Exception (${bucket}):`, err)
      return { publicUrl: '', error: err.message }
    }
  },

  /**
   * Deletes an image from Supabase Storage
   */
  async deleteImage({ supabase, bucket, orgId, entityId, fileName = 'avatar.webp' }: DeleteParams): Promise<{ success: boolean; error: string | null }> {
    try {
      const path = this.generatePath(orgId, entityId, fileName)
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        console.error(`[ImageStorage] Delete Error (${bucket}):`, error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err: any) {
      console.error(`[ImageStorage] Delete Exception (${bucket}):`, err)
      return { success: false, error: err.message }
    }
  },
  
  /**
   * Extracts the file path from a public URL
   */
  extractPathFromUrl(url: string | null): string | null {
    if (!url) return null;
    try {
      // url format is like: .../storage/v1/object/public/player-avatars/org_id/player_id/avatar.webp?t=123
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split('/public/');
      if (parts.length > 1) {
          const bucketAndPath = parts[1]; // e.g. player-avatars/org_id/player_id/avatar.webp
          const pathParts = bucketAndPath.split('/');
          pathParts.shift(); // remove bucket name
          return pathParts.join('/'); // org_id/player_id/avatar.webp
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
