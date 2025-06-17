// app/items/cards/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CardDetailPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    rarity: '',
  });

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/items/cards/${id}`);
        const data = await response.json();

        if (response.ok) {
          setCard(data.card);
          setEditData({
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && card) {
      setEditData({
        title: card.title,
        description: card.description || '',
        imageUrl: card.imageUrl,
        rarity: card.rarity,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); // 업데이트 중에도 로딩 상태 유지
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
        setCard(data.card);
        setIsEditing(false);
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

  const handleDelete = async () => {
    if (!confirm('정말로 이 카드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setLoading(true); // 삭제 중에도 로딩 상태 유지
    setError('');

    try {
      const response = await fetch(`/api/items/cards/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        alert('카드가 성공적으로 삭제되었습니다!');
        router.push('/items');
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

  // 로딩 상태일 때 미리 정의된 LoadingSpinner 컴포넌트 사용
  if (loading && !card) { // card 데이터가 없으면서 로딩 중일 때만 스피너 표시
    return <LoadingSpinner text="카드 정보를 불러오는 중입니다..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white">
        <div className="p-8 rounded-lg shadow-2xl bg-gray-800 bg-opacity-70 backdrop-blur-md border border-red-700 text-center">
          <p className="text-xl text-red-400 font-bold mb-4">오류 발생!</p>
          <p className="text-lg text-gray-300">{error}</p>
          <button
            onClick={() => router.push('/items')}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 to-black text-white">
        <div className="p-8 rounded-lg shadow-2xl bg-gray-800 bg-opacity-70 backdrop-blur-md border border-yellow-700 text-center">
          <p className="text-xl text-yellow-400 font-bold mb-4">카드를 찾을 수 없습니다.</p>
          <p className="text-lg text-gray-300">존재하지 않거나 삭제된 카드일 수 있습니다.</p>
          <button
            onClick={() => router.push('/items')}
            className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105"
          >
            카드 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === card.ownerId;

  const getRarityColorClass = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 font-bold';
      case 'Epic': return 'text-red-400 font-bold';
      case 'Rare': return 'text-cyan-400 font-bold';
      case 'Common': return 'text-gray-300';
      default: return 'text-gray-300';
    }
  };

  return (
    // 배경을 랜딩 페이지와 동일한 그라데이션으로 변경
    // 상단 여백 (padding-top)을 반응형으로 조정하여 헤더 높이만큼 확보
    <div className="relative min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gradient-to-br from-gray-950 to-black text-white 
        pt-24      // 기본 (모바일) 상단 패딩: 헤더 높이 약 64px + 여백 32px = 96px
        md:pt-32   // md (768px) 이상: 헤더 높이가 커지거나 더 많은 여백이 필요할 경우 (예: 80px 헤더 + 48px 여백 = 128px)
        lg:pt-40   // lg (1024px) 이상: 더 큰 화면에서 더 많은 여백 확보 (예: 96px 헤더 + 64px 여백 = 160px)
        pb-12">
      {/* 컨테이너 디자인 변경: 어둡고 투명한 배경, 그림자, 테두리 */}
      <div className="w-full max-w-2xl bg-gray-900 bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
        {/* 제목 스타일 변경: 흰색 텍스트에 포인트, 그림자 효과 */}
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-md">
          아트 카드 <span className="text-cyan-400">상세 정보</span>
        </h1>

        <div className="mb-8">
          <div className="relative w-full aspect-w-16 aspect-h-9 max-h-96 mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700">
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>

        {!isEditing ? (
          // 조회 모드
          <div className="space-y-4 text-lg">
            <p className="text-3xl font-bold text-white mb-2 leading-tight">{card.title}</p>
            <p className="text-gray-300 leading-relaxed">{card.description || '설명 없음'}</p>
            <p className="text-gray-300">
              <span className="font-semibold">희귀도:</span>{' '}
              <span className={getRarityColorClass(card.rarity)}>{card.rarity}</span>
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">소유자:</span> {card.owner?.username || '알 수 없음'}
            </p>
            <p className="text-gray-400 text-sm mt-6">
              등록일: {new Date(card.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-gray-400 text-sm">
              마지막 업데이트: {new Date(card.updatedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        ) : (
          // 수정 모드
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-300 mb-2">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-300 mb-2">설명</label>
              <textarea
                id="description"
                name="description"
                value={editData.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
              ></textarea>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-lg font-medium text-gray-300 mb-2">이미지 URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={editData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base"
                required
              />
            </div>
            <div>
              <label htmlFor="rarity" className="block text-lg font-medium text-gray-300 mb-2">희귀도</label>
              <select
                id="rarity"
                name="rarity"
                value={editData.rarity}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-base appearance-none cursor-pointer"
                required
              >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleEditToggle}
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <SmallLoadingSpinner className="mr-2" />
                    저장 중...
                  </div>
                ) : '변경 사항 저장'}
              </button>
            </div>
          </form>
        )}

        {/* 관리 버튼 (소유자에게만 보임) */}
        {isOwner && status === 'authenticated' && (
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
            {!isEditing && (
              <button
                onClick={handleEditToggle}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                카드 수정
              </button>
            )}
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <SmallLoadingSpinner className="mr-2" />
                  삭제 중...
                </div>
              ) : '카드 삭제'}
            </button>
          </div>
        )}

        {/* 목록으로 돌아가기 버튼 */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/items')}
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75"
          >
            ← 카드 목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}