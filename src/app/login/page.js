// app/login/page.js
'use client'; // 클라이언트 컴포넌트로 지정

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // 이전 메시지 초기화
    setIsSuccess(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || '로그인에 성공했습니다!');
        setIsSuccess(true);
        // JWT 토큰을 로컬 스토리지에 저장 (보안상 더 좋은 방법은 NextAuth.js 같은 라이브러리 사용)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // 사용자 정보도 저장 (선택 사항)

        // 로그인 성공 후 대시보드 또는 메인 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/'); // 메인 페이지 경로
        }, 1500);
      } else {
        setMessage(data.message || '로그인에 실패했습니다.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700">이메일 또는 사용자 이름</label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
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
          {message && (
            <p className={`text-center text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            로그인
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}