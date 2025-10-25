export type Option = {
    letter: string;
    text: string;
    explanation: string;
}

export type Question = {
    question: string;
    correctAnswer: string;
    order: number;
    explanation: string;
    options: Option[];
}

export type Simulado = {
    title: string;
    bank: string;
    description: string;
    subject: string;
    questions: Question[];
}