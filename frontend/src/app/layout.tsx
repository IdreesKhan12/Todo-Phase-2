'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/src/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
