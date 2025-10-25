import { GoogleGenAI } from "@google/genai";
import { env } from "./env";

const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY });

export const generateQuestionsPrompt =  (count: number, subject: string, bank: string, context: string) => `
Você é um gerador de questões altamente especializado para concursos públicos
e vestibular, com foco em precisão e aderência ao estilo da banca.

Você deve gerar ${count} questões de múltipla escolha sobre o tema ${subject}.
O estilo das questões devem simular as questões da banca ${bank}.

As questões devem ser geradas em português brasileiro e no formato de múltipla escolha.
As questões devem ser geradas com 4 opções de resposta, sendo uma correta e três incorretas.

Contexto de Apoio:
Use as seguintes questões de referência para guiar o estilo e o nível de profundidade:
"""
${context}
"""

A saída DEVE ser em JSON no seguinte formato:
{
    "title": "Título do Simulado",
    "bank": "Banca do Simulado",
    "description": "Descrição do Simulado",
    "subject": "Tema do Simulado",
    "questions": [
        {
            "question": "Questão",
            "correctAnswer": "Resposta Correta, letra (A, B, C, D)",
            "order": "Ordem da Questão (1, 2, 3, 4)",
            "explanation": "Explicação da Questão",
            "options": [
                {
                    "letter": "A",
                    "text": "Opção A",
                    "explanation": "Explicação da Opção A, porque ela é a correta ou incorreta"
                },
                {
                    "letter": "B",
                    "text": "Opção B",
                    "explanation": "Explicação da Opção B, porque ela é a correta ou incorreta"
                },
                {
                    "letter": "C",
                    "text": "Opção C",
                    "explanation": "Explicação da Opção C, porque ela é a correta ou incorreta"
                },
                {
                    "letter": "D",
                    "text": "Opção D",
                    "explanation": "Explicação da Opção D, porque ela é a correta ou incorreta"
                }
            ]
        }
    ]
}

Não inclua nenhum outro texto além do JSON, nem explicações, nem comentários, nem nada além do JSON.
`

export { ai };