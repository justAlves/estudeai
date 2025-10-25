import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from 'lucide-react'
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
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Simulado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-green-800">
        <DialogHeader>
          <DialogTitle className="text-white">Criar Novo Simulado</DialogTitle>
          <DialogDescription className="text-neutral-400">
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
                  <FormLabel className="text-white">
                    Quantidade de Questões <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 30"
                      className="text-white"
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
                  <FormLabel className="text-white">
                    Banca <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      list="bancas"
                      placeholder="Ex: ENEM, FUVEST, etc."
                      className="text-white"
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
                  <FormLabel className="text-white">
                    Matéria <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      list="materias"
                      placeholder="Ex: Matemática, Português, etc."
                      className="text-white"
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
                  <FormLabel className="text-white">
                    Título (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Simulado ENEM 2024 - Matemática"
                      className="text-white"
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
                  <FormLabel className="text-white">
                    Descrição (opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o foco deste simulado..."
                      className="text-white min-h-[100px]"
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
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
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
