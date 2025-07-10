import { useState } from 'react'
import { Eye, EyeOff, GraduationCap, Mail, Lock } from 'lucide-react'
import { useAdvisors, useInterns } from '../hooks/useInternships'
import { generateLoginFromName, generatePasswordFromUser } from '../lib/utils'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { data: advisors } = useAdvisors()
  const { data: interns } = useInterns()
  const navigate = useNavigate()
  const { user, login: authLogin } = useAuth()

  // Se já estiver logado, redireciona para dashboard
  if (user) {
    navigate('/')
    return null
  }

  // Função para autenticar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!advisors || !interns) {
      setError('Dados ainda não carregados. Tente novamente em instantes.')
      return
    }
    // Busca em orientadores
    const advisor = advisors.find(a => generateLoginFromName(a.nome) === login.toLowerCase())
    if (advisor) {
      const expectedPassword = generatePasswordFromUser(advisor)
      if (password === expectedPassword) {
        authLogin({ tipo: 'orientador', nome: advisor.nome })
        navigate('/')
        return
      } else {
        setError('Senha incorreta para orientador.')
        return
      }
    }
    // Busca em alunos
    const intern = interns.find(i => generateLoginFromName(i.nome) === login.toLowerCase())
    if (intern) {
      const expectedPassword = generatePasswordFromUser(intern)
      if (password === expectedPassword) {
        authLogin({ tipo: 'aluno', nome: intern.nome })
        navigate('/')
        return
      } else {
        setError('Senha incorreta para aluno.')
        return
      }
    }
    setError('Usuário não encontrado. Verifique o login.')
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-spotify-green rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Plataforma de Estágios</h1>
          <p className="text-text-secondary mt-2">Faça login para acessar sua conta</p>
        </div>

        {/* Formulário */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-text-primary mb-2">
                Login
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Ex: jcasagrande"
                  className="w-full bg-background-tertiary border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="4 últimas letras do sobrenome"
                  className="w-full bg-background-tertiary border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-spotify-green bg-background-tertiary border-gray-600 rounded focus:ring-spotify-green focus:ring-2"
                />
                <span className="ml-2 text-sm text-text-secondary">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm text-spotify-green hover:text-green-400 transition-colors duration-200">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-spotify-green hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-spotify-green focus:ring-offset-2 focus:ring-offset-background-primary"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Não tem uma conta?{' '}
              <a href="#" className="text-spotify-green hover:text-green-400 transition-colors duration-200 font-medium">
                Entre em contato
              </a>
            </p>
          </div>
        </div>

        {/* Dica de login */}
        <div className="mt-8 text-center text-sm text-text-tertiary">
          <p>
            <b>Dica:</b> O login é a primeira letra do nome + sobrenome, tudo minúsculo e sem acento.<br />
            Exemplo: <span className="font-mono bg-background-tertiary px-2 py-1 rounded">Jorge Henrique B. Casagrande → <b>jcasagrande</b></span><br />
            A senha são as 4 últimas letras do sobrenome.<br />
            Exemplo: <span className="font-mono bg-background-tertiary px-2 py-1 rounded">Casagrande → <b>ande</b></span>
          </p>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 text-center">
          <p className="text-text-tertiary text-xs">
            © 2024 Plataforma de Estágios. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
} 