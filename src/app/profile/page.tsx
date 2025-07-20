// app/profile/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../components/LoadingSpinner";
import Modal from "../../components/Modal";

interface Profile {
  id: string;
  username: string;
  email: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    cards?: number;
    ratings?: number;
    proposerTrades?: number;
    receiverTrades?: number;
  };
  bio?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  interface EditData {
    username: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
  }
  const [editData, setEditData] = useState<EditData>({ username: "" });
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setEditData({ username: data.user.username });
      } else {
        setError(data.message || "프로필 정보를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("프로필 정보 조회 오류:", err);
      setError("네트워크 오류 또는 서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && profile) {
      setEditData({ username: profile.username });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setIsEditing(false);
        setModalMsg("프로필이 성공적으로 업데이트되었습니다!");
        setModalOpen(true);
      } else {
        setModalMsg(data.message || "프로필 업데이트에 실패했습니다.");
        setModalOpen(true);
      }
    } catch (err) {
      console.error("프로필 업데이트 오류:", err);
      setModalMsg("프로필 업데이트 중 오류가 발생했습니다.");
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
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
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full transition-all duration-300"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-24 pb-12">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-400 mb-4">
              프로필을 찾을 수 없습니다
            </h1>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full transition-all duration-300"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
        <div className="container mx-auto px-2 sm:px-6 py-6 sm:py-8 z-10 relative">
          <div className="max-w-4xl mx-auto">
            {/* 페이지 제목 */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg animate-fade-in-up">
                <span className="text-cyan-400">프로필</span> 관리
              </h1>
              <p className="text-base xs:text-lg sm:text-2xl text-gray-300 mt-2 sm:mt-4 animate-fade-in animation-delay-500">
                당신의 <span className="text-yellow-400">정보</span>를
                관리하세요
              </p>
            </div>

            {error && (
              <p className="text-center text-red-500 text-base sm:text-xl font-medium mb-6 sm:mb-8 animate-fade-in">
                {error}
              </p>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-40 sm:h-64">
                <LoadingSpinner />
              </div>
            ) : profile ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* 프로필 정보 */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <h2 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      기본 정보
                    </h2>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-medium text-gray-300">
                          사용자명:
                        </span>
                        <span className="text-sm sm:text-base text-white font-semibold">
                          {profile.username}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-medium text-gray-300">
                          이메일:
                        </span>
                        <span className="text-sm sm:text-base text-white">
                          {profile.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-medium text-gray-300">
                          가입일:
                        </span>
                        <span className="text-sm sm:text-base text-gray-400">
                          {new Date(profile.createdAt).toLocaleDateString(
                            "ko-KR",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 통계 정보 */}
                  <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      활동 통계
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                          {profile?._count?.cards || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300">
                          보유 카드
                        </div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                          {profile?.points?.toLocaleString?.() || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300">
                          포인트
                        </div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-red-400">
                          {profile?._count?.ratings || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300">
                          평가 횟수
                        </div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-green-400">
                          {profile?._count?.proposerTrades || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300">
                          보낸 거래
                        </div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                          {profile?._count?.receiverTrades || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300">
                          받은 거래
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 프로필 편집 폼 */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      프로필 편집
                    </h3>
                    <form
                      onSubmit={handleUpdate}
                      className="space-y-3 sm:space-y-4"
                    >
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
                          value={editData.username}
                          onChange={handleChange}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
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
                        <p className="text-sm sm:text-base text-white">
                          이메일은 변경할 수 없습니다.
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="bio"
                          className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                        >
                          자기소개 (선택사항)
                        </label>
                        <textarea
                          id="bio"
                          value={profile?.bio || ""}
                          onChange={(e) =>
                            setProfile((prev) =>
                              prev ? { ...prev, bio: e.target.value } : null
                            )
                          }
                          rows={3}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base resize-none"
                          placeholder="자신에 대해 간단히 소개해주세요..."
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                        <button
                          type="button"
                          onClick={handleEditToggle}
                          className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? "저장 중..." : "프로필 저장"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* 비밀번호 변경 */}
                  <div className="p-4 sm:p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      비밀번호 변경
                    </h3>
                    <form
                      onSubmit={handleUpdate}
                      className="space-y-3 sm:space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                        >
                          현재 비밀번호
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={editData.password || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                        >
                          새 비밀번호
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={editData.newPassword || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm sm:text-base font-medium text-gray-300 mb-1 sm:mb-2"
                        >
                          새 비밀번호 확인
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={editData.confirmPassword || ""}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "변경 중..." : "비밀번호 변경"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-lg sm:text-2xl animate-fade-in">
                프로필 정보를 불러올 수 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalMsg}
      </Modal>
    </>
  );
}
