import { createFileRoute } from '@tanstack/react-router'
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
  BarChart3
} from 'lucide-react'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  // Dados mockados
  const stats = {
    totalSimulados: 12,
    simuladosCompletos: 8,
    redacoesEnviadas: 15,
    redacoesCorrigidas: 12,
    tempoEstudo: 24.5,
    pontuacaoMedia: 7.2,
    rankingPosicao: 156,
    proximoSimulado: "ENEM 2024 - Simulado 3"
  }

  const recentActivity = [
    { id: 1, type: 'simulado', title: 'ENEM 2024 - Simulado 2', status: 'completed', score: 720, date: '2 dias atrás' },
    { id: 2, type: 'redacao', title: 'Redação: Sustentabilidade', status: 'corrigida', score: 8.5, date: '3 dias atrás' },
    { id: 3, type: 'simulado', title: 'ENEM 2024 - Simulado 1', status: 'completed', score: 680, date: '1 semana atrás' },
    { id: 4, type: 'redacao', title: 'Redação: Educação Digital', status: 'pendente', score: null, date: '1 semana atrás' },
  ]

  const performanceData = [
    { subject: 'Matemática', score: 85, trend: '+5%' },
    { subject: 'Português', score: 78, trend: '+2%' },
    { subject: 'História', score: 72, trend: '+8%' },
    { subject: 'Geografia', score: 68, trend: '-1%' },
    { subject: 'Física', score: 75, trend: '+3%' },
    { subject: 'Química', score: 80, trend: '+6%' },
    { subject: 'Biologia', score: 82, trend: '+4%' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400">Acompanhe seu progresso nos estudos</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <TestTube2 className="w-4 h-4 mr-2" />
            Iniciar Simulado
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-32 flex flex-col gap-3 p-4 rounded-lg bg-background border border-green-700 hover:bg-neutral-900/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-300">Simulados Completos</span>
            <TestTube2 className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-white">{stats.simuladosCompletos}/{stats.totalSimulados}</div>
            <p className="text-xs text-neutral-400">
              {Math.round((stats.simuladosCompletos / stats.totalSimulados) * 100)}% concluído
            </p>
          </div>
        </div>

        <div className="h-32 flex flex-col gap-3 p-4 rounded-lg bg-background border border-green-700 hover:bg-neutral-900/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-300">Redações Corrigidas</span>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-white">{stats.redacoesCorrigidas}/{stats.redacoesEnviadas}</div>
            <p className="text-xs text-neutral-400">
              {Math.round((stats.redacoesCorrigidas / stats.redacoesEnviadas) * 100)}% corrigidas
            </p>
          </div>
        </div>

        <div className="h-32 flex flex-col gap-3 p-4 rounded-lg bg-background border border-green-700 hover:bg-neutral-900/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-300">Tempo de Estudo</span>
            <Clock className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-white">{stats.tempoEstudo}h</div>
            <p className="text-xs text-neutral-400">Esta semana</p>
          </div>
        </div>

        <div className="h-32 flex flex-col gap-3 p-4 rounded-lg bg-background border border-green-700 hover:bg-neutral-900/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-300">Pontuação Média</span>
            <Target className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-white">{stats.pontuacaoMedia}</div>
            <p className="text-xs text-neutral-400">
              <span className="text-green-500">+0.3</span> vs última semana
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance por Matéria */}
        <Card className="lg:col-span-2 bg-background border-green-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Performance por Matéria
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Suas pontuações nos simulados por disciplina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{item.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-300">{item.score}%</span>
                    <Badge variant={item.trend.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                      {item.trend}
                    </Badge>
                  </div>
                </div>
                <Progress value={item.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Próximas Atividades */}
        <Card className="bg-background border-green-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Próximas Atividades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">ENEM 2024 - Simulado 3</p>
                  <p className="text-xs text-neutral-400">Amanhã às 14:00</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Redação: Tecnologia</p>
                  <p className="text-xs text-neutral-400">Prazo: 3 dias</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Revisão de Física</p>
                  <p className="text-xs text-neutral-400">Esta semana</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card className="bg-background border-green-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            Atividades Recentes
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Seu histórico de atividades dos últimos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex-shrink-0">
                  {activity.type === 'simulado' ? (
                    <TestTube2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-neutral-400">{activity.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {activity.score && (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      {activity.score} pontos
                    </Badge>
                  )}
                  <Badge 
                    variant={activity.status === 'completed' || activity.status === 'corrigida' ? 'default' : 'secondary'}
                    className={
                      activity.status === 'completed' || activity.status === 'corrigida' 
                        ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                    }
                  >
                    {activity.status === 'completed' ? 'Concluído' : 
                     activity.status === 'corrigida' ? 'Corrigida' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="bg-background border-green-800">
        <CardHeader>
          <CardTitle className="text-white">Ações Rápidas</CardTitle>
          <CardDescription className="text-neutral-400">
            Continue seus estudos com essas ações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30 hover:from-green-500/20 hover:to-emerald-600/20 hover:border-green-500/50 transition-all">
              <TestTube2 className="w-6 h-6 text-green-500" />
              <span className="text-sm font-medium">Iniciar Simulado</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 hover:from-blue-500/20 hover:to-blue-600/20 hover:border-blue-500/50 transition-all">
              <FileText className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium">Nova Redação</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/50 transition-all">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <span className="text-sm font-medium">Revisar Conteúdo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
