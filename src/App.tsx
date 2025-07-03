import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Vagas } from './pages/Vagas'
import { Alunos } from './pages/Alunos'
import { Orientadores } from './pages/Orientadores'
import { Documentos } from './pages/Documentos'
import { Login } from './pages/Login'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background-primary">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
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
                  </Routes>
                </main>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App 