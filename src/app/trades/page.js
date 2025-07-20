"use client";

import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function TradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [actionLoading, setActionLoading] = useState(""); // tradeId

  // 받은 거래 목록 불러오기
  const fetchTrades = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trades?type=received");
      const data = await res.json();
      if (res.ok) {
        setTrades(data.trades);
      } else {
        setError(data.message || "거래 목록을 불러오지 못했습니다.");
      }
    } catch (err) {
      setError("네트워크 오류 또는 서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // 거래 수락/거절
  const handleAction = async (tradeId, action) => {
    setActionLoading(tradeId + action);
    try {
      const res = await fetch(`/api/trades/${tradeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setModalMsg(
        data.message ||
          (action === "accept"
            ? "거래가 완료되었습니다."
            : "거래가 거절되었습니다.")
      );
      setModalOpen(true);
      if (res.ok) {
        fetchTrades();
      }
    } catch (err) {
      setModalMsg("요청 처리 중 오류가 발생했습니다.");
      setModalOpen(true);
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
      <div className="container mx-auto max-w-2xl px-2 sm:px-6 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-cyan-400">
          받은 거래 목록
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 font-semibold py-8">
            {error}
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            받은 거래 요청이 없습니다.
          </div>
        ) : (
          <ul className="space-y-6">
            {trades.map((trade) => (
              <li
                key={trade.id}
                className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* 상대방 정보 */}
                  <div className="text-sm sm:text-base text-gray-300 mb-2 sm:mb-0">
                    <span className="font-bold text-cyan-400">
                      {trade.proposer.username}
                    </span>{" "}
                    님이
                  </div>
                  {/* 상대방 카드 */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">
                      상대 카드
                    </span>
                    <div className="w-20 h-28 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center mb-1">
                      <img
                        src={trade.proposerCard.imageUrl}
                        alt={trade.proposerCard.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-xs text-gray-300">
                      {trade.proposerCard.title}
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-gray-400 text-lg font-bold mx-2">
                    ↔
                  </span>
                  {/* 내 카드 */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">내 카드</span>
                    <div className="w-20 h-28 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center mb-1">
                      <img
                        src={trade.receiverCard.imageUrl}
                        alt={trade.receiverCard.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-xs text-gray-300">
                      {trade.receiverCard.title}
                    </span>
                  </div>
                </div>
                {/* 상태 및 버튼 */}
                <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end mt-2 sm:mt-0">
                  {trade.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleAction(trade.id, "accept")}
                        disabled={actionLoading === trade.id + "accept"}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === trade.id + "accept"
                          ? "처리 중..."
                          : "수락"}
                      </button>
                      <button
                        onClick={() => handleAction(trade.id, "reject")}
                        disabled={actionLoading === trade.id + "reject"}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-full shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === trade.id + "reject"
                          ? "처리 중..."
                          : "거절"}
                      </button>
                    </>
                  ) : trade.status === "ACCEPTED" ? (
                    <span className="text-green-400 font-bold">거래 완료</span>
                  ) : trade.status === "REJECTED" ? (
                    <span className="text-red-400 font-bold">거래 거절됨</span>
                  ) : trade.status === "CANCELLED" ? (
                    <span className="text-gray-400 font-bold">거래 취소됨</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {modalMsg}
        </Modal>
      </div>
    </div>
  );
}
