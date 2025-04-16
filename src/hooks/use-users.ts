import UsersService from '@/services/users';
import { useQuery } from '@tanstack/react-query';

const useUsers = () => {
  return useQuery({ queryKey: ['users'], queryFn: UsersService.get });
};

export default useUsers;
