// app/page.js
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-black text-white overflow-hidden">
      {/* 배경 애니메이션 - 추상적인 시안색/노란색/빨간색 흐름 */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-red-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-6000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1/3 h-1/3 bg-white rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-8000"></div>
      </div>

      {/* 메인 히어로 섹션 */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 pb-12">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-6 text-white leading-tight animate-fade-in-up drop-shadow-lg">
          <span className="text-cyan-400">AI</span>zen
          <span className="text-yellow-400">.</span>
          <span className="text-red-400">ART</span>
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl mb-10 max-w-3xl text-gray-200 animate-fade-in animation-delay-500">
          인공지능이 빚어낸 예술, <br className="sm:hidden" />당신이 완성하는 가치.
        </p>
        <div className="flex space-x-6">
          <Link href="/items" className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75">
            지금 카드 탐색하기
          </Link>
          <Link href="/signup" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75">
            나만의 아트 만들기
          </Link>
        </div>
      </section>

      {/* 특징 섹션 1 */}
      <section className="relative z-10 py-20 bg-gray-900 bg-opacity-80 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-12 animate-fade-in-up">
            새로운 <span className="text-yellow-400">예술의 장</span>을 열다
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-7xl mb-4 text-cyan-400">✨</span>
              <h3 className="text-3xl font-semibold mb-4 text-white">AI 아트의 세계</h3>
              <p className="text-lg text-gray-300">
                인공지능이 생성한 독창적인 아트 카드들을 만나보세요. 상상력의 경계를 허뭅니다.
              </p>
            </div>
            <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-7xl mb-4 text-red-400">🎨</span>
              <h3 className="text-3xl font-semibold mb-4 text-white">나만의 카드 제작</h3>
              <p className="text-lg text-gray-300">
                당신의 아이디어를 AI로 현실화하고, 세상에 하나뿐인 나만의 아트 카드를 만들 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-7xl mb-4 text-white">🔄</span>
              <h3 className="text-3xl font-semibold mb-4 text-white">자유로운 거래</h3>
              <p className="text-lg text-gray-300">
                다른 사용자와 자유롭게 카드를 교환하며, 나만의 컬렉션을 완성하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 2 - 포인트 및 도전 과제 */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-12 animate-fade-in-up">
            참여하고 <span className="text-cyan-400">보상</span> 받으세요
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-7xl mb-4 text-yellow-400">💎</span>
              <h3 className="text-3xl font-semibold mb-4 text-white">포인트 시스템</h3>
              <p className="text-lg text-gray-300">
                활동을 통해 포인트를 획득하고, 특별한 혜택으로 교환하세요.
              </p>
            </div>
            <div className="flex flex-col items-center p-8 bg-gray-800 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <span className="text-7xl mb-4 text-red-400">🏆</span>
              <h3 className="text-3xl font-semibold mb-4 text-white">도전 과제</h3>
              <p className="text-lg text-gray-300">
                다양한 과제를 완료하고 특별한 보상과 명예를 획득하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action 섹션 */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-cyan-600 to-blue-700 text-center shadow-inner">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-white mb-8 animate-fade-in-up">
            지금 <span className="text-yellow-300">Aizen</span>의 여정을 시작하세요!
          </h2>
          <p className="text-2xl text-white mb-10 animate-fade-in animation-delay-500">
            당신만의 AI 아트 컬렉션을 만들고, 글로벌 커뮤니티와 교류하며 무한한 가능성을 탐험하세요.
          </p>
          <Link href="/signup" className="px-10 py-5 bg-white text-blue-700 font-bold text-2xl rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75">
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Tailwind CSS 애니메이션 키프레임 (tailwind.config.js에 추가 권장) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseFade {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes bounceSubtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; }
        .animate-pulse-fade { animation: pulseFade 3s ease-in-out infinite; }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animate-bounce-subtle { animation: bounceSubtle 2s ease-in-out infinite; }

        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-2500 { animation-delay: 2.5s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-3500 { animation-delay: 3.5s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
        .animation-delay-8000 { animation-delay: 8s; }
      `}</style>
    </div>
  );
}