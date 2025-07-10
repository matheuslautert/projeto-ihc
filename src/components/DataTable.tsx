import React, { useState, useMemo } from 'react'
import { Search, Download, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useExportData } from '../hooks/useInternships'
import { Internship, InternshipStatus } from '../types/internship'
import { cn } from '../lib/utils'

interface DataTableProps {
  data: Internship[]
  title: string
  loading?: boolean
  onRowClick?: (internship: Internship) => void
}

interface SortConfig {
  key: keyof Internship
  direction: 'asc' | 'desc'
}

const ITEMS_PER_PAGE = 10

export function DataTable({ data, title, loading, onRowClick }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'nome', direction: 'asc' })
  const exportMutation = useExportData()

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    
    return data.filter(internship => 
      internship.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.orientadorAtual?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.orientadorAnterior?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue === undefined && bValue === undefined) return 0
      if (aValue === undefined) return 1
      if (bValue === undefined) return -1
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue, 'pt-BR')
          : bValue.localeCompare(aValue, 'pt-BR')
      }
      
      return 0
    })
    
    return sorted
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedData, currentPage])

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE)

  // Handle sorting
  const handleSort = (key: keyof Internship) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Handle export
  const handleExport = () => {
    const exportData = sortedData.map(internship => ({
      Nome: internship.nome,
      Obrigatório: internship.obrigatorio || '',
      Empresa: internship.empresa || '',
      'Orientador Atual': internship.orientadorAtual || '',
      'Orientador Anterior': internship.orientadorAnterior || '',
      'Início TCE': internship.inicioTce || '',
      'Término Previsto': internship.terminoPrevisto || '',
      'Status': determineStatus(internship),
      'Supervisor': internship.supervisorEmpresa || '',
    }))
    
    exportMutation.mutate({ 
      data: exportData, 
      filename: `${title.toLowerCase().replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv` 
    })
  }

  // Determine internship status
  function determineStatus(internship: Internship): InternshipStatus {
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

  // Status badge component
  function StatusBadge({ status }: { status: InternshipStatus }) {
    const statusConfig = {
      ATIVO: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      CONCLUÍDO: { color: 'bg-blue-100 text-blue-800', label: 'Concluído' },
      INTERROMPIDO: { color: 'bg-yellow-100 text-yellow-800', label: 'Interrompido' },
      CANCELADO: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    }
    
    const config = statusConfig[status]
    
    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.color
      )}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
        
        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou orientador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('nome')}
              >
                <div className="flex items-center">
                  Nome
                  {sortConfig.key === 'nome' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('empresa')}
              >
                <div className="flex items-center">
                  Empresa
                  {sortConfig.key === 'empresa' && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orientador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Início
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Término
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((internship, index) => (
              <tr 
                key={index}
                onClick={() => onRowClick?.(internship)}
                className={cn(
                  'hover:bg-gray-50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {internship.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {internship.empresa || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {internship.orientadorAtual || internship.orientadorAnterior || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={determineStatus(internship)} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {internship.inicioTce ? format(new Date(internship.inicioTce), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {internship.terminoPrevisto ? format(new Date(internship.terminoPrevisto), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)}
                </span>{' '}
                de <span className="font-medium">{sortedData.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  const isCurrent = page === currentPage
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        isCurrent
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 