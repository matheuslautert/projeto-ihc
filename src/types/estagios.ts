import { z } from 'zod'

// Schema de validação para Estágio
export const EstagioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  obrigatorio: z.string().optional(),
  empresa: z.string().min(1, "Empresa é obrigatória"),
  tceEntregue: z.string().optional(),
  conclusaoEstagio: z.string().optional(),
  prazoMaximo: z.string().optional(),
  orientadorAtual: z.string().optional(),
  orientadorAnterior: z.string().optional(),
  fpe: z.string().optional(),
  fpeLimite: z.string().optional(),
  inicioTce: z.string().optional(),
  terminoPrevisto: z.string().optional(),
  relatorioParcial1Limite: z.string().optional(),
  relatorioParcial1Entregue: z.string().optional(),
  relatorioParcial1Avaliado: z.string().optional(),
  relatorioParcial2Limite: z.string().optional(),
  relatorioParcial2Entregue: z.string().optional(),
  relatorioParcial2Avaliado: z.string().optional(),
  relatorioParcial3Limite: z.string().optional(),
  relatorioParcial3Entregue: z.string().optional(),
  relatorioParcial3Avaliado: z.string().optional(),
  relatorioFinalLimite: z.string().optional(),
  relatorioFinalEntregue: z.string().optional(),
  relatorioFinalAvaliado: z.string().optional(),
  prorrogacaoData1: z.string().optional(),
  prorrogacaoData2: z.string().optional(),
  prorrogacaoData3: z.string().optional(),
  supervisorNaEmpresa: z.string().optional(),
})

// Schema de validação para Empresa
export const EmpresaSchema = z.object({
  nome: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().optional(),
  areaAtuacao: z.string().optional(),
  endereco: z.string().optional(),
  contato: z.string().optional(),
})

// Schema de validação para Orientador
export const OrientadorSchema = z.object({
  nome: z.string().min(1, "Nome do orientador é obrigatório"),
  area: z.string().optional(),
  matricula: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
})

// Schema de validação para Estagiário
export const EstagiarioSchema = z.object({
  nome: z.string().min(1, "Nome do estagiário é obrigatório"),
  ra: z.string().optional(),
  curso: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
})

// Schema de validação para Visita do Articulador
export const VisitaArticuladorSchema = z.object({
  dataVisita: z.string().optional(),
  efetivada: z.string().optional(),
  empresa: z.string().optional(),
  supervisorNaEmpresa: z.string().optional(),
  estagiariosAtivosObrigatorios: z.string().optional(),
  observacoes: z.string().optional(),
})

// Schema de validação para Visita do Orientador
export const VisitaOrientadorSchema = z.object({
  orientador: z.string().optional(),
  dataVisita: z.string().optional(),
  empresa: z.string().optional(),
  supervisorNaEmpresa: z.string().optional(),
  nomeEstagiario: z.string().optional(),
  observacoes: z.string().optional(),
})

// Tipos derivados dos schemas
export type Estagio = z.infer<typeof EstagioSchema>
export type Empresa = z.infer<typeof EmpresaSchema>
export type Orientador = z.infer<typeof OrientadorSchema>
export type Estagiario = z.infer<typeof EstagiarioSchema>
export type VisitaArticulador = z.infer<typeof VisitaArticuladorSchema>
export type VisitaOrientador = z.infer<typeof VisitaOrientadorSchema>

// Tipos para filtros e consultas
export interface EstagioFilters {
  empresa?: string
  orientador?: string
  status?: 'ativo' | 'concluido' | 'interrompido'
  obrigatorio?: boolean
  prazoVencido?: boolean
}

export interface EstagioStats {
  total: number
  ativos: number
  concluidos: number
  interrompidos: number
  obrigatorios: number
  prazoVencido: number
}

// Status do estágio baseado nos dados
export type EstagioStatus = 
  | 'ativo'
  | 'concluido'
  | 'interrompido'
  | 'prazo_vencido'

// Motivos de conclusão
export type MotivoConclusao = 
  | 'Contratação'
  | 'Desistência'
  | 'Demissão'
  | 'Encerramento do Prazo Máximo'
  | 'Interrupção'
  | 'Cancelamento' 