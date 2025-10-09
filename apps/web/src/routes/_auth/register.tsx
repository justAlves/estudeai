import { createFileRoute, Link } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { ControlInput } from '@/components/control-input'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { toast } from 'sonner'
import { BrainCircuit, UserPlus, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

const registerSchema = z.object({
  name: z.string("Nome é obrigatório").min(3, "Nome é obrigatório"),
  email: z.email("Email é obrigatório"),
  password: z.string("Senha é obrigatória").min(8, "Senha é obrigatória"),
  confirmPassword: z.string("Confirmação de senha é obrigatória").min(8, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não coincidem",
})

type RegisterSchema = z.infer<typeof registerSchema>

function RouteComponent() {
  const navigate = useNavigate()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      confirmPassword: "",
      password: "",
    },
  })

  const onSubmit = async (data: RegisterSchema) => {
    auth.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    }, {
      onSuccess: () => {
        navigate({
          to: '/dashboard',
        })
      },
      onError: ({ error }) => {

        if(error.message === "User already exists. Use another email."){
          toast.error("Esse usuário já existe. Use outro email.")
          return
        }

        toast.error("Ocorreu um erro ao cadastrar o usuário.")
        return
      }
    })
  }

  const handleLogin = () => {
    navigate({
      to: '/login',
    })
  }
  
  return (
    <div className='min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4'>
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient Glow */}
      <div className="opacity-30 absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-green-500/20 via-emerald-500/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>
      
      {/* Logo/Brand */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full"></div>
          <BrainCircuit className="size-8 text-green-500 relative" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
          Estudy AI
        </span>
      </Link>

      <Card className='w-full max-w-md flex flex-col items-center backdrop-blur-sm bg-background/50 border-border/50 relative z-10'>
        <CardHeader className='w-full flex flex-col items-center space-y-3 pb-6'>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 backdrop-blur-sm">
            <Sparkles className="size-4 text-green-500" />
            <span className="text-xs font-medium text-green-600">Comece grátis</span>
          </div>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            Crie sua conta
          </CardTitle>  
          <CardDescription className='text-center'>
            Junte-se a milhares de estudantes que já estão usando IA para estudar
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
              <ControlInput 
                control={form.control} 
                name='name' 
                label='Nome completo'
                placeholder='Seu nome'
              />
              <ControlInput 
                control={form.control} 
                name='email' 
                label='Email'
                placeholder='seu@email.com'
                type='email'
              />
              <div className='grid md:grid-cols-2 gap-4'>
                <ControlInput 
                  control={form.control} 
                  name='password' 
                  label='Senha'
                  placeholder='••••••••'
                  type='password'
                  password
                />
                <ControlInput 
                  control={form.control} 
                  name='confirmPassword' 
                  label='Confirme a senha'
                  placeholder='••••••••'
                  type='password'
                  password
                />
              </div>
              <div className='pt-2'>
                <Button
                  type='submit'
                  className='w-full shadow-lg shadow-green-500/25'
                  size='lg'
                >
                  <UserPlus className="size-4 mr-2" />
                  Criar conta gratuita
                </Button>
              </div>
              <div className='flex justify-center items-center gap-2 pt-2'>
                <span className='text-sm text-muted-foreground'>
                  Já tem uma conta?
                </span>
                <Button 
                  variant='link' 
                  type='button' 
                  className='text-sm font-semibold text-green-500 hover:text-green-600 h-auto p-0' 
                  onClick={handleLogin}
                >
                  Fazer login
                </Button>
              </div>
              <p className='text-xs text-center text-muted-foreground pt-2'>
                Ao criar uma conta, você concorda com nossos{' '}
                <Link to="/termos" className='text-green-500 hover:text-green-600'>
                  Termos de Uso
                </Link>
                {' '}e{' '}
                <Link to="/privacidade" className='text-green-500 hover:text-green-600'>
                  Política de Privacidade
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
