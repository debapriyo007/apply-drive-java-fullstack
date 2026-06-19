import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../services/adminService';

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getAnalytics()
  });
}

export function useAdminCompaniesSetup() {
  return useQuery({
    queryKey: ['adminCompanies'],
    queryFn: () => adminService.getCompanies()
  });
}

export function useSaveCompany(selectedCompanyId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      if (selectedCompanyId) {
        return adminService.updateCompany(selectedCompanyId, payload);
      } else {
        return adminService.createCompany(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
    }
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });
    }
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => adminService.getUsers()
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => adminService.updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: ({ email, password }) => adminService.login(email, password)
  });
}
