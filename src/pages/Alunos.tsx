import { Plus, Search, Filter, User, Mail, Phone, MapPin, GraduationCap, Calendar } from 'lucide-react'

const alunos = [
  {
    id: 1,
    nome: 'João Silva Santos',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    curso: 'Ciência da Computação',
    semestre: '6º',
    localizacao: 'São Paulo, SP',
    status: 'Ativo',
    orientador: 'Prof. Maria Oliveira',
    empresa: 'TechCorp Solutions',
    inicioEstagio: '2024-03-01',
    fimEstagio: '2024-12-31',
    progresso: 75,
  },
  {
    id: 2,
    nome: 'Ana Costa Lima',
    email: 'ana.costa@email.com',
    telefone: '(21) 88888-8888',
    curso: 'Marketing',
    semestre: '4º',
    localizacao: 'Rio de Janeiro, RJ',
    status: 'Ativo',
    orientador: 'Prof. Carlos Santos',
    empresa: 'Digital Marketing Pro',
    inicioEstagio: '2024-02-15',
    fimEstagio: '2025-02-15',
    progresso: 45,
  },
  {
    id: 3,
    nome: 'Pedro Almeida',
    email: 'pedro.almeida@email.com',
    telefone: '(31) 77777-7777',
    curso: 'Administração',
    semestre: '8º',
    localizacao: 'Belo Horizonte, MG',
    status: 'Concluído',
    orientador: 'Prof. Roberto Silva',
    empresa: 'Banco Financeiro',
    inicioEstagio: '2023-08-01',
    fimEstagio: '2024-07-31',
    progresso: 100,
  },
  {
    id: 4,
    nome: 'Mariana Ferreira',
    email: 'mariana.ferreira@email.com',
    telefone: '(41) 66666-6666',
    curso: 'Design Gráfico',
    semestre: '5º',
    localizacao: 'Curitiba, PR',
    status: 'Ativo',
    orientador: 'Prof. Juliana Costa',
    empresa: 'Creative Studio',
    inicioEstagio: '2024-04-01',
    fimEstagio: '2024-09-30',
    progresso: 60,
  },
]

export function Alunos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Alunos</h1>
          <p className="text-text-secondary mt-2">Gerencie os estudantes em estágio</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Novo Aluno
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar alunos..."
              className="w-full bg-background-tertiary border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="input-field">
              <option value="">Status</option>
              <option value="ativo">Ativo</option>
              <option value="concluido">Concluído</option>
              <option value="inativo">Inativo</option>
            </select>
            <select className="input-field">
              <option value="">Curso</option>
              <option value="computacao">Ciência da Computação</option>
              <option value="marketing">Marketing</option>
              <option value="administracao">Administração</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Alunos */}
      <div className="grid gap-6">
        {alunos.map((aluno) => (
          <div key={aluno.id} className="card hover:bg-background-tertiary transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{aluno.nome}</h3>
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {aluno.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {aluno.telefone}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    aluno.status === 'Ativo' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {aluno.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-text-secondary">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>{aluno.curso} - {aluno.semestre}</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{aluno.localizacao}</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <User className="w-4 h-4 mr-2" />
                    <span>{aluno.orientador}</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{aluno.empresa}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-text-secondary mb-1">
                    <span>Progresso do Estágio</span>
                    <span>{aluno.progresso}%</span>
                  </div>
                  <div className="w-full bg-background-tertiary rounded-full h-2">
                    <div 
                      className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${aluno.progresso}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-text-tertiary">
                  <span>Início: {aluno.inicioEstagio}</span>
                  <span>Fim: {aluno.fimEstagio}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <button className="btn-primary text-sm px-4 py-2">
                  Ver Perfil
                </button>
                <button className="btn-secondary text-sm px-4 py-2">
                  Editar
                </button>
                <button className="btn-secondary text-sm px-4 py-2">
                  Documentos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">
          Mostrando 1-4 de 4 alunos
        </p>
        <div className="flex items-center gap-2">
          <button className="btn-secondary px-3 py-1 text-sm">Anterior</button>
          <button className="bg-spotify-green text-white px-3 py-1 rounded text-sm">1</button>
          <button className="btn-secondary px-3 py-1 text-sm">Próximo</button>
        </div>
      </div>
    </div>
  )
} 