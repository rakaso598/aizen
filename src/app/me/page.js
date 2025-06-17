// app/me/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        router.push('/login'); // 토큰이 없으면 로그인 페이지로 리다이렉트
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          const errorData = await response.json();
          setError(errorData.message || '사용자 정보를 가져오는데 실패했습니다.');
          localStorage.removeItem('token'); // 유효하지 않은 토큰이면 제거
          localStorage.removeItem('user');
          router.push('/login'); // 실패 시 로그인 페이지로 리다이렉트
        }
      } catch (err) {
        console.error('사용자 정보 요청 중 오류 발생:', err);
        setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]); // router가 변경될 때마다 useEffect 재실행 방지

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-blue-600">사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">내 정보</h1>
        {user && (
          <div className="space-y-2 text-left">
            <p className="text-gray-700"><strong>ID:</strong> {user.id}</p>
            <p className="text-gray-700"><strong>이메일:</strong> {user.email}</p>
            <p className="text-gray-700"><strong>사용자 이름:</strong> {user.username}</p>
            <p className="text-gray-700"><strong>포인트:</strong> {user.points}</p>
            <p className="text-gray-700 text-sm"><strong>가입일:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700 text-sm"><strong>최근 업데이트:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        )}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          }}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}