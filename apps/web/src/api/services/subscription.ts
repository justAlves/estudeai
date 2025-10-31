import { api } from "@/lib/api"

export interface SubscriptionStatus {
  isPro: boolean;
  subscription?: {
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  usage?: {
    simulados: number;
    redacoes: number;
  };
}

export interface UsageInfo {
  simulados: number;
  redacoes: number;
  isPro: boolean;
}

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const response = await api.get("/subscription/status", {
    withCredentials: true,
  })
  return response.data
}

export const getUsage = async (): Promise<UsageInfo> => {
  const response = await api.get("/subscription/usage", {
    withCredentials: true,
  })
  return response.data
}

export const createCheckoutSession = async (): Promise<{ url: string }> => {
  const response = await api.post("/subscription/create-checkout-session", {}, {
    withCredentials: true,
  })
  return response.data
}

export const cancelSubscription = async (): Promise<{ success: boolean }> => {
  const response = await api.post("/subscription/cancel", {}, {
    withCredentials: true,
  })
  return response.data
}

export const createPortalSession = async (): Promise<{ url: string }> => {
  const response = await api.post("/subscription/create-portal-session", {}, {
    withCredentials: true,
  })
  return response.data
}

