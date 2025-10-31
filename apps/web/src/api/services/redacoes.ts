import { api } from "@/lib/api"

export interface Redacao {
    id: string;
    userId: string;
    title: string;
    theme: string;
    content: string;
    bank: string;
    status: "pending" | "correcting" | "corrected" | "error";
    createdAt: string;
    updatedAt: string;
    correctedAt?: string;
}

export interface RedacaoCorrection {
    id: string;
    redacaoId: string;
    competencia1: number;
    competencia2: number;
    competencia3: number;
    competencia4: number;
    competencia5: number;
    totalScore: number;
    feedback: string;
    feedbackPorCompetencia: {
        competencia1: string;
        competencia2: string;
        competencia3: string;
        competencia4: string;
        competencia5: string;
    };
    createdAt: string;
}

export interface RedacaoWithCorrection extends Redacao {
    correction?: RedacaoCorrection | null;
}

export const getRedacoes = async (): Promise<Redacao[]> => {
    const response = await api.get("/redacao", {
        withCredentials: true,
    })
    return response.data
}

export const getRedacaoById = async (id: string): Promise<RedacaoWithCorrection> => {
    const response = await api.get(`/redacao/${id}`, {
        withCredentials: true,
    })
    return response.data
}

export const createRedacao = async (data: {
    title: string;
    theme: string;
    content: string;
    bank: string;
    sendForCorrection?: boolean;
}): Promise<Redacao> => {
    const response = await api.post("/redacao", data, {
        withCredentials: true,
    })
    return response.data
}

export const updateRedacao = async (id: string, data: {
    title?: string;
    theme?: string;
    content?: string;
    bank?: string;
}): Promise<Redacao> => {
    const response = await api.put(`/redacao/${id}`, data, {
        withCredentials: true,
    })
    return response.data
}

export const sendRedacaoForCorrection = async (id: string): Promise<RedacaoWithCorrection> => {
    const response = await api.post(`/redacao/${id}/send-for-correction`, {}, {
        withCredentials: true,
    })
    return response.data
}

