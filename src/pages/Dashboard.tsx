import { Users, Briefcase, GraduationCap, FileText, TrendingUp, Clock } from 'lucide-react'

const stats = [
  {
    name: 'Total de Alunos',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Vagas Ativas',
    value: '89',
    change: '+5%',
    changeType: 'positive',
    icon: Briefcase,
  },
  {
    name: 'Orientadores',
    value: '45',
    change: '+2%',
    changeType: 'positive',
    icon: GraduationCap,
  },
  {
    name: 'Documentos Pendentes',
    value: '23',
    change: '-8%',
    changeType: 'negative',
    icon: FileText,
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'vaga',
    title: 'Nova vaga de estágio em Desenvolvimento Web',
    description: 'Empresa TechCorp está oferecendo 5 vagas',
    time: '2 horas atrás',
  },
  {
    id: 2,
    type: 'aluno',
    title: 'João Silva foi aprovado para estágio',
    description: 'Estágio na área de Marketing Digital',
    time: '4 horas atrás',
  },
  {
    id: 3,
    type: 'documento',
    title: 'Novo documento enviado',
    description: 'Relatório de atividades do mês',
    time: '6 horas atrás',
  },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">Visão geral da plataforma de estágios</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-spotify-green/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-spotify-green" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`} />
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-text-secondary text-sm ml-1">vs mês anterior</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-spotify-green rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{activity.title}</p>
                  <p className="text-text-secondary text-sm">{activity.description}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-3 h-3 text-text-tertiary mr-1" />
                    <span className="text-text-tertiary text-xs">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Próximos Prazos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
              <div>
                <p className="text-text-primary font-medium">Entrega de Relatórios</p>
                <p className="text-text-secondary text-sm">Relatórios mensais dos estagiários</p>
              </div>
              <div className="text-right">
                <p className="text-spotify-green font-medium">2 dias</p>
                <p className="text-text-tertiary text-xs">15/12/2024</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
              <div>
                <p className="text-text-primary font-medium">Avaliação de Estágio</p>
                <p className="text-text-secondary text-sm">Avaliação semestral dos orientadores</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-medium">5 dias</p>
                <p className="text-text-tertiary text-xs">18/12/2024</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background-tertiary rounded-lg">
              <div>
                <p className="text-text-primary font-medium">Renovação de Contratos</p>
                <p className="text-text-secondary text-sm">Contratos de estágio vencendo</p>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-medium">1 semana</p>
                <p className="text-text-tertiary text-xs">22/12/2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 