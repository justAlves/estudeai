import * as z from 'zod'

export const simuladoFormSchema = z.object({
  quantidadeQuestoes: z.string()
    .min(1, "Quantidade de questões é obrigatória")
    .refine((val) => !isNaN(parseInt(val, 10)), { message: "Deve ser um número válido" })
    .refine((val) => parseInt(val, 10) >= 1, { message: "Deve ter pelo menos 1 questão" })
    .refine((val) => parseInt(val, 10) <= 200, { message: "Máximo de 200 questões" }),
  banca: z.string().min(1, "Banca é obrigatória"),
  materia: z.string().min(1, "Matéria é obrigatória"),
  titulo: z.string().optional(),
  descricao: z.string().optional(),
})

export type SimuladoFormValues = z.infer<typeof simuladoFormSchema>
