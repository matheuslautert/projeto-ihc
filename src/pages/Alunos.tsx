import React, { useState } from 'react'
import { Plus, Search, User, Building2 } from 'lucide-react'
import { useInterns, useFilteredInternships } from '../hooks/useInternships'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { InternshipFilters, InternshipStatus } from '../types/internship'
import { generateRouteId } from '../lib/utils'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '../hooks/useAuth'

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
  const { data: interns, isLoading: isLoadingInterns, isError: isErrorInterns, error: errorInterns } = useInterns()

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
  const { data: filteredInternships, isLoading: isLoadingFiltered, isError: isErrorFiltered, error: errorFiltered } = useFilteredInternships(filters)

  // Transform internships to intern format for display
  const displayData = React.useMemo(() => {
    if (!filteredInternships) return []
    
    return filteredInternships
  }, [filteredInternships])

  const { user } = useAuth()

  // Filtragem por papel
  const filteredByRole = React.useMemo(() => {
    if (!filteredInternships) return []
    if (!user) return []
    if (user.tipo === 'articulador') return filteredInternships
    if (user.tipo === 'aluno') {
      return filteredInternships.filter(i => i.nome && i.nome.trim().toLowerCase() === user.nome.trim().toLowerCase())
    }
    if (user.tipo === 'orientador') {
      return filteredInternships.filter(i => {
        const orientadores = [i.orientadorAtual, i.orientadorAnterior].map(o => o && o.trim().toLowerCase())
        return orientadores.includes(user.nome.trim().toLowerCase())
      })
    }
    return []
  }, [filteredInternships, user])

  // Exemplo de login para testes
  const exemplosLogin = [
    { papel: 'Aluno', login: 'fflamengo', senha: 'engo', nome: 'Franciele Flamengo' },
    { papel: 'Orientador', login: 'pprofessor', senha: 'sor', nome: 'Professor 1' },
    { papel: 'Articulador', login: 'articulador', senha: 'ador', nome: 'Articulador' },
  ]

  if (isLoadingInterns || isLoadingFiltered) {
    return <div className="text-center text-text-primary mt-10">Carregando estagiários...</div>
  }
  if (isErrorInterns || isErrorFiltered) {
    return <div className="text-center text-red-500 mt-10">Erro ao carregar estagiários: {(errorInterns?.message || errorFiltered?.message || 'Erro desconhecido')}</div>
  }

  return (
    <div className="space-y-6">
      {/* Exemplos de login */}
      <div className="card bg-blue-900/30 border-l-4 border-blue-400 mb-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Exemplos de Login para Teste</h3>
        <ul className="list-disc pl-6 text-blue-200">
          {exemplosLogin.map((ex, idx) => (
            <li key={idx}><b>{ex.papel}:</b> login <span className="font-mono">{ex.login}</span> | senha <span className="font-mono">{ex.senha}</span> | nome <span className="font-mono">{ex.nome}</span></li>
          ))}
        </ul>
      </div>
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
      {filteredByRole && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                <User className="h-6 w-6 text-spotify-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total de Estagiários</p>
                <p className="text-2xl font-bold text-text-primary">{filteredByRole.length}</p>
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
                  {filteredByRole.filter(intern => getInternshipStatus(intern) === 'ATIVO').length}
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
                  {new Set(filteredByRole.map(intern => intern.empresa).filter(Boolean)).size}
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
        data={filteredByRole} 
        columns={[
          { 
            key: 'nome', 
            header: 'Estagiário', 
            sortable: true,
            render: (value: any) => (
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
            render: (value: any) => (
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
            render: (value: any) => (
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