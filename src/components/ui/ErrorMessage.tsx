import React from 'react'
import { AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ 
  title = "Erro ao carregar dados", 
  message = "Ocorreu um erro ao carregar os dados. Tente novamente.",
  onRetry,
  className = ""
}: ErrorMessageProps) {
  return (
    <div className={`flex items-center space-x-2 p-4 bg-spotify-red bg-opacity-10 border border-spotify-red border-opacity-30 rounded-lg text-spotify-red ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export function EmptyState({ 
  title = "Nenhum dado encontrado", 
  message = "Não há dados para exibir no momento.",
  icon: Icon,
  className = ""
}: {
  title?: string
  message?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex flex-col items-center text-center">
        {Icon && (
          <div className="flex-shrink-0 mb-4">
            <Icon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500">
          {message}
        </p>
      </div>
    </div>
  )
} 