// components/LoadingSpinner.js
"use client"; // styled-jsx를 사용하므로 클라이언트 컴포넌트로 지정

import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    // 기존처럼 그라데이션 배경 유지
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white">
      {/* 네모 칸막이 div 제거 */}
      <div className="flex flex-col items-center">
        {/* 로딩 스피너 SVG - 랜딩 페이지의 시안색 포인트 컬러 적용 */}
        <svg
          className="animate-spin h-12 w-12 text-cyan-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {/* 로딩 텍스트 - 흰색으로 유지 */}
        <p className="mt-6 text-xl font-semibold text-white">
          페이지를 로드하는 중입니다...
        </p>
        {/* 기존에 네모 칸막이에 적용했던 그림자 효과 제거 */}
      </div>
    </div>
  );
};

export default LoadingSpinner;
