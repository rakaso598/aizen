// app/api/items/create/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/auth'; // JWT 인증 유틸리티

const prisma = new PrismaClient();

export async function POST(request) {
  // 1. JWT 검증 및 사용자 ID 추출 (인증된 사용자만 카드 생성 가능)
  const authResult = await verifyToken(request);
  if (authResult.error) {
    return authResult.error;
  }
  const ownerId = authResult.decoded.userId; // 토큰에서 소유자 ID 추출

  try {
    const { title, description, imageUrl, rarity } = await request.json();

    // 2. 입력 유효성 검사
    if (!title || !imageUrl || !rarity) {
      return NextResponse.json({ message: '제목, 이미지 URL, 희귀도는 필수 입력 항목입니다.' }, { status: 400 });
    }

    // 간단한 rarity 값 유효성 검사 (더 많은 희귀도 타입이 있다면 배열로 관리)
    const validRarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    if (!validRarities.includes(rarity)) {
      return NextResponse.json({ message: `유효하지 않은 희귀도 값입니다. (${validRarities.join(', ')}) 중 하나여야 합니다.` }, { status: 400 });
    }

    // 이미지 URL 형식 검사 (선택 사항, 필요시 더 정교하게 구현)
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        return NextResponse.json({ message: '유효한 이미지 URL 형식이 아닙니다.' }, { status: 400 });
    }

    // 3. 새 카드 생성 및 DB 저장
    const newCard = await prisma.card.create({
      data: {
        title,
        description: description || null, // description이 없으면 null로 저장
        imageUrl,
        rarity,
        owner: {
          connect: { id: ownerId }, // ownerId를 통해 User와 연결
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