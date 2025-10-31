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
  Hash,
  TrendingUp
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
        return <Loader2 className="size-4 animate-spin" />
      case 'waiting_response':
        return <PlayCircle className="size-4" />
      case 'answered':
        return <CheckCircle2 className="size-4" />
    }
  }

  const isCompleted = simulado.respondedAt !== null && simulado.score > 0
  const canStart = simulado.questions.length > 0 && simulado.respondedAt === null

  return (
    <Card className="group border-border/50 hover:border-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/5 flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <CardTitle className="text-lg font-semibold flex-1 line-clamp-2 leading-tight">
            {simulado.title}
          </CardTitle>
          <Badge 
            variant="outline"
            className={`shrink-0 ${
              status === 'answered' 
                ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                : status === 'pending'
                ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
            }`}
          >
            {getStatusIcon(status)}
            <span className="ml-1.5 text-xs">{statusConfig.label}</span>
          </Badge>
        </div>
        {simulado.description && (
          <CardDescription className="line-clamp-2 text-sm">
            {simulado.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 space-y-4">
        {/* Score destacado (se respondido) */}
        {isCompleted && (
          <div className="relative overflow-hidden rounded-lg border border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pontuação</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {simulado.score}%
                </p>
              </div>
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="size-6 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Informações principais */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-border/50">
            <Hash className="size-3 mr-1.5" />
            <span className="text-xs">{simulado.questions.length} {simulado.questions.length === 1 ? 'questão' : 'questões'}</span>
          </Badge>
          <Badge variant="outline" className="border-border/50">
            <BookOpen className="size-3 mr-1.5" />
            <span className="text-xs">{simulado.subject}</span>
          </Badge>
          <Badge variant="outline" className="border-border/50">
            <Building2 className="size-3 mr-1.5" />
            <span className="text-xs">{simulado.bank}</span>
          </Badge>
        </div>

        {/* Informações de resposta (se respondido) */}
        {isCompleted && simulado.timeToRespond > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-green-500" />
              <span className="text-muted-foreground">Tempo de resposta:</span>
              <span className="font-medium">{formatarTempo(simulado.timeToRespond)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-green-500" />
              <span className="text-muted-foreground">Respondido:</span>
              <span className="font-medium">{formatarData(simulado.respondedAt)}</span>
            </div>
          </div>
        )}

        {/* Espaçador */}
        <div className="flex-grow min-h-[0.5rem]"></div>

        {/* Botão de ação */}
        <Button 
          className={`w-full font-medium ${
            simulado.questions.length === 0
              ? 'cursor-not-allowed opacity-60' 
              : isCompleted
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
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
              <Loader2 className="size-4 mr-2 animate-spin" />
              Gerando questões...
            </>
          )}
          {canStart && (
            <>
              <PlayCircle className="size-4 mr-2" />
              Iniciar Simulado
            </>
          )}
          {isCompleted && (
            <>
              <FileText className="size-4 mr-2" />
              Ver Resultado
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
