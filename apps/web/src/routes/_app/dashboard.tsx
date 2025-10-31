import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Clock, 
  Target,
  Calendar,
  FileText,
  TestTube2,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import { useDashboardStats } from '@/api/hooks/useDashboard'

// Helper function para formatar datas relativas
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return diffInMinutes <= 1 ? 'agora' : `${diffInMinutes} minutos atrás`
    }
    return diffInHours === 1 ? '1 hora atrás' : `${diffInHours} horas atrás`
  } else if (diffInDays === 1) {
    return '1 dia atrás'
  } else if (diffInDays < 7) {
    return `${diffInDays} dias atrás`
  } else if (diffInWeeks === 1) {
    return '1 semana atrás'
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} semanas atrás`
  } else if (diffInMonths === 1) {
    return '1 mês atrás'
  } else {
    return `${diffInMonths} meses atrás`
  }
}

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { data: dashboardData, isLoading, error } = useDashboardStats()

  // Dados padrão enquanto carrega
  const stats = dashboardData?.stats || {
    totalSimulados: 0,
    simuladosCompletos: 0,
    pontuacaoMedia: 0,
    tempoEstudo: 0,
    redacoesEnviadas: 0,
    redacoesCorrigidas: 0,
  }

  const recentActivity = dashboardData?.recentActivity.map(activity => ({
    ...activity,
    date: formatRelativeDate(activity.date),
  })) || []

  const performanceData = dashboardData?.performance || []

  const upcomingActivities = dashboardData?.upcomingActivities || []

  const redacoesEnviadas = stats.redacoesEnviadas
  const redacoesCorrigidas = stats.redacoesCorrigidas

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-500/50">
          <CardContent className="p-6">
            <p className="text-red-500">Erro ao carregar dados do dashboard. Tente novamente mais tarde.</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Acompanhe seu progresso nos estudos</p>
        </div>
        <Button 
          size="lg" 
          className="font-medium text-white"
          onClick={() => navigate({ to: '/simulados' })}
        >
          <TestTube2 className="size-4 mr-2" />
          Iniciar Simulado
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 hover:border-green-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Simulados Completos</span>
              <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <TestTube2 className="size-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">{stats.simuladosCompletos}/{stats.totalSimulados}</div>
              <p className="text-sm text-muted-foreground">
                {stats.totalSimulados > 0 
                  ? `${Math.round((stats.simuladosCompletos / stats.totalSimulados) * 100)}% concluído`
                  : 'Nenhum simulado ainda'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-green-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Redações Corrigidas</span>
              <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <FileText className="size-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">{redacoesCorrigidas}/{redacoesEnviadas}</div>
              <p className="text-sm text-muted-foreground">
                {redacoesEnviadas > 0 
                  ? `${Math.round((redacoesCorrigidas / redacoesEnviadas) * 100)}% corrigidas`
                  : 'Nenhuma redação ainda'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-green-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Tempo de Estudo</span>
              <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Clock className="size-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">{stats.tempoEstudo}h</div>
              <p className="text-sm text-muted-foreground">Esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-green-500/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Pontuação Média</span>
              <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Target className="size-5 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold">{stats.pontuacaoMedia.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">
                {stats.simuladosCompletos > 0 ? 'Pontuação média' : 'Ainda sem pontuação'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance por Matéria */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-green-500" />
              Performance por Matéria
            </CardTitle>
            <CardDescription>
              Suas pontuações nos simulados por disciplina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">Carregando performance...</div>
            ) : performanceData.length > 0 ? (
              performanceData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.score}%</span>
                      <Badge 
                        variant={item.trend.startsWith('+') ? 'default' : 'secondary'}
                        className={item.trend.startsWith('+') ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}
                      >
                        {item.trend.startsWith('+') && <TrendingUp className="size-3 mr-1" />}
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">Nenhuma performance registrada ainda</div>
            )}
          </CardContent>
        </Card>

        {/* Próximas Atividades */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-green-500" />
              Próximas Atividades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-4">Carregando atividades...</div>
            ) : upcomingActivities.length > 0 ? (
              upcomingActivities.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-green-500/5 hover:bg-green-500/10 transition-colors cursor-pointer"
                  onClick={() => activity.simuladoId && navigate({ to: '/simulado/$id', params: { id: activity.simuladoId } })}
                >
                  <div className="size-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeDate(activity.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">Nenhuma atividade próxima</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5 text-green-500" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>
            Seu histórico de atividades dos últimos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-4">Carregando atividades recentes...</div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors ${activity.simuladoId || activity.redacaoId ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (activity.simuladoId) {
                      navigate({ to: '/simulado/$id', params: { id: activity.simuladoId } })
                    } else if (activity.redacaoId) {
                      navigate({ to: '/redacoes/$id', params: { id: activity.redacaoId } })
                    }
                  }}
                >
                <div className="flex-shrink-0">
                  {activity.type === 'simulado' ? (
                    <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <TestTube2 className="size-5 text-white" />
                    </div>
                  ) : (
                    <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <FileText className="size-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {activity.score !== null && activity.score !== undefined && (
                    <Badge variant="outline" className="border-green-500/30 text-green-600">
                      {activity.type === 'simulado' ? `${activity.score} pontos` : `${activity.score}/1000`}
                    </Badge>
                  )}
                  <Badge 
                    variant={activity.status === 'completed' || activity.status === 'corrected' ? 'default' : 'secondary'}
                    className={
                      activity.status === 'completed' || activity.status === 'corrected' 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : activity.status === 'correcting'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                    }
                  >
                    {activity.status === 'completed' ? 'Concluído' : 
                     activity.status === 'corrected' ? 'Corrigida' : 
                     activity.status === 'correcting' ? 'Corrigindo' : 'Pendente'}
                  </Badge>
                </div>
              </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">Nenhuma atividade recente</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Continue seus estudos com essas ações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col gap-3 border-border/50 hover:border-green-500/50 hover:bg-green-500/5 transition-all group"
              onClick={() => navigate({ to: '/simulados' })}
            >
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TestTube2 className="size-6 text-white" />
              </div>
              <span className="text-sm font-medium">Iniciar Simulado</span>
            </Button>
            <Button 
              variant="outline"
              className="h-auto p-6 flex flex-col gap-3 border-border/50 hover:border-green-500/50 hover:bg-green-500/5 transition-all group"
              onClick={() => navigate({ to: '/redacoes/new', replace: false })}
            >
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="size-6 text-white" />
              </div>
              <span className="text-sm font-medium">Nova Redação</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-6 flex flex-col gap-3 border-border/50 hover:border-green-500/50 hover:bg-green-500/5 transition-all group"
              disabled
            >
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="size-6 text-white" />
              </div>
              <span className="text-sm font-medium">Revisar Conteúdo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
