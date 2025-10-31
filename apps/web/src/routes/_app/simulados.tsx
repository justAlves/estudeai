import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetSimulados, useCreateSimulado } from '@/api/hooks/useSimulados'
import type { Simulado } from '@/types/simulados'
import type { SimuladoFormValues } from '@/lib/simulados-schema'
import { simuladoFormSchema } from '@/lib/simulados-schema'
import { SimuladoCard } from '@/components/simulados/simulado-card'
import { SimuladoCardSkeleton } from '@/components/simulados/simulado-card-skeleton'
import { SimuladoFormDialog } from '@/components/dialogs/simulado-form-dialog'
import { SimuladosFilters } from '@/components/simulados/simulados-filters'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestTube2, Plus, BookOpen, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { getSimuladoStatus } from '@/lib/simulados-helpers'
import { UpgradeModal } from '@/components/subscription/upgrade-modal'
import { useSubscriptionStatus, useCreateCheckoutSession } from '@/api/hooks/useSubscription'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export const Route = createFileRoute('/_app/simulados')({
  component: RouteComponent,
})

function RouteComponent() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [limitReachedDialogOpen, setLimitReachedDialogOpen] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<string>()
  const [filteredSimulados, setFilteredSimulados] = useState<Simulado[]>([])
  const { data: simulados, isLoading } = useGetSimulados()
  const { data: subscriptionStatus } = useSubscriptionStatus()
  const { mutate: createCheckoutSession, isPending: isCreatingCheckout } = useCreateCheckoutSession()
  const { mutate: createSimulado } = useCreateSimulado((reason) => {
    setUpgradeReason(reason)
    setUpgradeModalOpen(true)
    setDialogOpen(false)
  })

  // Verificar se pode criar simulado antes de abrir o dialog
  const handleOpenCreateDialog = () => {
    // Se é PRO, pode criar ilimitado
    if (subscriptionStatus?.isPro) {
      setDialogOpen(true)
      return
    }

    // Se não é PRO, verificar uso
    const simuladosCount = subscriptionStatus?.usage?.simulados || 0
    if (simuladosCount >= 1) {
      // Limite atingido, mostrar dialog informativo
      setLimitReachedDialogOpen(true)
    } else {
      // Pode criar, abrir dialog normalmente
      setDialogOpen(true)
    }
  }

  // Inicializar simulados filtrados quando os dados carregam
  useMemo(() => {
    if (simulados) {
      setFilteredSimulados(simulados)
    }
  }, [simulados])

  const form = useForm<SimuladoFormValues>({
    resolver: zodResolver(simuladoFormSchema),
    defaultValues: {
      quantidadeQuestoes: '',
      banca: '',
      materia: '',
      titulo: '',
      descricao: '',
    },
  })

  const onSubmit = (data: SimuladoFormValues) => {
    const formattedData = {
      ...data,
      quantidadeQuestoes: parseInt(data.quantidadeQuestoes, 10)
    }
    
    createSimulado({
      count: formattedData.quantidadeQuestoes,
      subject: formattedData.materia,
      bank: formattedData.banca,
      title: formattedData.titulo,
      description: formattedData.descricao,
    })
    setDialogOpen(false)
    form.reset()
  }

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!simulados) return null
    
    const total = simulados.length
    const completed = simulados.filter(s => getSimuladoStatus(s) === 'answered').length
    const pending = simulados.filter(s => getSimuladoStatus(s) === 'pending').length
    const waiting = simulados.filter(s => getSimuladoStatus(s) === 'waiting_response').length
    
    return { total, completed, pending, waiting }
  }, [simulados])

  const filteredStats = useMemo(() => {
    if (!filteredSimulados) return null
    
    const total = filteredSimulados.length
    const completed = filteredSimulados.filter(s => getSimuladoStatus(s) === 'answered').length
    const pending = filteredSimulados.filter(s => getSimuladoStatus(s) === 'pending').length
    const waiting = filteredSimulados.filter(s => getSimuladoStatus(s) === 'waiting_response').length
    
    return { total, completed, pending, waiting }
  }, [filteredSimulados])

  const hasFilters = filteredSimulados.length !== simulados?.length

  return (
    <div className="p-6 space-y-6">
      <UpgradeModal 
        open={upgradeModalOpen} 
        onOpenChange={setUpgradeModalOpen}
        reason={upgradeReason}
      />
      
      {/* Dialog de limite atingido */}
      <Dialog open={limitReachedDialogOpen} onOpenChange={setLimitReachedDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-green-500" />
              Recurso PRO Disponível
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Você já criou 1 simulado esta semana. No plano gratuito, você pode criar apenas 1 simulado por semana.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Upgrade para PRO e desbloqueie:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Simulados ilimitados</li>
                    <li>Correções de redação ilimitadas</li>
                    <li>Acesso completo a todos os recursos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setLimitReachedDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Entendi
            </Button>
            <Button
              onClick={() => {
                setLimitReachedDialogOpen(false)
                createCheckoutSession()
              }}
              disabled={isCreatingCheckout}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Sparkles className="size-4 mr-2" />
              {isCreatingCheckout ? 'Redirecionando...' : 'Fazer Upgrade para PRO'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulados</h1>
          <p className="text-muted-foreground mt-1">Gerencie e realize seus simulados</p>
        </div>
        <Button 
          onClick={handleOpenCreateDialog}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="size-4 mr-2" />
          Novo Simulado
        </Button>
      </div>
      
      <SimuladoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        form={form}
        onSubmit={onSubmit}
      />

      {/* Stats Cards */}
      {stats && !isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold mt-1">{filteredStats?.total || stats.total}</p>
                </div>
                <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TestTube2 className="size-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold mt-1">{filteredStats?.completed || stats.completed}</p>
                </div>
                <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="size-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aguardando resposta</p>
                  <p className="text-2xl font-bold mt-1">{filteredStats?.waiting || stats.waiting}</p>
                </div>
                <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Clock className="size-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold mt-1">{filteredStats?.pending || stats.pending}</p>
                </div>
                <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <BookOpen className="size-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      {simulados && simulados.length > 0 && (
        <Card className="border-border/50">
          <CardContent className="p-6">
            <SimuladosFilters
              simulados={simulados}
              onFilteredSimulados={setFilteredSimulados}
            />
          </CardContent>
        </Card>
      )}

      {/* Contador de resultados e ações */}
      {!isLoading && simulados && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-border/50">
              {filteredSimulados.length === simulados.length ? (
                `${simulados.length} simulado${simulados.length !== 1 ? 's' : ''} encontrado${simulados.length !== 1 ? 's' : ''}`
              ) : (
                `${filteredSimulados.length} de ${simulados.length} simulado${simulados.length !== 1 ? 's' : ''}`
              )}
            </Badge>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilteredSimulados(simulados)}
                className="text-muted-foreground hover:text-foreground"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Grid de Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SimuladoCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredSimulados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulados.map((simulado: Simulado) => (
            <SimuladoCard key={simulado.id} simulado={simulado} />
          ))}
        </div>
      ) : simulados && simulados.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="size-20 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mx-auto">
                <TestTube2 className="size-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Nenhum simulado criado</h3>
                <p className="text-muted-foreground">
                  Comece criando seu primeiro simulado personalizado com IA
                </p>
              </div>
              <Button
                onClick={handleOpenCreateDialog}
                size="lg"
                className="font-medium"
              >
                <Plus className="size-4 mr-2" />
                Criar primeiro simulado
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-16 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="size-20 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center mx-auto">
                <Sparkles className="size-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Nenhum simulado encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou criar um novo simulado
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setFilteredSimulados(simulados || [])}
                  className="font-medium"
                >
                  Limpar filtros
                </Button>
                <Button
                  onClick={handleOpenCreateDialog}
                  className="font-medium"
                >
                  <Plus className="size-4 mr-2" />
                  Novo simulado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
