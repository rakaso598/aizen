// app/api/user/profile/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { Session } from "next-auth";
type MySession = Session & {
  user: { id: string; name?: string; email?: string; image?: string };
};

const prisma = new PrismaClient();

// GET: 사용자 프로필 정보 조회
export async function GET(request: Request) {
  try {
    // 세션 확인
    const session = (await getServerSession(authOptions)) as MySession | null;
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 사용자 정보 조회 (카드 수, 포인트 등 포함)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        points: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            cards: true,
            ratings: true,
            proposerTrades: true,
            receiverTrades: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "프로필 정보 조회 성공",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("프로필 정보 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: 사용자 프로필 정보 수정
export async function PUT(request: Request) {
  try {
    const { username } = await request.json();

    // 세션 확인
    const session = (await getServerSession(authOptions)) as MySession | null;
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 입력 유효성 검사
    if (!username || username.trim().length < 2) {
      return NextResponse.json(
        { message: "사용자 이름은 최소 2자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 사용자 이름 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json(
        { message: "이미 존재하는 사용자 이름입니다." },
        { status: 409 }
      );
    }

    // 프로필 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username },
      select: {
        id: true,
        username: true,
        email: true,
        points: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "프로필 정보가 성공적으로 업데이트되었습니다.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("프로필 정보 수정 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
