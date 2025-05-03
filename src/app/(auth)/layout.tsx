import React from 'react';

import AuthTemplate from '@/components/auth-template';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  return <AuthTemplate>{children}</AuthTemplate>;
};

export default AuthLayout;
