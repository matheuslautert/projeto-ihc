import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para gerar slug a partir de um nome
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim()
}

// Função para gerar hash simples
export function generateHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

// Função para gerar ID único para rotas
export function generateRouteId(name: string): string {
  const slug = generateSlug(name)
  const hash = generateHash(name)
  return `${slug}-${hash}`
}

// Função para extrair nome do ID da rota
export function extractNameFromRouteId(routeId: string): string {
  const parts = routeId.split('-')
  // Remove o hash (última parte) e reconstrói o nome
  return parts.slice(0, -1).join('-').replace(/-/g, ' ')
}

// Função para encontrar nome original baseado no slug e hash
export function findOriginalName(slug: string, hash: string, candidates: string[]): string | null {
  for (const candidate of candidates) {
    const candidateSlug = generateSlug(candidate)
    const candidateHash = generateHash(candidate)
    if (candidateSlug === slug && candidateHash === hash) {
      return candidate
    }
  }
  return null
}

// Função melhorada para extrair nome considerando caracteres especiais
export function extractNameFromRouteIdImproved(routeId: string, candidates: string[]): string {
  const parts = routeId.split('-')
  const hash = parts[parts.length - 1]
  const slug = parts.slice(0, -1).join('-')
  
  // Tenta encontrar o nome original
  const originalName = findOriginalName(slug, hash, candidates)
  if (originalName) {
    return originalName
  }
  
  // Fallback para a função original
  return extractNameFromRouteId(routeId)
}

// Gera login a partir do nome completo
export function generateLoginFromName(nome: string): string {
  if (!nome) return ''
  const parts = nome.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/\s+/)
  if (parts.length === 1) return parts[0]
  const first = parts[0][0]
  const last = parts[parts.length - 1]
  return `${first}${last}`
}

// Gera senha a partir do CPF, nascimento ou sobrenome
export function generatePasswordFromUser(user: any): string {
  // CPF: pega os 4 últimos dígitos
  if (user.cpf && typeof user.cpf === 'string') {
    const digits = user.cpf.replace(/\D/g, '')
    if (digits.length >= 4) return digits.slice(-4)
  }
  // Data de nascimento: pega os 4 últimos dígitos (ano ou dia+ano)
  if (user.nascimento && typeof user.nascimento === 'string') {
    const digits = user.nascimento.replace(/\D/g, '')
    if (digits.length >= 4) return digits.slice(-4)
  }
  // Sobrenome: pega as 4 últimas letras
  if (user.nome && typeof user.nome === 'string') {
    const parts = user.nome.trim().split(/\s+/)
    if (parts.length > 1) {
      const last = parts[parts.length - 1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (last.length >= 4) return last.slice(-4)
      return last
    }
  }
  return '1234'
} 