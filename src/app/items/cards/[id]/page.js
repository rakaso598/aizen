// app/items/cards/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import Link from "next/link";
import Modal from "../../../../components/Modal";

export default function CardDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    fetchCardDetails();
  }, [id]);

  const fetchCardDetails = async () => {
    try {
      const response = await fetch(`/api/items/cards/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCard(data.card);
      } else {
        setError(data.message || "카드 정보를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("카드 상세 정보 조회 오류:", err);
      setError("네트워크 오류 또는 서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setModalMsg("로그인이 필요합니다.");
      setModalOpen(true);
      return;
    }

    if (rating === 0) {
      setModalMsg("평점을 선택해주세요.");
      setModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/items/cards/${id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMsg("평가가 성공적으로 등록되었습니다.");
        setModalOpen(true);
        setRating(0);
        setComment("");
        fetchCardDetails(); // 카드 정보 새로고침
      } else {
        setModalMsg(data.message || "평가 등록에 실패했습니다.");
        setModalOpen(true);
      }
    } catch (err) {
      console.error("평가 등록 오류:", err);
      setModalMsg("평가 등록 중 오류가 발생했습니다.");
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrade = () => {
    if (!session) {
      setModalMsg("로그인이 필요합니다.");
      setModalOpen(true);
      return;
    }

    // 거래 페이지로 이동 (향후 구현)
    setModalMsg("거래 기능은 준비 중입니다.");
    setModalOpen(true);
  };

  const handleTradeRequest = () => {
    if (!session) {
      setModalMsg("로그인이 필요합니다.");
      setModalOpen(true);
      return;
    }
    setModalMsg("거래 요청이 완료되었습니다.");
    setModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!session) {
      setModalMsg("로그인이 필요합니다.");
      setModalOpen(true);
      return;
    }

    if (rating === 0) {
      setModalMsg("평점을 선택해주세요.");
      setModalOpen(true);
      return;
    }

    setRatingLoading(true);
    try {
      const response = await fetch(`/api/items/cards/${id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMsg("평가가 성공적으로 등록되었습니다.");
        setModalOpen(true);
        setRating(0);
        setComment("");
        fetchCardDetails(); // 카드 정보 새로고침
      } else {
        setModalMsg(data.message || "평가 등록에 실패했습니다.");
        setModalOpen(true);
      }
    } catch (err) {
      console.error("평가 등록 오류:", err);
      setModalMsg("평가 등록 중 오류가 발생했습니다.");
      setModalOpen(true);
    } finally {
      setRatingLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Legendary":
        return "text-yellow-400";
      case "Epic":
        return "text-red-400";
      case "Rare":
        return "text-cyan-400";
      default:
        return "text-gray-300";
    }
  };

  const getRarityBgColor = (rarity) => {
    switch (rarity) {
      case "Legendary":
        return "bg-yellow-400/20 border-yellow-400";
      case "Epic":
        return "bg-red-400/20 border-red-400";
      case "Rare":
        return "bg-cyan-400/20 border-cyan-400";
      default:
        return "bg-gray-400/20 border-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-24 pb-12">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-24 pb-12">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">오류 발생</h1>
            <p className="text-xl text-gray-300 mb-8">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full transition-all duration-300"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-24 pb-12">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-400 mb-4">
              카드를 찾을 수 없습니다
            </h1>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full transition-all duration-300"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const averageRating = card.averageRating || 0;
  const totalRatings = card.totalRatings || 0;
  const recentRatings = card.ratings || [];

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
        <div className="container mx-auto max-w-5xl px-2 sm:px-6 md:px-8 py-6 sm:py-8 z-10 relative">
          {error && (
            <p className="text-center text-red-500 text-base sm:text-xl font-medium mb-6 sm:mb-8 animate-fade-in">
              {error}
            </p>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40 sm:h-64">
              <LoadingSpinner />
            </div>
          ) : card ? (
            <div className="max-w-3xl md:max-w-4xl mx-auto">
              {/* 카드 제목 */}
              <div className="text-center mb-6 md:mb-10">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg animate-fade-in-up">
                  <span className="text-yellow-400">{card.title}</span>
                </h1>
                <p className="text-base md:text-xl lg:text-2xl text-gray-300 mt-2 md:mt-4 animate-fade-in animation-delay-500">
                  AI가 생성한 <span className="text-cyan-400">특별한 아트</span>
                </p>
              </div>

              {/* 카드 상세 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12">
                {/* 카드 이미지 */}
                <div className="relative w-full h-64 md:h-96 lg:h-[500px] bg-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* 카드 정보 */}
                <div className="space-y-4 md:space-y-6">
                  <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      카드 정보
                    </h2>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-medium text-gray-300">
                          희귀도:
                        </span>
                        <span
                          className={
                            card.rarity === "Legendary"
                              ? "text-yellow-400 font-bold text-sm sm:text-base"
                              : card.rarity === "Epic"
                              ? "text-red-400 font-bold text-sm sm:text-base"
                              : card.rarity === "Rare"
                              ? "text-cyan-400 font-bold text-sm sm:text-base"
                              : "text-gray-300 text-sm sm:text-base"
                          }
                        >
                          {card.rarity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-medium text-gray-300">
                          소유자:
                        </span>
                        <span className="text-sm sm:text-base text-white">
                          {card.owner?.username || "알 수 없음"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-medium text-gray-300">
                          생성일:
                        </span>
                        <span className="text-sm sm:text-base text-gray-400">
                          {new Date(card.createdAt).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {card.description && (
                        <div className="pt-2 sm:pt-3 border-t border-gray-600">
                          <span className="text-sm sm:text-base font-medium text-gray-300 block mb-1 sm:mb-2">
                            설명:
                          </span>
                          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 평점 정보 */}
                  <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      평점
                    </h3>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg sm:text-2xl ${
                              i < Math.round(averageRating)
                                ? "text-yellow-400"
                                : "text-gray-600"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm sm:text-base text-gray-300">
                        {averageRating.toFixed(1)} ({totalRatings}개 평가)
                      </span>
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleTradeRequest}
                      disabled={loading || !session}
                      className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {session ? "거래 요청하기" : "로그인 후 거래 가능"}
                    </button>
                    <Link
                      href="/items"
                      className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 text-center"
                    >
                      다른 카드 보기
                    </Link>
                  </div>
                </div>
              </div>

              {/* 평점 입력 폼 */}
              {session && (
                <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 mb-8 sm:mb-12">
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                    평점 남기기
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`text-2xl sm:text-3xl transition-colors duration-200 ${
                            star <= rating
                              ? "text-yellow-400"
                              : "text-gray-600 hover:text-yellow-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleSubmitRating}
                      disabled={!rating || ratingLoading}
                      className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-sm sm:text-base rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {ratingLoading ? "평점 등록 중..." : "평점 등록"}
                    </button>
                  </div>
                </div>
              )}

              {/* 최근 평점들 */}
              {recentRatings.length > 0 && (
                <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                    최근 평점
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {recentRatings.map((rating) => (
                      <div
                        key={rating.id}
                        className="p-3 sm:p-4 bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start sm:items-center mb-2">
                          <span className="text-sm sm:text-base font-medium text-white">
                            {rating.user?.username || "익명"}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm sm:text-base ${
                                  i < rating.rating
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="text-sm sm:text-base text-gray-300">
                            {rating.comment}
                          </p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(rating.createdAt).toLocaleDateString(
                            "ko-KR",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400 text-lg sm:text-2xl animate-fade-in">
              카드를 찾을 수 없습니다.
            </p>
          )}
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalMsg}
      </Modal>
    </>
  );
}
