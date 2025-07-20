// app/items/ItemsPageContent.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// LoadingSpinner 컴포넌트를 import 합니다.
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";

interface Card {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  owner?: { id: string; username: string };
  createdAt: string;
}

export default function ItemsPageContent() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true); // 초기 로딩 상태는 true
  const [error, setError] = useState("");
  const [totalCards, setTotalCards] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputRarity, setInputRarity] = useState("");
  const [inputLimitPerPage, setInputLimitPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const fetchCards = useCallback(
    async (currentSearchParams: URLSearchParams) => {
      setLoading(true); // 데이터 fetch 시작 시 로딩 상태 true
      setError("");

      const query = new URLSearchParams(currentSearchParams);
      const rarityToFetch = query.get("rarity") || "";
      const pageToFetch = parseInt(query.get("page") || "1", 10);
      const limitToFetch = parseInt(query.get("limit") || "10", 10);

      try {
        const response = await fetch(`/api/items/cards?${query.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setCards(data.cards);
          setTotalCards(data.totalCards);
          setTotalPages(data.totalPages);
          setCurrentPage(data.currentPage);
          setInputLimitPerPage(data.limit);
        } else {
          setModalMsg(data.message || "카드 목록을 불러오는데 실패했습니다.");
          setModalOpen(true);
          setCards([]);
        }
      } catch (err) {
        console.error("카드 목록 조회 오류:", err);
        setModalMsg("네트워크 오류 또는 서버에 연결할 수 없습니다.");
        setModalOpen(true);
        setCards([]);
      } finally {
        setLoading(false); // 데이터 로딩이 완료되면 loading 상태를 false로 변경
      }
    },
    []
  );

  useEffect(() => {
    const rarityParam = searchParams.get("rarity") || "";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);

    setInputRarity(rarityParam);
    setInputLimitPerPage(limitParam);
    setCurrentPage(pageParam);

    // 컴포넌트가 마운트되거나 searchParams가 변경될 때 카드 목록을 가져옵니다.
    fetchCards(searchParams);
  }, [searchParams, fetchCards]);

  const handleApplyFilters = () => {
    const newQuery = new URLSearchParams();
    if (inputRarity) newQuery.append("rarity", inputRarity);
    newQuery.append("page", "1");
    newQuery.append("limit", inputLimitPerPage.toString());

    router.push(`/items?${newQuery.toString()}`);
  };

  const handleResetFilters = () => {
    setInputRarity("");
    setInputLimitPerPage(10);
    router.push("/items");
  };

  const handlePageChange = (page: number) => {
    const currentQuery = new URLSearchParams(searchParams);
    currentQuery.set("page", page.toString());
    router.push(`/items?${currentQuery.toString()}`);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    // 페이지 수가 0이면 버튼을 렌더링하지 않습니다.
    if (totalPages === 0) return null;

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`
            px-4 py-2 rounded-full mx-1 text-lg font-bold
            transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4
            ${
              currentPage === i
                ? "bg-cyan-600 text-white shadow-lg focus:ring-cyan-500 focus:ring-opacity-75"
                : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black focus:ring-white focus:ring-opacity-75"
            }`}
          disabled={loading} // 로딩 중에는 버튼 비활성화
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
        <div className="container mx-auto max-w-7xl px-2 sm:px-6 md:px-8 py-6 sm:py-8 z-10 relative">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 text-white text-center leading-tight drop-shadow-lg animate-fade-in-up">
            <span className="text-yellow-400">AI</span> 아트{" "}
            <span className="text-cyan-400">카드</span> 갤러리
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-gray-300 text-center mb-6 md:mb-10 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto animate-fade-in animation-delay-500">
            다양한 AI 생성 아트 카드를 확인하고, 당신의{" "}
            <span className="text-red-400">특별한 컬렉션</span>을 만들어보세요.
          </p>

          {/* 필터 섹션 디자인 개선 */}
          <div className="mb-8 md:mb-12 p-4 md:p-8 rounded-xl shadow-2xl bg-gray-900 bg-opacity-70 backdrop-blur-md border border-gray-700 animate-fade-in animation-delay-1000 max-w-2xl mx-auto">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-5 text-center">
              필터
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              <div>
                <label
                  htmlFor="inputRarity"
                  className="block text-base sm:text-lg font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  희귀도
                </label>
                <select
                  id="inputRarity"
                  value={inputRarity}
                  onChange={(e) => setInputRarity(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="">모든 희귀도</option>
                  <option value="Common">Common</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="inputLimitPerPage"
                  className="block text-base sm:text-lg font-medium text-gray-300 mb-1 sm:mb-2"
                >
                  페이지당 카드 수
                </label>
                <select
                  id="inputLimitPerPage"
                  value={inputLimitPerPage}
                  onChange={(e) =>
                    setInputLimitPerPage(parseInt(e.target.value, 10))
                  }
                  className="mt-1 block w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="5">5개</option>
                  <option value="10">10개</option>
                  <option value="20">20개</option>
                  <option value="50">50개</option>
                </select>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-center items-center gap-3 md:space-x-4">
              <button
                onClick={handleApplyFilters}
                className="w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75"
              >
                필터 적용
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-3 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
              >
                초기화
              </button>
            </div>
          </div>

          {error && (
            <p className="text-center text-red-500 text-base sm:text-xl font-medium mb-6 sm:mb-8 animate-fade-in">
              {error}
            </p>
          )}

          {/* ✅ 변경된 부분: 로딩 중일 때는 LoadingSpinner를 표시합니다. */}
          {loading ? (
            <div className="flex justify-center items-center h-40 sm:h-64">
              <LoadingSpinner />
            </div>
          ) : cards.length === 0 && !error ? (
            <p className="text-center text-gray-400 text-lg sm:text-2xl animate-fade-in">
              카드가 없습니다.{" "}
              <Link href="/signup" className="text-cyan-400 hover:underline">
                새로운 카드를 생성
              </Link>
              해보세요!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-8">
              {cards.map((card: Card) => (
                <Link
                  key={card.id}
                  href={`/items/cards/${card.id}`}
                  className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col cursor-pointer transform hover:scale-102 transition-all duration-300 hover:border-cyan-500"
                >
                  <div className="relative w-full h-44 xs:h-56 sm:h-56 bg-gray-700">
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-xl"
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                  </div>
                  <div className="p-3 sm:p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-base text-gray-400 mb-1">
                        <span className="font-semibold text-gray-300">
                          희귀도:
                        </span>{" "}
                        <span
                          className={
                            card.rarity === "Legendary"
                              ? "text-yellow-400 font-bold"
                              : card.rarity === "Epic"
                              ? "text-red-400 font-bold"
                              : card.rarity === "Rare"
                              ? "text-cyan-400 font-bold"
                              : "text-gray-300"
                          }
                        >
                          {card.rarity}
                        </span>
                      </p>
                      <p className="text-xs sm:text-base text-gray-400 mb-1 sm:mb-2">
                        <span className="font-semibold text-gray-300">
                          소유자:
                        </span>{" "}
                        {card.owner?.username || "알 수 없음"}
                      </p>
                      {card.description && (
                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                          {card.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-5 text-right text-xs text-gray-500">
                      등록일:{" "}
                      {new Date(card.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-center mt-8 md:mt-12 space-y-2 md:space-y-0 md:space-x-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1 || loading}
              >
                이전
              </button>
              {renderPaginationButtons()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || loading}
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalMsg}
      </Modal>
    </>
  );
}
