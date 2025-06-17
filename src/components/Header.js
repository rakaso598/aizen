// components/Header.js
'use client'; // 스크롤 이벤트를 사용하므로 클라이언트 컴포넌트로 지정

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // useSession과 signOut 임포트

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { data: session, status } = useSession(); // useSession 훅 사용

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${hasScrolled ? 'bg-black bg-opacity-70 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold text-white tracking-wider animate-pulse-fade">
          Aizen
        </Link>
        <div className="space-x-6">
          <Link href="/items" className="text-lg text-gray-300 hover:text-cyan-400 transition-colors duration-200">
            카드 탐색
          </Link>
          {/* 로그인 상태에 따라 버튼 조건부 렌더링 */}
          {status === 'loading' ? ( // 세션 로딩 중일 때
            <span className="text-lg text-gray-400">Loading...</span>
          ) : session ? ( // 로그인 되어 있을 때 (세션 존재)
            <>
              {/* 카드 생성 버튼 추가 */}
              <Link href="/create-card" className="text-lg text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                카드 생성
              </Link>
              <Link href="/me" className="text-lg text-gray-300 hover:text-green-400 transition-colors duration-200">
                내 정보
              </Link>
              <button
                onClick={() => signOut()} // 로그아웃 함수 호출
                className="text-lg text-gray-300 hover:text-red-400 transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : ( // 로그인 되어 있지 않을 때 (세션 없음)
            <>
              <Link href="/login" className="text-lg text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                로그인
              </Link>
              <Link href="/signup" className="text-lg text-gray-300 hover:text-red-400 transition-colors duration-200">
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}