# Sistema de Gestão de Estágios - Engenharia de Telecomunicações

Sistema web para gerenciamento de estágios da Engenharia de Telecomunicações, desenvolvido em React + TypeScript com integração de dados via CSV.

## 🚀 Funcionalidades

### 📊 Dashboard
- **Visão Geral**: Estatísticas completas dos estágios
- **Filtros por Status**: Ativos, Concluídos, Interrompidos, Cancelados
- **Tabelas Interativas**: Com busca, ordenação e paginação
- **Exportação de Dados**: CSV com filtros aplicados

### 👥 Gestão de Estagiários
- **Lista Completa**: Todos os estagiários com informações detalhadas
- **Filtros Avançados**: Por status, tipo (obrigatório/opcional), empresa, orientador
- **Busca Inteligente**: Por nome, empresa ou orientador
- **Status Visual**: Badges coloridos para diferentes status

### 🏢 Gestão de Empresas
- **Parceiras**: Lista de empresas parceiras
- **Estatísticas**: Total de estágios por empresa
- **Performance**: Taxa de conclusão e estágios ativos
- **Filtros**: Por status dos estágios

### 👨‍🏫 Gestão de Orientadores
- **Supervisão**: Orientadores e seus estagiários
- **Estatísticas**: Total de orientações e estágios ativos
- **Performance**: Distribuição por status
- **Busca**: Por nome do orientador

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**: Framework principal
- **TypeScript**: Tipagem estática
- **TailwindCSS**: Estilização
- **React Router**: Navegação
- **React Query**: Gerenciamento de estado e cache
- **Lucide React**: Ícones
- **Date-fns**: Manipulação de datas
- **PapaParse**: Parsing de CSV

### Validação e Tipagem
- **Zod**: Validação de schemas
- **TypeScript**: Tipagem estática

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── DataTable.tsx          # Tabela reutilizável com filtros
│   ├── StatusBadge.tsx        # Badge de status
│   └── layout/
│       ├── Header.tsx         # Cabeçalho da aplicação
│       └── Sidebar.tsx        # Menu lateral
├── hooks/
│   └── useInternships.ts      # Hooks React Query para dados
├── pages/
│   ├── Dashboard.tsx          # Página principal
│   ├── Alunos.tsx            # Gestão de estagiários
│   ├── Orientadores.tsx      # Gestão de orientadores
│   ├── Vagas.tsx             # Gestão de empresas
│   └── Documentos.tsx        # Documentação
├── services/
│   └── internshipService.ts   # Serviços de dados
├── types/
│   └── internship.ts          # Tipos TypeScript e schemas Zod
└── lib/
    └── utils.ts              # Utilitários
