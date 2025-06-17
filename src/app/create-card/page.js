// app/create-card/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // useSession 훅 임포트
import LoadingSpinner from '../../components/LoadingSpinner'; // LoadingSpinner 컴포넌트 임포트

export default function CreateCardPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rarity, setRarity] = useState('Common');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession(); // useSession 훅 사용

  // 페이지 진입 시 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    // 세션이 로딩 중이 아니고, 인증되지 않은 상태라면 로그인 페이지로 리다이렉트
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    if (status !== 'authenticated') {
      setMessage('카드를 생성하려면 먼저 로그인해야 합니다.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch('/api/items/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // NextAuth.js는 인증된 세션 쿠키를 자동으로 포함시키므로,
          // 클라이언트에서 'Authorization' 헤더를 수동으로 추가하는 것은 불필요합니다.
          // 서버 API에서 NextAuth.js의 세션을 검증해야 합니다.
        },
        body: JSON.stringify({ title, description, imageUrl, rarity }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || '카드가 성공적으로 생성되었습니다!');
        setIsSuccess(true);
        setTitle('');
        setDescription('');
        setImageUrl('');
        setRarity('Common');
        // 생성 후 잠시 뒤 카드 목록으로 이동하거나 상세 페이지로 이동 (선택 사항)
        // setTimeout(() => router.push('/items'), 2000);
      } else {
        setMessage(data.message || '카드 생성에 실패했습니다.');
        setIsSuccess(false);
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('카드 생성 요청 중 오류 발생:', error);
      setMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setIsSuccess(false);
    }
  };

  // 세션이 로딩 중일 때 LoadingSpinner 컴포넌트 렌더링
  if (status === 'loading') {
    return <LoadingSpinner />; // LoadingSpinner 컴포넌트 사용
  }

  // 세션이 없거나 인증되지 않은 상태 (useEffect에서 로그인 페이지로 리다이렉트)
  if (!session || status === 'unauthenticated') {
    return null;
  }

  // 로그인된 상태
  return (
    // 랜딩 페이지와 동일한 그라데이션 배경
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-24 bg-gradient-to-br from-gray-950 to-black text-white overflow-hidden">
      {/* 배경 애니메이션 (랜딩 페이지와 동일하게 적용) */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-red-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-6000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1/3 h-1/3 bg-white rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-8000"></div>
      </div>

      {/* 컨테이너 디자인 변경: 어둡고 투명한 배경, 그림자, 테두리 */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700">
        {/* 제목 스타일 변경: 흰색 텍스트에 시안색 포인트, 그림자 효과 */}
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-md">
          새 <span className="text-cyan-400">카드</span> 생성
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6"> {/* 간격 조정 */}
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-300 mb-2">카드 제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // 입력 필드 디자인 변경: 어두운 배경, 흰색 텍스트, 회색 테두리
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-300 mb-2">설명 (선택 사항)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              // 입력 필드 디자인 변경
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
            ></textarea>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-lg font-medium text-gray-300 mb-2">이미지 URL</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              // 입력 필드 디자인 변경
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="rarity" className="block text-lg font-medium text-gray-300 mb-2">희귀도</label>
            <select
              id="rarity"
              value={rarity}
              onChange={(e) => setRarity(e.target.value)}
              // 셀렉트 박스 디자인 변경
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              required
            >
              <option value="Common" className="bg-gray-800 text-white">Common</option>
              <option value="Rare" className="bg-gray-800 text-white">Rare</option>
              <option value="Epic" className="bg-gray-800 text-white">Epic</option>
              <option value="Legendary" className="bg-gray-800 text-white">Legendary</option>
            </select>
          </div>
          {message && (
            <p className={`text-center text-base font-medium ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            // 버튼 디자인 변경: 시안색 배경, 흰색 텍스트, 그림자, 호버/포커스 효과
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75 transform hover:scale-105 transition-all duration-300"
          >
            카드 생성
          </button>
        </form>
      </div>

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