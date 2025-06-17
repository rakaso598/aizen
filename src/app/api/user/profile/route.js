// app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/auth'; // auth 유틸리티 임포트

const prisma = new PrismaClient();

export async function PUT(request) {
  // 1. JWT 검증 및 사용자 ID 추출
  const authResult = await verifyToken(request);
  if (authResult.error) {
    return authResult.error;
  }
  const userId = authResult.decoded.userId;

  try {
    const { email, username } = await request.json();

    // 입력된 값이 없는 경우
    if (email === undefined && username === undefined) {
      return NextResponse.json({ message: '업데이트할 이메일 또는 사용자 이름을 제공해주세요.' }, { status: 400 });
    }

    const updateData = {};
    if (email !== undefined) {
      // 이메일 형식 유효성 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ message: '유효한 이메일 형식이 아닙니다.' }, { status: 400 });
      }
      updateData.email = email;
    }
    if (username !== undefined) {
      if (username.trim() === '') {
        return NextResponse.json({ message: '사용자 이름은 비워둘 수 없습니다.' }, { status: 400 });
      }
      updateData.username = username;
    }

    // 2. 이메일/사용자 이름 중복 확인 (본인 제외)
    if (updateData.email) {
      const existingUserWithEmail = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: userId }, // 본인 제외
        },
      });
      if (existingUserWithEmail) {
        return NextResponse.json({ message: '이미 사용 중인 이메일입니다.' }, { status: 409 });
      }
    }

    if (updateData.username) {
      const existingUserWithUsername = await prisma.user.findFirst({
        where: {
          username: updateData.username,
          NOT: { id: userId }, // 본인 제외
        },
      });
      if (existingUserWithUsername) {
        return NextResponse.json({ message: '이미 사용 중인 사용자 이름입니다.' }, { status: 409 });
      }
    }

    // 3. 사용자 정보 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        points: true,
        createdAt: true,
        updatedAt: true,
      }, // 비밀번호 해시 제외
    });

    return NextResponse.json(
      { message: '프로필이 성공적으로 업데이트되었습니다.', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}