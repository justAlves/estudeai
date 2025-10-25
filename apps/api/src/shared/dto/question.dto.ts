import z from "zod";

export const CreateQuestionDto = z.object({
    simuladoId: z.string().min(1),
    question: z.string().min(1),
    correctAnswer: z.string().min(1),
    order: z.number().min(1),
}); 

export type TCreateQuestionDto = z.infer<typeof CreateQuestionDto>;

export const UpdateQuestionDto = z.object({
    question: z.string().optional(),
    correctAnswer: z.string().optional(),
    order: z.number().optional(),
}); 

export type TUpdateQuestionDto = z.infer<typeof UpdateQuestionDto>;

