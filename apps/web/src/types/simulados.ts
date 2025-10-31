export type SimuladoStatus = 'pending' | 'waiting_response' | 'answered'

export type Option = {
  id: string
  letter: string
  text: string
  explanation?: string
  createdAt: Date
  updatedAt: Date
}

export type Question = {
  id: string
  simuladoId: string
  question: string
  answer: string
  isCorrect: boolean
  explanation?: string
  options: Option[]
  createdAt: Date
}

export type Simulado = {
  id: string
  title: string
  bank: string
  description: string
  subject: string
  timeToRespond: number
  score: number
  userId: string
  createdAt: Date
  respondedAt: Date | null
  questions: Question[]
}

export type StatusConfig = {
  icon: React.ReactNode
  label: string
  className: string
  variant: 'default' | 'secondary'
}
