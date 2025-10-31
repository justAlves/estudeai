import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "../services/dashboard"

export const useDashboardStats = () => {
  const query = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
    refetchInterval: 1000 * 30, // Refetch a cada 30 segundos
  })
  return query
}

