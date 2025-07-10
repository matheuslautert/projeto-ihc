import Papa from 'papaparse'
import { 
  Estagio, 
  Empresa, 
  Orientador, 
  Estagiario, 
  VisitaArticulador, 
  VisitaOrientador,
  EstagioFilters,
  EstagioStats,
  EstagioStatus,
  MotivoConclusao
} from '../types/estagios'
import { parse, isValid, isAfter, isBefore, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Cache para os dados carregados
let estagiosCache: Estagio[] = []
let empresasCache: Empresa[] = []
let orientadoresCache: Orientador[] = []
let estagiariosCache: Estagiario[] = []
let visitasArticuladorCache: VisitaArticulador[] = []
let visitasOrientadorCache: VisitaOrientador[] = []

// Função para converter string de data para Date
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || dateStr.trim() === '' || dateStr === '#VALUE!') {
    return null
  }
  
  // Tenta diferentes formatos de data
  const formats = ['dd/MM/yyyy', 'dd/MM/yy', 'yyyy-MM-dd']
  
  for (const format of formats) {
    try {
      const parsed = parse(dateStr, format, new Date(), { locale: ptBR })
      if (isValid(parsed)) {
        return parsed
      }
    } catch {
      continue
    }
  }
  
  return null
}

// Função para determinar o status do estágio
const getEstagioStatus = (estagio: Estagio): EstagioStatus => {
  const hoje = startOfDay(new Date())
  
  // Se tem conclusão, está concluído
  if (estagio.conclusaoEstagio && estagio.conclusaoEstagio.trim() !== '') {
    return 'concluido'
  }
  
  // Se tem prazo máximo, verifica se venceu
  if (estagio.prazoMaximo) {
    const prazoDate = parseDate(estagio.prazoMaximo)
    if (prazoDate && isBefore(prazoDate, hoje)) {
      return 'prazo_vencido'
    }
  }
  
  // Se não tem TCE entregue, pode estar interrompido
  if (!estagio.tceEntregue || estagio.tceEntregue.trim() === '') {
    return 'interrompido'
  }
  
  return 'ativo'
}

// Função para processar dados do CSV de estágios
const processEstagiosData = (data: any[]): Estagio[] => {
  return data
    .filter(row => row.NOME && row.NOME.trim() !== '')
    .map(row => ({
      nome: row.NOME?.trim() || '',
      obrigatorio: row.OBRIG?.trim() || '',
      empresa: row.EMPRESA?.trim() || '',
      tceEntregue: row['TCE\nENTREGUE']?.trim() || '',
      conclusaoEstagio: row['CONCLUSÃO\nDO ESTÁGIO']?.trim() || '',
      prazoMaximo: row['PRAZO MÁXIMO']?.trim() || '',
      orientadorAtual: row['ORIENTADOR ATUAL DESIGNADO PELO ARTICULADOR']?.trim() || '',
      orientadorAnterior: row['ORIENTADOR ANTERIOR DESIGNADO PELO ARTICULADOR']?.trim() || '',
      fpe: row.FPE?.trim() || '',
      fpeLimite: row['FPE\nLIMITE']?.trim() || '',
      inicioTce: row['INÍCIO\n(TCE APROVADO)']?.trim() || '',
      terminoPrevisto: row['TÉRMINO PREVISTO']?.trim() || '',
      relatorioParcial1Limite: row['Relatório Parcial 1']?.trim() || '',
      relatorioParcial1Entregue: row['Relatório Parcial 1.1']?.trim() || '',
      relatorioParcial1Avaliado: row['Relatório Parcial 1.2']?.trim() || '',
      relatorioParcial2Limite: row['Relatório Parcial 2']?.trim() || '',
      relatorioParcial2Entregue: row['Relatório Parcial 2.1']?.trim() || '',
      relatorioParcial2Avaliado: row['Relatório Parcial 2.2']?.trim() || '',
      relatorioParcial3Limite: row['Relatório Parcial 3']?.trim() || '',
      relatorioParcial3Entregue: row['Relatório Parcial 3.1']?.trim() || '',
      relatorioParcial3Avaliado: row['Relatório Parcial 3.2']?.trim() || '',
      relatorioFinalLimite: row['Relatório FINAL']?.trim() || '',
      relatorioFinalEntregue: row['Relatório FINAL.1']?.trim() || '',
      relatorioFinalAvaliado: row['Relatório FINAL.2']?.trim() || '',
      prorrogacaoData1: row['PRORROGAÇÕES DO ESTÁGIO']?.trim() || '',
      prorrogacaoData2: row['PRORROGAÇÕES DO ESTÁGIO.1']?.trim() || '',
      prorrogacaoData3: row['PRORROGAÇÕES DO ESTÁGIO.2']?.trim() || '',
      supervisorNaEmpresa: row['SUPERVISOR NA EMPRESA']?.trim() || '',
    }))
    .filter(estagio => estagio.nome && estagio.empresa)
}

// Função para extrair empresas únicas dos estágios
const extractEmpresas = (estagios: Estagio[]): Empresa[] => {
  const empresasMap = new Map<string, Empresa>()
  
  estagios.forEach(estagio => {
    if (estagio.empresa && !empresasMap.has(estagio.empresa)) {
      empresasMap.set(estagio.empresa, {
        nome: estagio.empresa,
        cnpj: '',
        areaAtuacao: '',
        endereco: '',
        contato: '',
      })
    }
  })
  
  return Array.from(empresasMap.values())
}

