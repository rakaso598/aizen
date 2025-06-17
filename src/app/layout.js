import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google'; // Next.js 폰트 최적화 (선택 사항)
import SessionProvider from '../components/SessionProvider';

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
  title: 'Aizen AI Card Platform',
  description: 'AI-generated art card collection and trading platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* SessionProvider로 자식 컴포넌트들을 감쌈 */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
