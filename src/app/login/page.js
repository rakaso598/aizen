// app/login/page.js
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("로그인 요청 중 오류 발생:", err);
      setError("네트워크 오류 또는 서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
      <div className="container mx-auto px-2 sm:px-6 py-6 sm:py-8 z-10 relative">
        <div className="max-w-md sm:max-w-lg mx-auto">
          {/* 페이지 제목 */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg animate-fade-in-up">
              <span className="text-cyan-400">로그인</span>
            </h1>
            <p className="text-base xs:text-lg sm:text-2xl text-gray-300 mt-2 sm:mt-4 animate-fade-in animation-delay-500">
              <span className="text-yellow-400">Aizen</span>에 오신 것을
              환영합니다
            </p>
          </div>

          {error && (
            <p className="text-center text-red-500 text-base sm:text-xl font-medium mb-6 sm:mb-8 animate-fade-in">
              {error}
            </p>
          )}

          {/* 로그인 폼 */}
          <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in animation-delay-1000">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* {loading ? '로그인 중...' : '로그인'} */}
                로그인
              </button>
            </form>

            {/* 구분선 */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm sm:text-base">
                <span className="px-2 sm:px-4 bg-gray-800 text-gray-400">
                  또는
                </span>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                계정이 없으신가요?
              </p>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-block px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
              >
                회원가입하기
              </Link>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              로그인하면 AI 아트 카드 생성, 거래, 평가 등의 모든 기능을 이용할
              수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
