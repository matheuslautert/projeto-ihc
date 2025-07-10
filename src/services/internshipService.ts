import Papa from 'papaparse'
import { Internship, Company, Advisor, Intern, InternshipStatus, InternshipFilters } from '../types/internship'
import { parse, isValid } from 'date-fns'

// Cache for parsed data
let cachedData: {
  internships: Internship[]
  companies: Company[]
  advisors: Advisor[]
  interns: Intern[]
} | null = null

// Helper function to determine internship status
function determineStatus(internship: any): InternshipStatus {
  if (internship.conclusaoEstagio && internship.conclusaoEstagio.trim()) {
    const motivo = internship.motivoConclusao?.toLowerCase() || ''
    if (motivo.includes('contratação')) return 'CONCLUÍDO'
    if (motivo.includes('desistência')) return 'CANCELADO'
    if (motivo.includes('demissão')) return 'INTERROMPIDO'
    if (motivo.includes('encerramento')) return 'CONCLUÍDO'
    if (motivo.includes('interrupção')) return 'INTERROMPIDO'
    if (motivo.includes('cancelamento')) return 'CANCELADO'
    return 'CONCLUÍDO'
  }
  return 'ATIVO'
}

// Helper function to parse date
function parseDate(dateStr: string): string | undefined {
  if (!dateStr || dateStr.trim() === '' || dateStr === '#VALUE!' || dateStr === 'em ser') {
    return undefined
  }
  
  // Clean the date string
  const cleanDate = dateStr.trim()
  
  // For dd/MM/yyyy format, parse manually to avoid timezone issues
  const ddMMyyyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (ddMMyyyyMatch) {
    const [, day, month, year] = ddMMyyyyMatch
    const dayNum = parseInt(day, 10)
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)
    
    // Validate date components
    if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
      return `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
    }
  }
  
  // For dd/MM/yy format
  const ddMMyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/)
  if (ddMMyyMatch) {
    const [, day, month, year] = ddMMyyMatch
    const dayNum = parseInt(day, 10)
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10) + 2000 // Assume 20xx
    
    if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12) {
      return `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
    }
  }
  
  // For yyyy-MM-dd format
  const yyyyMMddMatch = cleanDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (yyyyMMddMatch) {
    const [, year, month, day] = yyyyMMddMatch
    const dayNum = parseInt(day, 10)
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)
    
    if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
      return `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
    }
  }
  
  // Fallback to date-fns for other formats
  const formats = ['dd/MM/yyyy', 'dd/MM/yy', 'yyyy-MM-dd']
  
  for (const format of formats) {
    try {
      const parsed = parse(cleanDate, format, new Date())
      if (isValid(parsed)) {
        const year = parsed.getFullYear()
        const month = String(parsed.getMonth() + 1).padStart(2, '0')
        const day = String(parsed.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    } catch {
      continue
    }
  }
  
  return undefined
}

// Helper function to get column value with fallbacks
function getColumnValue(row: any, possibleNames: string[]): string | undefined {
  for (const name of possibleNames) {
    if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
      return row[name].trim()
    }
  }
  return undefined
}

// Transform raw CSV data to structured format
function transformInternshipData(rawData: any[]): Internship[] {
  console.log('Raw CSV data sample:', rawData.slice(0, 2))
  
  return rawData
    .filter(row => {
      const nome = getColumnValue(row, ['NOME', 'nome', 'Nome'])
      return nome && nome.trim() !== ''
    })
    .map(row => {
      // Debug: log the first row to see the actual column names
      const nome = getColumnValue(row, ['NOME', 'nome', 'Nome'])
      if (nome === 'alexandre herbst carvalho') {
        console.log('Sample row data:', row)
        console.log('Available columns:', Object.keys(row))
      }
      
      // Simplified mapping for testing
      return {
        nome: getColumnValue(row, ['NOME', 'nome', 'Nome']) || '',
        obrigatorio: (getColumnValue(row, ['OBRIG.', 'OBRIG', 'obrigatorio', 'Obrigatorio']) as 'SIM' | 'NÃO' | 'NAO' | '290') || undefined,
        empresa: getColumnValue(row, ['EMPRESA', 'empresa', 'Empresa']),
        tceEntregue: parseDate(getColumnValue(row, ['TCE\nENTREGUE', 'TCE_ENTREGUE', 'TCE ENTREGUE', 'tce_entregue']) || ''),
        conclusaoEstagio: getColumnValue(row, ['CONCLUSÃO\nDO ESTÁGIO', 'CONCLUSAO DO ESTAGIO', 'conclusao_estagio']),
        dataConclusao: parseDate(getColumnValue(row, ['Data ', 'DATA', 'data_conclusao']) || ''),
        motivoConclusao: getColumnValue(row, ['Motivo', 'MOTIVO', 'motivo_conclusao']),
        prazoMaximo: parseDate(getColumnValue(row, ['PRAZO MÁXIMO', 'PRAZO MAXIMO', 'prazo_maximo']) || ''),
        orientadorAtual: getColumnValue(row, ['ORIENTADOR ATUAL DESIGNADO PELO ARTICULADOR', 'ORIENTADOR ATUAL', 'orientador_atual']),
        orientadorAnterior: getColumnValue(row, ['ORIENTADOR ANTERIOR DESIGNADO PELO ARTICULADOR', 'ORIENTADOR ANTERIOR', 'orientador_anterior']),
        fpe: getColumnValue(row, ['FPE', 'fpe']),
        inicioTce: parseDate(getColumnValue(row, ['INÍCIO\n(TCE APROVADO)', 'INICIO (TCE APROVADO)', 'inicio_tce']) || ''),
        terminoPrevisto: parseDate(getColumnValue(row, ['TÉRMINO PREVISTO', 'TERMINO PREVISTO', 'termino_previsto']) || ''),
        relatorioParcial1: {
          limite: parseDate(getColumnValue(row, ['Relatório Parcial 1', 'RELATORIO PARCIAL 1', 'relatorio_parcial_1_limite']) || ''),
          entregue: parseDate(getColumnValue(row, ['REALIZADO', 'realizado', 'relatorio_parcial_1_entregue']) || ''),
          avaliado: parseDate(getColumnValue(row, ['AVALIADO', 'avaliado', 'relatorio_parcial_1_avaliado']) || ''),
        },
        relatorioParcial2: {
          limite: parseDate(getColumnValue(row, ['Relatório Parcial 2', 'RELATORIO PARCIAL 2', 'relatorio_parcial_2_limite']) || ''),
          entregue: parseDate(getColumnValue(row, ['ENTREGUE', 'entregue', 'relatorio_parcial_2_entregue']) || ''),
          avaliado: parseDate(getColumnValue(row, ['AVALIADO.1', 'AVALIADO_1', 'relatorio_parcial_2_avaliado']) || ''),
        },
        relatorioParcial3: {
          limite: parseDate(getColumnValue(row, ['Relatório Parcial 3', 'RELATORIO PARCIAL 3', 'relatorio_parcial_3_limite']) || ''),
          entregue: parseDate(getColumnValue(row, ['ENTREGUE.1', 'ENTREGUE_1', 'relatorio_parcial_3_entregue']) || ''),
          avaliado: parseDate(getColumnValue(row, ['AVALIADO.2', 'AVALIADO_2', 'relatorio_parcial_3_avaliado']) || ''),
        },
        relatorioFinal: {
          limite: parseDate(getColumnValue(row, ['Relatório FINAL', 'RELATORIO FINAL', 'relatorio_final_limite']) || ''),
          entregue: parseDate(getColumnValue(row, ['ENTREGUE.2', 'ENTREGUE_2', 'relatorio_final_entregue']) || ''),
          avaliado: parseDate(getColumnValue(row, ['AVALIADO.3', 'AVALIADO_3', 'relatorio_final_avaliado']) || ''),
        },
        prorrogacoes: [
          getColumnValue(row, ['PRORROGAÇÕES DO ESTÁGIO', 'PRORROGACOES DO ESTAGIO', 'prorrogacoes']),
          getColumnValue(row, ['Data 1', 'DATA_1', 'data_1']),
          getColumnValue(row, ['Data 2', 'DATA_2', 'data_2']),
          getColumnValue(row, ['Data 3', 'DATA_3', 'data_3']),
        ].filter((value): value is string => Boolean(value)),
        supervisorEmpresa: getColumnValue(row, ['SUPERVISOR NA EMPRESA', 'SUPERVISOR', 'supervisor_empresa']),
      }
    })
}

// Generate companies data
function generateCompaniesData(internships: Internship[]): Company[] {
  const companyMap = new Map<string, Company>()
  
  internships.forEach(internship => {
    if (!internship.empresa) return
    
    const companyName = internship.empresa.trim()
    const status = determineStatus(internship)
    
    if (!companyMap.has(companyName)) {
      companyMap.set(companyName, {
        nome: companyName,
        totalInternships: 0,
        activeInternships: 0,
        concludedInternships: 0,
      })
    }
    
    const company = companyMap.get(companyName)!
    company.totalInternships++
    
    if (status === 'ATIVO') {
      company.activeInternships++
    } else {
      company.concludedInternships++
    }
  })
  
  return Array.from(companyMap.values()).sort((a, b) => b.totalInternships - a.totalInternships)
}

// Generate advisors data
function generateAdvisorsData(internships: Internship[]): Advisor[] {
  const advisorMap = new Map<string, Advisor>()
  
  internships.forEach(internship => {
    const advisorName = internship.orientadorAtual || internship.orientadorAnterior
    if (!advisorName) return
    
    const status = determineStatus(internship)
    
    if (!advisorMap.has(advisorName)) {
      advisorMap.set(advisorName, {
        nome: advisorName,
        totalInternships: 0,
        activeInternships: 0,
        concludedInternships: 0,
      })
    }
    
    const advisor = advisorMap.get(advisorName)!
    advisor.totalInternships++
    
    if (status === 'ATIVO') {
      advisor.activeInternships++
    } else {
      advisor.concludedInternships++
    }
  })
  
  return Array.from(advisorMap.values()).sort((a, b) => b.totalInternships - a.totalInternships)
}

// Generate interns data
function generateInternsData(internships: Internship[]): Intern[] {
  return internships.map(internship => ({
    nome: internship.nome,
    obrigatorio: internship.obrigatorio,
    empresa: internship.empresa,
    orientador: internship.orientadorAtual || internship.orientadorAnterior,
    status: determineStatus(internship),
    inicioEstagio: internship.inicioTce,
    terminoEstagio: internship.dataConclusao || internship.terminoPrevisto,
  }))
}

// Load and parse CSV data
export async function loadInternshipData(): Promise<{
  internships: Internship[]
  companies: Company[]
  advisors: Advisor[]
  interns: Intern[]
}> {
  if (cachedData) return cachedData

  try {
    const response = await fetch('/docs/database.csv')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const csvText = await response.text()

    // Encontrar a linha do cabeçalho real
    const lines = csvText.split(/\r?\n/)
    const headerIndex = lines.findIndex(line =>
      line.toUpperCase().includes('NOME') && line.toUpperCase().includes('EMPRESA')
    )
    if (headerIndex === -1) throw new Error('Cabeçalho real não encontrado no CSV')

    // Parse apenas a partir do cabeçalho real
    const csvData = lines.slice(headerIndex).join('\n')
    const { data, errors } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim(),
    })

    if (errors.length > 0) {
      console.warn('CSV parsing errors:', errors)
    }

    // Filtrar linhas válidas
    const validData = data.filter((row: any) => {
      const nome = row.NOME || row.nome || row.Nome
      return nome && nome.trim() !== '' && nome.trim() !== 'NOME'
    })

    const internships = transformInternshipData(validData)
    const companies = generateCompaniesData(internships)
    const advisors = generateAdvisorsData(internships)
    const interns = generateInternsData(internships)

    cachedData = { internships, companies, advisors, interns }
    return cachedData
  } catch (error) {
    console.error('Error loading internship data:', error)
    throw error
  }
}

// Filter internships based on criteria
export function filterInternships(
  internships: Internship[],
  filters: InternshipFilters
): Internship[] {
  return internships.filter(internship => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const matchesSearch = 
        internship.nome.toLowerCase().includes(searchTerm) ||
        (internship.empresa?.toLowerCase().includes(searchTerm) || false) ||
        (internship.orientadorAtual?.toLowerCase().includes(searchTerm) || false) ||
        (internship.orientadorAnterior?.toLowerCase().includes(searchTerm) || false)
      
      if (!matchesSearch) return false
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      const status = determineStatus(internship)
      if (!filters.status.includes(status)) return false
    }
    
    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!internship.obrigatorio || !filters.type.includes(internship.obrigatorio)) {
        return false
      }
    }
    
    // Company filter
    if (filters.company && filters.company.length > 0) {
      if (!internship.empresa || !filters.company.includes(internship.empresa)) {
        return false
      }
    }
    
    // Advisor filter
    if (filters.advisor && filters.advisor.length > 0) {
      const advisor = internship.orientadorAtual || internship.orientadorAnterior
      if (!advisor || !filters.advisor.includes(advisor)) {
        return false
      }
    }
    
    return true
  })
}

// Get internship statistics
export function getInternshipStats(internships: Internship[]) {
  const stats = {
    total: internships.length,
    active: 0,
    concluded: 0,
    interrupted: 0,
    canceled: 0,
    mandatory: 0,
    optional: 0,
  }
  
  internships.forEach(internship => {
    const status = determineStatus(internship)
    
    switch (status) {
      case 'ATIVO':
        stats.active++
        break
      case 'CONCLUÍDO':
        stats.concluded++
        break
      case 'INTERROMPIDO':
        stats.interrupted++
        break
      case 'CANCELADO':
        stats.canceled++
        break
    }
    
    if (internship.obrigatorio === 'SIM') {
      stats.mandatory++
    } else {
      stats.optional++
    }
  })
  
  return stats
}

// Export data to CSV
export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
} 