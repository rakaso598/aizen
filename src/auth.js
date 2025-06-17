// auth.js (또는 src/auth.js)
// 이 파일은 NextAuth.js의 주 설정 파일입니다.
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// PrismaClient 인스턴스는 전역적으로 한 번만 초기화하는 것이 좋습니다.
// 핫 리로딩 시 여러 인스턴스 생성 방지.
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

// ************************************************************
// NextAuth 인스턴스를 별도 변수에 할당합니다.
const nextAuthInstance = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
          return null;
        }
        return { id: user.id, name: user.username, email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id; }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

// ************************************************************
// console.log는 nextAuthInstance가 선언되고 할당된 다음에 와야 합니다.
console.log('[DEBUG] NextAuth Instance:', nextAuthInstance);
console.log('[DEBUG] Handlers property:', nextAuthInstance?.handlers);

export const {
  handlers, // <-- 이 handlers 객체가 NextAuth 함수 호출 결과로 제대로 생성되어야 합니다.
  auth,
  signIn,
  signOut,
} = nextAuthInstance;