// app/api/trades/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// POST: 새로운 거래 제안 생성
export async function POST(request) {
  try {
    const { proposerCardId, receiverId, receiverCardId } = await request.json();

    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const proposerId = session.user.id;

    // 입력 유효성 검사
    if (!proposerCardId || !receiverId || !receiverCardId) {
      return NextResponse.json(
        { message: "모든 필드가 필요합니다." },
        { status: 400 }
      );
    }

    // 자신과는 거래할 수 없음
    if (proposerId === receiverId) {
      return NextResponse.json(
        { message: "자신과는 거래할 수 없습니다." },
        { status: 400 }
      );
    }

    // 제안하는 카드가 자신의 것인지 확인
    const proposerCard = await prisma.card.findUnique({
      where: { id: proposerCardId },
    });

    if (!proposerCard) {
      return NextResponse.json(
        { message: "제안하는 카드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (proposerCard.ownerId !== proposerId) {
      return NextResponse.json(
        { message: "제안하는 카드의 소유자가 아닙니다." },
        { status: 403 }
      );
    }

    // 요청하는 카드가 상대방의 것인지 확인
    const receiverCard = await prisma.card.findUnique({
      where: { id: receiverCardId },
    });

    if (!receiverCard) {
      return NextResponse.json(
        { message: "요청하는 카드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (receiverCard.ownerId !== receiverId) {
      return NextResponse.json(
        { message: "요청하는 카드의 소유자가 아닙니다." },
        { status: 403 }
      );
    }

    // 이미 진행 중인 거래가 있는지 확인
    const existingTrade = await prisma.trade.findFirst({
      where: {
        OR: [
          {
            proposerCardId,
            status: "PENDING",
          },
          {
            receiverCardId,
            status: "PENDING",
          },
        ],
      },
    });

    if (existingTrade) {
      return NextResponse.json(
        { message: "이미 진행 중인 거래가 있습니다." },
        { status: 409 }
      );
    }

    // 거래 생성
    const trade = await prisma.trade.create({
      data: {
        proposerId,
        proposerCardId,
        receiverId,
        receiverCardId,
        status: "PENDING",
      },
      include: {
        proposer: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
        proposerCard: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            rarity: true,
          },
        },
        receiverCard: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            rarity: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "거래 제안이 성공적으로 생성되었습니다.",
        trade,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("거래 생성 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET: 사용자의 거래 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'sent' 또는 'received'

    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 거래 목록 조회 조건 설정
    let whereClause = {};
    if (type === "sent") {
      whereClause.proposerId = userId;
    } else if (type === "received") {
      whereClause.receiverId = userId;
    } else {
      // 모든 거래 (보낸 것과 받은 것)
      whereClause.OR = [{ proposerId: userId }, { receiverId: userId }];
    }

    const trades = await prisma.trade.findMany({
      where: whereClause,
      include: {
        proposer: {
          select: {
            id: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
          },
        },
        proposerCard: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            rarity: true,
          },
        },
        receiverCard: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            rarity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "거래 목록 조회 성공",
        trades,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("거래 목록 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
