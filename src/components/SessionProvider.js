// components/SessionProvider.js
'use client'; // 클라이언트 컴포넌트임을 명시

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

// NextAuth.js의 SessionProvider를 감싸는 클라이언트 컴포넌트
export default function SessionProvider({ children }) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}