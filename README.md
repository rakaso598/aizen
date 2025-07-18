# 🃏 [Aizen: AI 아트 카드 갤러리 및 거래 플랫폼](https://aizen-rouge.vercel.app)

![Animation_aizen_1](https://github.com/user-attachments/assets/c7605a9b-cd4a-4bf8-8931-da6a09744085)

🚨**경고: 현재 테스트 중인 버전입니다. DB와 연동되어 있으니 실제 민감 정보를 절대 입력하지 마세요.** 🚨  

‼️**주의: 본 플랫폼은 개발 단계에 있으며, 서비스 안정성 및 보안이 보장되지 않습니다.**‼️  

## **1. 프로젝트 소개**

Aizen은 AI-Gen(AI Generation) 이미지 기술을 활용하는 아티스트와 사용자들을 위한 혁신적인 모바일 우선 커뮤니티 플랫폼입니다. 이곳에서 사용자들은 자신만의 독창적인 AI-Gen 아트를 카드 형태로 공유하고, 서로의 작품을 평가하며, 나아가 1:1로 교환하는 독특한 경험을 할 수 있습니다. Aizen은 단순히 이미지를 공유하는 것을 넘어, AI 아트가 새로운 가치를 창출하고 활발히 유통되는 선순환 생태계를 구축하는 것을 목표로 합니다.

#### *슬로건: 당신의 AI 아트를 공유하고, 평가하며, 소유하세요.*

**핵심 가치:**

* **창작 독려:** AI 아티스트들이 자유롭게 작품을 공유하고 인정받을 수 있는 환경을 조성합니다.
* **사용자 중심:** 모바일 환경에 최적화된 직관적이고 부드러운 UI/UX를 제공합니다.
* **공정성:** 투기적 요소를 배제하고 순수한 '카드 교환'에 집중하는 1:1 거래 시스템을 운영합니다.
* **저작권 부담 최소화:** AI 생성 이미지에 초점을 맞춰 개발 및 운영상의 저작권 부담을 경감합니다.
* **미학적 경험:** 강렬한 색상 대비와 신비로운 분위기를 통해 Aizen만의 독특한 시각적 경험을 제공합니다.

## **2. 기술 스택**

#### *프론트엔드/백엔드/데이터베이스*
![](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white) ![](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) ![](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
#### *배포/호스팅/버전관리*
![](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## **3. 주요 기능 (MVP)**

* **사용자 인증 및 프로필:**
    * 회원가입, 로그인/로그아웃, 비밀번호 재설정
    * 사용자 프로필 조회 및 업데이트 (사용자 이름, 보유 포인트, 업로드 카드 수)
* **AI 아트 카드 관리:**
    * AI 아트 카드 업로드 (제목, 설명, 이미지)
    * 내 카드 목록 조회 및 상세 보기
    * 카드 수정 및 삭제 (업로더 본인만 가능)
* **카드 탐색 및 상호작용:**
    * 전체 카드 갤러리 (무한 스크롤, 최신순 정렬)
    * 카드 검색 기능 (제목, 설명 기반)
    * 별점 부여 (로그인 사용자, 카드당 1회)
* **포인트 및 도전 과제 시스템:**
    * AI 아트 업로드, 별점 부여 등 활동을 통한 포인트 획득
    * 포인트 현황 및 획득/사용 내역 조회
    * 도전 과제 목록 조회 및 진행 상황 관리
* **1:1 카드 거래 시스템:**
    * 다른 사용자에게 AI 아트 카드 교환 제안
    * 보낸/받은 거래 제안 목록 확인 및 알림
    * 거래 제안 수락/거절 기능
    * 거래 수락 시 안전한 카드 소유권 자동 이전

## **4. 개발 워크플로우**

* **모바일 퍼스트:** 모든 UI/UX는 모바일 기기에서의 최적의 경험을 위해 설계됩니다.
* **애자일 방법론:** 기능을 작은 단위로 나누어 구현하고 테스트하는 반복적인 개발 방식을 채택합니다.
* **CI/CD:** GitHub와 Vercel을 연동하여 코드 변경 시 자동 빌드, 테스트 및 배포를 진행합니다.

## **5. 향후 확장 계획**

MVP 이후에는 다음과 같은 기능들을 추가하여 Aizen 플랫폼을 고도화할 예정입니다.

* 소셜 로그인 연동
* 댓글, 좋아요, 팔로우 등 소셜 커뮤니티 기능
* 실시간 알림 시스템
* 유료 포인트 구매 시스템
* 카드 카테고리/태그 및 고급 필터링
* 다양한 도전 과제 추가 및 관리 기능
* PC 웹 환경 최적화

**Aizen은 AI 아트의 새로운 가능성을 탐색하고, 창작자와 사용자 모두가 즐길 수 있는 특별한 공간을 제공합니다.**
