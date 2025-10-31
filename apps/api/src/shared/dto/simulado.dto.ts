import z from "zod";

export const CreateSimuladoDto = z.object({
    title: z.string().min(1),
    bank: z.string().min(1),
    description: z.string().min(1),
    subject: z.string().min(1),
}); 

export type TCreateSimuladoDto = z.infer<typeof CreateSimuladoDto>;

export const UpdateSimuladoDto = z.object({
    title: z.string().optional(),
    bank: z.string().optional(),
    description: z.string().optional(),
    subject: z.string().optional(),
    timeToRespond: z.number().optional(),
    score: z.number().optional(),
    status: z.string().optional(),
    respondedAt: z.date().optional(),
}); 

export type TUpdateSimuladoDto = z.infer<typeof UpdateSimuladoDto>;