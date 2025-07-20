// app/api/items/cards/[id]/ratings/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/authOptions";
import { Session } from "next-auth";
type MySession = Session & {
  user: { id: string; name?: string; email?: string; image?: string };
};

const prisma = new PrismaClient();

// POST: 카드에 평가 추가
export async function POST(request: Request, context: { params: any }) {
  try {
    const { params } = context;
    const { id: cardId } = await params;
    const { value, comment } = await request.json();

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
    if (!value || value < 1 || value > 5) {
      return NextResponse.json(
        { message: "평점은 1에서 5 사이의 값이어야 합니다." },
        { status: 400 }
      );
    }

    // 카드 존재 확인
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json(
        { message: "카드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 자신의 카드에는 평가할 수 없음
    if (card.ownerId === userId) {
      return NextResponse.json(
        { message: "자신의 카드에는 평가할 수 없습니다." },
        { status: 400 }
      );
    }

    // 이미 평가했는지 확인
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_cardId: {
          userId,
          cardId,
        },
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { message: "이미 평가한 카드입니다." },
        { status: 409 }
      );
    }

    // 평가 생성
    const rating = await prisma.rating.create({
      data: {
        value,
        comment: comment || null,
        userId,
        cardId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "평가가 성공적으로 추가되었습니다.",
        rating,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("평가 추가 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: 카드의 모든 평가 조회
export async function GET(request: Request, context: { params: any }) {
  try {
    const { params } = context;
    const { id: cardId } = await params;

    // 카드 존재 확인
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return NextResponse.json(
        { message: "카드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 평가 목록 조회
    const ratings = await prisma.rating.findMany({
      where: { cardId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 평균 평점 계산
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) /
          ratings.length
        : 0;

    return NextResponse.json(
      {
        message: "평가 목록 조회 성공",
        ratings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("평가 목록 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
