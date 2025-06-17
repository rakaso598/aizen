// app/api/items/cards/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// 인증 미들웨어 또는 유틸리티 임포트 (예시: authOptions, getServerSession)
// 실제 프로젝트에서는 NextAuth.js 등을 사용하여 세션 정보를 가져와야 합니다.
// 여기서는 간단한 더미 인증 로직을 사용합니다.
import { getServerSession } from "next-auth"; // NextAuth.js 사용 시
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // NextAuth.js 설정 파일 경로

const prisma = new PrismaClient();

// GET: 카드 상세 조회
export async function GET(request, { params }) {
  const { id } = params; // 동적 라우트 파라미터에서 ID 가져오기

  try {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!card) {
      return NextResponse.json({ message: '카드를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(
      { message: '카드 상세 조회 성공', card },
      { status: 200 }
    );
  } catch (error) {
    console.error(`카드 상세 조회 오류 (ID: ${id}):`, error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT: 카드 업데이트
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  // 실제 사용자 세션 정보 가져오기 (NextAuth.js 예시)
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  try {
    const existingCard = await prisma.card.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return NextResponse.json({ message: '카드를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 권한 확인: 카드 소유자만 수정 가능
    if (existingCard.ownerId !== session.user.id) {
      return NextResponse.json({ message: '카드 수정 권한이 없습니다.' }, { status: 403 });
    }

    // 업데이트할 데이터 유효성 검사 (최소 하나 이상의 필드가 있어야 함)
    const { title, description, imageUrl, rarity } = body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (rarity !== undefined) updateData.rarity = rarity;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: '업데이트할 데이터가 없습니다.' }, { status: 400 });
    }

    const updatedCard = await prisma.card.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: '카드 업데이트 성공', card: updatedCard },
      { status: 200 }
    );
  } catch (error) {
    console.error(`카드 업데이트 오류 (ID: ${id}):`, error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: 카드 삭제
export async function DELETE(request, { params }) {
  const { id } = params;

  // 실제 사용자 세션 정보 가져오기 (NextAuth.js 예시)
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }

  try {
    const existingCard = await prisma.card.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return NextResponse.json({ message: '카드를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 권한 확인: 카드 소유자만 삭제 가능
    if (existingCard.ownerId !== session.user.id) {
      return NextResponse.json({ message: '카드 삭제 권한이 없습니다.' }, { status: 403 });
    }

    await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json({ message: '카드 삭제 성공' }, { status: 200 });
  } catch (error) {
    console.error(`카드 삭제 오류 (ID: ${id}):`, error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}