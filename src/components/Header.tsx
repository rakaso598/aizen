// components/Header.js
"use client"; // 스크롤 이벤트를 사용하므로 클라이언트 컴포넌트로 지정

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // useSession과 signOut 임포트

const Header: React.FC = () => {
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
      <div className="container mx-auto px-2 sm:px-6 flex items-center h-12 sm:h-16 justify-center">
        {/* GNB: 로고 없이, '홈' 메뉴 포함 모든 메뉴를 한 줄에 동일한 간격/스타일로 중앙 정렬 */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-[11px] sm:text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
          >
            홈
          </Link>
          <Link
            href="/items"
            className="text-[11px] sm:text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
          >
            갤러리
          </Link>
          {session && (
            <Link
              href="/create-card"
              className="text-[11px] sm:text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
            >
              카드생성
            </Link>
          )}
          {session && (
            <Link
              href="/trades"
              className="text-[11px] sm:text-sm font-medium text-cyan-400 hover:text-white transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-cyan-700 whitespace-nowrap"
            >
              거래함
            </Link>
          )}
          {session && (
            <Link
              href="/profile"
              className="text-[11px] sm:text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
            >
              프로필
            </Link>
          )}
          {session ? (
            <button
              onClick={handleSignOut}
              className="text-[11px] sm:text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[11px] sm:text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-[11px] sm:text-sm font-medium bg-cyan-600 hover:bg-cyan-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 whitespace-nowrap"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
