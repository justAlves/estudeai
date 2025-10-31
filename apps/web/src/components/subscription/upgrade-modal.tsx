import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sparkles, CheckCircle2, X } from 'lucide-react'
import { useCreateCheckoutSession } from '@/api/hooks/useSubscription'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason?: string
}

export function UpgradeModal({ open, onOpenChange, reason }: UpgradeModalProps) {
  const { mutate: createCheckoutSession, isPending } = useCreateCheckoutSession()

  const handleUpgrade = () => {
    createCheckoutSession()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Sparkles className="size-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Upgrade para PRO</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Desbloqueie recursos ilimitados
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {reason && (
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">{reason}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Com o plano PRO você terá:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">
                  Simulados ilimitados gerados por IA
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">
                  Correções ilimitadas de redação com IA
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">
                  Acesso a todos os recursos premium
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">
                  Suporte prioritário
                </span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="pt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border text-foreground hover:bg-muted"
          >
            <X className="size-4 mr-2" />
            Talvez depois
          </Button>
          <Button
            type="button"
            onClick={handleUpgrade}
            disabled={isPending}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            {isPending ? (
              <>
                <div className="size-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Redirecionando...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                Fazer Upgrade
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

