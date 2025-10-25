import type { Simulado, SimuladoStatus, StatusConfig } from '@/types/simulados'

export function getSimuladoStatus(simulado: Simulado): SimuladoStatus {
  if (simulado.questions.length === 0) return 'gerando'
  if (simulado.respondedAt !== null) return 'respondido'
  return 'aguardando'
}

export function getStatusConfig(status: SimuladoStatus): Omit<StatusConfig, 'icon'> {
  switch (status) {
    case 'gerando':
      return {
        label: 'Gerando',
        className: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        variant: 'secondary' as const
      }
    case 'aguardando':
      return {
        label: 'Aguardando Resposta',
        className: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        variant: 'secondary' as const
      }
    case 'respondido':
      return {
        label: 'Respondido',
        className: 'bg-green-500/20 text-green-500 border-green-500/30',
        variant: 'default' as const
      }
  }
}

export function formatarTempo(minutos: number): string {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  if (horas > 0) {
    return `${horas}h ${mins}m`
  }
  return `${mins}m`
}

export function formatarData(data: Date): string {
  const agora = new Date()
  const diff = agora.getTime() - data.getTime()
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Ontem'
  if (dias < 7) return `${dias} dias atrás`
  
  return data.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}
