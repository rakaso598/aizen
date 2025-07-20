// app/api/auth/[...nextauth]/route.js
import NextAuth, {
  AuthOptions,
  Session,
  User,
  SessionStrategy,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // 비밀번호 검증을 위해 bcryptjs 임포트
import { authOptions } from "./authOptions";

const prisma = new PrismaClient();

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions);

// GET 및 POST 요청을 핸들러로 내보냄
export { handler as GET, handler as POST };

// PrismaClient 인스턴스는 한 번만 생성하고, 애플리케이션 전역에서 재사용하는 것이 좋습니다.
// 프로덕션 환경에서는 이 방식으로 인해 과도한 연결이 발생할 수 있으므로,
// 전역 변수 (globalThis)를 사용하여 한 번만 초기화하는 패턴을 고려할 수 있습니다.
// 개발 편의를 위해 여기서는 간단히 매 요청마다 생성하도록 하였습니다.
