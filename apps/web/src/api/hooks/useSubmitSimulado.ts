import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitSimulado } from "../services/simulados";

interface SubmitSimuladoData {
  simuladoId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    selectedOption: string;
  }>;
  timeElapsed: number;
}

export const useSubmitSimulado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitSimuladoData) => submitSimulado(data),
    onSuccess: (data) => {
      // Invalidar cache dos simulados para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ["simulados"] });
      queryClient.invalidateQueries({ queryKey: ["simulado", data.simuladoId] });
    },
    onError: (error) => {
      console.error("Erro ao submeter simulado:", error);
    },
  });
};
