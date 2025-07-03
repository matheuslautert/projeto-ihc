import { Plus, Search, Filter, FileText, Download, Eye, Edit, Trash2, Calendar, User, FileType } from 'lucide-react'

const documentos = [
  {
    id: 1,
    titulo: 'Relatório Mensal - Dezembro 2024',
    tipo: 'Relatório',
    categoria: 'Mensal',
    autor: 'João Silva Santos',
    dataUpload: '2024-12-10',
    tamanho: '2.5 MB',
    formato: 'PDF',
    status: 'Aprovado',
    descricao: 'Relatório mensal de atividades do estágio em desenvolvimento web.',
    orientador: 'Prof. Maria Oliveira',
  },
  {
    id: 2,
    titulo: 'Contrato de Estágio - Ana Costa',
    tipo: 'Contrato',
    categoria: 'Legal',
    autor: 'Ana Costa Lima',
    dataUpload: '2024-12-08',
    tamanho: '1.8 MB',
    formato: 'PDF',
    status: 'Pendente',
    descricao: 'Contrato de estágio para posição de marketing digital.',
    orientador: 'Prof. Carlos Santos',
  },
  {
    id: 3,
    titulo: 'Avaliação Semestral - Pedro Almeida',
    tipo: 'Avaliação',
    categoria: 'Avaliação',
    autor: 'Prof. Roberto Silva',
    dataUpload: '2024-12-05',
    tamanho: '3.2 MB',
    formato: 'DOCX',
    status: 'Aprovado',
    descricao: 'Avaliação semestral do estagiário em administração.',
    orientador: 'Prof. Roberto Silva',
  },
  {
    id: 4,
    titulo: 'Portfolio de Projetos - Mariana',
    tipo: 'Portfolio',
    categoria: 'Projeto',
    autor: 'Mariana Ferreira',
    dataUpload: '2024-12-03',
    tamanho: '15.7 MB',
    formato: 'ZIP',
    status: 'Em Revisão',
    descricao: 'Portfolio com projetos de design desenvolvidos durante o estágio.',
    orientador: 'Prof. Juliana Costa',
  },
  {
    id: 5,
    titulo: 'Termo de Compromisso - João Silva',
    tipo: 'Termo',
    categoria: 'Legal',
    autor: 'João Silva Santos',
    dataUpload: '2024-11-28',
    tamanho: '0.8 MB',
    formato: 'PDF',
    status: 'Aprovado',
    descricao: 'Termo de compromisso de estágio obrigatório.',
    orientador: 'Prof. Maria Oliveira',
  },
]

const categorias = [
  { nome: 'Todos', count: documentos.length },
  { nome: 'Relatórios', count: 1 },
  { nome: 'Contratos', count: 1 },
  { nome: 'Avaliações', count: 1 },
  { nome: 'Projetos', count: 1 },
  { nome: 'Termos', count: 1 },
]

export function Documentos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Documentos</h1>
          <p className="text-text-secondary mt-2">Gerencie todos os documentos e relatórios</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Novo Documento
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Total de Documentos</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{documentos.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Aprovados</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {documentos.filter(d => d.status === 'Aprovado').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">
                {documentos.filter(d => d.status === 'Pendente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Em Revisão</p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {documentos.filter(d => d.status === 'Em Revisão').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="w-full bg-background-tertiary border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="input-field">
              <option value="">Tipo</option>
              <option value="relatorio">Relatório</option>
              <option value="contrato">Contrato</option>
              <option value="avaliacao">Avaliação</option>
              <option value="projeto">Projeto</option>
            </select>
            <select className="input-field">
              <option value="">Status</option>
              <option value="aprovado">Aprovado</option>
              <option value="pendente">Pendente</option>
              <option value="revisao">Em Revisão</option>
            </select>
            <button className="btn-secondary flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2">
        {categorias.map((categoria) => (
          <button
            key={categoria.nome}
            className="px-4 py-2 bg-background-tertiary text-text-secondary rounded-lg hover:bg-spotify-green hover:text-white transition-colors duration-200 text-sm"
          >
            {categoria.nome} ({categoria.count})
          </button>
        ))}
      </div>

      {/* Lista de Documentos */}
      <div className="grid gap-4">
        {documentos.map((documento) => (
          <div key={documento.id} className="card hover:bg-background-tertiary transition-colors duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-spotify-green/10 rounded-lg flex items-center justify-center">
                  <FileType className="w-6 h-6 text-spotify-green" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">{documento.titulo}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      documento.status === 'Aprovado' 
                        ? 'bg-green-500/20 text-green-400'
                        : documento.status === 'Pendente'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {documento.status}
                    </span>
                  </div>
                  
                  <p className="text-text-secondary text-sm mb-3">{documento.descricao}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text-secondary">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{documento.autor}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{documento.dataUpload}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{documento.formato} • {documento.tamanho}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{documento.orientador}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-text-secondary hover:text-spotify-green hover:bg-background-tertiary rounded-lg transition-colors duration-200">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-tertiary rounded-lg transition-colors duration-200">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-text-secondary hover:text-red-400 hover:bg-background-tertiary rounded-lg transition-colors duration-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm">
          Mostrando 1-5 de 5 documentos
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