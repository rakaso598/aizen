# 🃏 [Aizen: AI 아트 카드 갤러리 및 거래 플랫폼](https://aizen-rouge.vercel.app)

![Animation_aizen_1](https://github.com/user-attachments/assets/c7605a9b-cd4a-4bf8-8931-da6a09744085)

<img width="1108" height="865" alt="image" src="https://github.com/user-attachments/assets/da145bdf-0553-4a65-9228-ffa77e7ea4ef" />

- 🚨**경고: 현재 테스트 중인 버전입니다. DB와 연동되어 있으니 실제 민감 정보를 절대 입력하지 마세요.** 🚨

- ‼️**주의: 본 플랫폼은 개발 단계에 있으며, 서비스 안정성 및 보안이 보장되지 않습니다.**‼️

## **1. 프로젝트 소개**

Aizen은 AI-Gen(AI Generation) 이미지 기술을 활용하는 아티스트와 사용자들을 위한 혁신적인 모바일 우선 커뮤니티 플랫폼입니다. 이곳에서 사용자들은 자신만의 독창적인 AI-Gen 아트를 카드 형태로 공유하고, 서로의 작품을 평가하며, 나아가 1:1로 교환하는 독특한 경험을 할 수 있습니다. Aizen은 단순히 이미지를 공유하는 것을 넘어, AI 아트가 새로운 가치를 창출하고 활발히 유통되는 선순환 생태계를 구축하는 것을 목표로 합니다.

#### _슬로건: 당신의 AI 아트를 공유하고, 평가하며, 소유하세요._

**핵심 가치:**

- **창작 독려:** AI 아티스트들이 자유롭게 작품을 공유하고 인정받을 수 있는 환경을 조성합니다.
- **사용자 중심:** 모바일 환경에 최적화된 직관적이고 부드러운 UI/UX를 제공합니다.
- **공정성:** 투기적 요소를 배제하고 순수한 '카드 교환'에 집중하는 1:1 거래 시스템을 운영합니다.
- **저작권 부담 최소화:** AI 생성 이미지에 초점을 맞춰 개발 및 운영상의 저작권 부담을 경감합니다.
- **미학적 경험:** 강렬한 색상 대비와 신비로운 분위기를 통해 Aizen만의 독특한 시각적 경험을 제공합니다.

## **2. 기술 스택**

#### _프론트엔드/백엔드/데이터베이스_

![](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) ![](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

#### _배포/호스팅/버전관리_

![](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![](https://img.shields.io/badge/Neon%20DB-4A4A4A?style=for-the-badge&logo=neon&logoColor=white)

## **3. 주요 기능 (MVP)**

### ✅ **완성된 기능들**

- **사용자 인증 및 프로필:**

  - ✅ 회원가입, 로그인/로그아웃
  - ✅ 사용자 프로필 조회 및 업데이트 (사용자 이름, 보유 포인트, 업로드 카드 수)
  - ✅ NextAuth.js를 통한 안전한 세션 관리

- **AI 아트 카드 관리:**

  - ✅ AI 아트 카드 업로드 (제목, 설명, 이미지 URL, 희귀도)
  - ✅ 전체 카드 갤러리 (무한 스크롤, 최신순 정렬, 필터링)
  - ✅ 카드 상세보기 및 평가 시스템
  - ✅ 카드 수정 및 삭제 (업로더 본인만 가능)

- **카드 탐색 및 상호작용:**

  - ✅ 전체 카드 갤러리 (페이지네이션, 희귀도별 필터링)
  - ✅ 카드 검색 기능 (제목, 설명 기반)
  - ✅ 별점 부여 (로그인 사용자, 카드당 1회)
  - ✅ 평가 코멘트 작성

- **포인트 및 활동 시스템:**

  - ✅ 사용자 활동 통계 (보유 카드, 작성한 평가, 거래 내역)
  - ✅ 포인트 현황 조회

- **1:1 카드 거래 시스템:**
  - ✅ 다른 사용자에게 AI 아트 카드 교환 제안
  - ✅ 보낸/받은 거래 제안 목록 확인
  - ✅ 거래 제안 수락/거절 기능
  - ✅ 거래 수락 시 안전한 카드 소유권 자동 이전

### 🔄 **개발 중인 기능들**

- **도전 과제 시스템:**
  - 🔄 도전 과제 목록 조회 및 진행 상황 관리
  - 🔄 포인트 획득/사용 내역 조회

## **4. 설치 및 실행 방법**

### **필수 요구사항**

- Node.js 18.0.0 이상
- PostgreSQL 데이터베이스
- npm 또는 yarn

### **1. 프로젝트 클론**

```bash
git clone https://github.com/your-username/aizen.git
cd aizen
```

### **2. 의존성 설치**

```bash
npm install
```

### **3. 환경 변수 설정**

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/aizen_db"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**중요:**

- `DATABASE_URL`을 실제 PostgreSQL 데이터베이스 연결 문자열로 변경하세요
- `NEXTAUTH_SECRET`은 보안을 위해 강력한 랜덤 문자열로 설정하세요 (예: `openssl rand -base64 32` 명령어로 생성)

### **4. 데이터베이스 설정**

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma db push
```

### **5. 개발 서버 실행**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## **0. 프로젝트 구조**

```
aizen/
  ├─ src/
  │   ├─ app/                # Next.js 라우트 및 페이지, API 엔드포인트
  │   ├─ components/         # 공통 UI 컴포넌트
  │   └─ utils/              # 유틸리티 함수
  ├─ prisma/                 # Prisma 스키마 및 마이그레이션
  ├─ public/                 # 정적 파일(이미지, 아이콘 등)
  ├─ README.md
  ├─ package.json
  └─ ...
```

- 각 주요 폴더 및 파일의 역할을 위와 같이 참고하세요.

## **5. 개발 워크플로우**

- **모바일 퍼스트:** 모든 UI/UX는 모바일 기기에서의 최적의 경험을 위해 설계됩니다. Tailwind CSS의 유틸리티 클래스와 Next.js의 동적 라우팅을 적극 활용하여 반응형 UI를 구현하였습니다.
- **애자일 방법론:** 기능을 작은 단위로 나누어 구현하고 테스트하는 반복적인 개발 방식을 채택합니다.
- **CI/CD:** GitHub와 Vercel을 연동하여 코드 변경 시 자동 빌드, 테스트 및 배포를 진행합니다.

## **6. API 엔드포인트**

### **인증 관련**

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/[...nextauth]` - NextAuth.js 인증

### **카드 관련**

- `GET /api/items/cards` - 카드 목록 조회
- `POST /api/items/create` - 카드 생성
- `GET /api/items/cards/[id]` - 카드 상세 조회
- `PUT /api/items/cards/[id]` - 카드 수정
- `DELETE /api/items/cards/[id]` - 카드 삭제
- `POST /api/items/cards/[id]/ratings` - 카드 평가 추가
- `GET /api/items/cards/[id]/ratings` - 카드 평가 목록

### **거래 관련**

- `POST /api/trades` - 거래 제안 생성
- `GET /api/trades` - 거래 목록 조회
- `PUT /api/trades/[id]` - 거래 응답 (수락/거절)
- `DELETE /api/trades/[id]` - 거래 취소

### **사용자 관련**

- `GET /api/user/profile` - 프로필 정보 조회
- `PUT /api/user/profile` - 프로필 정보 수정

## **7. 데이터베이스 스키마**

프로젝트는 Prisma ORM을 사용하며, 다음과 같은 주요 모델들을 포함합니다:

- **User**: 사용자 정보 (이메일, 사용자명, 포인트 등)
- **Card**: AI 아트 카드 (제목, 설명, 이미지 URL, 희귀도 등)
- **Rating**: 카드 평가 (평점, 코멘트)
- **Trade**: 카드 거래 (제안자, 수신자, 카드 정보, 상태)
- **Challenge**: 도전 과제 (이름, 설명, 보상 포인트)
- **UserChallenge**: 사용자별 도전 과제 진행 상황
- **PointHistory**: 포인트 변동 내역

## **8. 향후 확장 계획**

MVP 이후에는 다음과 같은 기능들을 추가하여 Aizen 플랫폼을 고도화할 예정입니다.

- 소셜 로그인 연동 (Google, Kakao 등)
- 댓글, 좋아요, 팔로우 등 소셜 커뮤니티 기능
- 실시간 알림 시스템
- 유료 포인트 구매 시스템
- 카드 카테고리/태그 및 고급 필터링
- 다양한 도전 과제 추가 및 관리 기능
- PC 웹 환경 최적화
- 모바일 앱 개발

## **9. 기여하기**

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## **10. 라이선스**

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

**Aizen은 AI 아트의 새로운 가능성을 탐색하고, 창작자와 사용자 모두가 즐길 수 있는 특별한 공간을 제공합니다.**

🚀 **지금 바로 Aizen의 여정을 시작하세요!**

## **11. 테스트(Jest) 실행 및 커버리지 확인 방법**

이 프로젝트는 [Jest](https://jestjs.io/)와 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)를 사용한 단위 테스트를 지원합니다.

### 1. 의존성 설치

아직 설치하지 않았다면 아래 명령어로 테스트 관련 패키지를 설치하세요:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### 2. 테스트 실행

아래 명령어로 전체 테스트를 실행할 수 있습니다:

```bash
npx jest
```

또는

```bash
npm test
```

### 3. 테스트 커버리지 리포트 확인

아래 명령어로 테스트 커버리지 리포트를 확인할 수 있습니다:

```bash
npx jest --coverage
```

### 4. 테스트 파일 구조

- `src/app/items/__tests__/ItemsPageContent.test.js` : 카드 갤러리 페이지 테스트
- `src/app/items/cards/[id]/__tests__/CardDetailPage.test.js` : 카드 상세 페이지 테스트
- `src/components/__tests__/LoadingSpinner.test.js` : 로딩 스피너 컴포넌트 테스트
- `src/components/__tests__/Header.test.js` : 헤더 컴포넌트 테스트
- `src/components/__tests__/Footer.test.js` : 푸터 컴포넌트 테스트
- `src/app/api/` 하위 각 API 엔드포인트별로 `route.test.ts` 파일이 존재합니다.

### 5. 테스트 예시

```js
import { render, screen } from "@testing-library/react";
import Header from "../Header";

test("헤더에 로고가 보인다", () => {
  render(<Header />);
  expect(screen.getByText(/Aizen/)).toBeInTheDocument();
});
```

### 6. 참고

- 테스트는 `__tests__` 폴더 또는 `*.test.js`/`*.test.ts` 파일에 작성합니다.
- 더 많은 테스트를 추가하고 싶다면 기존 예시를 참고해 자유롭게 작성하세요.

## **12. 기여 가이드 및 코드 스타일**

- 코드 스타일은 ESLint, Prettier를 따릅니다. (설정 파일: `eslint.config.mjs`, `prettier.config.js` 등)
- 커밋 메시지는 Conventional Commits 규칙을 권장합니다.
- PR(Pull Request) 생성 전 반드시 테스트를 통과시켜 주세요.

## **13. FAQ / 문제 해결**

### Q. DB 연결 오류가 발생해요!

- `.env.local`의 `DATABASE_URL`이 올바른지, DB가 실행 중인지 확인하세요.

### Q. Prisma 마이그레이션이 안 돼요!

- `npx prisma generate`와 `npx prisma db push`를 순서대로 실행하세요.

### Q. 기타 문의

- 이슈 트래커에 남겨주시면 빠르게 답변드리겠습니다.
