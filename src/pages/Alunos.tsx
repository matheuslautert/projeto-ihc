import React, { useState } from 'react'
import { Plus, Search, Filter, User, Mail, Phone, MapPin, GraduationCap, Users, BookOpen, CheckCircle, AlertTriangle, Clock, Building2 } from 'lucide-react'
import { useInterns, useFilteredInternships } from '../hooks/useInternships'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Intern, InternshipFilters, InternshipStatus } from '../types/internship'
import { generateRouteId } from '../lib/utils'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Function to format date
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr.trim() === '' || dateStr === '#VALUE!') {
    return '-'
  }
  
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return format(date, 'dd/MM/yyyy', { locale: ptBR })
    }
  } catch {
    // If can't parse, return as is
  }
  
  return dateStr
}

// Function to determine internship status
const getInternshipStatus = (internship: any): InternshipStatus => {
  if (internship.conclusaoEstagio && internship.conclusaoEstagio.trim()) {
    const motivo = internship.motivoConclusao?.toLowerCase() || ''
    if (motivo.includes('contratação')) return 'CONCLUÍDO'
    if (motivo.includes('desistência')) return 'CANCELADO'
    if (motivo.includes('demissão')) return 'INTERROMPIDO'
    if (motivo.includes('encerramento')) return 'CONCLUÍDO'
    if (motivo.includes('interrupção')) return 'INTERROMPIDO'
    if (motivo.includes('cancelamento')) return 'CANCELADO'
    return 'CONCLUÍDO'
  }
  return 'ATIVO'
}

export function Alunos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [obrigatorioFilter, setObrigatorioFilter] = useState<string>('all')

  // Load data
  const { data: interns, isLoading: isLoadingInterns } = useInterns()

  // Create filters
  const filters: InternshipFilters = React.useMemo(() => {
    const filter: InternshipFilters = {}
    
    if (searchTerm) {
      filter.search = searchTerm
    }
    
    if (statusFilter !== 'all') {
      filter.status = [statusFilter as any]
    }
    
    if (obrigatorioFilter !== 'all') {
      filter.type = obrigatorioFilter === 'obrigatorio' ? ['SIM'] : ['NÃO', 'NAO']
    }
    
    return filter
  }, [searchTerm, statusFilter, obrigatorioFilter])

  // Get filtered data
  const { data: filteredInternships } = useFilteredInternships(filters)

  // Transform internships to intern format for display
  const displayData = React.useMemo(() => {
    if (!filteredInternships) return []
    
    return filteredInternships
  }, [filteredInternships])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Estagiários</h1>
          <p className="text-text-muted">
            Lista completa de estagiários e seus estágios
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Novo Estagiário
        </button>
      </div>

      {/* Statistics */}
      {filteredInternships && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                <User className="h-6 w-6 text-spotify-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total de Estagiários</p>
                <p className="text-2xl font-bold text-text-primary">{filteredInternships.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-green bg-opacity-20 rounded-lg">
                <User className="h-6 w-6 text-spotify-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Estágios Ativos</p>
                <p className="text-2xl font-bold text-text-primary">
                  {filteredInternships.filter(intern => getInternshipStatus(intern) === 'ATIVO').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-purple bg-opacity-20 rounded-lg">
                <Building2 className="h-6 w-6 text-spotify-purple" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Empresas Diferentes</p>
                <p className="text-2xl font-bold text-text-primary">
                  {new Set(filteredInternships.map(intern => intern.empresa).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Nome, empresa ou orientador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 pr-3"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-text-muted mb-2">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">Todos</option>
              <option value="ATIVO">Ativo</option>
              <option value="CONCLUÍDO">Concluído</option>
              <option value="INTERROMPIDO">Interrompido</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          {/* Mandatory Filter */}
          <div>
            <label htmlFor="obrigatorio-filter" className="block text-sm font-medium text-text-muted mb-2">
              Tipo
            </label>
            <select
              id="obrigatorio-filter"
              value={obrigatorioFilter}
              onChange={(e) => setObrigatorioFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">Todos</option>
              <option value="obrigatorio">Obrigatório</option>
              <option value="opcional">Opcional</option>
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
            header: 'Estagiário', 
            sortable: true,
            render: (value: any, item: any) => (
              <Link 
                to={`/aluno/${generateRouteId(value)}`}
                className="text-spotify-green hover:text-spotify-green-dark font-medium transition-colors duration-200"
              >
                {value}
              </Link>
            )
          },
          { 
            key: 'empresa', 
            header: 'Empresa', 
            sortable: true,
            render: (value: any, item: any) => (
              <Link 
                to={`/empresa/${generateRouteId(value)}`}
                className="text-spotify-green hover:text-spotify-green-dark font-medium transition-colors duration-200"
              >
                {value}
              </Link>
            )
          },
          { 
            key: 'orientadorAtual', 
            header: 'Orientador', 
            sortable: true,
            render: (value: any, item: any) => (
              <Link 
                to={`/orientador/${generateRouteId(value)}`}
                className="text-spotify-green hover:text-spotify-green-dark font-medium transition-colors duration-200"
              >
                {value}
              </Link>
            )
          },
          { 
            key: 'status', 
            header: 'Status', 
            render: (_: any, item: any) => (
              <StatusBadge status={getInternshipStatus(item)} />
            )
          },
          { 
            key: 'obrigatorio', 
            header: 'Tipo', 
            render: (value: any) => value === 'SIM' ? 'Obrigatório' : 'Opcional',
            sortable: true 
          },
          { 
            key: 'inicioTce', 
            header: 'Início', 
            render: (value: any) => formatDate(value),
            sortable: true 
          },
        ]}
        title="Estagiários"
        searchable
        exportable
        loading={isLoadingInterns}
      />
    </div>
  )
} 