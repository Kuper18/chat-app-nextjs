'use client';

import {
  QueryClient,
  QueryClientProvider as QueryProvider,
} from '@tanstack/react-query';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: Props) => {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};

export default QueryClientProvider;
