import { api } from "@/lib/api"

export interface DashboardStats {
  stats: {
    totalSimulados: number;
    simuladosCompletos: number;
    pontuacaoMedia: number;
    tempoEstudo: number;
    redacoesEnviadas: number;
    redacoesCorrigidas: number;
  };
  performance: Array<{
    subject: string;
    score: number;
    trend: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'simulado' | 'redacao';
    title: string;
    status: 'completed' | 'pending' | 'correcting' | 'corrected';
    score: number | null;
    date: string;
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

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats", {
    withCredentials: true,
  })
  return response.data.data // A API retorna { success: true, data: stats }
}
