import z from "zod";

export const CreateRedacaoDto = z.object({
    title: z.string().min(1),
    theme: z.string().min(1),
    content: z.string().min(1),
    bank: z.string().min(1),
});

export type TCreateRedacaoDto = z.infer<typeof CreateRedacaoDto>;

export const UpdateRedacaoDto = z.object({
    title: z.string().min(1).optional(),
    theme: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    bank: z.string().min(1).optional(),
    status: z.enum(["pending", "correcting", "corrected", "error"]).optional(),
});

export type TUpdateRedacaoDto = z.infer<typeof UpdateRedacaoDto>;

