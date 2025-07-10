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
import { useAuth } from '../../hooks/useAuth'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Vagas de Estágio', href: '/vagas', icon: Briefcase },
  { name: 'Alunos', href: '/alunos', icon: Users },
  { name: 'Orientadores', href: '/orientadores', icon: GraduationCap },
  { name: 'Documentos', href: '/documentos', icon: FileText },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  return (
    <div className="w-64 bg-background-sidebar min-h-screen p-4 border-r border-border-primary flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-spotify-green rounded-lg flex items-center justify-center mr-3 hover:bg-spotify-greenHover transition-colors duration-200">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Estágios</h1>
          {user && (
            <div className="text-xs text-text-muted mt-1">
              {user.nome} <span className="text-spotify-green">({user.tipo})</span>
            </div>
          )}
        </div>
      </div>
      
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-item ${
                  isActive ? 'nav-item-active' : ''
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-8 border-t border-border-primary">
        <button className="nav-item w-full">
          <Settings className="w-5 h-5 mr-3" />
          Configurações
        </button>
        <button onClick={logout} className="nav-item w-full mt-2 text-spotify-red hover:text-red-400 hover:bg-background-tertiary">
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  )
} 