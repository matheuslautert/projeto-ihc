import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Vagas } from './pages/Vagas'
import { Alunos } from './pages/Alunos'
import { Orientadores } from './pages/Orientadores'
import { Documentos } from './pages/Documentos'
import { Login } from './pages/Login'
import { OrientadorDetail } from './pages/OrientadorDetail'
import { EmpresaDetail } from './pages/EmpresaDetail'
import { AlunoDetail } from './pages/AlunoDetail'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function TesteAviso() {
  return (
    <div className="w-full bg-orange-400 text-black py-3 px-4 text-center font-semibold z-50 relative shadow-md">
      Este sistema é um <b>protótipo para testes</b>. Por favor, avalie a experiência preenchendo o formulário:&nbsp;
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSfXv-Nt0PDrRseOL8a5wDdYjtRBGiwmqGOfQ6eppWYA8VUAbw/viewform?usp=preview"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-900 underline font-bold hover:text-blue-700 transition-colors"
      >
        Avaliar protótipo
      </a>
    </div>
  )
}

function ProtectedLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background-primary">
            <TesteAviso />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vagas" element={<Vagas />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/orientadores" element={<Orientadores />} />
                <Route path="/documentos" element={<Documentos />} />
                {/* Rotas dinâmicas */}
                <Route path="/orientador/:orientadorId" element={<OrientadorDetail />} />
                <Route path="/empresa/:empresaId" element={<EmpresaDetail />} />
                <Route path="/aluno/:alunoId" element={<AlunoDetail />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App 