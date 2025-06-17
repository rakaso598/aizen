import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google'; // Next.js 폰트 최적화 (선택 사항)
import SessionProvider from '../components/SessionProvider';
import Header from '@/components/Header'; // Header 컴포넌트를 불러옵니다.
import Footer from '@/components/Footer'; // Footer 컴포넌트를 불러옵니다.

const inter = Inter({ subsets: ['latin'] }); // 폰트 설정 (선택 사항)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Aizen.ART - AI Art Platform',
  description: '인공지능이 빚어낸 예술, 당신이 완성하는 가치.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* SessionProvider로 자식 컴포넌트들을 감쌈 */}
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
