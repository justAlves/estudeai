import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { ControlInput } from '@/components/control-input'
import { useUserStore } from '@/store/user.store'
import { useUpdateUser } from '@/api/hooks/useUser'
import { useTheme } from '@/components/theme-provider'
import { auth } from '@/lib/auth'
import { toast } from 'sonner'
import { useState, useRef, useEffect } from 'react'
import { Camera, LogOut, Moon, Sun, Settings, Monitor, Sparkles, Calendar, CreditCard, X } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSubscriptionStatus, useCancelSubscription, useCreatePortalSession, useCreateCheckoutSession } from '@/api/hooks/useSubscription'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export const Route = createFileRoute('/_app/configuracoes')({
  component: RouteComponent,
})

const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
})

type ProfileSchema = z.infer<typeof profileSchema>

function RouteComponent() {
  const navigate = useNavigate()
  const { user, clearUser } = useUserStore()
  const { updateUser, isLoading } = useUpdateUser()
  const { theme, setTheme } = useTheme()
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: subscriptionStatus } = useSubscriptionStatus()
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription()
  const { mutate: createPortalSession, isPending: isCreatingPortal } = useCreatePortalSession()
  const { mutate: createCheckoutSession, isPending: isCreatingCheckout } = useCreateCheckoutSession()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  // Verificar parâmetros de URL para mensagens de sucesso/cancelamento
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      toast.success('Assinatura criada com sucesso! Bem-vindo ao plano PRO.')
      // Remover parâmetro da URL
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (urlParams.get('canceled') === 'true') {
      toast.info('Processo de assinatura cancelado.')
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (urlParams.get('restored') === 'true') {
      toast.success('Assinatura restaurada com sucesso! Você continuará com acesso PRO até o vencimento.')
      window.history.replaceState({}, '', window.location.pathname)
      // Invalidar cache da subscription para atualizar dados
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
    if (urlParams.get('already_active') === 'true') {
      toast.info('Você já possui uma assinatura ativa.')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  // Atualizar formulário quando usuário mudar
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
      })
      setImagePreview(user.image || null)
    }
  }, [user, form])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida')
        return
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB')
        return
      }

      // Criar preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = async (data: ProfileSchema) => {
    try {
      const file = fileInputRef.current?.files?.[0]
      await updateUser(data, file || undefined)
      
      // Resetar preview se não há arquivo novo
      if (!file && user?.image) {
        setImagePreview(user.image)
      }
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut({
        fetchOptions: {
          onSuccess: () => {
            clearUser()
            toast.success('Logout realizado com sucesso')
            navigate({ to: '/login' })
          },
        },
      })
    } catch (error) {
      clearUser()
      toast.error('Erro ao fazer logout')
      navigate({ to: '/login' })
    }
  }


  return (
    <div className="p-6 space-y-6 max-w-4xl w-full mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="size-6 text-green-500" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e preferências</p>
      </div>

      {/* Perfil Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais e foto de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="size-24 border-2 border-border">
                    <AvatarImage src={imagePreview || undefined} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white text-2xl">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full size-8"
                    onClick={handleAvatarClick}
                  >
                    <Camera className="size-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Clique no ícone de câmera para alterar sua foto
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="space-y-4">
                <ControlInput
                  control={form.control}
                  name="name"
                  label="Nome"
                  placeholder="Seu nome completo"
                />
                <ControlInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="seu@email.com"
                  disabled
                  type="email"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-32"
                >
                  {isLoading ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Aparência Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>
            Personalize a aparência da interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Tema</Label>
              <p className="text-sm text-muted-foreground">
                Escolha o tema da interface
              </p>
            </div>
            <Select
              value={theme}
              onValueChange={(value: 'light' | 'dark' | 'system') => {
                setTheme(value)
                const themeNames = {
                  light: 'claro',
                  dark: 'escuro',
                  system: 'sistema'
                }
                toast.success(`Tema alterado para ${themeNames[value]}`)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {theme === 'light' && <Sun className="size-4" />}
                    {theme === 'dark' && <Moon className="size-4" />}
                    {theme === 'system' && <Monitor className="size-4" />}
                    <span>
                      {theme === 'light' && 'Claro'}
                      {theme === 'dark' && 'Escuro'}
                      {theme === 'system' && 'Sistema'}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="size-4" />
                    <span>Claro</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="size-4" />
                    <span>Escuro</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="size-4" />
                    <span>Sistema</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmação de cancelamento */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <X className="size-5 text-destructive" />
              Cancelar Assinatura
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Tem certeza que deseja cancelar sua assinatura?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-foreground">
                Você continuará com acesso PRO até{' '}
                {subscriptionStatus?.subscription && (
                  <span className="font-semibold">
                    {new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                  </span>
                )}.
                Após essa data, você voltará para o plano gratuito.
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Manter Assinatura
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setCancelDialogOpen(false)
                cancelSubscription()
              }}
              disabled={isCanceling}
              className="w-full sm:w-auto"
            >
              <X className="size-4 mr-2" />
              {isCanceling ? 'Cancelando...' : 'Sim, Cancelar Assinatura'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assinatura Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-green-500" />
            Assinatura
          </CardTitle>
          <CardDescription>
            Gerencie seu plano e assinatura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptionStatus?.isPro || (subscriptionStatus?.subscription && new Date(subscriptionStatus.subscription.currentPeriodEnd) > new Date()) ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white">PRO</Badge>
                    <span className="text-sm font-medium text-foreground">
                      Plano Ativo
                    </span>
                  </div>
                  {subscriptionStatus.subscription && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      <span>
                        {subscriptionStatus.subscription.cancelAtPeriodEnd 
                          ? `Válido até ${new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}`
                          : `Renova em ${new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}`
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {subscriptionStatus.subscription?.cancelAtPeriodEnd ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    Sua assinatura será cancelada em{' '}
                    {new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}.
                    Você continuará com acesso PRO até essa data.
                  </p>
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      onClick={() => createPortalSession()}
                      disabled={isCreatingPortal}
                      className="w-full"
                    >
                      <CreditCard className="size-4 mr-2" />
                      {isCreatingPortal ? 'Abrindo...' : 'Gerenciar Pagamento'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => createPortalSession()}
                    disabled={isCreatingPortal}
                    className="flex-1"
                  >
                    <CreditCard className="size-4 mr-2" />
                    {isCreatingPortal ? 'Abrindo...' : 'Gerenciar Pagamento'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setCancelDialogOpen(true)}
                    disabled={isCanceling}
                  >
                    <X className="size-4 mr-2" />
                    {isCanceling ? 'Cancelando...' : 'Cancelar Assinatura'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 border border-border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Gratuito</Badge>
                    <span className="text-sm font-medium text-foreground">
                      Plano Atual
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você está no plano gratuito. Upgrade para PRO e desbloqueie recursos ilimitados!
                  </p>
                </div>
              </div>

              {subscriptionStatus?.usage && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Simulados esta semana</p>
                    <p className="text-2xl font-bold text-foreground">
                      {subscriptionStatus.usage.simulados}/1
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Redações esta semana</p>
                    <p className="text-2xl font-bold text-foreground">
                      {subscriptionStatus.usage.redacoes}/1
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={() => createCheckoutSession()}
                disabled={isCreatingCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Sparkles className="size-4 mr-2" />
                {isCreatingCheckout ? 'Redirecionando...' : 'Fazer Upgrade para PRO'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessão Section */}
      <Card className="border-border/50 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Sessão</CardTitle>
          <CardDescription>
            Gerencie sua sessão e segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Logout</Label>
              <p className="text-sm text-muted-foreground">
                Encerre sua sessão atual
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="size-4" />
              Sair da conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
