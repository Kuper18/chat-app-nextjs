import React from 'react';

import MainLayout from '@/components/main-layout';
import { MessageHistory } from '@/components/message-history';

type Props = {
  params: { roomId: string };
};

const RoomPage = async ({ params }: Props) => {
  const { roomId } = await params;

  return (
    <MainLayout>
      <MessageHistory roomId={Number(roomId)} />
    </MainLayout>
  );
};

export default RoomPage;
