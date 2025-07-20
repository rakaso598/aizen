// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.pixabay.com", // Pixabay (무료 고품질 이미지)
      "images.unsplash.com", // Unsplash (무료 고품질 사진)
      "i.namu.wiki", // 나무위키 (참고용, 저작권 주의)
      "via.placeholder.com", // 플레이스홀더 이미지 (개발/임시용)
      "upload.wikimedia.org", // 위키미디어 공용 (정보성 이미지)
      "i.ytimg.com", // YouTube 썸네일 (동영상 썸네일 사용 시)
      "lh3.googleusercontent.com", // Google 계정 프로필 사진 등 (로그인 연동 시)
      "avatars.githubusercontent.com", // GitHub 아바타/이미지 (GitHub 연동 시)
      "cdn.jsdelivr.net", // jsDelivr (CDN을 통해 이미지 호스팅 시)
      "user-images.githubusercontent.com", // GitHub 사용자 이미지 (GitHub README 등)
      "res.cloudinary.com", // Cloudinary (클라우드 기반 이미지/비디오 관리)
      "drive.google.com", // Google Drive (공유된 이미지 사용 시, 직접 링크가 아니라 뷰어 링크일 수 있음)
      "s3.amazonaws.com", // AWS S3 (S3에 이미지 호스팅 시)
      "*.s3.ap-northeast-2.amazonaws.com", // AWS S3 한국 리전 예시 (와일드카드 서브도메인)
      "storage.googleapis.com", // Google Cloud Storage (GCS에 이미지 호스팅 시)
      "firebasestorage.googleapis.com", // Firebase Storage (Firebase에 이미지 호스팅 시)
      "cdn.sanity.io", // Sanity.io (Headless CMS에서 이미지 가져올 때)
      "picsum.photos", // Lorem Picsum (랜덤 플레이스홀더 이미지)
      "assets.example.com", // 일반적으로 자산을 호스팅하는 서브도메인 (예시, 실제 도메인으로 교체 필요)
      // 필요한 경우 추가적인 도메인을 여기에 계속 추가할 수 있습니다.
    ],
    // Next.js 13 이상에서 권장하는 방식
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "i.namu.wiki", // 실제 이미지가 호스팅되는 도메인
      },
      // 만약 나중에 다른 이미지 호스트를 사용하게 된다면 여기에 추가
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-host.com',
      // },
    ],
    // Next.js 12 이하에서 사용하던 방식 (가능하면 remotePatterns 권장)
    // domains: ['via.placeholder.com'],
  },
};

export default nextConfig;
