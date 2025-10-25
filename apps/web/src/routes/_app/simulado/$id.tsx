import { useGetSimuladoById } from '@/api/hooks/useSimulados'
import { ModernQuestionary } from '@/components/simulados/modern-questionary'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Clock } from 'lucide-react'

export const Route = createFileRoute('/_app/simulado/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: simulado, isLoading, error } = useGetSimuladoById(id as string)
  
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar simulado</h2>
            <p className="text-neutral-400 mb-6">
              Não foi possível carregar o simulado. Verifique se o ID está correto.
            </p>
            <Button 
              onClick={() => navigate({ to: '/simulados' })}
              className="bg-green-600 hover:bg-green-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Simulados
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="w-10 h-10 rounded" />
            <div className="space-y-2">
              <Skeleton className="w-64 h-8" />
              <Skeleton className="w-48 h-4" />
            </div>
          </div>
          
          {/* Progress Skeleton */}
          <div className="space-y-4 mb-8">
            <Skeleton className="w-full h-2 rounded" />
            <div className="flex justify-between">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
          
          {/* Question Card Skeleton */}
          <Card className="bg-background border-green-800 mb-6">
            <CardHeader>
              <Skeleton className="w-full h-8 mb-4" />
              <Skeleton className="w-3/4 h-6" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full h-16 rounded" />
              ))}
            </CardContent>
          </Card>
          
          {/* Navigation Skeleton */}
          <div className="flex justify-between">
            <Skeleton className="w-24 h-10 rounded" />
            <Skeleton className="w-24 h-10 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!simulado) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-neutral-500 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-2">Simulado não encontrado</h2>
            <p className="text-neutral-400 mb-6">
              O simulado que você está procurando não existe ou foi removido.
            </p>
            <Button 
              onClick={() => navigate({ to: '/simulados' })}
              className="bg-green-600 hover:bg-green-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Simulados
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate({ to: '/simulados' })}
              className="text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white truncate">{simulado.title}</h1>
              <p className="text-sm text-neutral-400 truncate">{simulado.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Clock className="w-4 h-4" />
              <span>Em andamento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <ModernQuestionary 
          questions={simulado.questions}
          simuladoTitle={simulado.title}
          simuladoBank={simulado.bank}
          simuladoSubject={simulado.subject}
        />
      </div>
    </div>
  )
}
