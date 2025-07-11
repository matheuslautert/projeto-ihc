import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Award
} from 'lucide-react'
import { useCompanies, useFilteredInternships } from '../hooks/useInternships'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { extractNameFromRouteIdImproved } from '../lib/utils'
import { InternshipStatus } from '../types/internship'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

export function EmpresaDetail() {
  const { empresaId } = useParams<{ empresaId: string }>()
  
  // Load data
  const { data: companies } = useCompanies()
  const { data: allInternships } = useFilteredInternships({})
  
  // Extract company name from route ID
  const companyName = useMemo(() => {
    if (!empresaId || !companies) return ''
    const companyNames = companies.map(c => c.nome)
    return extractNameFromRouteIdImproved(empresaId, companyNames)
  }, [empresaId, companies])
  
  // Find company data
  const company = useMemo(() => {
    if (!companies || !companyName) return null
    return companies.find(c => c.nome.toLowerCase() === companyName.toLowerCase())
  }, [companies, companyName])
  
  // Get internships for this company
  const companyInternships = useMemo(() => {
    if (!allInternships || !companyName) return []
    return allInternships.filter(internship => 
      internship.empresa?.toLowerCase() === companyName.toLowerCase()
    )
  }, [allInternships, companyName])
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (!companyInternships.length) return null
    
    const active = companyInternships.filter(intern => getInternshipStatus(intern) === 'ATIVO').length
    const concluded = companyInternships.filter(intern => getInternshipStatus(intern) === 'CONCLUÍDO').length
    const interrupted = companyInternships.filter(intern => getInternshipStatus(intern) === 'INTERROMPIDO').length
    const canceled = companyInternships.filter(intern => getInternshipStatus(intern) === 'CANCELADO').length
    
    const advisors = new Set(companyInternships.map(intern => intern.orientadorAtual).filter(Boolean))
    const mandatory = companyInternships.filter(intern => intern.obrigatorio === 'SIM').length
    const optional = companyInternships.filter(intern => intern.obrigatorio === 'NÃO' || intern.obrigatorio === 'NAO').length
    
    // Calculate average internship duration (for concluded ones)
    const concludedInternships = companyInternships.filter(intern => getInternshipStatus(intern) === 'CONCLUÍDO')
    const avgDuration = concludedInternships.length > 0 ? 
      concludedInternships.reduce((sum, intern) => {
        const start = intern.inicioTce ? new Date(intern.inicioTce) : null
        const end = intern.dataConclusao ? new Date(intern.dataConclusao) : null
        if (start && end) {
          return sum + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        }
        return sum
      }, 0) / concludedInternships.length : 0
    
    return {
      total: companyInternships.length,
      active,
      concluded,
      interrupted,
      canceled,
      advisors: advisors.size,
      mandatory,
      optional,
      successRate: concluded > 0 ? Math.round((concluded / (concluded + interrupted + canceled)) * 100) : 0,
      avgDuration: Math.round(avgDuration)
    }
  }, [companyInternships])

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/vagas" className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </div>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Empresa não encontrada</h2>
          <p className="text-text-muted">A empresa solicitada não foi encontrada no sistema.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/vagas" className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{company.nome}</h1>
            <p className="text-text-muted">Empresa Parceira</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
            <Building2 className="h-6 w-6 text-spotify-blue" />
          </div>
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
              <div className="p-2 bg-spotify-purple bg-opacity-20 rounded-lg">
                <Award className="h-6 w-6 text-spotify-purple" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-text-primary">{stats.successRate}%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-orange bg-opacity-20 rounded-lg">
                <Target className="h-6 w-6 text-spotify-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Duração Média</p>
                <p className="text-2xl font-bold text-text-primary">{stats.avgDuration} dias</p>
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
              <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                <Target className="h-6 w-6 text-spotify-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Orientadores</p>
                <p className="text-2xl font-bold text-text-primary">{stats.advisors}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estágios na Empresa */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Estágios na Empresa</h2>
          <span className="text-sm text-text-muted">{companyInternships.length} estágios</span>
        </div>
        
        {companyInternships.length > 0 ? (
          <div className="overflow-x-auto">
            <DataTable
              data={companyInternships}
              columns={[
                { 
                  key: 'nome', 
                  header: 'Estagiário', 
                  sortable: true,
                  width: '25%'
                },
                { 
                  key: 'orientadorAtual', 
                  header: 'Orientador', 
                  sortable: true,
                  width: '25%'
                },
                { 
                  key: 'status', 
                  header: 'Status', 
                  render: (_: any, item: any) => (
                    <StatusBadge status={getInternshipStatus(item)} />
                  ),
                  width: '15%'
                },
                { 
                  key: 'obrigatorio', 
                  header: 'Tipo', 
                  render: (value: any) => value === 'SIM' ? 'Obrigatório' : 'Opcional',
                  sortable: true,
                  width: '15%'
                },
                { 
                  key: 'terminoPrevisto', 
                  header: 'Término Previsto', 
                  render: (value: any) => formatDate(value),
                  sortable: true,
                  width: '20%'
                }
              ]}
              searchable
              exportable
              itemsPerPage={10}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">Nenhum estágio encontrado para esta empresa.</p>
          </div>
        )}
      </div>
    </div>
  )
}
