import { useGetSimuladoById, useGetUserResponses } from '@/api/hooks/useSimulados'
import { ModernQuestionary } from '@/components/simulados/modern-questionary'
import { SimuladoResults } from '@/components/simulados/simulado-results'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/_app/simulado/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: simulado, isLoading, error } = useGetSimuladoById(id as string)
  const { data: userResponses, isLoading: isLoadingResponses, error: responsesError } = useGetUserResponses(id as string)
  
  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Erro ao carregar simulado</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Não foi possível carregar o simulado. Verifique se o ID está correto.
            </p>
            <Button 
              onClick={() => navigate({ to: '/simulados' })}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Simulados
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading || isLoadingResponses) {
    return (
      <div className="h-screen bg-background overflow-hidden flex flex-col">
        {/* Header Skeleton */}
        <div className="border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="w-64 h-6 sm:h-8" />
                <Skeleton className="w-48 h-4" />
              </div>
              <Skeleton className="w-24 h-4 flex-shrink-0" />
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-4 sm:py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              {/* Progress Skeleton */}
              <div className="space-y-4 mb-6 sm:mb-8">
                <Skeleton className="w-full h-2 rounded" />
                <div className="flex justify-between">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
              
              {/* Question Card Skeleton */}
              <Card className="bg-background border-green-800 mb-4 sm:mb-6">
                <CardHeader className="pb-4">
                  <Skeleton className="w-full h-6 sm:h-8 mb-4" />
                  <Skeleton className="w-3/4 h-4 sm:h-6" />
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-full h-12 sm:h-16 rounded" />
                  ))}
                </CardContent>
              </Card>
              
              {/* Navigation Skeleton */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <Skeleton className="w-full sm:w-24 h-10 rounded" />
                <Skeleton className="w-full sm:w-24 h-10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!simulado) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-muted-foreground text-4xl sm:text-6xl mb-4">📝</div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Simulado não encontrado</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              O simulado que você está procurando não existe ou foi removido.
            </p>
            <Button 
              onClick={() => navigate({ to: '/simulados' })}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Simulados
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Debug: verificar dados
  console.log('Simulado data:', {
    status: simulado.status,
    respondedAt: simulado.respondedAt,
    userResponses: userResponses,
    userResponsesLength: userResponses?.length,
    responsesError: responsesError
  })

  // Verificar se o simulado já foi respondido
  const isAnswered = simulado.status === 'answered'
  
  console.log('Is answered:', isAnswered)

  // Se já foi respondido, mostrar os resultados
  if (isAnswered) {
    // Converter as respostas do usuário para o formato esperado pelo componente
    const answers = userResponses ? userResponses.map((response: any) => ({
      questionId: response.questionId,
      selectedOption: response.response
    })) : []

    return (
      <div className="h-screen bg-background overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-neutral-800 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate({ to: '/simulados' })}
              className="text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">{simulado.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{simulado.description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-green-500 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Concluído</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Resultados */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-4 sm:py-6">
            <SimuladoResults
              questions={simulado.questions}
              answers={answers}
              timeElapsed={simulado.timeToRespond || 0}
              simuladoBank={simulado.bank}
              simuladoSubject={simulado.subject}
              onBackToSimulados={() => navigate({ to: '/simulados' })}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate({ to: '/simulados' })}
              className="text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">{simulado.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{simulado.description}</p>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Em andamento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-4 sm:py-6">
        <ModernQuestionary 
          questions={simulado.questions}
          simuladoTitle={simulado.title}
          simuladoBank={simulado.bank}
          simuladoSubject={simulado.subject}
          simuladoId={simulado.id}
          onBackToSimulados={() => navigate({ to: '/simulados' })}
        />
        </div>
      </div>
    </div>
  )
}
