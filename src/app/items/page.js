// app/items/page.js

// React의 Suspense를 임포트합니다.
import { Suspense } from 'react';
// 새로 생성한 ItemsPageContent 클라이언트 컴포넌트를 임포트합니다.
import ItemsPageContent from './ItemsPageContent';

// Suspense가 로딩 중일 때 보여줄 폴백(fallback) UI를 정의합니다.
// 이 부분은 페이지 로딩 중 사용자에게 보여질 내용입니다.
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center p-8 rounded-lg shadow-md bg-white">
      {/* 로딩 스피너 SVG */}
      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-lg text-blue-600">페이지를 로드하는 중...</p>
    </div>
  </div>
);

// 이 컴포넌트는 서버 컴포넌트(기본)로 작동합니다.
export default function ItemsPage() {
  return (
    // ItemsPageContent 컴포넌트를 Suspense로 감쌉니다.
    // Suspense는 내부의 클라이언트 컴포넌트(ItemsPageContent)가
    // useSearchParams와 같은 동적인 클라이언트 기능으로 인해 준비되지 않았을 때
    // fallback으로 지정된 LoadingFallback UI를 표시합니다.
    <Suspense fallback={<LoadingFallback />}>
      <ItemsPageContent />
    </Suspense>
  );
}