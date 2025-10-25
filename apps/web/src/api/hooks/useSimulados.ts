import { useMutation, useQuery } from "@tanstack/react-query"
import { createSimulado, getSimuladoById, getSimulados } from "../services/simulados"
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

export const useCreateSimulado = () => {
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
        },
        onError: () => {
            toast.error("Ocorreu um erro ao enviar o simulado para a criação!")
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