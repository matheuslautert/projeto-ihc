import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Briefcase, 
  Users, 
  GraduationCap, 
  FileText, 
  Settings,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Vagas de Estágio', href: '/vagas', icon: Briefcase },
  { name: 'Alunos', href: '/alunos', icon: Users },
  { name: 'Orientadores', href: '/orientadores', icon: GraduationCap },
  { name: 'Documentos', href: '/documentos', icon: FileText },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-background-secondary min-h-screen p-4">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-spotify-green rounded-lg flex items-center justify-center mr-3">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-text-primary">Estágios</h1>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-spotify-green text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-8 border-t border-gray-700">
        <button className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-tertiary transition-colors duration-200 w-full">
          <Settings className="w-5 h-5 mr-3" />
          Configurações
        </button>
        <button className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-background-tertiary transition-colors duration-200 w-full mt-2">
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  )
} 