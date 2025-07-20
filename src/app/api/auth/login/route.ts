import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET; // .env에서 JWT_SECRET 가져오기

export async function POST(request: Request) {
  try {
    const { emailOrUsername, password } = await request.json();

    // 1. 입력 유효성 검사
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { message: "이메일/사용자 이름과 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 2. 사용자 찾기 (이메일 또는 사용자 이름으로)
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "잘못된 이메일/사용자 이름 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    // 3. 비밀번호 일치 여부 확인
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "잘못된 이메일/사용자 이름 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    // 4. JWT 생성
    if (!JWT_SECRET) {
      console.error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { message: "서버 설정 오류: JWT 시크릿이 없습니다." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" } // 토큰 유효 기간 1시간 설정
    );

    // 5. 응답 반환 (토큰 및 사용자 정보)
    // 비밀번호 해시는 클라이언트에 보내지 않습니다.
    const { passwordHash, ...userWithoutPasswordHash } = user;

    return NextResponse.json(
      { message: "로그인 성공", token, user: userWithoutPasswordHash },
      { status: 200 }
    );
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
