import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  Calendar,
  FileText,
  PlayCircle,
  Loader2,
  CheckCircle2,
  Building2,
  Hash
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { Simulado, SimuladoStatus } from '@/types/simulados'
import { getSimuladoStatus, getStatusConfig, formatarTempo, formatarData } from '@/lib/simulados-helpers'

interface SimuladoCardProps {
  simulado: Simulado
}

export function SimuladoCard({ simulado }: SimuladoCardProps) {
  const navigate = useNavigate()
  const status = getSimuladoStatus(simulado)
  const statusConfig = getStatusConfig(status)
  
  const getStatusIcon = (status: SimuladoStatus) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'waiting_response':
        return <PlayCircle className="w-4 h-4" />
      case 'answered':
        return <CheckCircle2 className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-background border-green-800 hover:border-green-700 transition-all hover:shadow-lg hover:shadow-green-500/10 flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-white text-lg flex-1 line-clamp-2">
            {simulado.title}
          </CardTitle>
          <Badge className={statusConfig.className}>
            {getStatusIcon(status)}
            <span className="ml-1">{statusConfig.label}</span>
          </Badge>
        </div>
        <CardDescription className="text-neutral-400 line-clamp-2">
          {simulado.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-4">
          {/* Score (se respondido) */}
          {simulado.respondedAt !== null && simulado.score > 0 && (
            <div className="flex items-center justify-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {simulado.score}%
                </div>
                <div className="text-xs text-neutral-400 mt-1">Pontuação</div>
              </div>
            </div>
          )}

          {/* Informações principais */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-neutral-300 border-neutral-600">
              <Hash className="w-3 h-3 mr-1" />
              {simulado.questions.length} {simulado.questions.length === 1 ? 'questão' : 'questões'}
            </Badge>
            <Badge variant="outline" className="text-neutral-300 border-neutral-600">
              <BookOpen className="w-3 h-3 mr-1" />
              {simulado.subject}
            </Badge>
            <Badge variant="outline" className="text-neutral-300 border-neutral-600">
              <Building2 className="w-3 h-3 mr-1" />
              {simulado.bank}
            </Badge>
          </div>

          {/* Informações de resposta (se respondido) */}
          {simulado.respondedAt !== null && simulado.timeToRespond > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-700">
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <Clock className="w-4 h-4 text-green-500" />
                <span>Tempo de resposta: </span>
                <span className="font-semibold text-white">{formatarTempo(simulado.timeToRespond)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Respondido: </span>
                <span className="font-semibold text-white">{formatarData(simulado.respondedAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Espaçador com altura mínima */}
        <div className="flex-grow min-h-[1rem]"></div>

        {/* Botão de ação */}
        <Button 
          className={`w-full ${
            simulado.questions.length === 0
              ? 'bg-yellow-700 hover:bg-yellow-600 cursor-not-allowed' 
              : simulado.respondedAt !== null
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={simulado.questions.length === 0}
          onClick={() => {
            if (simulado.questions.length > 0) {
              navigate({ to: '/simulado/$id', params: { id: simulado.id } })
            }
          }}
        >
          {simulado.questions.length === 0 && (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Gerando questões...
            </>
          )}
          {simulado.questions.length > 0 && simulado.respondedAt === null && (
            <>
              <PlayCircle className="w-4 h-4 mr-2" />
              Iniciar Simulado
            </>
          )}
          {simulado.respondedAt !== null && (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Ver Resultado
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
