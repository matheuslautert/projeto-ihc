import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Internship } from '../../types/internship'
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DashboardChartsProps {
  internships: Internship[]
  isAdvisor?: boolean
  advisorName?: string
}

// Cores para os gráficos (não utilizadas no momento)
// const COLORS = ['#1DB954', '#1E3A8A', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

// Função para determinar status do estágio
const getInternshipStatus = (internship: Internship): string => {
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

// Função para formatar data
const formatDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr || dateStr.trim() === '' || dateStr === '#VALUE!') {
    return null
  }
  
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date
    }
  } catch {
    // If can't parse, return null
  }
  
  return null
}

export function DashboardCharts({ internships, isAdvisor = false, advisorName }: DashboardChartsProps) {
  // Dados para gráfico de pizza - Status dos estágios
  const statusData = React.useMemo(() => {
    const statusCount = internships.reduce((acc, internship) => {
      const status = getInternshipStatus(internship)
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'ATIVO' ? '#1DB954' : 
             status === 'CONCLUÍDO' ? '#1E3A8A' : 
             status === 'INTERROMPIDO' ? '#F59E0B' : '#EF4444'
    }))
  }, [internships])

  // Dados para gráfico de barras - Empresas
  const companyData = React.useMemo(() => {
    const companyCount = internships.reduce((acc, internship) => {
      if (internship.empresa) {
        acc[internship.empresa] = (acc[internship.empresa] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return Object.entries(companyCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([company, count]) => ({
        name: company.length > 20 ? company.substring(0, 20) + '...' : company,
        value: count,
        fullName: company
      }))
  }, [internships])

  // Dados para gráfico de linha - Evolução temporal
  const timelineData = React.useMemo(() => {
    const now = new Date()
    const sixMonthsAgo = subMonths(now, 6)
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now })
    
    return months.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthInternships = internships.filter(internship => {
        const startDate = formatDate(internship.inicioTce)
        return startDate && startDate >= monthStart && startDate <= monthEnd
      })
      
      return {
        month: format(month, 'MMM/yy', { locale: ptBR }),
        ativos: monthInternships.filter(i => getInternshipStatus(i) === 'ATIVO').length,
        concluidos: monthInternships.filter(i => getInternshipStatus(i) === 'CONCLUÍDO').length,
        interrompidos: monthInternships.filter(i => getInternshipStatus(i) === 'INTERROMPIDO').length,
        cancelados: monthInternships.filter(i => getInternshipStatus(i) === 'CANCELADO').length,
      }
    })
  }, [internships])

  // Dados para gráfico de área - Tipo de estágio (Obrigatório vs Opcional)
  const typeData = React.useMemo(() => {
    const mandatory = internships.filter(i => i.obrigatorio === 'SIM').length
    const optional = internships.filter(i => i.obrigatorio === 'NÃO' || i.obrigatorio === 'NAO').length
    
    return [
      { name: 'Obrigatório', value: mandatory, color: '#1DB954' },
      { name: 'Opcional', value: optional, color: '#8B5CF6' }
    ]
  }, [internships])

  // Dados específicos do orientador
  const advisorData = React.useMemo(() => {
    if (!isAdvisor || !advisorName) return null
    
    const advisorInternships = internships.filter(internship => 
      internship.orientadorAtual?.toLowerCase() === advisorName.toLowerCase() ||
      internship.orientadorAnterior?.toLowerCase() === advisorName.toLowerCase()
    )
    
    const companies = new Set(advisorInternships.map(intern => intern.empresa).filter(Boolean))
    const active = advisorInternships.filter(intern => getInternshipStatus(intern) === 'ATIVO').length
    const concluded = advisorInternships.filter(intern => getInternshipStatus(intern) === 'CONCLUÍDO').length
    const interrupted = advisorInternships.filter(intern => getInternshipStatus(intern) === 'INTERROMPIDO').length
    const canceled = advisorInternships.filter(intern => getInternshipStatus(intern) === 'CANCELADO').length
    
    return {
      total: advisorInternships.length,
      companies: companies.size,
      active,
      concluded,
      interrupted,
      canceled,
      successRate: concluded > 0 ? Math.round((concluded / (concluded + interrupted + canceled)) * 100) : 0
    }
  }, [internships, isAdvisor, advisorName])

  return (
    <div className="space-y-8">
      {/* Gráficos Gerais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Pizza - Status dos Estágios */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Status dos Estágios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras - Top Empresas */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Top 10 Empresas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1DB954" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Linha - Evolução Temporal */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Evolução dos Estágios (Últimos 6 Meses)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ativos" stroke="#1DB954" strokeWidth={2} name="Ativos" />
            <Line type="monotone" dataKey="concluidos" stroke="#1E3A8A" strokeWidth={2} name="Concluídos" />
            <Line type="monotone" dataKey="interrompidos" stroke="#F59E0B" strokeWidth={2} name="Interrompidos" />
            <Line type="monotone" dataKey="cancelados" stroke="#EF4444" strokeWidth={2} name="Cancelados" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos de Tipo de Estágio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Área - Tipo de Estágio */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Tipo de Estágio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stackId="1" stroke="#1DB954" fill="#1DB954" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras Horizontais - Comparação */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Comparação por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seção Específica do Orientador */}
      {isAdvisor && advisorData && (
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Dashboard do Orientador</h3>
          
          {/* Estatísticas do Orientador */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-spotify-blue bg-opacity-20 rounded-lg">
              <p className="text-2xl font-bold text-spotify-blue">{advisorData.total}</p>
              <p className="text-sm text-text-muted">Total de Estágios</p>
            </div>
            <div className="text-center p-4 bg-spotify-green bg-opacity-20 rounded-lg">
              <p className="text-2xl font-bold text-spotify-green">{advisorData.active}</p>
              <p className="text-sm text-text-muted">Ativos</p>
            </div>
            <div className="text-center p-4 bg-spotify-purple bg-opacity-20 rounded-lg">
              <p className="text-2xl font-bold text-spotify-purple">{advisorData.successRate}%</p>
              <p className="text-sm text-text-muted">Taxa de Sucesso</p>
            </div>
            <div className="text-center p-4 bg-spotify-orange bg-opacity-20 rounded-lg">
              <p className="text-2xl font-bold text-spotify-orange">{advisorData.companies}</p>
              <p className="text-sm text-text-muted">Empresas</p>
            </div>
          </div>

          {/* Gráfico de Pizza do Orientador */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Status dos Estágios Supervisionados</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Ativos', value: advisorData.active, color: '#1DB954' },
                      { name: 'Concluídos', value: advisorData.concluded, color: '#1E3A8A' },
                      { name: 'Interrompidos', value: advisorData.interrupted, color: '#F59E0B' },
                      { name: 'Cancelados', value: advisorData.canceled, color: '#EF4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Ativos', value: advisorData.active, color: '#1DB954' },
                      { name: 'Concluídos', value: advisorData.concluded, color: '#1E3A8A' },
                      { name: 'Interrompidos', value: advisorData.interrupted, color: '#F59E0B' },
                      { name: 'Cancelados', value: advisorData.canceled, color: '#EF4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Taxa de Sucesso</h4>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#1DB954"
                        strokeWidth="3"
                        strokeDasharray={`${advisorData.successRate}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-text-primary">{advisorData.successRate}%</span>
                    </div>
                  </div>
                  <p className="text-text-muted">Taxa de Sucesso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 