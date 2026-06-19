import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import jobService from '../services/jobService';
import userService from '../services/userService';

export function useJobsList(params) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobService.getJobs(params)
  });
}

export function useJobDetails(id) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobDetails(id),
    enabled: !!id
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => jobService.getCategories()
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ['companiesHome'],
    queryFn: () => jobService.getCompanies()
  });
}

export function useSavedJobsList(isLoggedIn) {
  return useQuery({
    queryKey: ['savedJobsHome'],
    queryFn: () => userService.getSavedJobs(),
    enabled: !!isLoggedIn
  });
}

export function useSavedStatus(id, isLoggedIn) {
  return useQuery({
    queryKey: ['savedCheck', id],
    queryFn: () => jobService.checkSavedStatus(id),
    enabled: !!isLoggedIn && !!id
  });
}

export function useToggleSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isSaved }) => {
      if (isSaved) {
        return jobService.deleteSavedJob(id);
      } else {
        return jobService.saveJob(id);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['savedJobsHome'] });
      queryClient.invalidateQueries({ queryKey: ['savedCheck', variables.id] });
    }
  });
}
