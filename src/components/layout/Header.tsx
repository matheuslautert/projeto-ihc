import { Search, Bell, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-background-secondary border-b border-border-primary px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="input-search w-full pl-10 pr-4"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-all duration-200 focus-spotify">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-spotify-green rounded-full animate-pulse"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center hover:bg-spotify-greenHover transition-colors duration-200">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary">{user?.nome || 'Usuário'}</p>
              <p className="text-xs text-text-muted">{user?.tipo === 'orientador' ? 'Orientador' : user?.tipo === 'aluno' ? 'Aluno' : ''}</p>
              <button onClick={logout} className="text-xs text-spotify-green hover:underline mt-1">Sair</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 