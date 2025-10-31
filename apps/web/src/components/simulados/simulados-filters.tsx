import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import type { Simulado } from '@/types/simulados'
import { getSimuladoStatus } from '@/lib/simulados-helpers'

interface SimuladosFiltersProps {
  simulados: Simulado[]
  onFilteredSimulados: (filtered: Simulado[]) => void
}

interface FilterState {
  search: string
  materia: string
  banca: string
  status: string
}

export function SimuladosFilters({ simulados, onFilteredSimulados }: SimuladosFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    materia: '',
    banca: '',
    status: ''
  })

  // Extrair valores únicos para os filtros
  const materias = Array.from(new Set(simulados.map(s => s.subject).filter(Boolean)))
  const bancas = Array.from(new Set(simulados.map(s => s.bank).filter(Boolean)))
  const statusOptions = [
    { value: 'pending', label: 'Gerando' },
    { value: 'waiting_response', label: 'Aguardando Resposta' },
    { value: 'answered', label: 'Respondido' }
  ]

  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...simulados]

    // Filtro de busca por texto
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(simulado => 
        simulado.title.toLowerCase().includes(searchLower) ||
        simulado.description.toLowerCase().includes(searchLower) ||
        simulado.subject.toLowerCase().includes(searchLower) ||
        simulado.bank.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por matéria
    if (newFilters.materia) {
      filtered = filtered.filter(simulado => simulado.subject === newFilters.materia)
    }

    // Filtro por banca
    if (newFilters.banca) {
      filtered = filtered.filter(simulado => simulado.bank === newFilters.banca)
    }

    // Filtro por status
    if (newFilters.status) {
      filtered = filtered.filter(simulado => {
        const status = getSimuladoStatus(simulado)
        return status === newFilters.status
      })
    }

    onFilteredSimulados(filtered)
  }

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      materia: '',
      banca: '',
      status: ''
    }
    setFilters(clearedFilters)
    applyFilters(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Buscar simulados por título, descrição, matéria ou banca..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10 h-11"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('search', '')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Filtros em linha */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Filtro por Matéria */}
        <div className="flex-1 min-w-[150px]">
          <Select
            value={filters.materia || undefined}
            onValueChange={(value) => handleFilterChange('materia', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as matérias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined as unknown as string}>Todas as matérias</SelectItem>
              {materias.map((materia) => (
                <SelectItem key={materia} value={materia}>
                  {materia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Banca */}
        <div className="flex-1 min-w-[150px]">
          <Select
            value={filters.banca || undefined}
            onValueChange={(value) => handleFilterChange('banca', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as bancas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined as unknown as string}>Todas as bancas</SelectItem>
              {bancas.map((banca) => (
                <SelectItem key={banca} value={banca}>
                  {banca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Status */}
        <div className="flex-1 min-w-[150px]">
          <Select
            value={filters.status || undefined}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined as unknown as string}>Todos os status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão limpar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="default"
            onClick={clearFilters}
            className="shrink-0"
          >
            <X className="size-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {filters.materia && (
            <Badge variant="outline" className="border-green-500/30 text-green-600">
              Matéria: {filters.materia}
            </Badge>
          )}
          {filters.banca && (
            <Badge variant="outline" className="border-green-500/30 text-green-600">
              Banca: {filters.banca}
            </Badge>
          )}
          {filters.status && (
            <Badge variant="outline" className="border-green-500/30 text-green-600">
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
