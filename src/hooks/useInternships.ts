import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  loadInternshipData, 
  filterInternships, 
  getInternshipStats,
  exportToCSV 
} from '../services/internshipService'
import { InternshipFilters, Internship } from '../types/internship'

// Query keys
export const internshipKeys = {
  all: ['internships'] as const,
  lists: () => [...internshipKeys.all, 'list'] as const,
  list: (filters: InternshipFilters) => [...internshipKeys.lists(), filters] as const,
  stats: () => [...internshipKeys.all, 'stats'] as const,
  companies: () => [...internshipKeys.all, 'companies'] as const,
  advisors: () => [...internshipKeys.all, 'advisors'] as const,
  interns: () => [...internshipKeys.all, 'interns'] as const,
}

// Hook to load all internship data
export function useInternshipData() {
  return useQuery({
    queryKey: internshipKeys.all,
    queryFn: loadInternshipData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook to get filtered internships
export function useFilteredInternships(filters: InternshipFilters) {
  return useQuery({
    queryKey: internshipKeys.list(filters),
    queryFn: async () => {
      const data = await loadInternshipData()
      return filterInternships(data.internships, filters)
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook to get internship statistics
export function useInternshipStats() {
  return useQuery({
    queryKey: internshipKeys.stats(),
    queryFn: async () => {
      const data = await loadInternshipData()
      return getInternshipStats(data.internships)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to get companies data
export function useCompanies() {
  return useQuery({
    queryKey: internshipKeys.companies(),
    queryFn: async () => {
      const data = await loadInternshipData()
      return data.companies
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to get advisors data
export function useAdvisors() {
  return useQuery({
    queryKey: internshipKeys.advisors(),
    queryFn: async () => {
      const data = await loadInternshipData()
      return data.advisors
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to get interns data
export function useInterns() {
  return useQuery({
    queryKey: internshipKeys.interns(),
    queryFn: async () => {
      const data = await loadInternshipData()
      return data.interns
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to export data
export function useExportData() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ data, filename }: { data: any[], filename: string }) => {
      exportToCSV(data, filename)
    },
    onSuccess: () => {
      // Invalidate queries to refresh data if needed
      queryClient.invalidateQueries({ queryKey: internshipKeys.all })
    },
  })
}

// Hook to get unique values for filters
export function useFilterOptions() {
  const { data } = useInternshipData()
  
  if (!data) {
    return {
      companies: [],
      advisors: [],
      statuses: ['ATIVO', 'CONCLUÍDO', 'INTERROMPIDO', 'CANCELADO'],
      types: ['SIM', 'NÃO', 'NAO', '290'],
    }
  }
  
  const companies = [...new Set(data.internships.map(i => i.empresa).filter(Boolean))]
  const advisors = [...new Set([
    ...data.internships.map(i => i.orientadorAtual).filter(Boolean),
    ...data.internships.map(i => i.orientadorAnterior).filter(Boolean)
  ])]
  
  return {
    companies: companies.sort(),
    advisors: advisors.sort(),
    statuses: ['ATIVO', 'CONCLUÍDO', 'INTERROMPIDO', 'CANCELADO'],
    types: ['SIM', 'NÃO', 'NAO', '290'],
  }
} 