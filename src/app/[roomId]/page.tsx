import MainLayout from '@/components/main-layout';
import { MessageHistory } from '@/components/message-history';
import React from 'react';

type Props = {
  params: { roomId: string };
};

const RoomPage = async ({ params }: Props) => {
  const { roomId } = await params;

  return (
    <MainLayout>
      <MessageHistory roomId={roomId} />
    </MainLayout>
  );
};

export default RoomPage;
