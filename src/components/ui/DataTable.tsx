import React, { useState, useMemo } from 'react'
import { Search, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { clsx } from 'clsx'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, item: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  title?: string
  searchable?: boolean
  exportable?: boolean
  pagination?: boolean
  itemsPerPage?: number
  onExport?: (data: T[]) => void
  className?: string
  emptyMessage?: string
  loading?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  exportable = true,
  pagination = true,
  itemsPerPage = 10,
  onExport,
  className,
  emptyMessage = "Nenhum dado encontrado",
  loading = false
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filtrar dados baseado no termo de busca
  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm])

  // Ordenar dados
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn as keyof T]
      const bValue = b[sortColumn as keyof T]

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = String(aValue).localeCompare(String(bValue))
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortColumn, sortDirection])

  // Paginação
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData

  // Função para ordenar
  const handleSort = (column: keyof T | string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Função para exportar
  const handleExport = () => {
    if (onExport) {
      onExport(sortedData)
    }
  }

  // Função para renderizar valor da célula
  const renderCell = (item: T, column: Column<T>) => {
    const value = item[column.key as keyof T]
    
    if (column.render) {
      return column.render(value, item)
    }
    
    return value || '-'
  }

  if (loading) {
    return (
      <div className={clsx("table-container", className)}>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 spotify-loading rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 spotify-loading rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx("table-container", className)}>
      {/* Header */}
      <div className="p-6 border-b border-border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {title && (
              <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            )}
            <span className="text-sm text-text-muted">
              {sortedData.length} {sortedData.length === 1 ? 'item' : 'itens'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-search pl-10 pr-4"
                />
              </div>
            )}
            
            {exportable && onExport && (
              <button
                onClick={handleExport}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={clsx(
                    "px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:bg-background-quaternary transition-colors duration-200",
                    column.width
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-spotify-green">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background-card divide-y divide-border-primary">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr key={rowIndex} className="table-row">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-text-primary"
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border-primary bg-background-tertiary">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-muted">
              Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length} resultados
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-ghost p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-sm text-text-primary">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-ghost p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 