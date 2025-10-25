import z from "zod";

export const CreateOptionDto = z.object({
    questionId: z.string().min(1),
    letter: z.string().min(1),
    text: z.string().min(1),
}); 

export type TCreateOptionDto = z.infer<typeof CreateOptionDto>;

export const UpdateOptionDto = z.object({
    letter: z.string().optional(),
    text: z.string().optional(),
}); 

export type TUpdateOptionDto = z.infer<typeof UpdateOptionDto>;

