import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return diffInMinutes <= 1 ? 'agora' : `${diffInMinutes} minutos atrás`
    }
    return diffInHours === 1 ? '1 hora atrás' : `${diffInHours} horas atrás`
  } else if (diffInDays === 1) {
    return '1 dia atrás'
  } else if (diffInDays < 7) {
    return `${diffInDays} dias atrás`
  } else if (diffInWeeks === 1) {
    return '1 semana atrás'
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} semanas atrás`
  } else if (diffInMonths === 1) {
    return '1 mês atrás'
  } else {
    return `${diffInMonths} meses atrás`
  }
}