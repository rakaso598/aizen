import React from "react";

function getModalStyleAndIcon(children) {
  const msg = typeof children === "string" ? children : "";
  if (/성공|완료|환영|가입되었습니다|등록되었습니다|추가되었습니다/.test(msg)) {
    return {
      icon: <span className="text-green-400 text-5xl mb-4">✔️</span>,
      titleClass: "text-green-500",
      contentClass: "text-green-900",
    };
  }
  if (/실패|오류|에러|중 오류|거절|불가|없습니다/.test(msg)) {
    return {
      icon: <span className="text-red-400 text-5xl mb-4">❌</span>,
      titleClass: "text-red-500",
      contentClass: "text-red-900",
    };
  }
  if (/경고|주의|확인/.test(msg)) {
    return {
      icon: <span className="text-yellow-400 text-5xl mb-4">⚠️</span>,
      titleClass: "text-yellow-500",
      contentClass: "text-yellow-900",
    };
  }
  return {
    icon: null,
    titleClass: "text-cyan-500",
    contentClass: "text-gray-900",
  };
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  hideDefaultCloseButton,
}) {
  if (!open) return null;
  const { icon, titleClass, contentClass } = getModalStyleAndIcon(children);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xs sm:max-w-md w-full px-8 py-10 relative animate-fadeIn flex flex-col items-center">
        {icon}
        {title && (
          <h2 className={`text-xl font-bold mb-3 ${titleClass}`}>{title}</h2>
        )}
        <div
          className={`mb-6 text-center text-lg font-semibold ${contentClass}`}
        >
          {children}
        </div>
        {!hideDefaultCloseButton && (
          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-80 text-base"
            aria-label="닫기"
          >
            닫기
          </button>
        )}
      </div>
    </div>
  );
}
