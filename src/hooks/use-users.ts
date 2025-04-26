import { QueryKeys } from '@/enum';
import UsersService from '@/services/users';
import { useQuery } from '@tanstack/react-query';

const useUsers = () => {
  return useQuery({ queryKey: [QueryKeys.USERS], queryFn: UsersService.get });
};

export default useUsers;
