import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/enum';
import UsersService from '@/services/users';

const useUsers = () => {
  return useQuery({ queryKey: [QueryKeys.USERS], queryFn: UsersService.get });
};

export default useUsers;