// Função para extrair orientadores únicos dos estágios
const extractOrientadores = (estagios: Estagio[]): Orientador[] => {
  const orientadoresMap = new Map<string, Orientador>()
  
  estagios.forEach(estagio => {
    if (estagio.orientadorAtual && !orientadoresMap.has(estagio.orientadorAtual)) {
      orientadoresMap.set(estagio.orientadorAtual, {
        nome: estagio.orientadorAtual,
        area: '',
        matricula: '',
        email: '',
        telefone: '',
      })
    }
    
    if (estagio.orientadorAnterior && !orientadoresMap.has(estagio.orientadorAnterior)) {
      orientadoresMap.set(estagio.orientadorAnterior, {
        nome: estagio.orientadorAnterior,
        area: '',
        matricula: '',
        email: '',
        telefone: '',
      })
    }
  })
  
  return Array.from(orientadoresMap.values())
}

// Função para extrair estagiários únicos dos estágios
const extractEstagiarios = (estagios: Estagio[]): Estagiario[] => {
  return estagios.map(estagio => ({
    nome: estagio.nome,
    ra: '',
    curso: '',
    email: '',
    telefone: '',
  }))
}

// Carregar dados do CSV
export const loadEstagiosData = async (): Promise<{
  estagios: Estagio[]
  empresas: Empresa[]
  orientadores: Orientador[]
  estagiarios: Estagiario[]
}> => {
  try {
    const response = await fetch('/docs/database.csv')
    const csvText = await response.text()
    
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    })
    
    const estagios = processEstagiosData(data)
    const empresas = extractEmpresas(estagios)
    const orientadores = extractOrientadores(estagios)
    const estagiarios = extractEstagiarios(estagios)
    
    // Atualizar cache
    estagiosCache = estagios
    empresasCache = empresas
    orientadoresCache = orientadores
    estagiariosCache = estagiarios
    
    return { estagios, empresas, orientadores, estagiarios }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    throw new Error('Falha ao carregar dados da planilha')
  }
}

// Funções de consulta e filtro
export const getEstagios = (filters?: EstagioFilters): Estagio[] => {
  let filtered = [...estagiosCache]
  
  if (filters?.empresa) {
    filtered = filtered.filter(e => 
      e.empresa.toLowerCase().includes(filters.empresa!.toLowerCase())
    )
  }
  
  if (filters?.orientador) {
    filtered = filtered.filter(e => 
      e.orientadorAtual?.toLowerCase().includes(filters.orientador!.toLowerCase()) ||
      e.orientadorAnterior?.toLowerCase().includes(filters.orientador!.toLowerCase())
    )
  }
  
  if (filters?.status) {
    filtered = filtered.filter(e => getEstagioStatus(e) === filters.status)
  }
  
  if (filters?.obrigatorio !== undefined) {
    filtered = filtered.filter(e => 
      filters.obrigatorio ? e.obrigatorio === 'SIM' : e.obrigatorio !== 'SIM'
    )
  }
  
  if (filters?.prazoVencido) {
    filtered = filtered.filter(e => getEstagioStatus(e) === 'prazo_vencido')
  }
  
  return filtered
}

export const getEstagioStats = (): EstagioStats => {
  const total = estagiosCache.length
  const ativos = estagiosCache.filter(e => getEstagioStatus(e) === 'ativo').length
  const concluidos = estagiosCache.filter(e => getEstagioStatus(e) === 'concluido').length
  const interrompidos = estagiosCache.filter(e => getEstagioStatus(e) === 'interrompido').length
  const obrigatorios = estagiosCache.filter(e => e.obrigatorio === 'SIM').length
  const prazoVencido = estagiosCache.filter(e => getEstagioStatus(e) === 'prazo_vencido').length
  
  return {
    total,
    ativos,
    concluidos,
    interrompidos,
    obrigatorios,
    prazoVencido,
  }
}

export const getEmpresas = (): Empresa[] => {
  return [...empresasCache]
}

export const getOrientadores = (): Orientador[] => {
  return [...orientadoresCache]
}

export const getEstagiarios = (): Estagiario[] => {
  return [...estagiariosCache]
}

export const getEstagioById = (nome: string): Estagio | undefined => {
  return estagiosCache.find(e => e.nome === nome)
}

export const getEmpresaByName = (nome: string): Empresa | undefined => {
  return empresasCache.find(e => e.nome === nome)
}

export const getOrientadorByName = (nome: string): Orientador | undefined => {
  return orientadoresCache.find(e => e.nome === nome)
}

// Função para exportar dados filtrados
export const exportEstagiosToCSV = (estagios: Estagio[]): string => {
  const headers = [
    'Nome',
    'Obrigatório',
    'Empresa',
    'TCE Entregue',
    'Conclusão do Estágio',
    'Prazo Máximo',
    'Orientador Atual',
    'Supervisor na Empresa',
    'Status'
  ]
  
  const rows = estagios.map(estagio => [
    estagio.nome,
    estagio.obrigatorio,
    estagio.empresa,
    estagio.tceEntregue,
    estagio.conclusaoEstagio,
    estagio.prazoMaximo,
    estagio.orientadorAtual,
    estagio.supervisorNaEmpresa,
    getEstagioStatus(estagio)
  ])
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell || ''}"`).join(','))
    .join('\n')
  
  return csvContent
} 