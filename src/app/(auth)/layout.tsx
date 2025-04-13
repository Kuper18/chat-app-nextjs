import AuthTemplate from '@/components/auth-template';
import React from 'react';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  return <AuthTemplate>{children}</AuthTemplate>;
};

export default AuthLayout;
