import { useMutation } from '@tanstack/react-query';
import authService from '../services/authService';

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      return authService.login(email, password);
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({ fullName, email, password }) => {
      return authService.register(fullName, email, password);
    }
  });
}
