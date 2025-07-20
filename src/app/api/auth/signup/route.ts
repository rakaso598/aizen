// app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    // 1. 입력 유효성 검사
    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "이메일, 사용자 이름, 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 간단한 이메일 형식 검사 (더 강력한 검사는 라이브러리 사용 권장)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "유효한 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 2. 이메일 및 사용자 이름 중복 확인
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "이미 존재하는 이메일입니다." },
        { status: 409 }
      );
    }

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "이미 존재하는 사용자 이름입니다." },
        { status: 409 }
      );
    }

    // 3. 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. 새 사용자 생성 및 DB 저장
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        // points는 @default(0)으로 자동 설정됩니다.
      },
    });

    return NextResponse.json(
      { message: "회원가입 성공", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    // 개발 환경에서는 Prisma 연결 풀링을 위해 disconnect()를 생략하기도 하지만
    // 안전을 위해 명시적으로 해제하는 것을 권장합니다.
    await prisma.$disconnect();
  }
}
