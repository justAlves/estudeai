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
      callbackURL: "http://localhost:5173/dashboard",
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
            <span className="text-xs font-medium text-green-600">Bem-vindo de volta</span>
          </div>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            Entre na sua conta
          </CardTitle>  
          <CardDescription className='text-center'>
            Continue seus estudos de onde parou
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full space-y-6'>
          <Button variant='outline' className='w-full' onClick={handleGoogleLogin}>
            <img src={GoogleIcon} alt='Google' className='w-4 h-4' />
            Continuar com Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
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
                  className='text-sm text-muted-foreground hover:text-green-500 h-auto p-0' 
                  onClick={handleForgotPassword}
                >
                  Esqueceu sua senha?
                </Button>
              </div>
              <Button
                type='submit'
                className='w-full shadow-lg shadow-green-500/25 group'
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
                  className='text-sm font-semibold text-green-500 hover:text-green-600 h-auto p-0' 
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
