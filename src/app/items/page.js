// app/items/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ItemsPage() {
  const [cards, setCards] = useState([]);
  // 'loading' 상태 하나로 데이터 로딩 여부를 관리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCards, setTotalCards] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputRarity, setInputRarity] = useState('');
  const [inputLimitPerPage, setInputLimitPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 카드 데이터 가져오는 함수
  const fetchCards = useCallback(async (currentSearchParams) => {
    setLoading(true); // 데이터 요청 시작 시 로딩 상태 활성화
    setError('');

    const query = new URLSearchParams(currentSearchParams);
    const rarityToFetch = query.get('rarity') || '';
    const pageToFetch = parseInt(query.get('page') || '1', 10);
    const limitToFetch = parseInt(query.get('limit') || '10', 10);

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
        setError(data.message || '카드 목록을 불러오는데 실패했습니다.');
        setCards([]); // 오류 발생 시 카드 목록 초기화
      }
    } catch (err) {
      console.error('카드 목록 조회 오류:', err);
      setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setCards([]); // 네트워크 오류 시 카드 목록 초기화
    } finally {
      setLoading(false); // 데이터 로드 완료 시 로딩 상태 비활성화
    }
  }, []);

  useEffect(() => {
    const rarityParam = searchParams.get('rarity') || '';
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);

    setInputRarity(rarityParam);
    setInputLimitPerPage(limitParam);
    setCurrentPage(pageParam);

    fetchCards(searchParams);
  }, [searchParams, fetchCards]);

  const handleApplyFilters = () => {
    const newQuery = new URLSearchParams();
    if (inputRarity) newQuery.append('rarity', inputRarity);
    newQuery.append('page', '1');
    newQuery.append('limit', inputLimitPerPage.toString());

    router.push(`/items?${newQuery.toString()}`, { shallow: true });
  };

  const handleResetFilters = () => {
    setInputRarity('');
    setInputLimitPerPage(10);
    router.push('/items', { shallow: true });
  };

  const handlePageChange = (page) => {
    const currentQuery = new URLSearchParams(searchParams);
    currentQuery.set('page', page.toString());
    router.push(`/items?${currentQuery.toString()}`, { shallow: true });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 border rounded-md mx-1 ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'
            }`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  // --- 로딩 UI 통합 및 개선 ---
  // 페이지 전체 로딩 오버레이
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center p-8 rounded-lg shadow-md bg-white">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg text-blue-600">카드 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  // --- 로딩 UI 통합 및 개선 끝 ---

  // 메인 UI 렌더링
  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md relative">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">AI 아트 카드 갤러리</h1>

        {/* 필터링 UI */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">필터</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inputRarity" className="block text-sm font-medium text-gray-700">희귀도</label>
              <select
                id="inputRarity"
                value={inputRarity}
                onChange={(e) => setInputRarity(e.target.value)}
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
              <label htmlFor="inputLimitPerPage" className="block text-sm font-medium text-gray-700">카드 수</label>
              <select
                id="inputLimitPerPage"
                value={inputLimitPerPage}
                onChange={(e) => setInputLimitPerPage(parseInt(e.target.value, 10))}
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
              onClick={handleApplyFilters}
              className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              필터 적용
            </button>
            <button
              onClick={handleResetFilters}
              className="ml-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-red-600 mb-4">{error}</p>
        )}

        {/* 데이터가 없고 오류도 없을 때 메시지 */}
        {cards.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-600">카드가 없습니다. 새로운 카드를 생성해보세요!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link key={card.id} href={`/items/cards/${card.id}`} passHref>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200">
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
              </Link>
            ))}
          </div>
        )}

        {/* 페이지네이션 컨트롤 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 border rounded-md text-blue-600 border-blue-600 hover:bg-blue-100 disabled:opacity-50"
              disabled={currentPage === 1 || loading}
            >
              이전
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
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