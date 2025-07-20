import React from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xs sm:max-w-md w-full p-6 relative animate-fadeIn">
        {title && (
          <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
        )}
        <div className="mb-4 text-gray-700">{children}</div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
}
