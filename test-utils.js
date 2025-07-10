// Função para gerar slug a partir de um nome
function generateSlug(name) {
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
function generateHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

// Função para gerar ID único para rotas
function generateRouteId(name) {
  const slug = generateSlug(name)
  const hash = generateHash(name)
  return `${slug}-${hash}`
}

// Função para extrair nome do ID da rota
function extractNameFromRouteId(routeId) {
  const parts = routeId.split('-')
  // Remove o hash (última parte) e reconstrói o nome
  return parts.slice(0, -1).join('-').replace(/-/g, ' ')
}

// Função para encontrar nome original baseado no slug e hash
function findOriginalName(slug, hash, candidates) {
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
function extractNameFromRouteIdImproved(routeId, candidates) {
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

// Teste com o nome problemático
const name = 'Jorge Henrique B. Casagrande'
const candidates = ['Jorge Henrique B. Casagrande', 'João Silva', 'Maria Santos']

console.log('Nome original:', name)
console.log('Slug:', generateSlug(name))
console.log('Hash:', generateHash(name))
console.log('Route ID:', generateRouteId(name))
console.log('Extraído (antigo):', extractNameFromRouteId(generateRouteId(name)))
console.log('Extraído (novo):', extractNameFromRouteIdImproved(generateRouteId(name), candidates))
console.log('Comparação (antigo):', name === extractNameFromRouteId(generateRouteId(name)))
console.log('Comparação (novo):', name === extractNameFromRouteIdImproved(generateRouteId(name), candidates)) 