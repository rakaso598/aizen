// app/signup/page.js
"use client"; // 클라이언트 컴포넌트로 지정

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 로그인 페이지로 이동하는 Link 컴포넌트 추가
import Modal from "../../components/Modal";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalOpen(false); // 폼 제출 시 모달 닫기
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setModalMsg("비밀번호가 일치하지 않습니다.");
      setModalOpen(true);
      return;
    }
    if (password.length < 6) {
      setModalMsg("비밀번호는 최소 6자 이상이어야 합니다.");
      setModalOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMsg(data.message || "회원가입에 성공했습니다!");
        setIsSuccess(true);
        setModalOpen(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setModalMsg(data.message || "회원가입에 실패했습니다.");
        setIsSuccess(false);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      setModalMsg("네트워크 오류 또는 서버에 연결할 수 없습니다.");
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

  return (
    // 배경을 랜딩 페이지와 동일한 그라데이션으로 변경
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
      <div className="container mx-auto px-2 sm:px-6 py-6 sm:py-8 z-10 relative">
        <div className="max-w-md sm:max-w-lg mx-auto">
          {/* 페이지 제목 */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg animate-fade-in-up">
              <span className="text-yellow-400">회원가입</span>
            </h1>
            <p className="text-base xs:text-lg sm:text-2xl text-gray-300 mt-2 sm:mt-4 animate-fade-in animation-delay-500">
              <span className="text-cyan-400">Aizen</span>의 멤버가 되어보세요
            </p>
          </div>

          {/* 회원가입 폼 */}
          <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in animation-delay-1000">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  사용자명
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                  placeholder="사용자명을 입력하세요"
                  required
                />
              </div>
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                // 버튼 디자인 변경: 노란색 배경, 흰색 텍스트, 그림자, 호버/포커스 효과 (랜딩 페이지의 "내 컬렉션" 버튼과 유사)
                className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                회원가입
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

            {/* 로그인 링크 */}
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                이미 계정이 있으신가요?
              </p>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-block px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
              >
                로그인하기
              </Link>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              회원가입 시 AI 아트 카드 생성, 거래, 평가 등의 모든 기능을 이용할
              수 있습니다.
            </p>
          </div>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalMsg}
      </Modal>
    </div>
  );
}
