import { useState } from 'react'
import { 
  Users, 
  GraduationCap, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Target, 
  RefreshCw 
} from 'lucide-react'
import { useFilteredInternships, useInternshipData, useInternshipStats } from '../hooks/useInternships'
import { DataTable } from '../components/ui/DataTable'

import { InternshipFilters } from '../types/internship'
import { generateRouteId } from '../lib/utils'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '../hooks/useAuth'
import { DashboardCharts } from '../components/charts/DashboardCharts'
import { useMemo } from 'react'
import { getInternshipStatus } from './Alunos'


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

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ativos' | 'concluidos'>('overview')
  const { user } = useAuth()
  
  // Load data
  const { data: internshipData, isLoading: isLoadingData } = useInternshipData()
  const { data: stats, isLoading: isLoadingStats } = useInternshipStats()
  
  // Filter active internships
  const activeFilters: InternshipFilters = { status: ['ATIVO'] }
  const { data: activeInternships } = useFilteredInternships(activeFilters)
  
  // Filter concluded internships
  const concludedFilters: InternshipFilters = { status: ['CONCLUÍDO'] }
  const { data: concludedInternships } = useFilteredInternships(concludedFilters)

  const isLoading = isLoadingData || isLoadingStats

  // Carregar todos os estágios para os gráficos
  const allInternships = internshipData?.internships || []
  // Detectar se é orientador
  const isAdvisor = user?.tipo === 'orientador'
  const advisorName = isAdvisor ? user?.nome : undefined

  // Análise inteligente dos dados
  const smartAnalysis = useMemo(() => {
    if (!internshipData) return null
    const { internships } = internshipData
    const inconsistencies: string[] = []

    // Empresas com nomes parecidos (case-insensitive)
    const companyNames = internships.map(i => i.empresa?.trim()).filter(Boolean) as string[]
    const companyNameMap: Record<string, string[]> = {}
    companyNames.forEach(name => {
      const key = name.toLowerCase()
      if (!companyNameMap[key]) companyNameMap[key] = []
      companyNameMap[key].push(name)
    })
    Object.values(companyNameMap).forEach(variations => {
      const unique = Array.from(new Set(variations))
      if (unique.length > 1) {
        inconsistencies.push(`Empresa com nomes parecidos: ${unique.join(', ')}`)
      }
    })

    // Estágios sem empresa
    const noCompany = internships.filter(i => !i.empresa || i.empresa.trim() === '')
    if (noCompany.length > 0) {
      inconsistencies.push(`${noCompany.length} estágio(s) sem empresa informada.`)
    }

    // Estágios sem orientador
    const noAdvisor = internships.filter(i => (!i.orientadorAtual && !i.orientadorAnterior))
    if (noAdvisor.length > 0) {
      inconsistencies.push(`${noAdvisor.length} estágio(s) sem orientador informado.`)
    }

    // Status inválidos
    const validStatus = ['ATIVO', 'CONCLUÍDO', 'INTERROMPIDO', 'CANCELADO']
    const invalidStatus = internships.filter(i => !validStatus.includes(getInternshipStatus(i)))
    if (invalidStatus.length > 0) {
      inconsistencies.push(`${invalidStatus.length} estágio(s) com status inválido.`)
    }

    return inconsistencies
  }, [internshipData])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 spotify-loading rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 spotify-loading rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard de Estágios</h1>
          <p className="text-text-muted">
            Visão geral dos estágios da Engenharia de Telecomunicações
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 text-text-muted" />
          <span className="text-sm text-text-muted">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                <Users className="h-6 w-6 text-spotify-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total de Estágios</p>
                <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
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
                <p className="text-2xl font-bold text-text-primary">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                <Target className="h-6 w-6 text-spotify-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Concluídos</p>
                <p className="text-2xl font-bold text-text-primary">{stats.concluded}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-purple bg-opacity-20 rounded-lg">
                <GraduationCap className="h-6 w-6 text-spotify-purple" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Obrigatórios</p>
                <p className="text-2xl font-bold text-text-primary">{stats.mandatory}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-yellow bg-opacity-20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-spotify-yellow" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Interrompidos</p>
                <p className="text-2xl font-bold text-text-primary">{stats.interrupted}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-red bg-opacity-20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-spotify-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Cancelados</p>
                <p className="text-2xl font-bold text-text-primary">{stats.canceled}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-orange bg-opacity-20 rounded-lg">
                <Clock className="h-6 w-6 text-spotify-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Opcionais</p>
                <p className="text-2xl font-bold text-text-primary">{stats.optional}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Análise inteligente dos dados */}
      {smartAnalysis && smartAnalysis.length > 0 && (
        <div className="card bg-yellow-900/30 border-l-4 border-yellow-400 mb-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Análise Inteligente dos Dados</h3>
          <ul className="list-disc pl-6 text-yellow-200">
            {smartAnalysis.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Gráficos e análises */}
      <DashboardCharts internships={allInternships} isAdvisor={isAdvisor} advisorName={advisorName} />

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-border-primary">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'overview'
                  ? 'border-spotify-green text-spotify-green'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-secondary'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('ativos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'ativos'
                  ? 'border-spotify-green text-spotify-green'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-secondary'
              }`}
            >
              Estágios Ativos
            </button>
            <button
              onClick={() => setActiveTab('concluidos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'concluidos'
                  ? 'border-spotify-green text-spotify-green'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-secondary'
              }`}
            >
              Estágios Concluídos
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Resumo dos Estágios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card-minimal">
                    <h4 className="font-medium text-text-primary mb-2">Estágios Ativos</h4>
                    <p className="text-3xl font-bold text-spotify-green">{stats?.active || 0}</p>
                    <p className="text-sm text-text-muted mt-1">em andamento</p>
                  </div>
                  <div className="card-minimal">
                    <h4 className="font-medium text-text-primary mb-2">Estágios Concluídos</h4>
                    <p className="text-3xl font-bold text-spotify-blue">{stats?.concluded || 0}</p>
                    <p className="text-sm text-text-muted mt-1">finalizados</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ativos' && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Estágios Ativos</h3>
              {activeInternships && activeInternships.length > 0 ? (
                <div className="overflow-x-auto">
                  <DataTable
                    data={activeInternships}
                    columns={[
                      { 
                        key: 'nome', 
                        header: 'Estagiário', 
                        sortable: true,
                        width: '30%',
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
                        width: '25%',
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
                        width: '30%',
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
                        key: 'terminoPrevisto', 
                        header: 'Término Previsto', 
                        render: (value: any) => formatDate(value),
                        sortable: true,
                        width: '15%'
                      }
                    ]}
                    title="Estágios Ativos"
                    searchable
                    exportable
                    itemsPerPage={10}
                  />
                </div>
              ) : (
                <p className="text-text-muted text-center py-8">Nenhum estágio ativo encontrado.</p>
              )}
            </div>
          )}

          {activeTab === 'concluidos' && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Estágios Concluídos</h3>
              {concludedInternships && concludedInternships.length > 0 ? (
                <div className="overflow-x-auto">
                  <DataTable
                    data={concludedInternships}
                    columns={[
                      { 
                        key: 'nome', 
                        header: 'Estagiário', 
                        sortable: true,
                        width: '25%',
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
                        width: '25%',
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
                        width: '25%',
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
                        key: 'dataConclusao', 
                        header: 'Data de Conclusão', 
                        render: (value: any) => formatDate(value),
                        sortable: true,
                        width: '15%'
                      },
                      { 
                        key: 'motivoConclusao', 
                        header: 'Motivo da Conclusão', 
                        sortable: true,
                        width: '10%'
                      }
                    ]}
                    title="Estágios Concluídos"
                    searchable
                    exportable
                    itemsPerPage={10}
                  />
                </div>
              ) : (
                <p className="text-text-muted text-center py-8">Nenhum estágio concluído encontrado.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 