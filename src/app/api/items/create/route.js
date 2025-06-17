// app/api/items/create/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { verifyToken } from '@/utils/auth'; // 이전 JWT 인증 유틸리티 주석 처리 또는 삭제
import { getServerSession } from "next-auth"; // NextAuth.js 사용
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // NextAuth.js 설정 파일 경로

const prisma = new PrismaClient();

export async function POST(request) {
  // 1. NextAuth.js 세션 검증 및 사용자 ID 추출
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
  }
  const ownerId = session.user.id; // 세션에서 소유자 ID 추출

  try {
    const { title, description, imageUrl, rarity } = await request.json();

    // 2. 입력 유효성 검사 (기존 로직 동일)
    if (!title || !imageUrl || !rarity) {
      return NextResponse.json({ message: '제목, 이미지 URL, 희귀도는 필수 입력 항목입니다.' }, { status: 400 });
    }

    const validRarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    if (!validRarities.includes(rarity)) {
      return NextResponse.json({ message: `유효하지 않은 희귀도 값입니다. (${validRarities.join(', ')}) 중 하나여야 합니다.` }, { status: 400 });
    }

    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        return NextResponse.json({ message: '유효한 이미지 URL 형식이 아닙니다.' }, { status: 400 });
    }

    // 3. 새 카드 생성 및 DB 저장
    const newCard = await prisma.card.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        rarity,
        owner: {
          connect: { id: ownerId },
        },
      },
    });

    return NextResponse.json(
      { message: '카드 생성 성공', cardId: newCard.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('카드 생성 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}