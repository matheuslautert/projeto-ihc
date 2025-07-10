import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Users,
  BookOpen,
  Target,
  Award,
  FileText,
  Star,
  Clock3
} from 'lucide-react'
import { useInterns, useFilteredInternships } from '../hooks/useInternships'
import { DataTable } from '../components/ui/DataTable'
import { StatusBadge } from '../components/ui/StatusBadge'
import { extractNameFromRouteId, extractNameFromRouteIdImproved } from '../lib/utils'
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

export function AlunoDetail() {
  const { alunoId } = useParams<{ alunoId: string }>()
  
  // Load data
  const { data: interns } = useInterns()
  const { data: allInternships } = useFilteredInternships({})
  
  // Extract student name from route ID
  const studentName = useMemo(() => {
    if (!alunoId || !allInternships) return ''
    const studentNames = allInternships.map(internship => internship.nome)
    return extractNameFromRouteIdImproved(alunoId, studentNames)
  }, [alunoId, allInternships])
  
  // Find student data
  const student = useMemo(() => {
    if (!allInternships || !studentName) return null
    return allInternships.find(internship => 
      internship.nome.toLowerCase() === studentName.toLowerCase()
    )
  }, [allInternships, studentName])
  
  // Get all internships for this student (in case of multiple)
  const studentInternships = useMemo(() => {
    if (!allInternships || !studentName) return []
    return allInternships.filter(internship => 
      internship.nome.toLowerCase() === studentName.toLowerCase()
    )
  }, [allInternships, studentName])
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (!studentInternships.length) return null
    
    const currentInternship = studentInternships.find(intern => getInternshipStatus(intern) === 'ATIVO')
    const concludedInternships = studentInternships.filter(intern => getInternshipStatus(intern) === 'CONCLUÍDO')
    const interruptedInternships = studentInternships.filter(intern => getInternshipStatus(intern) === 'INTERROMPIDO')
    const canceledInternships = studentInternships.filter(intern => getInternshipStatus(intern) === 'CANCELADO')
    
    const mandatory = studentInternships.filter(intern => intern.obrigatorio === 'SIM').length
    const optional = studentInternships.filter(intern => intern.obrigatorio === 'NÃO' || intern.obrigatorio === 'NAO').length
    
    // Calculate total internship duration
    const totalDuration = studentInternships.reduce((sum, intern) => {
      const start = intern.inicioTce ? new Date(intern.inicioTce) : null
      const end = intern.dataConclusao ? new Date(intern.dataConclusao) : 
                  (currentInternship && intern === currentInternship) ? new Date() : null
      if (start && end) {
        return sum + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      }
      return sum
    }, 0)
    
    return {
      total: studentInternships.length,
      current: currentInternship ? 1 : 0,
      concluded: concludedInternships.length,
      interrupted: interruptedInternships.length,
      canceled: canceledInternships.length,
      mandatory,
      optional,
      totalDuration: Math.round(totalDuration),
      successRate: concludedInternships.length > 0 ? Math.round((concludedInternships.length / (concludedInternships.length + interruptedInternships.length + canceledInternships.length)) * 100) : 0
    }
  }, [studentInternships])

  if (!student) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/alunos" className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </div>
        <div className="text-center py-12">
          <User className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Aluno não encontrado</h2>
          <p className="text-text-muted">O aluno solicitado não foi encontrado no sistema.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/alunos" className="btn-secondary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{student.nome}</h1>
            <p className="text-text-muted">Estagiário</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
            <User className="h-6 w-6 text-spotify-blue" />
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-2">Empresa Atual</h3>
            <p className="text-text-primary font-medium">{student.empresa || 'Não definida'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-2">Orientador</h3>
            <p className="text-text-primary font-medium">{student.orientadorAtual || 'Não definido'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-2">Tipo de Estágio</h3>
            <p className="text-text-primary font-medium">
              {student.obrigatorio === 'SIM' ? 'Obrigatório' : 'Opcional'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-2">Status Atual</h3>
            <StatusBadge status={getInternshipStatus(student)} />
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                <BookOpen className="h-6 w-6 text-spotify-blue" />
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
                <p className="text-sm font-medium text-text-muted">Estágios Concluídos</p>
                <p className="text-2xl font-bold text-text-primary">{stats.concluded}</p>
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
                <Clock3 className="h-6 w-6 text-spotify-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Duração Total</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalDuration} dias</p>
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

      {/* Timeline de Estágios */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Histórico de Estágios</h2>
          <span className="text-sm text-text-muted">{studentInternships.length} estágios</span>
        </div>
        
        {studentInternships.length > 0 ? (
          <div className="space-y-4">
            {studentInternships.map((internship, index) => (
              <div key={index} className="border border-border-primary rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-spotify-blue bg-opacity-20 rounded-lg">
                      <Building2 className="h-5 w-5 text-spotify-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-primary">{internship.empresa}</h3>
                      <p className="text-sm text-text-muted">Orientador: {internship.orientadorAtual}</p>
                    </div>
                  </div>
                  <StatusBadge status={getInternshipStatus(internship)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Início: </span>
                    <span className="text-text-primary">{formatDate(internship.inicioTce)}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Término Previsto: </span>
                    <span className="text-text-primary">{formatDate(internship.terminoPrevisto)}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Tipo: </span>
                    <span className="text-text-primary">
                      {internship.obrigatorio === 'SIM' ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                </div>
                
                {internship.dataConclusao && (
                  <div className="mt-3 pt-3 border-t border-border-primary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-text-muted">Data de Conclusão: </span>
                        <span className="text-text-primary">{formatDate(internship.dataConclusao)}</span>
                      </div>
                      <div>
                        <span className="text-text-muted">Motivo: </span>
                        <span className="text-text-primary">{internship.motivoConclusao}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">Nenhum estágio encontrado para este aluno.</p>
          </div>
        )}
      </div>
    </div>
  )
}
