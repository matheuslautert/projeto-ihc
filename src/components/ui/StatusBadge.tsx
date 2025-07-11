import { clsx } from 'clsx'
import { InternshipStatus } from '../../types/internship'

interface StatusBadgeProps {
  status: InternshipStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = (status: InternshipStatus) => {
    switch (status) {
      case 'ATIVO':
        return {
          label: 'Ativo',
          className: 'status-active'
        }
      case 'CONCLUÍDO':
        return {
          label: 'Concluído',
          className: 'status-completed'
        }
      case 'INTERROMPIDO':
        return {
          label: 'Interrompido',
          className: 'status-pending'
        }
      case 'CANCELADO':
        return {
          label: 'Cancelado',
          className: 'status-cancelled'
        }
      default:
        return {
          label: status,
          className: 'status-pending'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`status-badge ${config.className} ${className}`}>
      {config.label}
    </span>
  )
}

// Componente para mostrar motivo de conclusão
interface MotivoBadgeProps {
  motivo: string
  className?: string
}

export function MotivoBadge({ motivo, className }: MotivoBadgeProps) {
  const getMotivoConfig = (motivo: string) => {
    const motivoLower = motivo.toLowerCase()
    
    if (motivoLower.includes('contratação')) {
      return {
        label: 'Contratado',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🎉'
      }
    }
    
    if (motivoLower.includes('desistência')) {
      return {
        label: 'Desistiu',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: '🚪'
      }
    }
    
    if (motivoLower.includes('demissão')) {
      return {
        label: 'Demitido',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌'
      }
    }
    
    if (motivoLower.includes('encerramento')) {
      return {
        label: 'Prazo Expirado',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '⏰'
      }
    }
    
    if (motivoLower.includes('interrupção')) {
      return {
        label: 'Interrompido',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '⏸️'
      }
    }
    
    if (motivoLower.includes('cancelamento')) {
      return {
        label: 'Cancelado',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: '🚫'
      }
    }
    
    return {
      label: motivo,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '📝'
    }
  }

  const config = getMotivoConfig(motivo)

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  )
}

// Componente para mostrar se é obrigatório
interface ObrigatorioBadgeProps {
  obrigatorio: string
  className?: string
}

export function ObrigatorioBadge({ obrigatorio, className }: ObrigatorioBadgeProps) {
  const isObrigatorio = obrigatorio === 'SIM'
  
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        isObrigatorio
          ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
          : 'bg-gray-100 text-gray-800 border-gray-200',
        className
      )}
    >
      <span className="mr-1">
        {isObrigatorio ? '📚' : '📖'}
      </span>
      {isObrigatorio ? 'Obrigatório' : 'Não Obrigatório'}
    </span>
  )
} 