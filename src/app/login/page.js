// app/login/page.js
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // next-auth/react에서 signIn 함수 임포트
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // NextAuth.js의 signIn 함수 사용
      const result = await signIn('credentials', {
        redirect: false, // 로그인 실패 시 리다이렉트 방지
        email,
        password,
      });

      if (result.error) {
        // 로그인 실패 시 에러 메시지 처리
        setError(result.error);
      } else {
        // 로그인 성공 시 메인 페이지 또는 대시보드로 리다이렉트
        router.push('/');
      }
    } catch (err) {
      console.error('로그인 요청 중 오류 발생:', err);
      setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          {error && (
            <p className="text-center text-red-600 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            로그인
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            계정이 없으신가요? 회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}