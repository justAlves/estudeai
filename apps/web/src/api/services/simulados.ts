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