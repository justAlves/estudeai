import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle2,
  FileText,
  Target,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Send,
  Building2
} from 'lucide-react'
import { useGetRedacaoById, useSendRedacaoForCorrection } from '@/api/hooks/useRedacoes'
import { formatRelativeDate } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_app/redacoes/$id/')({
  component: ViewRedacaoComponent,
})

function ViewRedacaoComponent() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const { data: redacao, isLoading } = useGetRedacaoById(id)
  const sendForCorrectionMutation = useSendRedacaoForCorrection()

  const handleSendForCorrection = () => {
    sendForCorrectionMutation.mutate(id)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (!redacao) {
    return (
      <div className="p-6">
        <Card className="border-red-500/50">
          <CardContent className="p-6">
            <p className="text-red-500">Redação não encontrada</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const correction = redacao.correction
  const isCorrected = redacao.status === 'corrected'
  const isCorrecting = redacao.status === 'correcting'

  const competencias = correction ? [
    { num: 1, name: 'Domínio da Escrita Formal', score: correction.competencia1, feedback: correction.feedbackPorCompetencia.competencia1 },
    { num: 2, name: 'Compreensão do Tema', score: correction.competencia2, feedback: correction.feedbackPorCompetencia.competencia2 },
    { num: 3, name: 'Seleção de Argumentos', score: correction.competencia3, feedback: correction.feedbackPorCompetencia.competencia3 },
    { num: 4, name: 'Mecanismos Linguísticos', score: correction.competencia4, feedback: correction.feedbackPorCompetencia.competencia4 },
    { num: 5, name: 'Proposta de Intervenção', score: correction.competencia5, feedback: correction.feedbackPorCompetencia.competencia5 },
  ] : []

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/redacoes' })}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{redacao.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-muted-foreground">Tema: {redacao.theme}</p>
            {redacao.bank && (
              <>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1.5">
                  <Building2 className="size-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{redacao.bank}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <Badge 
          variant="outline"
          className={
            isCorrected
              ? 'bg-green-500/10 text-green-600 border-green-500/20'
              : isCorrecting
              ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
          }
        >
          {isCorrected ? (
            <>
              <CheckCircle2 className="size-4 mr-1.5" />
              Corrigida
            </>
          ) : isCorrecting ? (
            <>
              <Loader2 className="size-4 mr-1.5 animate-spin" />
              Corrigindo...
            </>
          ) : (
            'Pendente'
          )}
        </Badge>
      </div>

      {/* Resultado da Correção */}
      {isCorrected && correction && (
        <Card className="border-border/50 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-green-500" />
              Resultado da Correção
            </CardTitle>
            <CardDescription>
              Correção baseada nos critérios do {redacao.bank}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nota Total */}
          <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Nota Final</div>
              <div className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {correction.totalScore}
              </div>
              <div className="text-lg text-muted-foreground">de 1000 pontos</div>
              <Progress value={(correction.totalScore / 1000) * 100} className="mt-4 h-3" />
            </div>

            <Separator />

            {/* Competências */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Avaliação por Competência</h3>
              {competencias.map((comp) => (
                <Card key={comp.num} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Competência {comp.num}: {comp.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className="bg-green-500/10 text-green-600 border-green-500/20"
                        >
                          {comp.score} / 200
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={(comp.score / 200) * 100} className="h-2" />
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="size-4 text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm leading-relaxed">{comp.feedback}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Feedback Geral */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="size-5 text-green-500" />
                Feedback Geral
              </h3>
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{correction.feedback}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status de Correção */}
      {isCorrecting && (
        <Card className="border-border/50 bg-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="size-8 animate-spin text-blue-500" />
              <div>
                <h3 className="font-semibold">Sua redação está sendo corrigida</h3>
                <p className="text-sm text-muted-foreground">
                  Aguarde alguns instantes enquanto nossa IA analisa sua redação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão para enviar para correção se estiver pendente */}
      {redacao.status === 'pending' && (
        <Card className="border-border/50 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Redação salva</h3>
                <p className="text-sm text-muted-foreground">
                  Sua redação foi salva. Envie para correção quando estiver pronto.
                </p>
              </div>
              <Button
                onClick={handleSendForCorrection}
                disabled={sendForCorrectionMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {sendForCorrectionMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Enviar para Correção
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Redação Original */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Sua Redação</CardTitle>
          <CardDescription>
            {redacao.correctedAt 
              ? `Corrigida ${formatRelativeDate(redacao.correctedAt)}`
              : `Criada ${formatRelativeDate(redacao.createdAt)}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-base">
              {redacao.content}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