```

## 📊 Estrutura de Dados

### Entidades Principais

#### Internship (Estágio)
```typescript
interface Internship {
  nome: string                    // Nome do estagiário
  obrigatorio?: 'SIM' | 'NÃO' | 'NAO' | '290'
  empresa?: string               // Nome da empresa
  orientadorAtual?: string       // Orientador atual
  orientadorAnterior?: string    // Orientador anterior
  tceEntregue?: string           // Data entrega TCE
  conclusaoEstagio?: string      // Status de conclusão
  dataConclusao?: string         // Data de conclusão
  motivoConclusao?: string       // Motivo da conclusão
  prazoMaximo?: string           // Prazo máximo
  inicioTce?: string             // Data início TCE
  terminoPrevisto?: string       // Término previsto
  // Relatórios parciais e final
  relatorioParcial1: ReportStatus
  relatorioParcial2: ReportStatus
  relatorioParcial3: ReportStatus
  relatorioFinal: ReportStatus
  prorrogacoes?: string[]        // Prorrogações
  supervisorEmpresa?: string     // Supervisor na empresa
}
```

#### Company (Empresa)
```typescript
interface Company {
  nome: string
  totalInternships: number
  activeInternships: number
  concludedInternships: number
}
```

#### Advisor (Orientador)
```typescript
interface Advisor {
  nome: string
  totalInternships: number
  activeInternships: number
  concludedInternships: number
}
```

### Status dos Estágios
- **ATIVO**: Estágio em andamento
- **CONCLUÍDO**: Estágio finalizado com sucesso
- **INTERROMPIDO**: Estágio interrompido (demissão, etc.)
- **CANCELADO**: Estágio cancelado (desistência, etc.)

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <repository-url>
cd ihc

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### Build para Produção
```bash
npm run build
npm run preview
```

## 📁 Configuração de Dados

### Arquivo CSV
O sistema utiliza o arquivo `public/docs/database.csv` que deve conter:

1. **Registro de Estágios**: Dados principais dos estágios
2. **Colunas Principais**:
   - NOME: Nome do estagiário
   - OBRIG: Tipo de estágio (SIM/NÃO)
   - EMPRESA: Nome da empresa
   - ORIENTADOR ATUAL: Orientador atual
   - TCE ENTREGUE: Data de entrega do TCE
   - CONCLUSÃO DO ESTÁGIO: Status de conclusão
   - PRAZO MÁXIMO: Prazo máximo do estágio
   - Relatórios parciais e final
   - Prorrogações
   - Supervisor na empresa

### Estrutura do CSV
O arquivo deve seguir a estrutura específica com:
- Cabeçalhos nas primeiras linhas
- Dados organizados em colunas
- Datas no formato dd/mm/yyyy
- Status padronizados

## 🔧 Configurações

### Vite
O projeto usa Vite para desenvolvimento rápido:
- Hot Module Replacement (HMR)
- Build otimizado
- Servir arquivos estáticos da pasta `public`

### React Query
Configuração para cache e gerenciamento de estado:
- `staleTime`: 5 minutos para dados principais
- `gcTime`: 10 minutos para garbage collection
- Retry automático em caso de erro

### TailwindCSS
Configuração customizada para:
- Cores do tema
- Componentes reutilizáveis
- Responsividade

## 📈 Funcionalidades Avançadas

### Filtros e Busca
- **Busca Global**: Por nome, empresa, orientador
- **Filtros Múltiplos**: Status, tipo, empresa, orientador
- **Combinação**: Múltiplos filtros simultâneos

### Exportação
- **CSV Formatado**: Com cabeçalhos em português
- **Filtros Aplicados**: Exporta apenas dados filtrados
- **Nomeação Automática**: Com data e tipo de dados

### Cache e Performance
- **Cache Inteligente**: Dados em memória
- **Lazy Loading**: Carregamento sob demanda
- **Otimização**: Re-renderização mínima

## 🔮 Melhorias Futuras

### Funcionalidades Planejadas
- [ ] **Dashboard Interativo**: Gráficos e métricas avançadas
- [ ] **Notificações**: Alertas de prazos e status
- [ ] **Relatórios**: Geração automática de relatórios
- [ ] **Backend**: API REST para persistência
- [ ] **Autenticação**: Sistema de login e permissões
- [ ] **Upload de Arquivos**: Importação de novos dados
- [ ] **Histórico**: Versionamento de mudanças
- [ ] **Mobile**: Interface responsiva para dispositivos móveis

### Melhorias Técnicas
- [ ] **Testes**: Unit tests e integration tests
- [ ] **CI/CD**: Pipeline de deploy automático
- [ ] **Monitoramento**: Logs e métricas de performance
- [ ] **PWA**: Progressive Web App
- [ ] **Offline**: Funcionalidade offline
- [ ] **Internacionalização**: Suporte a múltiplos idiomas

## 🤝 Contribuição

### Padrões de Código
- **TypeScript**: Tipagem estrita
- **ESLint**: Linting de código
- **Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits

### Estrutura de Commits
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

## 📄 Licença

Este projeto está sob a licença ISC.

## 👥 Autores

Desenvolvido para o curso de Engenharia de Telecomunicações.

---

**Nota**: Este sistema foi desenvolvido seguindo as melhores práticas de desenvolvimento web moderno, com foco em performance, usabilidade e manutenibilidade. 