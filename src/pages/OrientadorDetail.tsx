import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Building2, 
  CheckCircle, 
  AlertTriangle,
  Users,
  BookOpen,
  Target,
  Award
} from 'lucide-react'
import { useAdvisors, useFilteredInternships } from '../hooks/useInternships'
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

export function OrientadorDetail() {
  const { orientadorId } = useParams<{ orientadorId: string }>()
  
  // Load data
  const { data: advisors } = useAdvisors()
  const { data: allInternships } = useFilteredInternships({})
  
  // Extract advisor name from route ID
  const advisorName = useMemo(() => {
    if (!orientadorId || !advisors) return ''
    const advisorNames = advisors.map(a => a.nome)
    return extractNameFromRouteIdImproved(orientadorId, advisorNames)
  }, [orientadorId, advisors])
  
  // Find advisor data
  const advisor = useMemo(() => {
    if (!advisors || !advisorName) return null
    return advisors.find(a => a.nome.toLowerCase() === advisorName.toLowerCase())
  }, [advisors, advisorName])
  
  // Get internships for this advisor
  const advisorInternships = useMemo(() => {
    if (!allInternships || !advisorName) return []
    return allInternships.filter(internship => 
      internship.orientadorAtual?.toLowerCase() === advisorName.toLowerCase() ||
      internship.orientadorAnterior?.toLowerCase() === advisorName.toLowerCase()
    )
  }, [allInternships, advisorName])
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (!advisorInternships.length) return null
    
    const active = advisorInternships.filter(intern => getInternshipStatus(intern) === 'ATIVO').length
    const concluded = advisorInternships.filter(intern => getInternshipStatus(intern) === 'CONCLUÍDO').length
    const interrupted = advisorInternships.filter(intern => getInternshipStatus(intern) === 'INTERROMPIDO').length
    const canceled = advisorInternships.filter(intern => getInternshipStatus(intern) === 'CANCELADO').length
    
    const companies = new Set(advisorInternships.map(intern => intern.empresa).filter(Boolean))
    const mandatory = advisorInternships.filter(intern => intern.obrigatorio === 'SIM').length
    const optional = advisorInternships.filter(intern => intern.obrigatorio === 'NÃO' || intern.obrigatorio === 'NAO').length
    
    return {
      total: advisorInternships.length,
      active,
      concluded,
      interrupted,
      canceled,
      companies: companies.size,
      mandatory,
      optional,
      successRate: concluded > 0 ? Math.round((concluded / (concluded + interrupted + canceled)) * 100) : 0
    }
  }, [advisorInternships])

  if (!advisor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/orientadores" className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </div>
        <div className="text-center py-12">
          <User className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Orientador não encontrado</h2>
          <p className="text-text-muted">O orientador solicitado não foi encontrado no sistema.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/orientadores" className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{advisor.nome}</h1>
            <p className="text-text-muted">Orientador de Estágios</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-spotify-green bg-opacity-20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-spotify-green" />
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
                <Building2 className="h-6 w-6 text-spotify-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Empresas</p>
                <p className="text-2xl font-bold text-text-primary">{stats.companies}</p>
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
                <p className="text-sm font-medium text-text-muted">Obrigatórios</p>
                <p className="text-2xl font-bold text-text-primary">{stats.mandatory}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estágios Supervisionados */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Estágios Supervisionados</h2>
          <span className="text-sm text-text-muted">{advisorInternships.length} estágios</span>
        </div>
        
        {advisorInternships.length > 0 ? (
          <div className="overflow-x-auto">
            <DataTable
              data={advisorInternships}
              columns={[
                { 
                  key: 'nome', 
                  header: 'Estagiário', 
                  sortable: true,
                  width: '25%'
                },
                { 
                  key: 'empresa', 
                  header: 'Empresa', 
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
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">Nenhum estágio encontrado para este orientador.</p>
          </div>
        )}
      </div>
    </div>
  )
}