// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // 비밀번호 검증을 위해 bcryptjs 임포트

const prisma = new PrismaClient();

export const authOptions = {
  // 인증 제공자 설정
  providers: [
    CredentialsProvider({
      // 로그인 폼에 표시될 이름 (예: "이메일 로그인")
      name: "Credentials",
      // 로그인 폼에 필요한 자격 증명 필드 정의
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      // 사용자가 로그인 시도할 때 호출되는 함수
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // 이메일 또는 비밀번호가 없으면 인증 실패
        }

        // 1. 데이터베이스에서 이메일로 사용자 찾기
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 2. 사용자가 없거나 비밀번호가 일치하지 않으면 인증 실패
        if (!user || !(await bcrypt.compare(credentials.password, user.passwordHash))) {
          // 참고: bcrypt.compare는 해싱된 비밀번호와 평문 비밀번호를 비교합니다.
          // 여기서 user.password는 실제 DB의 passwordHash 필드입니다.
          return null;
        }

        // 3. 인증 성공 시 사용자 객체 반환
        // 반환된 객체는 세션 및 JWT에 저장될 정보입니다.
        // 여기에 민감한 정보(예: passwordHash)는 포함하지 마세요.
        return {
          id: user.id,
          name: user.username, // NextAuth.js의 'name' 필드에 username 매핑
          email: user.email,
        };
      },
    }),
    // Google, Kakao 등 다른 OAuth 제공자를 추가할 수 있습니다.
  ],

  // 세션 관리 전략: JWT (권장)
  session: {
    strategy: "jwt",
  },

  // JWT 및 세션 콜백: JWT에 사용자 ID를 추가하여 세션에서도 접근 가능하게 함
  callbacks: {
    async jwt({ token, user }) {
      // 로그인 시 (user 객체가 있을 때) JWT에 사용자 ID를 추가
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 사용자 ID를 추가하여 클라이언트 컴포넌트에서 접근 가능하게 함
      session.user.id = token.id;
      return session;
    },
  },

  // 커스텀 로그인 페이지 경로
  pages: {
    signIn: "/login", // /auth/signin 대신 우리가 만든 /login 페이지를 사용
  },

  // JWT 서명에 사용될 시크릿 키 (환경 변수에서 가져옴)
  secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions);

// GET 및 POST 요청을 핸들러로 내보냄
export { handler as GET, handler as POST };

// PrismaClient 인스턴스는 한 번만 생성하고, 애플리케이션 전역에서 재사용하는 것이 좋습니다.
// 프로덕션 환경에서는 이 방식으로 인해 과도한 연결이 발생할 수 있으므로,
// 전역 변수 (globalThis)를 사용하여 한 번만 초기화하는 패턴을 고려할 수 있습니다.
// 개발 편의를 위해 여기서는 간단히 매 요청마다 생성하도록 하였습니다.