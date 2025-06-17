// utils/auth.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: NextResponse.json({ message: '인증 실패: 토큰이 제공되지 않았습니다.' }, { status: 401 }),
      decoded: null,
    };
  }

  const token = authHeader.split(' ')[1];

  if (!JWT_SECRET) {
    console.error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
    return {
      error: NextResponse.json({ message: '서버 설정 오류: JWT 시크릿이 없습니다.' }, { status: 500 }),
      decoded: null,
    };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    return { error: null, decoded };
  } catch (error) {
    return {
      error: NextResponse.json({ message: '인증 실패: 유효하지 않거나 만료된 토큰입니다.' }, { status: 401 }),
      decoded: null,
    };
  }
}