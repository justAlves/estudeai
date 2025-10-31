import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save, Send, ArrowLeft } from 'lucide-react'
import { useUpdateRedacao, useGetRedacaoById, useSendRedacaoForCorrection } from '@/api/hooks/useRedacoes'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { UpgradeModal } from '@/components/subscription/upgrade-modal'
import { useSubscriptionStatus, useCreateCheckoutSession } from '@/api/hooks/useSubscription'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkles } from 'lucide-react'

const BANKS = [
  'ENEM',
  'FUVEST',
  'VUNESP',
  'FCC',
  'CESPE',
  'ESAF',
  'FGV',
  'Outra'
]

export const Route = createFileRoute('/_app/redacoes/$id/edit')({
  component: EditRedacaoComponent,
})

function EditRedacaoComponent() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  const { data: redacao, isLoading } = useGetRedacaoById(id)
  const updateMutation = useUpdateRedacao()
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [limitReachedDialogOpen, setLimitReachedDialogOpen] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<string>()
  const { data: subscriptionStatus } = useSubscriptionStatus()
  const { mutate: createCheckoutSession, isPending: isCreatingCheckout } = useCreateCheckoutSession()
  const sendForCorrectionMutation = useSendRedacaoForCorrection((reason) => {
    setUpgradeReason(reason)
    setUpgradeModalOpen(true)
  })
  
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [content, setContent] = useState('')
  const [bank, setBank] = useState('')

  useEffect(() => {
    if (redacao) {
      setTitle(redacao.title)
      setTheme(redacao.theme)
      setContent(redacao.content)
      setBank(redacao.bank || '')
    }
  }, [redacao])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (!redacao) {
    return (
      <div className="p-6">
        <Card className="border-red-500/50">
          <CardContent className="p-6">
            <p className="text-red-500">Redação não encontrada</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (redacao.status === 'corrected') {
    navigate({ to: '/redacoes/$id', params: { id } })
    return null
  }

  const handleSave = () => {
    if (!title.trim() || !theme.trim() || !content.trim()) {
      toast.error('Preencha título, tema e conteúdo antes de salvar')
      return
    }

    const updateData: { title: string; theme: string; content: string; bank?: string } = {
      title: title.trim(),
      theme: theme.trim(),
      content: content.trim(),
    }

    // Incluir bank apenas se foi preenchido
    if (bank.trim()) {
      updateData.bank = bank.trim()
    }

    updateMutation.mutate({
      id,
      data: updateData
    }, {
      onSuccess: () => {
        navigate({ to: '/redacoes' })
      }
    })
  }

  const handleSendForCorrection = () => {
    if (!title.trim() || !theme.trim() || !content.trim() || !bank.trim()) {
      toast.error('Preencha todos os campos antes de enviar para correção')
      return
    }

    // Verificar limite antes de enviar
    // Se é PRO, pode enviar ilimitado
    if (subscriptionStatus?.isPro) {
      // Primeiro salvar, depois enviar
      updateMutation.mutate({
        id,
        data: {
          title: title.trim(),
          theme: theme.trim(),
          content: content.trim(),
          bank: bank.trim(),
        }
      }, {
        onSuccess: () => {
          sendForCorrectionMutation.mutate(id, {
            onSuccess: () => {
              navigate({ to: '/redacoes' })
            }
          })
        }
      })
      return
    }

    // Se não é PRO, verificar uso
    const redacoesCount = subscriptionStatus?.usage?.redacoes || 0
    if (redacoesCount >= 1) {
      // Limite atingido, mostrar dialog informativo
      setLimitReachedDialogOpen(true)
      return
    }

    // Primeiro salvar, depois enviar
    updateMutation.mutate({
      id,
      data: {
        title: title.trim(),
        theme: theme.trim(),
        content: content.trim(),
        bank: bank.trim(),
      }
    }, {
      onSuccess: () => {
        sendForCorrectionMutation.mutate(id, {
          onSuccess: () => {
            navigate({ to: '/redacoes' })
          }
        })
      }
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl w-full mx-auto">
      <UpgradeModal 
        open={upgradeModalOpen} 
        onOpenChange={setUpgradeModalOpen}
        reason={upgradeReason}
      />
      
      {/* Dialog de limite atingido */}
      <Dialog open={limitReachedDialogOpen} onOpenChange={setLimitReachedDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-green-500" />
              Recurso PRO Disponível
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Você já enviou 1 redação para correção esta semana. No plano gratuito, você pode enviar apenas 1 redação por semana para correção.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Upgrade para PRO e desbloqueie:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Correções de redação ilimitadas</li>
                    <li>Simulados ilimitados</li>
                    <li>Acesso completo a todos os recursos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setLimitReachedDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Entendi
            </Button>
            <Button
              onClick={() => {
                setLimitReachedDialogOpen(false)
                createCheckoutSession()
              }}
              disabled={isCreatingCheckout}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Sparkles className="size-4 mr-2" />
              {isCreatingCheckout ? 'Redirecionando...' : 'Fazer Upgrade para PRO'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/redacoes' })}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Redação</h1>
          <p className="text-muted-foreground mt-1">Edite sua redação antes de enviar para correção</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Informações da Redação</CardTitle>
          <CardDescription>
            Preencha o título e o tema antes de começar a escrever
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ex: Redação sobre sustentabilidade"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Input
              id="theme"
              placeholder="Ex: Desafios da sustentabilidade ambiental no Brasil"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank">Banca</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Selecione uma banca" />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((bankOption) => (
                  <SelectItem key={bankOption} value={bankOption}>
                    {bankOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Redação</CardTitle>
          <CardDescription>
            Escreva sua redação seguindo o formato dissertativo-argumentativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Comece a escrever sua redação aqui..."
            className="min-h-[500px] font-sans text-base leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{content.length} caracteres</span>
            <span>Mínimo recomendado: 800 caracteres</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/redacoes' })}
        >
          Cancelar
        </Button>
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={updateMutation.isPending || sendForCorrectionMutation.isPending || !title.trim() || !theme.trim() || !content.trim()}
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
        {redacao.status === 'pending' && (
          <Button
            onClick={handleSendForCorrection}
            disabled={updateMutation.isPending || sendForCorrectionMutation.isPending || !title.trim() || !theme.trim() || !content.trim() || !bank.trim()}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            {sendForCorrectionMutation.isPending || updateMutation.isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="size-4 mr-2" />
                Salvar e Enviar para Correção
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
