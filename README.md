# 🎓 Plataforma de Gerenciamento de Estágios

Uma plataforma moderna e responsiva para gerenciamento completo de estágios, inspirada no design do Spotify. Desenvolvida com React, TypeScript e Tailwind CSS.

## ✨ Características

- **Dashboard Interativo**: Visão geral com estatísticas e atividades recentes
- **Gestão de Vagas**: Cadastro, edição e busca de vagas de estágio
- **Controle de Alunos**: Perfis completos com progresso de estágio
- **Orientadores**: Gerenciamento de professores orientadores
- **Documentos**: Sistema de upload e organização de arquivos
- **Design Responsivo**: Interface adaptável para desktop e mobile
- **Tema Escuro**: Design moderno inspirado no Spotify

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool e dev server
- **React Router** - Roteamento da aplicação
- **Lucide React** - Ícones modernos
- **ESLint** - Linting de código

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd estagios-platform
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Vagas.tsx
│   ├── Alunos.tsx
│   ├── Orientadores.tsx
│   ├── Documentos.tsx
│   └── Login.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Design System

### Cores
- **Primária**: Verde Spotify (#1DB954)
- **Fundo**: Tons de cinza escuro (#121212, #181818, #282828)
- **Texto**: Branco e tons de cinza claro

### Componentes
- **Cards**: Containers com sombra e hover effects
- **Botões**: Primário (verde) e secundário (cinza)
- **Inputs**: Campos com foco verde e bordas arredondadas

## 📱 Funcionalidades

### Dashboard
- Estatísticas em tempo real
- Atividades recentes
- Próximos prazos
- Gráficos de progresso

### Vagas de Estágio
- Listagem com filtros
- Detalhes completos
- Status de vagas
- Requisitos e benefícios

### Alunos
- Perfis detalhados
- Progresso de estágio
- Informações acadêmicas
- Histórico de atividades

### Orientadores
- Perfis profissionais
- Especialidades
- Alunos orientados
- Métricas de performance

### Documentos
- Upload de arquivos
- Categorização
- Status de aprovação
- Histórico de versões

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Visualiza o build de produção
npm run lint         # Executa o linter
npm run lint:fix     # Corrige problemas do linter
```

## 🎯 Próximas Funcionalidades

- [ ] Sistema de autenticação completo
- [ ] Notificações em tempo real
- [ ] Relatórios avançados
- [ ] Integração com APIs externas
- [ ] Sistema de chat
- [ ] Upload de arquivos em lote
- [ ] Exportação de dados
- [ ] Dashboard mobile otimizado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvido por

Plataforma de Estágios - Sistema de Gerenciamento Acadêmico

---

**Nota**: Este é um protótipo funcional desenvolvido para demonstração. Para uso em produção, recomenda-se implementar autenticação, validações de segurança e integração com banco de dados. 