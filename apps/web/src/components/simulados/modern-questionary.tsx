import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Hash,
  Building2
} from 'lucide-react'
import type { Question } from '@/types/simulados'
import { useSubmitSimulado } from '@/api/hooks/useSubmitSimulado'
import { useUserStore } from '@/store/user.store'
import { SimuladoResults } from './simulado-results'

interface ModernQuestionaryProps {
  questions: Question[]
  simuladoTitle: string
  simuladoBank: string
  simuladoSubject: string
  simuladoId: string
  onBackToSimulados?: () => void
}

interface Answer {
  questionId: string
  selectedOption: string
}

export function ModernQuestionary({ 
  questions, 
  simuladoTitle, 
  simuladoBank, 
  simuladoSubject,
  simuladoId,
  onBackToSimulados
}: ModernQuestionaryProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useUserStore()
  const submitSimuladoMutation = useSubmitSimulado()

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const getSelectedAnswer = (questionId: string) => {
    return answers.find(answer => answer.questionId === questionId)?.selectedOption
  }

  const hasCurrentAnswer = getSelectedAnswer(currentQuestion.id)

  // Timer
  useEffect(() => {
    if (!isCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isCompleted])

  const handleAnswerSelect = (optionLetter: string) => {
    const existingAnswerIndex = answers.findIndex(
      answer => answer.questionId === currentQuestion.id
    )

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOption: optionLetter
    }

    if (existingAnswerIndex >= 0) {
      setAnswers(prev => 
        prev.map((answer, index) => 
          index === existingAnswerIndex ? newAnswer : answer
        )
      )
    } else {
      setAnswers(prev => [...prev, newAnswer])
    }
  }

  const handleNext = async () => {
    // Verificar se há uma resposta selecionada para a questão atual
    const hasAnswer = getSelectedAnswer(currentQuestion.id)
    if (!hasAnswer) {
      return // Não permite prosseguir sem resposta
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Finalizar simulado - salvar respostas
      await handleSubmitSimulado()
    }
  }

  const handleSubmitSimulado = async () => {
    if (!user?.id || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await submitSimuladoMutation.mutateAsync({
        simuladoId,
        userId: user.id,
        answers,
        timeElapsed,
      })
      
      setIsCompleted(true)
      setShowResults(true)
    } catch (error) {
      console.error('Erro ao submeter simulado:', error)
      // Aqui você pode adicionar um toast de erro se tiver
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }


  if (showResults) {
    return (
        <SimuladoResults
          questions={questions}
          answers={answers}
          timeElapsed={timeElapsed}
          simuladoBank={simuladoBank}
          simuladoSubject={simuladoSubject}
          onBackToSimulados={onBackToSimulados || (() => {})}
        />
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Badge variant="outline" className="text-foreground border-border text-xs">
              <Hash className="w-3 h-3 mr-1" />
              {questions.length} questões
            </Badge>
            <Badge variant="outline" className="text-foreground border-border text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{simuladoSubject}</span>
              <span className="sm:hidden">{simuladoSubject.slice(0, 10)}...</span>
            </Badge>
            <Badge variant="outline" className="text-foreground border-border text-xs">
              <Building2 className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{simuladoBank}</span>
              <span className="sm:hidden">{simuladoBank.slice(0, 10)}...</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2 break-words">{simuladoTitle}</h1>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mt-2">
          <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% concluído</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-background border-border mb-4 sm:mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl text-foreground leading-relaxed break-words">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = getSelectedAnswer(currentQuestion.id) === option.letter
            return (
              <Button
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start h-auto min-h-[60px] p-3 sm:p-4 text-left ${
                  isSelected 
                    ? 'bg-green-600 hover:bg-green-700 border-green-500 text-white' 
                    : 'border-border hover:border-green-500 hover:bg-green-500/10'
                }`}
                onClick={() => handleAnswerSelect(option.letter)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5 ${
                    isSelected 
                      ? 'bg-white text-green-600' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {option.letter}
                  </div>
                  <span className="text-foreground text-sm sm:text-base flex-1 break-words whitespace-normal leading-relaxed">{option.text}</span>
                </div>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="space-y-3">
        {!hasCurrentAnswer && (
          <div className="text-center">
            <p className="text-sm text-amber-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Selecione uma resposta para continuar
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="border-border text-foreground hover:bg-muted w-full sm:w-[49%]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden">← Anterior</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!hasCurrentAnswer || isSubmitting}
            className={`w-full sm:w-[49%] ${
              hasCurrentAnswer && !isSubmitting
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-muted cursor-not-allowed opacity-50'
            }`}
          >
            <span className="hidden sm:inline">
              {isSubmitting 
                ? 'Salvando...' 
                : currentQuestionIndex === questions.length - 1 
                  ? 'Finalizar' 
                  : 'Próxima'
              }
            </span>
            <span className="sm:hidden">
              {isSubmitting 
                ? 'Salvando...' 
                : currentQuestionIndex === questions.length - 1 
                  ? 'Finalizar' 
                  : 'Próxima →'
              }
            </span>
            {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2 hidden sm:inline" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
