// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-6 sm:py-8">
      <div className="container mx-auto px-2 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">A</span>
            </div>
            <span className="text-sm sm:text-lg font-bold text-white">
              Aizen
            </span>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm text-gray-400">
              © 2024 Aizen. AI 아트 카드 갤러리 및 거래 플랫폼.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              개발 단계의 프로젝트입니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
