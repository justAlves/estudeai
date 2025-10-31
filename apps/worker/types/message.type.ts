export type Message = {
    count?: number;
    subject?: string;
    bank?: string;
    userId?: string;
    simuladoId?: string;
    type?: "generate_questions" | "correct_redacao";
    redacaoId?: string;
    content?: string;
    theme?: string;
};
