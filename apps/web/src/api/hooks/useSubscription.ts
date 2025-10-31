import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getSubscriptionStatus, 
  getUsage, 
  createCheckoutSession, 
  cancelSubscription,
  createPortalSession,
  type SubscriptionStatus,
  type UsageInfo,
} from "../services/subscription"
import { toast } from "sonner"

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription", "status"],
    queryFn: getSubscriptionStatus,
    staleTime: 5000, // 1 minuto
  })
}

export const useCheckUsage = () => {
  return useQuery({
    queryKey: ["subscription", "usage"],
    queryFn: getUsage,
    staleTime: 30000, // 30 segundos
  })
}

export const useCreateCheckoutSession = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      // Se a URL retornada não é do Stripe (é uma URL de redirect interno), 
      // significa que a subscription foi restaurada sem criar novo checkout
      if (data.url && !data.url.includes('checkout.stripe.com')) {
        // Subscription foi restaurada, invalidar queries e navegar
        queryClient.invalidateQueries({ queryKey: ["subscription"] })
        window.location.href = data.url
      } else if (data.url) {
        // É uma URL do Stripe, redirecionar normalmente
        window.location.href = data.url
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Erro ao criar sessão de checkout")
    },
  })
}

export const useCancelSubscription = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] })
      toast.success("Assinatura cancelada. Você continuará com acesso PRO até o vencimento.")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Erro ao cancelar assinatura")
    },
  })
}

export const useCreatePortalSession = () => {
  return useMutation({
    mutationFn: createPortalSession,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Erro ao criar sessão do portal")
    },
  })
}

