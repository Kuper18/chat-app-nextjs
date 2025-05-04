import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { QueryKeys } from '@/enum';
import UsersService from '@/services/users';
import { TUser } from '@/types';

const useUsers = (searchQuery: string) => {
  const {
    data: usersData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QueryKeys.USERS, searchQuery],
    queryFn: async ({ pageParam }) => {
      return UsersService.get({ offset: pageParam, search: searchQuery });
    },
    getNextPageParam: (lastPage) => lastPage.meta.next,
    initialPageParam: 0,
  });

  const users = useMemo(() => {
    return (
      usersData?.pages.reduce(
        (acc, curr) => [...acc, ...curr.users],
        [] as TUser[],
      ) ?? []
    );
  }, [usersData]);

  return {
    hasNextPage,
    users,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
  };
};

export default useUsers;
