import { Effect, pipe } from "effect";
import { SimuladoRepository } from "../../shared/repository/simulado.repository";
import { RedacaoRepository } from "../../shared/repository/redacao.repository";
import { logger } from "../../config/logger";

export interface DashboardStats {
  stats: {
    totalSimulados: number;
    simuladosCompletos: number;
    pontuacaoMedia: number;
    tempoEstudo: number; // em horas
    redacoesEnviadas: number;
    redacoesCorrigidas: number;
  };
  performance: Array<{
    subject: string;
    score: number;
    trend: string; // "+5%" ou "-2%" ou "0%"
  }>;
  recentActivity: Array<{
    id: string;
    type: 'simulado' | 'redacao';
    title: string;
    status: 'completed' | 'pending' | 'correcting' | 'corrected';
    score: number | null;
    date: string; // ISO date
    simuladoId?: string;
    redacaoId?: string;
  }>;
  upcomingActivities: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
    simuladoId?: string;
    redacaoId?: string;
  }>;
}

export abstract class DashboardService {
  static async getStats(userId: string): Promise<DashboardStats> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          logger.info(`Getting dashboard stats for user ${userId}`);

          // Buscar todos os simulados do usuário
          const simulados = await SimuladoRepository.findAll(userId);

          // Calcular estatísticas básicas
          const totalSimulados = simulados.length;
          const simuladosCompletos = simulados.filter(s => s.status === 'answered').length;
          
          // Calcular pontuação média dos simulados completos
          const simuladosRespondidos = simulados.filter(s => s.status === 'answered' && s.score > 0);
          const pontuacaoMedia = simuladosRespondidos.length > 0
            ? simuladosRespondidos.reduce((acc, s) => acc + s.score, 0) / simuladosRespondidos.length
            : 0;

          // Calcular tempo de estudo (soma de timeToRespond em horas)
          const tempoEstudoSegundos = simuladosRespondidos.reduce((acc, s) => acc + (s.timeToRespond || 0), 0);
          const tempoEstudo = Math.round((tempoEstudoSegundos / 3600) * 10) / 10; // Converter para horas e arredondar para 1 decimal

          // Calcular performance por matéria
          const performanceMap = new Map<string, { total: number; scores: number[] }>();
          
          simuladosRespondidos.forEach(simulado => {
            const subject = simulado.subject;
            if (!performanceMap.has(subject)) {
              performanceMap.set(subject, { total: 0, scores: [] });
            }
            const perf = performanceMap.get(subject)!;
            perf.total++;
            perf.scores.push(simulado.score);
          });

          const performance = Array.from(performanceMap.entries()).map(([subject, data]) => {
            const avgScore = data.scores.reduce((acc, score) => acc + score, 0) / data.scores.length;
            // Trend fixo baseado na média - não muda a cada atualização
            // Futuramente pode ser calculado comparando com período anterior
            const trend = "0%"; // Mantém estável até implementar cálculo real de tendência
            
            return {
              subject,
              score: Math.round(avgScore),
              trend,
            };
          }).sort((a, b) => b.score - a.score); // Ordenar por score decrescente

          // Buscar redações do usuário
          const redacoes = await RedacaoRepository.findAll(userId);
          const redacoesEnviadas = redacoes.length;
          const redacoesCorrigidas = redacoes.filter(r => r.status === 'corrected').length;

          // Atividades recentes (últimos 10 itens - simulados e redações, ordenados por data)
          const recentSimulados = simulados
            .filter(s => s.status === 'answered' && s.respondedAt)
            .map(s => ({
              id: s.id,
              type: 'simulado' as const,
              title: s.title,
              status: 'completed' as const,
              score: s.score,
              date: s.respondedAt?.toISOString() || s.createdAt.toISOString(),
              simuladoId: s.id,
            }));

          // Buscar redações com correção para obter o score
          const recentRedacoes = await Promise.all(
            redacoes.map(async (r) => {
              let score: number | null = null;
              if (r.status === 'corrected') {
                const redacaoWithCorrection = await RedacaoRepository.findById(r.id);
                score = redacaoWithCorrection?.correction?.totalScore || null;
              }
              
              return {
                id: r.id,
                type: 'redacao' as const,
                title: r.title,
                status: r.status === 'corrected' ? 'corrected' as const : r.status === 'correcting' ? 'correcting' as const : 'pending' as const,
                score,
                date: r.correctedAt?.toISOString() || r.updatedAt.toISOString(),
                redacaoId: r.id,
              };
            })
          );

          const recentActivity = [...recentSimulados, ...recentRedacoes]
            .sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              return dateB - dateA; // Mais recente primeiro
            })
            .slice(0, 10);

          // Próximas atividades (apenas simulados waiting_response - prontos para responder)
          const upcomingActivities = simulados
            .filter(s => s.status === 'waiting_response')
            .sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateA - dateB; // Mais antigo primeiro
            })
            .slice(0, 5)
            .map(s => ({
              id: s.id,
              title: s.title,
              date: s.createdAt.toISOString(),
              type: 'simulado',
              simuladoId: s.id,
            }));

          const stats: DashboardStats = {
            stats: {
              totalSimulados,
              simuladosCompletos,
              pontuacaoMedia: Math.round(pontuacaoMedia * 10) / 10, // Arredondar para 1 decimal
              tempoEstudo,
              redacoesEnviadas,
              redacoesCorrigidas,
            },
            performance,
            recentActivity,
            upcomingActivities,
          };

          logger.info(`Dashboard stats calculated for user ${userId}: ${totalSimulados} simulados, ${simuladosCompletos} completos`);

          return stats;
        },
        catch: (error) => {
          logger.error(`Error getting dashboard stats: ${error}`);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }
}

