import type { Simulado, SimuladoStatus, StatusConfig } from '@/types/simulados'

export function getSimuladoStatus(simulado: Simulado): SimuladoStatus {
  if (simulado.questions.length === 0) return 'pending'
  if (simulado.respondedAt !== null) return 'answered'
  return 'waiting_response'
}

export function getStatusConfig(status: SimuladoStatus): Omit<StatusConfig, 'icon'> {
  switch (status) {
    case 'pending':
      return {
        label: 'Gerando',
        className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        variant: 'secondary' as const
      }
    case 'waiting_response':
      return {
        label: 'Aguardando Resposta',
        className: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        variant: 'secondary' as const
      }
    case 'answered':
      return {
        label: 'Respondido',
        className: 'bg-green-500/20 text-green-500 border-green-500/30',
        variant: 'default' as const
      }
  }
}

export function formatarTempo(segundos: number): string {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const segs = segundos % 60
  
  if (horas > 0) {
    return `${horas}h ${minutos}m ${segs}s`
  }
  if (minutos > 0) {
    return `${minutos}m ${segs}s`
  }
  return `${segs}s`
}

export function formatarData(data: Date | null | string): string {
  if (!data) return 'Data não disponível'
  
  const dataObj = typeof data === 'string' ? new Date(data) : data
  const agora = new Date()
  const diff = agora.getTime() - dataObj.getTime()
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Ontem'
  if (dias < 7) return `${dias} dias atrás`
  
  return dataObj.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}
