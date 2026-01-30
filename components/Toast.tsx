
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] animate__animated animate__fadeInUp`}>
      <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
        type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'
      }`}>
        <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
        <span className="font-bold text-sm">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
