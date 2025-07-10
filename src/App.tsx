import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background-primary">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 p-6">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/vagas" element={<Vagas />} />
                        <Route path="/alunos" element={<Alunos />} />
                        <Route path="/orientadores" element={<Orientadores />} />
                        <Route path="/documentos" element={<Documentos />} />
                        
                        {/* Rotas dinâmicas */}
                        <Route path="/orientador/:orientadorId" element={<OrientadorDetail />} />
                        <Route path="/empresa/:empresaId" element={<EmpresaDetail />} />
                        <Route path="/aluno/:alunoId" element={<AlunoDetail />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App 