import React, { useState } from 'react'
import { Search, Users, BookOpen, CheckCircle } from 'lucide-react'
import { useAdvisors } from '../hooks/useInternships'
import { DataTable } from '../components/ui/DataTable'
import { generateRouteId } from '../lib/utils'
import { Link } from 'react-router-dom'

export function Orientadores() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Load data
  const { data: advisors, isLoading: isLoadingAdvisors } = useAdvisors()

  // Transform advisors data for display
  const displayData = React.useMemo(() => {
    if (!advisors) return []
    
    return advisors.map(advisor => ({
      nome: advisor.nome,
      totalInternships: advisor.totalInternships,
      activeInternships: advisor.activeInternships,
      concludedInternships: advisor.concludedInternships,
      // Add other fields that might be needed for display
      orientadorAtual: advisor.nome,
      orientadorAnterior: advisor.nome,
      empresa: '',
      tceEntregue: '',
      conclusaoEstagio: '',
      dataConclusao: '',
      motivoConclusao: '',
      prazoMaximo: '',
      fpe: '',
      inicioTce: '',
      terminoPrevisto: '',
      relatorioParcial1: { limite: '', entregue: '', avaliado: '' },
      relatorioParcial2: { limite: '', entregue: '', avaliado: '' },
      relatorioParcial3: { limite: '', entregue: '', avaliado: '' },
      relatorioFinal: { limite: '', entregue: '', avaliado: '' },
      prorrogacoes: [],
      supervisorEmpresa: '',
      obrigatorio: undefined,
    }))
  }, [advisors])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Orientadores</h1>
          <p className="text-text-muted">
            Lista de orientadores e seus estágios supervisionados
          </p>
        </div>
        {/* Botão de novo orientador removido */}
      </div>

      {/* Statistics */}
      {advisors && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                <Users className="h-6 w-6 text-spotify-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total de Orientadores</p>
                <p className="text-2xl font-bold text-text-primary">{advisors.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-green bg-opacity-20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-spotify-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Estágios Ativos</p>
                <p className="text-2xl font-bold text-text-primary">
                  {advisors.reduce((sum, advisor) => sum + advisor.activeInternships, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-purple bg-opacity-20 rounded-lg">
                <BookOpen className="h-6 w-6 text-spotify-purple" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total de Estágios</p>
                <p className="text-2xl font-bold text-text-primary">
                  {advisors.reduce((sum, advisor) => sum + advisor.totalInternships, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium text-text-muted mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
              <input
                id="search-filter"
                type="text"
                placeholder="Nome do orientador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 pr-3"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-text-muted mb-2">
              Status dos Estágios
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">Todos</option>
              <option value="ATIVO">Ativos</option>
              <option value="CONCLUÍDO">Concluídos</option>
              <option value="INTERROMPIDO">Interrompidos</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable 
        data={displayData} 
        columns={[
          { 
            key: 'nome', 
            header: 'Orientador', 
            sortable: true,
            render: (value: any) => (
              <Link 
                to={`/orientador/${generateRouteId(value)}`}
                className="text-spotify-green hover:text-spotify-green-dark font-medium transition-colors duration-200"
              >
                {value}
              </Link>
            )
          },
          { key: 'totalInternships', header: 'Total de Estágios', sortable: true },
          { key: 'activeInternships', header: 'Estágios Ativos', sortable: true },
          { key: 'concludedInternships', header: 'Estágios Concluídos', sortable: true },
        ]}
        title="Orientadores"
        searchable
        exportable
        loading={isLoadingAdvisors}
      />
    </div>
  )
} 