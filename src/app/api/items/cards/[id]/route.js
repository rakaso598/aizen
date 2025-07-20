// app/api/items/cards/[id]/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: 특정 카드 상세 정보 조회
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
        ratings: {
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
        },
      },
    });

    if (!card) {
      return NextResponse.json(
        { message: "카드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 평균 평점 계산
    const averageRating =
      card.ratings.length > 0
        ? card.ratings.reduce((sum, rating) => sum + rating.value, 0) /
          card.ratings.length
        : 0;

    return NextResponse.json(
      {
        message: "카드 상세 정보 조회 성공",
        card: {
          ...card,
          averageRating: Math.round(averageRating * 10) / 10, // 소수점 첫째 자리까지
          totalRatings: card.ratings.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("카드 상세 정보 조회 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: 카드 정보 수정 (소유자만 가능)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { title, description, rarity } = await request.json();

    // 입력 유효성 검사
    if (!title || !rarity) {
      return NextResponse.json(
        { message: "제목과 희귀도는 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    const validRarities = ["Common", "Rare", "Epic", "Legendary"];
    if (!validRarities.includes(rarity)) {
      return NextResponse.json(
        {
          message: `유효하지 않은 희귀도 값입니다. (${validRarities.join(
            ", "
          )}) 중 하나여야 합니다.`,
        },
        { status: 400 }
      );
    }

    // 카드 존재 확인 및 소유자 확인
    const existingCard = await prisma.card.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!existingCard) {
      return NextResponse.json(
        { message: "카드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // TODO: 세션에서 사용자 ID를 가져와서 소유자 확인 로직 추가
    // 현재는 임시로 수정 허용

    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        title,
        description: description || null,
        rarity,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "카드 수정 성공",
        card: updatedCard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("카드 수정 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: 카드 삭제 (소유자만 가능)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // 카드 존재 확인
    const existingCard = await prisma.card.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return NextResponse.json(
        { message: "카드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // TODO: 세션에서 사용자 ID를 가져와서 소유자 확인 로직 추가
    // 현재는 임시로 삭제 허용

    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "카드 삭제 성공",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("카드 삭제 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
