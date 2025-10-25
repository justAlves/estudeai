import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Hash,
  Building2
} from 'lucide-react'
import type { Question, Option } from '@/types/simulados'

interface ModernQuestionaryProps {
  questions: Question[]
  simuladoTitle: string
  simuladoBank: string
  simuladoSubject: string
}

interface Answer {
  questionId: string
  selectedOption: string
}

export function ModernQuestionary({ 
  questions, 
  simuladoTitle, 
  simuladoBank, 
  simuladoSubject 
}: ModernQuestionaryProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

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

  const getSelectedAnswer = (questionId: string) => {
    return answers.find(answer => answer.questionId === questionId)?.selectedOption
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setIsCompleted(true)
      setShowResults(true)
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

  const calculateScore = () => {
    let correct = 0
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      if (question && answer.selectedOption === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Simulado Concluído!
            </CardTitle>
            <p className="text-neutral-400">
              Parabéns! Você finalizou o simulado com sucesso.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-green-500">{score}%</div>
                <div className="text-sm text-neutral-400">Pontuação</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-blue-500">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-neutral-400">Tempo Total</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-purple-500">{questions.length}</div>
                <div className="text-sm text-neutral-400">Questões</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Resumo das Respostas</h3>
              <div className="space-y-2">
                {questions.map((question, index) => {
                  const userAnswer = getSelectedAnswer(question.id)
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-300">
                          Questão {index + 1}
                        </span>
                        <Badge 
                          className={isCorrect 
                            ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                            : 'bg-red-500/20 text-red-500 border-red-500/30'
                          }
                        >
                          {isCorrect ? 'Correta' : 'Incorreta'}
                        </Badge>
                      </div>
                      <div className="text-sm text-neutral-400">
                        Sua resposta: <span className="font-medium">{userAnswer || 'Não respondida'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-neutral-300 border-neutral-600">
              <Hash className="w-3 h-3 mr-1" />
              {questions.length} questões
            </Badge>
            <Badge variant="outline" className="text-neutral-300 border-neutral-600">
              <BookOpen className="w-3 h-3 mr-1" />
              {simuladoSubject}
            </Badge>
            <Badge variant="outline" className="text-neutral-300 border-neutral-600">
              <Building2 className="w-3 h-3 mr-1" />
              {simuladoBank}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">{simuladoTitle}</h1>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-neutral-400 mt-2">
          <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% concluído</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-background border-green-800 mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-white leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = getSelectedAnswer(currentQuestion.id) === option.letter
            return (
              <Button
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start h-auto p-4 text-left ${
                  isSelected 
                    ? 'bg-green-600 hover:bg-green-700 border-green-500' 
                    : 'border-neutral-600 hover:border-green-500 hover:bg-green-500/10'
                }`}
                onClick={() => handleAnswerSelect(option.letter)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isSelected 
                      ? 'bg-white text-green-600' 
                      : 'bg-neutral-700 text-neutral-300'
                  }`}>
                    {option.letter}
                  </div>
                  <span className="text-white">{option.text}</span>
                </div>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        
        <Button
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
