// app/api/trades/[id]/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Session } from "next-auth";
type MySession = Session & {
  user: { id: string; name?: string; email?: string; image?: string };
};

const prisma = new PrismaClient();

// PUT: 거래 응답 (수락/거절)
export async function PUT(request: Request, { params }: { params: any }) {
  try {
    const { id: tradeId } = params;
    const { action } = await request.json(); // 'accept' 또는 'reject'

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
    if (!action || !["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "유효하지 않은 액션입니다." },
        { status: 400 }
      );
    }

    // 거래 존재 확인 및 권한 확인
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: {
        proposerCard: true,
        receiverCard: true,
      },
    });

    if (!trade) {
      return NextResponse.json(
        { message: "거래를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 거래 수신자만 응답할 수 있음
    if (trade.receiverId !== userId) {
      return NextResponse.json(
        { message: "거래 응답 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 이미 처리된 거래인지 확인
    if (trade.status !== "PENDING") {
      return NextResponse.json(
        { message: "이미 처리된 거래입니다." },
        { status: 400 }
      );
    }

    if (action === "accept") {
      // 거래 수락 - 카드 소유권 이전
      await prisma.$transaction(async (tx) => {
        // 거래 상태 업데이트
        await tx.trade.update({
          where: { id: tradeId },
          data: { status: "ACCEPTED" },
        });

        // 카드 소유권 이전
        await tx.card.update({
          where: { id: trade.proposerCardId },
          data: { ownerId: trade.receiverId },
        });

        await tx.card.update({
          where: { id: trade.receiverCardId },
          data: { ownerId: trade.proposerId },
        });
      });

      return NextResponse.json(
        {
          message: "거래가 성공적으로 완료되었습니다.",
        },
        { status: 200 }
      );
    } else {
      // 거래 거절
      await prisma.trade.update({
        where: { id: tradeId },
        data: { status: "REJECTED" },
      });

      return NextResponse.json(
        {
          message: "거래가 거절되었습니다.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("거래 응답 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: 거래 취소 (제안자만 가능)
export async function DELETE(request: Request, { params }: { params: any }) {
  try {
    const { id: tradeId } = params;

    // 세션 확인
    const session = (await getServerSession(authOptions)) as MySession | null;
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 거래 존재 확인 및 권한 확인
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
    });

    if (!trade) {
      return NextResponse.json(
        { message: "거래를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 거래 제안자만 취소할 수 있음
    if (trade.proposerId !== userId) {
      return NextResponse.json(
        { message: "거래 취소 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 이미 처리된 거래인지 확인
    if (trade.status !== "PENDING") {
      return NextResponse.json(
        { message: "이미 처리된 거래입니다." },
        { status: 400 }
      );
    }

    // 거래 취소
    await prisma.trade.update({
      where: { id: tradeId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(
      {
        message: "거래가 취소되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("거래 취소 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
