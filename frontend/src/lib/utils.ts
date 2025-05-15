import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { backend } from "wailsjs/go/models"

//tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//files
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export async function getFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function downloadImage(image: backend.ConvertedImage) {
  const link = document.createElement("a")
  link.href = image.path
  link.download = image.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

//time
export function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'agora mesmo'
  if (minutes < 60) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`
  if (hours < 24) return `${hours} hora${hours > 1 ? 's' : ''} atrás`
  if (days < 30) return `${days} dia${days > 1 ? 's' : ''} atrás`
  if (months < 12) return `${months} mês${months > 1 ? 'es' : ''} atrás`
  return `${years} ano${years > 1 ? 's' : ''} atrás`
}
