import { api } from "@/lib/api"

export const getSimulados = async () => {
    const response = await api.get("/simulado", {
        withCredentials: true,
    })
    return response.data
}

export const createSimulado = async (data: {
    count: number,
    subject: string,
    bank: string,
    title?: string,
    description?: string,
}) => {
    const response = await api.post("/simulado/generate", data, {
        withCredentials: true,
    })
    return response.data
};

export const getSimuladoById = async (id: string) => {
    const response = await api.get(`/simulado/${id}`, {
        withCredentials: true,
    })
    return response.data
}

export const submitSimulado = async (data: {
    simuladoId: string;
    userId: string;
    answers: Array<{
        questionId: string;
        selectedOption: string;
    }>;
    timeElapsed: number;
}) => {
    const response = await api.post("/user-response/submit", data, {
        withCredentials: true,
    })
    return response.data
}

export const getUserResponses = async (simuladoId: string) => {
    const response = await api.get(`/user-response/${simuladoId}`, {
        withCredentials: true,
    })
    return response.data.data // A API retorna { success: true, data: responses }
}