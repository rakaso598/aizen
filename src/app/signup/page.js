// app/signup/page.js
'use client'; // 클라이언트 컴포넌트로 지정

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 로그인 페이지로 이동하는 Link 컴포넌트 추가

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || '회원가입에 성공했습니다!');
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setMessage(data.message || '회원가입에 실패했습니다.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('회원가입 요청 중 오류 발생:', error);
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setIsSuccess(false);
    }
  };

  return (
    // 배경을 랜딩 페이지와 동일한 그라데이션으로 변경
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gradient-to-br from-gray-950 to-black text-white">
      {/* 컨테이너 디자인 변경: 어둡고 투명한 배경, 그림자, 테두리 */}
      <div className="w-full max-w-md bg-gray-900 bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700">
        {/* 제목 스타일 변경: 흰색 텍스트에 노란색 포인트, 그림자 효과 */}
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-md">
          새 계정 <span className="text-yellow-400">만들기</span>
        </h1>
        <label htmlFor="email" className="block text-sm font-medium text-center text-gray-300 mb-2">🚨경고: 현재 테스트 중인 버전입니다. DB와 연동되어 있으니 실제 민감 정보를 절대 입력하지 마세요. 🚨</label>
        <label htmlFor="email" className="block text-sm font-medium text-center text-gray-300 mb-2">‼️주의: 본 플랫폼은 개발 단계에 있으며, 서비스 안정성 및 보안이 보장되지 않습니다.‼️</label>

        <form onSubmit={handleSubmit} className="space-y-6"> {/* 간격 조정 */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-2">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // 입력 필드 디자인 변경: 어두운 배경, 흰색 텍스트, 회색 테두리
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-300 mb-2">사용자 이름</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // 입력 필드 디자인 변경
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-300 mb-2">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // 입력 필드 디자인 변경
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-300 mb-2">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              // 입력 필드 디자인 변경
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              required
            />
          </div>
          {message && (
            <p className={`text-center text-base font-medium ${isSuccess ? 'text-green-400' : 'text-red-500'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            // 버튼 디자인 변경: 노란색 배경, 흰색 텍스트, 그림자, 호버/포커스 효과 (랜딩 페이지의 "내 컬렉션" 버튼과 유사)
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-75 transform hover:scale-105 transition-all duration-300"
          >
            회원가입
          </button>
        </form>
        <div className="mt-8 text-center"> {/* 간격 조정 */}
          {/* 링크 디자인 변경: 흰색 텍스트, 시안색 호버 언더라인 */}
          <Link href="/login" className="font-medium text-white hover:text-cyan-400 hover:underline transition-colors duration-200 text-base">
            이미 계정이 있으신가요? <span className="font-bold">로그인</span>
          </Link>
        </div>
      </div>
    </div>
  );
}