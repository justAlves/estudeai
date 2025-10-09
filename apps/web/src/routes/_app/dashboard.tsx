import { createFileRoute } from '@tanstack/react-router'
import StudentSuprise from '@/assets/images/student-suprise.png'
import { Card } from '@/components/ui/card'
import { Brain, Sparkles, Rocket } from 'lucide-react'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-20'>
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient Glow */}
      <div className="opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-green-500/30 via-emerald-500/20 to-transparent blur-3xl rounded-full pointer-events-none"></div>
      
      <div className='flex flex-col items-center justify-center gap-8 relative z-10'>
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/10 blur-2xl rounded-full animate-pulse"></div>
          <img src={StudentSuprise} alt='Student Suprise' className='w-64 md:w-72 relative' />
        </div>
        
        <div className='text-center max-w-3xl space-y-6'>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 backdrop-blur-sm mb-2">
            <Brain className="size-4 text-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">Em desenvolvimento</span>
          </div>
          
          <h1 className='text-4xl md:text-5xl font-bold leading-tight'>
            A IA ainda está lendo o edital.{' '}
            <span className='bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent'>
              Você é rápido demais!
            </span>
          </h1>
          
          <p className='text-lg md:text-xl text-muted-foreground leading-relaxed'>
            Calma, jovem gafanhoto! 🦗 Nossa IA ainda está na fase de "fazer resumo da matéria às 3h da manhã antes da prova". 
            Estamos trabalhando nisso mais rápido que você procrastinou esse semestre inteiro.
          </p>
          
          <Card className='p-6 backdrop-blur-sm bg-background/50 border-green-500/20 mt-8'>
            <p className='text-sm text-muted-foreground'>
              💡 <strong className='text-foreground'>Spoiler:</strong> Em breve você vai poder estudar aqui ao invés de assistir mais um episódio "só pra relaxar". 
              Enquanto isso, aproveite para... bem, assistir mais um episódio mesmo. Você merece!
            </p>
          </Card>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl w-full'>
          <Card className='p-6 backdrop-blur-sm bg-background/50 border-border/50 text-center space-y-2 hover:border-green-500/50 transition-colors'>
            <div className='size-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto'>
              <Sparkles className='size-6 text-white' />
            </div>
            <h3 className='font-semibold'>Simulados com IA</h3>
            <p className='text-xs text-muted-foreground'>
              Geração personalizada baseada no seu edital
            </p>
          </Card>

          <Card className='p-6 backdrop-blur-sm bg-background/50 border-border/50 text-center space-y-2 hover:border-green-500/50 transition-colors'>
            <div className='size-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto'>
              <Brain className='size-6 text-white' />
            </div>
            <h3 className='font-semibold'>Explicações inteligentes</h3>
            <p className='text-xs text-muted-foreground'>
              A IA explica cada erro de forma didática
            </p>
          </Card>

          <Card className='p-6 backdrop-blur-sm bg-background/50 border-border/50 text-center space-y-2 hover:border-green-500/50 transition-colors'>
            <div className='size-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mx-auto'>
              <Rocket className='size-6 text-white' />
            </div>
            <h3 className='font-semibold'>Correção de redações</h3>
            <p className='text-xs text-muted-foreground'>
              Feedback instantâneo e detalhado
            </p>
          </Card>
        </div>

        <p className='text-xs text-muted-foreground mt-8'>
          Estamos preparando algo incrível. Avisaremos assim que estiver pronto! 🚀
        </p>
      </div>
    </div>
  )
}
