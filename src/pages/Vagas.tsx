import { Plus, Search, Filter, MapPin, Clock, DollarSign, Building } from 'lucide-react'

const vagas = [
  {
    id: 1,
    titulo: 'Desenvolvedor Frontend React',
    empresa: 'TechCorp Solutions',
    localizacao: 'São Paulo, SP',
    tipo: 'Remoto',
    salario: 'R$ 1.500 - R$ 2.000',
    periodo: '6 meses',
    vagas: 3,
    status: 'Ativa',
    descricao: 'Desenvolvimento de interfaces web modernas com React, TypeScript e Tailwind CSS.',
    requisitos: ['React', 'TypeScript', 'CSS', 'Git'],
    dataPublicacao: '2024-12-10',
  },
  {
    id: 2,
    titulo: 'Estagiário em Marketing Digital',
    empresa: 'Digital Marketing Pro',
    localizacao: 'Rio de Janeiro, RJ',
    tipo: 'Híbrido',
    salario: 'R$ 1.200 - R$ 1.800',
    periodo: '12 meses',
    vagas: 2,
    status: 'Ativa',
    descricao: 'Auxiliar na criação de campanhas de marketing digital e análise de dados.',
    requisitos: ['Marketing', 'Redes Sociais', 'Analytics', 'Criatividade'],
    dataPublicacao: '2024-12-08',
  },
  {
    id: 3,
    titulo: 'Estagiário em Finanças',
    empresa: 'Banco Financeiro',
    localizacao: 'Belo Horizonte, MG',
    tipo: 'Presencial',
    salario: 'R$ 1.800 - R$ 2.200',
    periodo: '12 meses',
    vagas: 1,
    status: 'Ativa',
    descricao: 'Análise de dados financeiros e suporte em relatórios contábeis.',
    requisitos: ['Excel', 'Contabilidade', 'Análise de Dados', 'Inglês'],
    dataPublicacao: '2024-12-05',
  },
  {
    id: 4,
    titulo: 'Estagiário em Design UX/UI',
    empresa: 'Creative Studio',
    localizacao: 'Curitiba, PR',
    tipo: 'Remoto',
    salario: 'R$ 1.300 - R$ 1.900',
    periodo: '6 meses',
    vagas: 2,
    status: 'Ativa',
    descricao: 'Criação de interfaces de usuário e experiências digitais.',
    requisitos: ['Figma', 'Adobe Creative Suite', 'UX Design', 'Prototipagem'],
    dataPublicacao: '2024-12-03',
  },
]

export function Vagas() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Vagas de Estágio</h1>
          <p className="text-text-secondary mt-2">Gerencie e visualize todas as vagas disponíveis</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nova Vaga
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar vagas..."
              className="w-full bg-background-tertiary border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="input-field">
              <option value="">Tipo de Trabalho</option>
              <option value="remoto">Remoto</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
            </select>
            <select className="input-field">
              <option value="">Localização</option>
              <option value="sp">São Paulo</option>
              <option value="rj">Rio de Janeiro</option>
              <option value="mg">Minas Gerais</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Vagas */}
      <div className="grid gap-6">
        {vagas.map((vaga) => (
          <div key={vaga.id} className="card hover:bg-background-tertiary transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-text-primary">{vaga.titulo}</h3>
                  <span className="px-2 py-1 bg-spotify-green/20 text-spotify-green text-xs font-medium rounded-full">
                    {vaga.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-text-secondary text-sm mb-3">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {vaga.empresa}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {vaga.localizacao}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {vaga.tipo}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {vaga.salario}
                  </div>
                </div>
                
                <p className="text-text-secondary mb-3">{vaga.descricao}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {vaga.requisitos.map((req) => (
                    <span
                      key={req}
                      className="px-3 py-1 bg-background-tertiary text-text-secondary text-xs rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-text-tertiary">
                  <span>Período: {vaga.periodo}</span>
                  <span>{vaga.vagas} vaga(s) disponível(is)</span>
                  <span>Publicado em {vaga.dataPublicacao}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <button className="btn-primary text-sm px-4 py-2">
                  Ver Detalhes
                </button>
                <button className="btn-secondary text-sm px-4 py-2">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">
          Mostrando 1-4 de 4 vagas
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