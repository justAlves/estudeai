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

export const generateCorrectionPrompt = (content: string, theme: string, bank?: string) => `
Você é um corretor especializado em redações do ENEM, seguindo rigorosamente os critérios de avaliação oficiais.

${bank ? `Banca de Referência: ${bank}\n` : ''}Tema da Redação: ${theme}

Redação a ser corrigida:
"""
${content}
"""

Você deve corrigir esta redação seguindo os critérios das 5 competências do ENEM:

Competência 1: Demonstrar domínio da modalidade escrita formal da Língua Portuguesa.
- Avaliar gramática, ortografia, pontuação e estruturação de frases.

Competência 2: Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema.
- Avaliar se o tema foi compreendido e desenvolvido adequadamente.

Competência 3: Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.
- Avaliar a seleção e organização de argumentos.

Competência 4: Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.
- Avaliar coesão textual e uso adequado de conectivos.

Competência 5: Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.
- Avaliar a proposta de intervenção apresentada.

Cada competência deve ser avaliada com nota de 0 a 200 pontos.

A saída DEVE ser em JSON no seguinte formato:
{
    "competencia1": 160,
    "competencia2": 180,
    "competencia3": 170,
    "competencia4": 160,
    "competencia5": 150,
    "totalScore": 820,
    "feedback": "Feedback geral detalhado sobre a redação...",
    "feedbackPorCompetencia": {
        "competencia1": "Feedback específico sobre domínio da escrita formal...",
        "competencia2": "Feedback específico sobre compreensão do tema...",
        "competencia3": "Feedback específico sobre seleção de argumentos...",
        "competencia4": "Feedback específico sobre mecanismos linguísticos...",
        "competencia5": "Feedback específico sobre proposta de intervenção..."
    }
}

Não inclua nenhum outro texto além do JSON, nem explicações, nem comentários, nem nada além do JSON.
`

export { ai };