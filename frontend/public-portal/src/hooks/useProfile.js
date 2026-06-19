import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';

export function useProfile(isLoggedIn = true) {
  return useQuery({
    queryKey: ['profileHome'],
    queryFn: () => userService.getProfile(),
    enabled: isLoggedIn
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedData) => userService.updateProfile(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileHome'] });
    }
  });
}
