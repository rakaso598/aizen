// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next.js 13 이상에서 권장하는 방식
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'i.namu.wiki', // 실제 이미지가 호스팅되는 도메인
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