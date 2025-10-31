import { useMutation, useQuery } from "@tanstack/react-query"
import { createSimulado, getSimuladoById, getSimulados, getUserResponses } from "../services/simulados"
import { getContext } from "@/integrations/tanstack-query/root-provider"
import { toast } from "sonner"

const { queryClient} = getContext()

export const useGetSimulados = () => {
    const query = useQuery({
        queryKey: ["simulados"],
        queryFn: () => getSimulados(),
        refetchInterval: 1000 * 15,
    })
    return query
}

export const useCreateSimulado = (onLimitExceeded?: (reason: string) => void) => {
    const mutation = useMutation({
        mutationFn: (data: {
            count: number,
            subject: string,
            bank: string,
            title?: string,
            description?: string,
        }) => createSimulado(data),
        onSuccess: () => {
            toast.success("Simulado enviado para a criação!")
            queryClient.refetchQueries({ queryKey: ["simulados"] })
            queryClient.invalidateQueries({ queryKey: ["subscription"] })
        },
        onError: (error: any) => {
            if (error?.response?.status === 403) {
                const reason = error?.response?.data?.error || "Limite semanal de simulados atingido"
                onLimitExceeded?.(reason)
            } else {
                toast.error("Ocorreu um erro ao enviar o simulado para a criação!")
            }
        }
    })
    return mutation
}

export const useGetSimuladoById = (id: string) => {
    const query = useQuery({
        queryKey: ["simulado", id],
        queryFn: () => getSimuladoById(id),
        enabled: !!id,
    })
    return query
}

export const useGetUserResponses = (simuladoId: string) => {
    const query = useQuery({
        queryKey: ["user-responses", simuladoId],
        queryFn: () => getUserResponses(simuladoId),
        enabled: !!simuladoId,
        retry: 1,
        retryDelay: 1000,
    })
    return query
}
