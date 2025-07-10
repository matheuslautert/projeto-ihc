import { InternshipStatus } from '../types/internship'
import { cn } from '../lib/utils'

interface StatusBadgeProps {
  status: InternshipStatus
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    ATIVO: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      label: 'Ativo',
      icon: '🟢'
    },
    CONCLUÍDO: { 
      color: 'bg-blue-100 text-blue-800 border-blue-200', 
      label: 'Concluído',
      icon: '✅'
    },
    INTERROMPIDO: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      label: 'Interrompido',
      icon: '⚠️'
    },
    CANCELADO: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      label: 'Cancelado',
      icon: '❌'
    },
  }
  
  const sizeConfig = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }
  
  const config = statusConfig[status]
  const sizeClass = sizeConfig[size]
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium border',
      config.color,
      sizeClass
    )}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
} 