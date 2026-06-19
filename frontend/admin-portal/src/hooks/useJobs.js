import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import jobService from '../services/jobService';

export function useAdminJobs(params) {
  return useQuery({
    queryKey: ['adminJobs', params],
    queryFn: () => jobService.getJobs(params)
  });
}

export function useAdminCompanies() {
  return useQuery({
    queryKey: ['adminCompaniesList'],
    queryFn: () => jobService.getCompanies()
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ['adminCategoriesList'],
    queryFn: () => jobService.getCategories()
  });
}

export function useImportParse() {
  return useMutation({
    mutationFn: (text) => jobService.importParse(text)
  });
}

export function useSaveJob(selectedJobId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      if (selectedJobId) {
        return jobService.updateJob(selectedJobId, payload);
      } else {
        return jobService.createJob(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    }
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => jobService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    }
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    }
  });
}

export function useCloneJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => jobService.cloneJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
    }
  });
}
