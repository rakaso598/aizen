// app/create-card/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // useSession 훅 임포트
import LoadingSpinner from "@/components/LoadingSpinner"; // 전체 페이지 로딩 스피너
import SmallLoadingSpinner from "@/components/SmallLoadingSpinner"; // 새로 만든 작은 스피너 임포트
import Image from "next/image"; // Image 컴포넌트 임포트
import Link from "next/link"; // Link 컴포넌트 임포트
import Modal from "../../components/Modal";

export default function CreateCardPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [rarity, setRarity] = useState("Common");
  const [isLoadingButton, setIsLoadingButton] = useState(false); // 버튼 로딩 상태 추가
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const router = useRouter();
  const { data: session, status } = useSession(); // useSession 훅 사용

  // 페이지 진입 시 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    // 세션이 로딩 중이 아니고, 인증되지 않은 상태라면 로그인 페이지로 리다이렉트
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButton(true); // 버튼 로딩 시작

    if (status !== "authenticated") {
      setModalMsg("카드를 생성하려면 먼저 로그인해야 합니다.");
      setModalOpen(true);
      setIsLoadingButton(false); // 로딩 종료
      return;
    }

    try {
      const response = await fetch("/api/items/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, imageUrl, rarity }),
      });

      const data = await response.json();

      if (response.ok) {
        // 카드 생성 성공 시 즉시 /items 페이지로 이동
        router.push("/items");

        // 입력 필드 초기화 (페이지 이동 직전에)
        setTitle("");
        setDescription("");
        setImageUrl("");
        setRarity("Common");
      } else {
        // 카드 생성 실패 시 (alert 또는 폼 내부 메시지 등으로 처리)
        setModalMsg(data.message || "카드 생성에 실패했습니다.");
        setModalOpen(true);
        if (response.status === 401) {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("카드 생성 요청 중 오류 발생:", error);
      setModalMsg("네트워크 오류 또는 서버에 연결할 수 없습니다.");
      setModalOpen(true);
    } finally {
      setIsLoadingButton(false); // 로딩 종료 (성공/실패와 관계없이)
    }
  };

  // 세션이 로딩 중일 때 LoadingSpinner 컴포넌트 렌더링
  if (status === "loading") {
    return <LoadingSpinner />; // 전체 페이지 로딩 스피너
  }

  // 세션이 없거나 인증되지 않은 상태 (useEffect에서 로그인 페이지로 리다이렉트)
  if (!session || status === "unauthenticated") {
    return null;
  }

  // 로그인된 상태
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
      <div className="container mx-auto px-2 sm:px-6 py-6 sm:py-8 z-10 relative">
        <div className="max-w-4xl mx-auto">
          {/* 페이지 제목 */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg animate-fade-in-up">
              <span className="text-yellow-400">AI</span> 아트{" "}
              <span className="text-cyan-400">카드</span> 생성
            </h1>
            <p className="text-base xs:text-lg sm:text-2xl text-gray-300 mt-2 sm:mt-4 animate-fade-in animation-delay-500">
              당신의 <span className="text-red-400">상상력</span>을 AI로
              현실화하세요
            </p>
          </div>

          {/* 카드 생성 폼 */}
          <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in animation-delay-1000">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  카드 제목 *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                  placeholder="카드의 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  카드 설명 (선택사항)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base resize-none"
                  placeholder="카드에 대한 설명을 입력하세요..."
                />
              </div>

              <div>
                <label
                  htmlFor="rarity"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  희귀도 *
                </label>
                <select
                  id="rarity"
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base appearance-none cursor-pointer transition-all duration-200"
                  required
                >
                  <option value="Common">Common (일반)</option>
                  <option value="Rare">Rare (희귀)</option>
                  <option value="Epic">Epic (영웅)</option>
                  <option value="Legendary">Legendary (전설)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  AI 프롬프트 *
                </label>
                <textarea
                  id="prompt"
                  value={imageUrl} // imageUrl을 prompt로 사용
                  onChange={(e) => setImageUrl(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base resize-none"
                  placeholder="AI가 생성할 이미지를 설명하는 프롬프트를 입력하세요. 예: 'A majestic dragon flying over a mystical forest at sunset, digital art style'"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  type="submit"
                  disabled={isLoadingButton}
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingButton ? (
                    <div className="flex items-center">
                      <SmallLoadingSpinner className="mr-2" />{" "}
                      {/* SmallLoadingSpinner 사용 */}
                      생성 중...
                    </div>
                  ) : (
                    "카드 생성하기"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setImageUrl("");
                    setRarity("Common");
                  }}
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
                >
                  초기화
                </button>
              </div>
            </form>
          </div>

          {/* 생성된 카드 미리보기 */}
          {/* This section is not directly related to the form submission,
              but it's part of the new_code. It will be removed as per instructions. */}
          {/*
          {generatedCard && (
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">생성된 카드</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative w-full h-64 sm:h-80 bg-gray-700 rounded-xl overflow-hidden">
                  <Image
                    src={generatedCard.imageUrl}
                    alt={generatedCard.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <span className="text-sm sm:text-base font-medium text-gray-300">제목:</span>
                    <p className="text-sm sm:text-base text-white font-semibold">{generatedCard.title}</p>
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-medium text-gray-300">희귀도:</span>
                    <span className={
                      generatedCard.rarity === 'Legendary' ? 'text-yellow-400 font-bold text-sm sm:text-base' :
                        generatedCard.rarity === 'Epic' ? 'text-red-400 font-bold text-sm sm:text-base' :
                          generatedCard.rarity === 'Rare' ? 'text-cyan-400 font-bold text-sm sm:text-base' :
                            'text-gray-300 text-sm sm:text-base'
                    }>
                      {generatedCard.rarity}
                    </span>
                  </div>
                  {generatedCard.description && (
                    <div>
                      <span className="text-sm sm:text-base font-medium text-gray-300">설명:</span>
                      <p className="text-sm sm:text-base text-gray-400">{generatedCard.description}</p>
                    </div>
                  )}
                  <div className="pt-2 sm:pt-3">
                    <Link
                      href={`/items/cards/${generatedCard.id}`}
                      className="w-full sm:w-auto inline-block px-6 py-3 sm:px-8 sm:py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 text-center">
                        카드 상세보기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          */}

          {/* 추가 정보 */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              카드 생성에는 시간이 걸릴 수 있습니다. 생성된 카드는 갤러리에서
              확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Tailwind CSS 애니메이션 키프레임 (기존과 동일) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseFade {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes bounceSubtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-pulse-fade {
          animation: pulseFade 3s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 2s ease-in-out infinite;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-2500 {
          animation-delay: 2.5s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-3500 {
          animation-delay: 3.5s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        .animation-delay-8000 {
          animation-delay: 8s;
        }
      `}</style>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalMsg}
      </Modal>
    </div>
  );
}
