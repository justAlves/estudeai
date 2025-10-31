import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { ControlInput } from '@/components/control-input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import GoogleIcon from '@/assets/icons/google.png'
import { auth } from '@/lib/auth'
import { toast } from 'sonner'
import { BrainCircuit, LogIn, Sparkles } from 'lucide-react'
import { FRONTEND_URL } from '@/lib/api'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

const authSchema = z.object({
  email: z.email("Email é obrigatório"),
  password: z.string("Senha é obrigatória").min(8, "Senha é obrigatória"),
})

type AuthSchema = z.infer<typeof authSchema>

function RouteComponent() {
 
  const navigate = useNavigate()

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: AuthSchema) => {
    await auth.signIn.email({
      email: data.email,
      password: data.password,
    }, {
      onSuccess: () => {
        navigate({
          to: '/dashboard',
        })
      },
      onError: ({ error }) => {
        
        if(error.message === "Invalid email or password"){
          toast.error("Email ou senha inválidos")
          return
        }

        toast.error("Ocorreu um erro ao fazer login")
        return
      }
    })
  }

  const handleGoogleLogin = async () => {
    await auth.signIn.social({
      provider: "google",
      callbackURL: `${FRONTEND_URL}/dashboard`,
    })
  }

  const handleForgotPassword = () => {
    navigate({
      to: '/',
    })
  }

  const handleRegister = () => {
    navigate({
      to: '/register',
    })
  }
  
  return (
    <div className='min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4'>
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>
      
      {/* Subtle Top Gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-green-500/8 via-emerald-500/4 to-transparent blur-3xl rounded-full pointer-events-none"></div>
      
      {/* Logo/Brand */}
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 group z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/10 blur-md rounded-lg group-hover:bg-green-500/20 transition-colors"></div>
          <BrainCircuit className="size-7 text-green-500 relative" />
        </div>
        <span className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Estudy AI
        </span>
      </Link>

      <Card className='w-full max-w-md border-border/50 bg-card relative z-10'>
        <CardHeader className='w-full flex flex-col items-center space-y-4 pb-6'>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 text-sm font-medium">
            <Sparkles className="size-3.5" />
            <span>Bem-vindo de volta</span>
          </div>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            Entre na sua conta
          </CardTitle>  
          <CardDescription className='text-center'>
            Continue seus estudos de onde parou
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full space-y-6'>
          <Button variant='outline' className='w-full font-medium' onClick={handleGoogleLogin}>
            <img src={GoogleIcon} alt='Google' className='w-4 h-4 mr-2' />
            Continuar com Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou entre com email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
              <ControlInput 
                control={form.control} 
                name='email' 
                label='Email'
                placeholder='seu@email.com'
                type='email'
              />
              <ControlInput 
                control={form.control} 
                name='password' 
                label='Senha'
                placeholder='••••••••'
                type='password'
                password
              />
              <div className='flex justify-end -mt-2'>
                <Button 
                  variant='link' 
                  type='button' 
                  className='text-sm text-muted-foreground hover:text-green-600 h-auto p-0 font-medium' 
                  onClick={handleForgotPassword}
                >
                  Esqueceu sua senha?
                </Button>
              </div>
              <Button
                type='submit'
                className='w-full shadow-md shadow-green-500/10 hover:shadow-green-500/20 font-medium'
                size='lg'
              >
                <LogIn className="size-4 mr-2" />
                Entrar na conta
              </Button>
              <div className='flex justify-center items-center gap-2 pt-2'>
                <span className='text-sm text-muted-foreground'>
                  Ainda não tem uma conta?
                </span>
                <Button 
                  variant='link' 
                  type='button' 
                  className='text-sm font-semibold text-green-600 hover:text-green-700 h-auto p-0' 
                  onClick={handleRegister}
                >
                  Cadastre-se grátis
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
