// app/api/items/cards/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // 쿼리 파라미터 가져오기 및 기본값 설정
    const ownerId = searchParams.get('ownerId');
    const rarity = searchParams.get('rarity');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // 유효성 검사
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ message: '잘못된 페이지 번호입니다.' }, { status: 400 });
    }
    if (isNaN(limit) || limit < 1 || limit > 50) { // 한 페이지당 최대 50개로 제한
      return NextResponse.json({ message: 'limit 값은 1에서 50 사이여야 합니다.' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    // 필터링 조건 객체 생성
    const whereClause = {};
    if (ownerId) {
      whereClause.ownerId = ownerId;
    }
    if (rarity) {
      whereClause.rarity = rarity;
    }

    // 1. 조건에 맞는 총 카드 수 조회 (페이지네이션 계산용)
    const totalCards = await prisma.card.count({
      where: whereClause,
    });

    // 2. 카드 데이터 조회 (필터링, 페이지네이션, 소유자 정보 포함)
    const cards = await prisma.card.findMany({
      where: whereClause,
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // 최신 카드부터 조회
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true, // 필요하다면 이메일도 포함 (일반적으로 username만 보냄)
          },
        },
      },
    });

    const totalPages = Math.ceil(totalCards / limit);

    return NextResponse.json(
      {
        message: '카드 목록 조회 성공',
        cards,
        totalCards,
        totalPages,
        currentPage: page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('카드 목록 조회 오류:', error);
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}