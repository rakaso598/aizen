// app/me/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function MePage() {
  // useSession 훅을 사용하여 세션 데이터와 상태를 가져옵니다.
  const { data: session, status } = useSession();
  const router = useRouter();

  // 세션 상태가 변경될 때마다 리다이렉트 로직을 처리합니다.
  useEffect(() => {
    // 세션 로딩 중이 아니고, 인증되지 않은 상태라면 로그인 페이지로 리다이렉트
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 세션 정보가 로딩 중일 때
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white">
        <p className="text-lg text-cyan-400 animate-pulse">사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 세션이 존재하지 않는 경우 (unauthenticated 상태로 리다이렉트되므로 여기 도달하지 않을 수 있음)
  if (!session) {
    return null; // 리다이렉트가 이미 처리되었거나 곧 처리될 것임
  }

  // 세션 정보가 있을 때 (로그인 상태)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gradient-to-br from-gray-950 to-black text-white">
      <div className="w-full max-w-md bg-gray-900 bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-md">
          내 <span className="text-cyan-400">정보</span>
        </h1>
        {session.user && ( // session.user 객체가 존재하는지 확인
          <div className="space-y-4 text-left text-gray-300">
            <p className="text-lg"><strong>ID:</strong> <span className="text-cyan-200">{session.user.id}</span></p>
            <p className="text-lg"><strong>이메일:</strong> <span className="text-cyan-200">{session.user.email}</span></p>
            <p className="text-lg"><strong>사용자 이름:</strong> <span className="text-cyan-200">{session.user.name || session.user.username}</span></p> {/* name 또는 username 사용 */}
            <p className="text-lg"><strong>포인트:</strong> <span className="text-cyan-200">{session.user.points || '정보 없음'}</span></p> {/* points 정보가 없을 경우 대비 */}
            {/* createdAt, updatedAt 정보는 session.user에 직접 포함되지 않을 수 있습니다.
                필요하다면, 서버 사이드에서 getServerSession을 사용하여 더 많은 정보를 가져와야 합니다.
                하지만 여기서는 클라이언트 useSession()만 사용하므로 이 필드들은 제거했습니다.
            */}
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })} // 로그아웃 후 로그인 페이지로 이동
          className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-75 transform hover:scale-105 transition-all duration-300"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}