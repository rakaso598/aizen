// // app/api/auth/me/route.js
// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET;

// export async function GET(request) {
//   try {
//     // 1. Authorization 헤더에서 토큰 추출
//     const authHeader = request.headers.get('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ message: '인증 실패: 토큰이 제공되지 않았습니다.' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];

//     // 2. 토큰 검증
//     if (!JWT_SECRET) {
//       console.error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
//       return NextResponse.json({ message: '서버 설정 오류: JWT 시크릿이 없습니다.' }, { status: 500 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: '인증 실패: 유효하지 않거나 만료된 토큰입니다.' }, { status: 401 });
//     }

//     // 3. 토큰에서 추출한 userId로 사용자 정보 조회
//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       select: {
//         id: true,
//         email: true,
//         username: true,
//         points: true,
//         createdAt: true,
//         updatedAt: true,
//       }, // 비밀번호 해시 제외
//     });

//     if (!user) {
//       return NextResponse.json({ message: '사용자를 찾을 수 없습니다.' }, { status: 404 });
//     }

//     // 4. 인증된 사용자 정보 반환
//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     console.error('인증 오류:', error);
//     return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }