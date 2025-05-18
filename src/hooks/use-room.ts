import { useQuery } from '@tanstack/react-query';

import { QueryKeys } from '@/enum';
import RoomsService from '@/services/rooms';

const useRoom = (userId: number) => {
  return useQuery({
    queryKey: [QueryKeys.ROOM, userId],
    queryFn: () => RoomsService.get(userId),
  });
};

export default useRoom;
