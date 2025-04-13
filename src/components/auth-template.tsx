import React from 'react';

const AuthTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex items-center justify-center bg-primary px-5">
      {children}
    </main>
  );
};

export default AuthTemplate;
