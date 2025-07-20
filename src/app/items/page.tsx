// app/items/page.js
// React의 Suspense를 임포트합니다.
import { Suspense } from 'react';
// 새로 생성한 ItemsPageContent 클라이언트 컴포넌트를 임포트합니다.
import ItemsPageContent from './ItemsPageContent';
// 새로 생성한 LoadingSpinner 클라이언트 컴포넌트를 임포트합니다.
import LoadingSpinner from '../../components/LoadingSpinner'; // 경로 주의!

// 이 컴포넌트는 서버 컴포넌트(기본)로 작동합니다.
export default function ItemsPage() {
  return (
    // ItemsPageContent 컴포넌트를 Suspense로 감쌉니다.
    // Suspense는 내부의 클라이언트 컴포넌트(ItemsPageContent)가
    // useSearchParams와 같은 동적인 클라이언트 기능으로 인해 준비되지 않았을 때
    // fallback으로 지정된 LoadingSpinner UI를 표시합니다.
    <Suspense fallback={<LoadingSpinner />}>
      <ItemsPageContent />
    </Suspense>
  );
}