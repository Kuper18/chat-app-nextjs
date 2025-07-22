import React from 'react';

import MainLayout from '@/components/main-layout';
import { MessageHistory } from '@/components/message-history';

const RoomPage = () => {
  return (
    <MainLayout>
      <MessageHistory />
    </MainLayout>
  );
};

export default RoomPage;
