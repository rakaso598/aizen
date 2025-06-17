// components/Header.js
'use client'; // 스크롤 이벤트를 사용하므로 클라이언트 컴포넌트로 지정

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);

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
          <Link href="/login" className="text-lg text-gray-300 hover:text-yellow-400 transition-colors duration-200">
            로그인
          </Link>
          <Link href="/signup" className="text-lg text-gray-300 hover:text-red-400 transition-colors duration-200">
            회원가입
          </Link>
        </div>
      </nav>
    </header>
  );
}