// app/profile/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // 프로필 수정 폼 상태
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [isProfileSuccess, setIsProfileSuccess] = useState(false);

  // 비밀번호 변경 폼 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setEmail(userData.email); // 폼에 초기값 설정
          setUsername(userData.username); // 폼에 초기값 설정
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } catch (err) {
        console.error('사용자 정보 로드 오류:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setIsProfileSuccess(false);

    const token = localStorage.getItem('token');
    if (!token) {
      setProfileMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, username }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfileMessage(data.message || '프로필이 성공적으로 업데이트되었습니다!');
        setIsProfileSuccess(true);
        setUser(data.user); // 업데이트된 사용자 정보로 UI 갱신
        localStorage.setItem('user', JSON.stringify(data.user)); // 로컬 스토리지도 갱신

        setTimeout(() => setProfileMessage(''), 3000); // 3초 후 메시지 사라짐
      } else {
        setProfileMessage(data.message || '프로필 업데이트에 실패했습니다.');
        setIsProfileSuccess(false);
      }
    } catch (error) {
      console.error('프로필 업데이트 요청 중 오류 발생:', error);
      setProfileMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setIsProfileSuccess(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setIsPasswordSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPasswordMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage(data.message || '비밀번호가 성공적으로 변경되었습니다!');
        setIsPasswordSuccess(true);
        // 성공 시 폼 초기화
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => setPasswordMessage(''), 3000); // 3초 후 메시지 사라짐
      } else {
        setPasswordMessage(data.message || '비밀번호 변경에 실패했습니다.');
        setIsPasswordSuccess(false);
      }
    } catch (error) {
      console.error('비밀번호 변경 요청 중 오류 발생:', error);
      setPasswordMessage('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      setIsPasswordSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-blue-600">사용자 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">프로필 설정</h1>

        {/* 현재 사용자 정보 표시 (선택 사항) */}
        {user && (
          <div className="mb-8 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">현재 정보</h2>
            <p className="text-gray-700"><strong>이메일:</strong> {user.email}</p>
            <p className="text-gray-700"><strong>사용자 이름:</strong> {user.username}</p>
            <p className="text-gray-700"><strong>포인트:</strong> {user.points}</p>
          </div>
        )}

        {/* 프로필 정보 수정 폼 */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">프로필 정보 수정</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">새 이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">새 사용자 이름</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          {profileMessage && (
            <p className={`text-center text-sm ${isProfileSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {profileMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            프로필 업데이트
          </button>
        </form>

        {/* 비밀번호 변경 폼 */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">비밀번호 변경</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          {passwordMessage && (
            <p className={`text-center text-sm ${isPasswordSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {passwordMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
}