// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 py-10 bg-gray-950 text-center text-gray-500">
      <p>&copy; 2025 Aizen. All rights reserved.</p>
      <p className="mt-2 text-sm">
        <Link href="/privacy" className="hover:text-white transition-colors duration-200">개인정보처리방침</Link> |{' '}
        <Link href="/terms" className="hover:text-white transition-colors duration-200">이용약관</Link>
      </p>
    </footer>
  );
}