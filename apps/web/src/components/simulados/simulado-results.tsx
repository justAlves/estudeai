import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Hash, 
  Building2,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Trophy,
  Brain
} from 'lucide-react'
import type { Question } from '@/types/simulados'

interface Answer {
  questionId: string
  selectedOption: string
}

interface SimuladoResultsProps {
  questions: Question[]
  answers: Answer[]
  timeElapsed: number
  simuladoBank: string
  simuladoSubject: string
  onBackToSimulados: () => void
}

export function SimuladoResults({ 
  questions, 
  answers, 
  timeElapsed, 
  simuladoBank,
  simuladoSubject,
  onBackToSimulados 
}: SimuladoResultsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showExplanations, setShowExplanations] = useState(true)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const getSelectedAnswer = (questionId: string) => {
    return answers.find(answer => answer.questionId === questionId)?.selectedOption
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      if (question && answer.selectedOption === question.answer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const getQuestionStats = () => {
    let correct = 0
    let incorrect = 0
    let unanswered = 0

    questions.forEach(question => {
      const userAnswer = getSelectedAnswer(question.id)
      if (!userAnswer) {
        unanswered++
      } else if (userAnswer === question.answer) {
        correct++
      } else {
        incorrect++
      }
    })

    return { correct, incorrect, unanswered }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excelente! Você dominou o conteúdo!'
    if (score >= 80) return 'Muito bom! Continue assim!'
    if (score >= 60) return 'Bom! Há espaço para melhorar.'
    if (score >= 40) return 'Precisa estudar mais este assunto.'
    return 'Recomendamos revisar o conteúdo antes de tentar novamente.'
  }

  const score = calculateScore()
  const stats = getQuestionStats()

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header com resultado geral */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Simulado Concluído!
          </CardTitle>
          <p className="text-muted-foreground">
            {getScoreMessage(score)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</div>
              <div className="text-sm text-muted-foreground">Pontuação</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-blue-500">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-muted-foreground">Tempo Total</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-green-500">{stats.correct}</div>
              <div className="text-sm text-muted-foreground">Corretas</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-red-500">{stats.incorrect}</div>
              <div className="text-sm text-muted-foreground">Incorretas</div>
            </div>
          </div>

          {/* Informações do simulado */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center">
            <Badge variant="outline" className="text-foreground border-border">
              <Hash className="w-3 h-3 mr-1" />
              {questions.length} questões
            </Badge>
            <Badge variant="outline" className="text-foreground border-border">
              <BookOpen className="w-3 h-3 mr-1" />
              {simuladoSubject}
            </Badge>
            <Badge variant="outline" className="text-foreground border-border">
              <Building2 className="w-3 h-3 mr-1" />
              {simuladoBank}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Controles de navegação */}
      <Card className="bg-background border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowExplanations(!showExplanations)}
                className="border-border text-foreground hover:bg-muted"
              >
                {showExplanations ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showExplanations ? 'Ocultar' : 'Mostrar'} Explicações
              </Button>
              <div className="text-sm text-muted-foreground">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="border-border text-foreground hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="border-border text-foreground hover:bg-muted"
              >
                Próxima
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Questão atual */}
      <Card className="bg-background border-border">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl text-foreground">
              Questão {currentQuestionIndex + 1}
            </CardTitle>
            <Badge 
              className={`${
                getSelectedAnswer(currentQuestion.id) === currentQuestion.answer
                  ? 'bg-green-500/20 text-green-500 border-green-500/30'
                  : 'bg-red-500/20 text-red-500 border-red-500/30'
              }`}
            >
              {getSelectedAnswer(currentQuestion.id) === currentQuestion.answer ? 'Correta' : 'Incorreta'}
            </Badge>
          </div>
          <p className="text-foreground text-lg leading-relaxed">
            {currentQuestion.question}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Opções */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = getSelectedAnswer(currentQuestion.id) === option.letter
              const isCorrect = option.letter === currentQuestion.answer
              const isWrong = isSelected && !isCorrect
              
              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500/50'
                      : isWrong
                      ? 'bg-red-500/10 border-red-500/50'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isCorrect
                        ? 'bg-green-500 text-white'
                        : isWrong
                        ? 'bg-red-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {option.letter}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-sm leading-relaxed">{option.text}</p>
                      {showExplanations && (option as any).explanation && (
                        <p className="text-muted-foreground text-xs mt-2 italic">
                          {(option as any).explanation}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {isWrong && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Explicação da questão */}
          {showExplanations && (currentQuestion as any).explanation && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-blue-400">Explicação</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {(currentQuestion as any).explanation}
              </p>
            </div>
          )}

          {/* Resumo da resposta */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sua resposta:</span>
              <span className="text-sm font-medium text-foreground">
                {getSelectedAnswer(currentQuestion.id) || 'Não respondida'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Resposta correta:</span>
              <span className="text-sm font-medium text-green-500">
                {currentQuestion.answer}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão para voltar */}
      <div className="flex justify-center">
        <Button
          onClick={onBackToSimulados}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Simulados
        </Button>
      </div>
    </div>
  )
}
