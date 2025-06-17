// app/items/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ItemsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCards, setTotalCards] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 필터링 상태
  const [filterOwnerId, setFilterOwnerId] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10); // 한 페이지당 아이템 수

  // 카드 데이터 가져오는 함수
  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError('');

    const query = new URLSearchParams();
    if (filterOwnerId) query.append('ownerId', filterOwnerId);
    if (filterRarity) query.append('rarity', filterRarity);
    query.append('page', currentPage.toString());
    query.append('limit', limitPerPage.toString());

    // URL 업데이트 (뒤로가기/앞으로가기 버튼 지원)
    router.push(`/items?${query.toString()}`, { shallow: true });

    try {
      const response = await fetch(`/api/items/cards?${query.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setCards(data.cards);
        setTotalCards(data.totalCards);
        setTotalPages(data.totalPages);
        // 서버에서 받은 실제 페이지와 limit를 상태에 반영 (동기화)
        setCurrentPage(data.currentPage);
        setLimitPerPage(data.limit);
      } else {
        setError(data.message || '카드 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('카드 목록 조회 오류:', err);
      setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [filterOwnerId, filterRarity, currentPage, limitPerPage, router]);

  // URL 쿼리 파라미터 변경 시 상태 업데이트
  useEffect(() => {
    const ownerIdParam = searchParams.get('ownerId') || '';
    const rarityParam = searchParams.get('rarity') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);

    setFilterOwnerId(ownerIdParam);
    setFilterRarity(rarityParam);
    setCurrentPage(pageParam);
    setLimitPerPage(limitParam);

    // URL 파라미터가 변경될 때마다 카드 다시 가져오기
    fetchCards();
  }, [searchParams, fetchCards]); // searchParams가 변경될 때마다 fetchCards 호출

  // 페이지네이션 버튼 렌더링
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 border rounded-md mx-1 ${
            currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'
          }`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (loading && cards.length === 0) { // 초기 로딩 시에만 전체 로딩 메시지
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-blue-600">카드 목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">AI 아트 카드 갤러리</h1>

        {/* 필터링 UI */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">필터</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filterOwnerId" className="block text-sm font-medium text-gray-700">소유자 ID (본인 카드만 보려면 /me 페이지에서 ID 확인)</label>
              <input
                type="text"
                id="filterOwnerId"
                value={filterOwnerId}
                onChange={(e) => setFilterOwnerId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="소유자 ID 입력"
              />
            </div>
            <div>
              <label htmlFor="filterRarity" className="block text-sm font-medium text-gray-700">희귀도</label>
              <select
                id="filterRarity"
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">모두</option>
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>
            <div>
                <label htmlFor="limitPerPage" className="block text-sm font-medium text-gray-700">카드 수</label>
                <select
                    id="limitPerPage"
                    value={limitPerPage}
                    onChange={(e) => {
                        setLimitPerPage(parseInt(e.target.value, 10));
                        setCurrentPage(1); // limit 변경 시 첫 페이지로 이동
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setCurrentPage(1); // 필터 적용 시 1페이지로 리셋
                fetchCards(); // 필터 적용
              }}
              className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              필터 적용
            </button>
            <button
              onClick={() => {
                setFilterOwnerId('');
                setFilterRarity('');
                setCurrentPage(1);
                setLimitPerPage(10);
                // URL 초기화
                router.push('/items', { shallow: true });
              }}
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-red-600 mb-4">{error}</p>
        )}

        {loading && cards.length > 0 && ( // 데이터는 있지만 추가 로딩 중일 때
            <p className="text-center text-blue-600 mb-4">카드 목록 업데이트 중...</p>
        )}

        {cards.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-600">카드가 없습니다. 새로운 카드를 생성해보세요!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="relative w-full h-48 bg-gray-200">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">희귀도:</span> {card.rarity}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">소유자:</span> {card.owner?.username || '알 수 없음'}
                    </p>
                    {card.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">{card.description}</p>
                    )}
                  </div>
                  <div className="mt-4 text-right text-xs text-gray-500">
                    등록일: {new Date(card.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 컨트롤 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-100 disabled:opacity-50"
              disabled={currentPage === 1 || loading}
            >
              이전
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-100 disabled:opacity-50"
              disabled={currentPage === totalPages || loading}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}