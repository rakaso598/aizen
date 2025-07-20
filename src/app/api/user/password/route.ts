// app/api/user/password/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verifyToken } from "src/utils/auth";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  // 1. JWT 검증 및 사용자 ID 추출
  const authResult = await verifyToken(request);
  if (authResult.error) {
    return authResult.error;
  }
  const userId = authResult.decoded.userId;

  try {
    const { currentPassword, newPassword } = await request.json();

    // 2. 입력 유효성 검사
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "새 비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 3. 현재 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // 이론적으로 JWT가 유효한데 사용자 없음은 불가능하나, 혹시 모를 상황 대비
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 4. 현재 비밀번호 일치 여부 확인
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "인증 실패: 현재 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // 5. 새 비밀번호 해싱 및 업데이트
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json(
      { message: "비밀번호가 성공적으로 변경되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
