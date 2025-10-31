import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Loader2 } from 'lucide-react'
import { useGetRedacoes } from '@/api/hooks/useRedacoes'
import { RedacaoCard } from '@/components/redacoes/redacao-card'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_app/redacoes/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { data: redacoes, isLoading, error } = useGetRedacoes()

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-500/50">
          <CardContent className="p-6">
            <p className="text-red-500">Erro ao carregar redações. Tente novamente mais tarde.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Redações</h1>
          <p className="text-muted-foreground mt-1">Gerencie e acompanhe suas redações</p>
        </div>
        <Button 
          size="lg" 
          className="font-medium"
          onClick={() => navigate({ to: '/redacoes/new', replace: false })}
        >
          <Plus className="size-4 mr-2" />
          Nova Redação
        </Button>
      </div>

      {/* Lista de redações */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : redacoes && redacoes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {redacoes.map((redacao) => (
            <RedacaoCard key={redacao.id} redacao={redacao} />
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <FileText className="size-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Nenhuma redação ainda</h3>
                <p className="text-muted-foreground mt-1">
                  Comece criando sua primeira redação para receber correções detalhadas
                </p>
              </div>
              <Button 
                onClick={() => navigate({ to: '/redacoes/new', replace: false })}
                className="mt-4"
              >
                <Plus className="size-4 mr-2" />
                Criar Primeira Redação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
