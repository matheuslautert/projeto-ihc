import { z } from 'zod'

// Zod schemas for data validation
export const InternshipSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  obrigatorio: z.enum(['SIM', 'NÃO', 'NAO', '290']).optional(),
  empresa: z.string().optional(),
  tceEntregue: z.string().optional(),
  conclusaoEstagio: z.string().optional(),
  dataConclusao: z.string().optional(),
  motivoConclusao: z.string().optional(),
  prazoMaximo: z.string().optional(),
  orientadorAtual: z.string().optional(),
  orientadorAnterior: z.string().optional(),
  fpe: z.string().optional(),
  inicioTce: z.string().optional(),
  terminoPrevisto: z.string().optional(),
  relatorioParcial1: z.object({
    limite: z.string().optional(),
    entregue: z.string().optional(),
    avaliado: z.string().optional(),
  }),
  relatorioParcial2: z.object({
    limite: z.string().optional(),
    entregue: z.string().optional(),
    avaliado: z.string().optional(),
  }),
  relatorioParcial3: z.object({
    limite: z.string().optional(),
    entregue: z.string().optional(),
    avaliado: z.string().optional(),
  }),
  relatorioFinal: z.object({
    limite: z.string().optional(),
    entregue: z.string().optional(),
    avaliado: z.string().optional(),
  }),
  prorrogacoes: z.array(z.string()).optional(),
  supervisorEmpresa: z.string().optional(),
})

export const CompanySchema = z.object({
  nome: z.string().min(1, 'Nome da empresa é obrigatório'),
  totalInternships: z.number().default(0),
  activeInternships: z.number().default(0),
  concludedInternships: z.number().default(0),
})

export const AdvisorSchema = z.object({
  nome: z.string().min(1, 'Nome do orientador é obrigatório'),
  totalInternships: z.number().default(0),
  activeInternships: z.number().default(0),
  concludedInternships: z.number().default(0),
})

export const InternSchema = z.object({
  nome: z.string().min(1, 'Nome do estagiário é obrigatório'),
  obrigatorio: z.enum(['SIM', 'NÃO', 'NAO', '290']).optional(),
  empresa: z.string().optional(),
  orientador: z.string().optional(),
  status: z.enum(['ATIVO', 'CONCLUÍDO', 'INTERROMPIDO', 'CANCELADO']).optional(),
  inicioEstagio: z.string().optional(),
  terminoEstagio: z.string().optional(),
})

// TypeScript types derived from schemas
export type Internship = z.infer<typeof InternshipSchema>
export type Company = z.infer<typeof CompanySchema>
export type Advisor = z.infer<typeof AdvisorSchema>
export type Intern = z.infer<typeof InternSchema>

// Additional types for the application
export type InternshipStatus = 'ATIVO' | 'CONCLUÍDO' | 'INTERROMPIDO' | 'CANCELADO'
export type InternshipType = 'SIM' | 'NÃO' | 'NAO' | '290'

export interface InternshipFilters {
  status?: InternshipStatus[]
  type?: InternshipType[]
  company?: string[]
  advisor?: string[]
  search?: string
}

export interface InternshipStats {
  total: number
  active: number
  concluded: number
  interrupted: number
  canceled: number
  mandatory: number
  optional: number
}

export interface CompanyStats {
  total: number
  active: number
  concluded: number
  topCompanies: Array<{ name: string; count: number }>
}

export interface AdvisorStats {
  total: number
  active: number
  concluded: number
  topAdvisors: Array<{ name: string; count: number }>
} 