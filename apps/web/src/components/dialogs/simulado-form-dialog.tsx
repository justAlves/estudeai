import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { UseFormReturn } from 'react-hook-form'
import type { SimuladoFormValues } from '@/lib/simulados-schema'

interface SimuladoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<SimuladoFormValues>
  onSubmit: (data: SimuladoFormValues) => void
}

const bancasSugeridas = [
  'ENEM', 'FUVEST', 'UNICAMP', 'UNESP', 'ITA', 'IME', 
  'UERJ', 'UFG', 'UFMG', 'USP'
]

const materiasSugeridas = [
  'Matemática', 'Português', 'Física', 'Química', 'Biologia',
  'História', 'Geografia', 'Filosofia', 'Sociologia', 'Literatura',
  'Inglês', 'Espanhol'
]

export function SimuladoFormDialog({ 
  open, 
  onOpenChange, 
  form, 
  onSubmit 
}: SimuladoFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Criar Novo Simulado</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados para gerar um novo simulado personalizado
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Quantidade de Questões */}
            <FormField
              control={form.control}
              name="quantidadeQuestoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Quantidade de Questões <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 30"
                      className="text-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Banca */}
            <FormField
              control={form.control}
              name="banca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Banca <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      list="bancas"
                      placeholder="Ex: ENEM, FUVEST, etc."
                      className="text-foreground"
                      {...field}
                    />
                  </FormControl>
                  <datalist id="bancas">
                    {bancasSugeridas.map((banca) => (
                      <option key={banca} value={banca} />
                    ))}
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Matéria */}
            <FormField
              control={form.control}
              name="materia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Matéria <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      list="materias"
                      placeholder="Ex: Matemática, Português, etc."
                      className="text-foreground"
                      {...field}
                    />
                  </FormControl>
                  <datalist id="materias">
                    {materiasSugeridas.map((materia) => (
                      <option key={materia} value={materia} />
                    ))}
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Título */}
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Título (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Simulado ENEM 2024 - Matemática"
                      className="text-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Descrição (opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o foco deste simulado..."
                      className="text-foreground min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Criar Simulado
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
