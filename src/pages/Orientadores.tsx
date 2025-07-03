import { Plus, Search, Filter, User, Mail, Phone, MapPin, GraduationCap, Users, BookOpen } from 'lucide-react'

const orientadores = [
  {
    id: 1,
    nome: 'Prof. Maria Oliveira Silva',
    email: 'maria.oliveira@universidade.edu.br',
    telefone: '(11) 99999-9999',
    departamento: 'Ciência da Computação',
    especialidade: 'Desenvolvimento Web',
    localizacao: 'São Paulo, SP',
    status: 'Ativo',
    alunosAtivos: 8,
    totalAlunos: 25,
    cargaHoraria: '40h',
    formacao: 'Doutorado em Ciência da Computação',
  },
  {
    id: 2,
    nome: 'Prof. Carlos Santos Costa',
    email: 'carlos.santos@universidade.edu.br',
    telefone: '(21) 88888-8888',
    departamento: 'Marketing',
    especialidade: 'Marketing Digital',
    localizacao: 'Rio de Janeiro, RJ',
    status: 'Ativo',
    alunosAtivos: 5,
    totalAlunos: 18,
    cargaHoraria: '40h',
    formacao: 'Mestrado em Administração',
  },
  {
    id: 3,
    nome: 'Prof. Roberto Silva Almeida',
    email: 'roberto.silva@universidade.edu.br',
    telefone: '(31) 77777-7777',
    departamento: 'Administração',
    especialidade: 'Finanças Corporativas',
    localizacao: 'Belo Horizonte, MG',
    status: 'Ativo',
    alunosAtivos: 6,
    totalAlunos: 22,
    cargaHoraria: '40h',
    formacao: 'Doutorado em Administração',
  },
  {
    id: 4,
    nome: 'Prof. Juliana Costa Ferreira',
    email: 'juliana.costa@universidade.edu.br',
    telefone: '(41) 66666-6666',
    departamento: 'Design',
    especialidade: 'Design de Interface',
    localizacao: 'Curitiba, PR',
    status: 'Ativo',
    alunosAtivos: 4,
    totalAlunos: 15,
    cargaHoraria: '40h',
    formacao: 'Mestrado em Design',
  },
]

export function Orientadores() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Orientadores</h1>
          <p className="text-text-secondary mt-2">Gerencie os professores orientadores</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Novo Orientador
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar orientadores..."
              className="w-full bg-background-tertiary border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="input-field">
              <option value="">Departamento</option>
              <option value="computacao">Ciência da Computação</option>
              <option value="marketing">Marketing</option>
              <option value="administracao">Administração</option>
              <option value="design">Design</option>
            </select>
            <select className="input-field">
              <option value="">Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Orientadores */}
      <div className="grid gap-6">
        {orientadores.map((orientador) => (
          <div key={orientador.id} className="card hover:bg-background-tertiary transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{orientador.nome}</h3>
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {orientador.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {orientador.telefone}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    {orientador.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-text-secondary">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{orientador.departamento}</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{orientador.localizacao}</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{orientador.alunosAtivos} alunos ativos</span>
                  </div>
                  <div className="flex items-center text-text-secondary">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>{orientador.cargaHoraria}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-text-secondary text-sm mb-2">
                    <strong>Especialidade:</strong> {orientador.especialidade}
                  </p>
                  <p className="text-text-secondary text-sm">
                    <strong>Formação:</strong> {orientador.formacao}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-text-secondary">
                    <span>Total de alunos orientados: {orientador.totalAlunos}</span>
                  </div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <span>Taxa de conclusão: {Math.round((orientador.totalAlunos - orientador.alunosAtivos) / orientador.totalAlunos * 100)}%</span>
                  </div>
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
                  Alunos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">
          Mostrando 1-4 de 4 orientadores
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