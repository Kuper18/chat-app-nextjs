'use client';

import React from 'react';
import {
  QueryClient,
  QueryClientProvider as QueryProvider,
} from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: Props) => {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>;
};

export default QueryClientProvider;
