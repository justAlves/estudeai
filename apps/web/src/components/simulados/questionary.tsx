import type { Question } from '@/types/simulados'
import { useState } from 'react'
import { Button } from '../ui/button'

interface QuestionaryProps {
  questions: Question[]
}

export default function Questionary({ questions }: QuestionaryProps) {
  
  const [currentQuestion] = useState(0)
  
  return (
    <div className='w-full h-full flex flex-col gap-4 items-center'>
      <h2 className='text-lg font-bold'>{questions[currentQuestion].question}</h2>
      <div className='w-full h-full flex flex-col gap-4 items-center'>
        {questions[currentQuestion].options.map((option) => (
          <Button key={option.id}>{option.text}</Button>
        ))}
      </div>
    </div>
  )
}
