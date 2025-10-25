import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetSimulados } from '@/api/hooks/useSimulados'
import type { Simulado } from '@/types/simulados'
import type { SimuladoFormValues } from '@/lib/simulados-schema'
import { simuladoFormSchema } from '@/lib/simulados-schema'
import { SimuladoCard } from '@/components/simulados/simulado-card'
import { SimuladoCardSkeleton } from '@/components/simulados/simulado-card-skeleton'
import { SimuladoFormDialog } from '@/components/dialogs/simulado-form-dialog'
import { useCreateSimulado } from '@/api/hooks/useSimulados'

export const Route = createFileRoute('/_app/simulados')({
  component: RouteComponent,
})

function RouteComponent() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: simulados, isLoading } = useGetSimulados()
  const { mutate: createSimulado } = useCreateSimulado()

  const form = useForm<SimuladoFormValues>({
    resolver: zodResolver(simuladoFormSchema),
    defaultValues: {
      quantidadeQuestoes: '',
      banca: '',
      materia: '',
      titulo: '',
      descricao: '',
    },
  })

  const onSubmit = (data: SimuladoFormValues) => {
    const formattedData = {
      ...data,
      quantidadeQuestoes: parseInt(data.quantidadeQuestoes, 10)
    }
    
    createSimulado({
      count: formattedData.quantidadeQuestoes,
      subject: formattedData.materia,
      bank: formattedData.banca,
      title: formattedData.titulo,
      description: formattedData.descricao,
    })
    setDialogOpen(false)
    form.reset()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Simulados</h1>
          <p className="text-neutral-400">Gerencie e realize seus simulados</p>
        </div>
        
        <SimuladoFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          form={form}
          onSubmit={onSubmit}
        />
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SimuladoCardSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            {simulados?.map((simulado: Simulado) => (
              <SimuladoCard key={simulado.id} simulado={simulado} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}