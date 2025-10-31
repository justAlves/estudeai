import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Clock,
  Calendar,
  Edit,
  CheckCircle2,
  Loader2,
  XCircle,
  Eye,
  Building2
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { Redacao } from '@/api/services/redacoes'
import { formatRelativeDate } from '@/lib/utils'

interface RedacaoCardProps {
  redacao: Redacao
}

export function RedacaoCard({ redacao }: RedacaoCardProps) {
  const navigate = useNavigate()

  const getStatusConfig = (status: Redacao["status"]) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendente',
          icon: <Clock className="size-4" />,
          className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
        }
      case 'correcting':
        return {
          label: 'Corrigindo',
          icon: <Loader2 className="size-4 animate-spin" />,
          className: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
        }
      case 'corrected':
        return {
          label: 'Corrigida',
          icon: <CheckCircle2 className="size-4" />,
          className: 'bg-green-500/10 text-green-600 border-green-500/20'
        }
      case 'error':
        return {
          label: 'Erro',
          icon: <XCircle className="size-4" />,
          className: 'bg-red-500/10 text-red-600 border-red-500/20'
        }
    }
  }

  const statusConfig = getStatusConfig(redacao.status)
  const isCorrected = redacao.status === 'corrected'
  const canEdit = redacao.status !== 'corrected'

  return (
    <Card className="group border-border/50 hover:border-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/5 flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <CardTitle className="text-lg font-semibold flex-1 line-clamp-2 leading-tight">
            {redacao.title}
          </CardTitle>
          <Badge 
            variant="outline"
            className={`shrink-0 ${statusConfig.className}`}
          >
            {statusConfig.icon}
            <span className="ml-1.5 text-xs">{statusConfig.label}</span>
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          Tema: {redacao.theme}
        </CardDescription>
        {redacao.bank && (
          <div className="flex items-center gap-1.5 mt-2">
            <Building2 className="size-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{redacao.bank}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 space-y-4">
        {/* Informações principais */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>Criada {formatRelativeDate(redacao.createdAt)}</span>
        </div>

        {redacao.correctedAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-green-500" />
            <span>Corrigida {formatRelativeDate(redacao.correctedAt)}</span>
          </div>
        )}

        {/* Espaçador */}
        <div className="flex-grow min-h-[0.5rem]"></div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          {canEdit && (
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => {
                navigate({ to: '/redacoes/$id/edit', params: { id: redacao.id } })
              }}
            >
              <Edit className="size-4 mr-2" />
              Editar
            </Button>
          )}
          <Button 
            className={`flex-1 font-medium ${
              isCorrected
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
            }`}
            onClick={() => {
              navigate({ to: '/redacoes/$id', params: { id: redacao.id } })
            }}
          >
            {isCorrected ? (
              <>
                <Eye className="size-4 mr-2" />
                Ver Correção
              </>
            ) : (
              <>
                <FileText className="size-4 mr-2" />
                Ver Detalhes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

