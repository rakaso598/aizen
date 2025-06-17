// app/items/cards/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // NextAuth.js 클라이언트 세션 훅

export default function CardDetailPage({ params }) {
  const { id } = params; // 동적 라우트에서 카드 ID 가져오기
  const router = useRouter();
  const { data: session, status } = useSession(); // NextAuth.js 세션 정보

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    rarity: '',
  });

  // 카드 데이터 가져오기
  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/items/cards/${id}`);
        const data = await response.json();

        if (response.ok) {
          setCard(data.card);
          setEditData({ // 수정 폼 초기값 설정
            title: data.card.title,
            description: data.card.description || '',
            imageUrl: data.card.imageUrl,
            rarity: data.card.rarity,
          });
        } else {
          setError(data.message || '카드 정보를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('카드 상세 조회 오류:', err);
        setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCard();
    }
  }, [id]);

  // 수정 모드 토글
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // 카드 업데이트 제출 핸들러
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/items/cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      const data = await response.json();

      if (response.ok) {
        setCard(data.card); // 업데이트된 카드 정보로 UI 갱신
        setIsEditing(false); // 수정 모드 종료
        alert('카드가 성공적으로 업데이트되었습니다!');
      } else {
        setError(data.message || '카드 업데이트에 실패했습니다.');
        alert(`카드 업데이트 실패: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('카드 업데이트 오류:', err);
      setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      alert('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카드 삭제 핸들러
  const handleDelete = async () => {
    if (!confirm('정말로 이 카드를 삭제하시겠습니까?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/items/cards/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        alert('카드가 성공적으로 삭제되었습니다!');
        router.push('/items'); // 카드 목록 페이지로 이동
      } else {
        setError(data.message || '카드 삭제에 실패했습니다.');
        alert(`카드 삭제 실패: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error('카드 삭제 오류:', err);
      setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      alert('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 상태 처리
  if (loading && !card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-blue-600">카드 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-red-600">오류: {error}</p>
      </div>
    );
  }

  // 카드 데이터가 없는 경우 (예: 404)
  if (!card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">카드를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // 현재 로그인한 사용자가 카드 소유자인지 확인
  const isOwner = session?.user?.id === card.ownerId;

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">카드 상세 정보</h1>

        <div className="mb-6">
          <div className="relative w-full h-80 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              style={{ objectFit: 'contain' }} // 상세 페이지에서는 contain으로 전체 이미지 보이게
              className="rounded-lg"
              sizes="100vw"
              priority
            />
          </div>

          {!isEditing ? (
            // 조회 모드
            <div>
              <p className="text-2xl font-semibold text-gray-900 mb-2">{card.title}</p>
              <p className="text-md text-gray-700 mb-3">{card.description}</p>
              <p className="text-md text-gray-600 mb-1">
                <span className="font-medium">희귀도:</span> {card.rarity}
              </p>
              <p className="text-md text-gray-600 mb-1">
                <span className="font-medium">소유자:</span> {card.owner?.username || '알 수 없음'} ({card.ownerId})
              </p>
              <p className="text-sm text-gray-500 mt-4">
                등록일: {new Date(card.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                마지막 업데이트: {new Date(card.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            // 수정 모드
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">설명</label>
                <textarea
                  id="description"
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">이미지 URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={editData.imageUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="rarity" className="block text-sm font-medium text-gray-700">희귀도</label>
                <select
                  id="rarity"
                  name="rarity"
                  value={editData.rarity}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="Common">Common</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? '저장 중...' : '변경 사항 저장'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 관리 버튼 (소유자에게만 보임) */}
        {isOwner && status === 'authenticated' && (
          <div className="flex justify-end space-x-3 mt-6">
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading}
              >
                카드 수정
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={loading}
            >
              카드 삭제
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/items')}
            className="px-6 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← 카드 목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}