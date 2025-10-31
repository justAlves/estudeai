import { useMutation, useQuery } from "@tanstack/react-query"
import { getRedacoes, getRedacaoById, createRedacao, updateRedacao, sendRedacaoForCorrection } from "../services/redacoes"
import { getContext } from "@/integrations/tanstack-query/root-provider"
import { toast } from "sonner"

const { queryClient } = getContext()

export const useGetRedacoes = () => {
    const query = useQuery({
        queryKey: ["redacoes"],
        queryFn: () => getRedacoes(),
        refetchInterval: 1000 * 15, // Refetch a cada 15 segundos para ver atualizações de status
    })
    return query
}

export const useGetRedacaoById = (id: string) => {
    const query = useQuery({
        queryKey: ["redacao", id],
        queryFn: () => getRedacaoById(id),
        enabled: !!id,
        refetchInterval: (query) => {
            // Se está corrigindo, refetch mais frequentemente
            if (query.data?.status === "correcting") {
                return 1000 * 10 // A cada 10 segundos
            }
            return false
        },
    })
    return query
}

export const useCreateRedacao = (onLimitExceeded?: (reason: string) => void) => {
    const mutation = useMutation({
        mutationFn: (data: {
            title: string;
            theme: string;
            content: string;
            bank: string;
            sendForCorrection?: boolean;
        }) => createRedacao(data),
        onSuccess: (data, variables) => {
            if (variables.sendForCorrection) {
                toast.success("Redação criada e enviada para correção!")
            } else {
                toast.success("Redação salva com sucesso!")
            }
            queryClient.refetchQueries({ queryKey: ["redacoes"] })
            queryClient.invalidateQueries({ queryKey: ["redacao", data.id] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
            queryClient.invalidateQueries({ queryKey: ["subscription"] })
        },
        onError: (error: any) => {
            if (error?.response?.status === 403) {
                const reason = error?.response?.data?.error || "Limite semanal de correções de redação atingido"
                onLimitExceeded?.(reason)
            } else {
                toast.error(error?.response?.data?.error || "Ocorreu um erro ao criar a redação!")
            }
        }
    })
    return mutation
}

export const useSendRedacaoForCorrection = (onLimitExceeded?: (reason: string) => void) => {
    const mutation = useMutation({
        mutationFn: (id: string) => sendRedacaoForCorrection(id),
        onSuccess: (data) => {
            toast.success("Redação enviada para correção!")
            queryClient.refetchQueries({ queryKey: ["redacoes"] })
            queryClient.invalidateQueries({ queryKey: ["redacao", data.id] })
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
            queryClient.invalidateQueries({ queryKey: ["subscription"] })
        },
        onError: (error: any) => {
            if (error?.response?.status === 403) {
                const reason = error?.response?.data?.error || "Limite semanal de correções de redação atingido"
                onLimitExceeded?.(reason)
            } else {
                toast.error(error?.response?.data?.error || "Ocorreu um erro ao enviar a redação para correção!")
            }
        }
    })
    return mutation
}

export const useUpdateRedacao = () => {
    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { title?: string; theme?: string; content?: string; bank?: string } }) => {
            // Filtrar campos undefined para garantir que sejam enviados apenas campos válidos
            const updateData: Record<string, string> = {}
            if (data.title !== undefined) updateData.title = data.title
            if (data.theme !== undefined) updateData.theme = data.theme
            if (data.content !== undefined) updateData.content = data.content
            if (data.bank !== undefined) updateData.bank = data.bank
            return updateRedacao(id, updateData)
        },
        onSuccess: (data) => {
            toast.success("Redação atualizada com sucesso!")
            queryClient.refetchQueries({ queryKey: ["redacoes"] })
            queryClient.invalidateQueries({ queryKey: ["redacao", data.id] })
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.error || "Ocorreu um erro ao atualizar a redação!")
        }
    })
    return mutation
}

