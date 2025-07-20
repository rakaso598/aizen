// components/Header.js
"use client"; // 스크롤 이벤트를 사용하므로 클라이언트 컴포넌트로 지정

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // useSession과 signOut 임포트

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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-md border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-2 sm:px-6 relative flex items-center justify-between h-16 sm:h-20">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
            <span className="text-white font-bold text-sm sm:text-lg">A</span>
          </div>
          <span className="text-lg sm:text-2xl font-extrabold text-white group-hover:text-cyan-400 transition-colors duration-300">
            Aizen
          </span>
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden sm:flex flex-1 justify-center items-center space-x-4 sm:space-x-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link
            href="/items"
            className="text-sm sm:text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-700"
          >
            카드 갤러리
          </Link>
          {session && (
            <Link
              href="/create-card"
              className="text-sm sm:text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-700"
            >
              카드 생성
            </Link>
          )}
        </nav>

        {/* 사용자 메뉴 */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {session ? (
            <>
              <Link
                href="/profile"
                className="text-sm sm:text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-700"
              >
                프로필
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm sm:text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-700"
              >
                로그아웃
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/login"
                className="text-sm sm:text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-gray-700"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-sm sm:text-base font-medium bg-cyan-600 hover:bg-cyan-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
