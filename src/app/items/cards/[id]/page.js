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
  const [myCards, setMyCards] = useState([]);
  const [selectedMyCardId, setSelectedMyCardId] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editRarity, setEditRarity] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteWithRatings, setDeleteWithRatings] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(false);

  useEffect(() => {
    fetchCardDetails();
  }, [id]);

  // 내 카드 목록 불러오기
  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/items/cards?ownerId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setMyCards(data.cards || []);
          if (data.cards && data.cards.length > 0) {
            setSelectedMyCardId(data.cards[0].id);
          }
        });
    }
  }, [session?.user?.id]);

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

  // 거래 요청
  const handleTradeRequest = async () => {
    if (!session) {
      setModalMsg("로그인이 필요합니다.");
      setModalOpen(true);
      return;
    }
    if (!selectedMyCardId) {
      setModalMsg("제안할 내 카드를 선택해주세요.");
      setModalOpen(true);
      return;
    }
    try {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposerCardId: selectedMyCardId,
          receiverId: card.owner.id,
          receiverCardId: card.id,
        }),
      });
      const data = await response.json();
      setModalMsg(data.message || "거래 요청이 완료되었습니다.");
      setModalOpen(true);
    } catch (err) {
      setModalMsg("거래 요청 중 오류가 발생했습니다.");
      setModalOpen(true);
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

  // 카드 삭제
  const handleDelete = () => {
    setDeleteConfirmOpen(true);
    setDeleteWithRatings(false);
  };

  // 실제 삭제 실행
  const doDelete = async (withRatings = false) => {
    setPendingDelete(true);
    try {
      const url = withRatings
        ? `/api/items/cards/${id}?withRatings=true`
        : `/api/items/cards/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setModalMsg("카드가 삭제되었습니다.");
        setModalOpen(true);
        setTimeout(() => router.push("/items"), 1200);
      } else if (data.message && data.message.includes("평점이 남아 있어")) {
        // 평점이 남아 있으면 평점까지 삭제할지 물어보는 모달
        setDeleteConfirmOpen(true);
        setDeleteWithRatings(true);
      } else {
        setModalMsg(data.message || "카드 삭제에 실패했습니다.");
        setModalOpen(true);
      }
    } catch (err) {
      setModalMsg("카드 삭제 중 오류가 발생했습니다.");
      setModalOpen(true);
    } finally {
      setPendingDelete(false);
    }
  };

  // 수정 모드 진입
  const startEdit = () => {
    setEditTitle(card.title);
    setEditDescription(card.description || "");
    setEditImageUrl(card.imageUrl);
    setEditRarity(card.rarity);
    setEditMode(true);
  };
  // 수정 저장
  const handleEditSave = async () => {
    try {
      const res = await fetch(`/api/items/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          imageUrl: editImageUrl,
          rarity: editRarity,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setModalMsg("카드가 수정되었습니다.");
        setModalOpen(true);
        setEditMode(false);
        fetchCardDetails();
      } else {
        setModalMsg(data.message || "카드 수정에 실패했습니다.");
        setModalOpen(true);
      }
    } catch (err) {
      setModalMsg("카드 수정 중 오류가 발생했습니다.");
      setModalOpen(true);
    }
  };
  // 수정 취소
  const handleEditCancel = () => setEditMode(false);

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
                  {/* 소유자만 수정/삭제 버튼 */}
                  {session?.user?.id === card.owner?.id && !editMode && (
                    <div className="flex gap-3 mb-2">
                      <button
                        onClick={startEdit}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full shadow-md text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-md text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                  {/* 수정 폼 */}
                  {editMode ? (
                    <div className="space-y-3 p-4 bg-gray-900 rounded-xl border border-gray-700">
                      <div>
                        <label className="block text-gray-300 mb-1">제목</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">설명</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          이미지 URL
                        </label>
                        <input
                          type="text"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          희귀도
                        </label>
                        <select
                          value={editRarity}
                          onChange={(e) => setEditRarity(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
                        >
                          <option value="Common">Common</option>
                          <option value="Rare">Rare</option>
                          <option value="Epic">Epic</option>
                          <option value="Legendary">Legendary</option>
                        </select>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleEditSave}
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full shadow-md text-sm"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-full shadow-md text-sm"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : null}
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
                  <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto mt-4 mb-2">
                    {/* 내 카드 선택 드롭다운 */}
                    {session && myCards.length > 0 && (
                      <select
                        value={selectedMyCardId}
                        onChange={(e) => setSelectedMyCardId(e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        {myCards.map((myCard) => (
                          <option key={myCard.id} value={myCard.id}>
                            {myCard.title} ({myCard.rarity})
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={handleTradeRequest}
                      disabled={loading || !session || myCards.length === 0}
                      className="w-full max-w-xs px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {session ? "거래 요청하기" : "로그인 후 거래 가능"}
                    </button>
                    <Link
                      href="/items"
                      className="w-full max-w-xs px-5 py-2 bg-transparent border-2 border-white text-white font-bold text-base rounded-full shadow-md hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 text-center"
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
      {/* 삭제 확인 모달 */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        hideDefaultCloseButton={true}
      >
        {deleteWithRatings ? (
          <div className="text-center">
            <div className="mb-3">
              이 카드에 평점이 남아 있습니다.
              <br />
              평점까지 같이 삭제할까요?
            </div>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  doDelete(true);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-md text-sm"
                disabled={pendingDelete}
              >
                평점까지 삭제
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-full shadow-md text-sm"
                disabled={pendingDelete}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-3">
              정말로 이 카드를 삭제하시겠습니까?
              <br />
              되돌릴 수 없습니다.
            </div>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  doDelete(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-md text-sm"
                disabled={pendingDelete}
              >
                삭제
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-full shadow-md text-sm"
                disabled={pendingDelete}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
