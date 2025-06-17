/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind CSS가 적용될 파일들을 지정합니다.
  // './pages/**/*.{js,ts,jsx,tsx,mdx}', // Next.js Pages Router를 사용한다면 필요
  // './components/**/*.{js,ts,jsx,tsx,mdx}', // 컴포넌트 폴더가 있다면 필요
  // './app/**/*.{js,ts,jsx,tsx,mdx}', // Next.js App Router를 사용한다면 필요 (현재 프로젝트에 해당)
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // app 폴더 내의 모든 JS/TS/JSX/TSX/MDX 파일
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // pages 폴더를 사용한다면 추가 (선택 사항)
    './components/**/*.{js,ts,jsx,tsx,mdx}', // components 폴더를 사용한다면 추가
    // 필요한 경우 다른 경로도 여기에 추가할 수 있습니다.
  ],
  theme: {
    extend: {
      // 여기에 커스텀 Tailwind CSS 설정(폰트, 색상 등)을 확장할 수 있습니다.
      // 애니메이션 키프레임 정의
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseFade: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      // 애니메이션 클래스 정의
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'pulse-fade': 'pulseFade 3s ease-in-out infinite',
        blob: 'blob 10s infinite alternate',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [], // 추가적인 Tailwind CSS 플러그인이 있다면 여기에 추가합니다.
};