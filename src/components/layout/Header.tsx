import { Search, Bell, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-background-secondary border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-background-tertiary border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-spotify-green rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary">Admin</p>
              <p className="text-xs text-text-secondary">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 