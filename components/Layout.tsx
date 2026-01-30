
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'لوحة التحكم', icon: 'fa-th-large', path: '/' },
    { label: 'التقارير المالية', icon: 'fa-chart-pie', path: '/reports' }
  ];

  const navigateTo = (path: string) => {
    window.location.hash = path;
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-slate-900 flex-col shadow-2xl z-30">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <i className="fas fa-vault text-white text-xl"></i>
            </div>
            <span className="text-xl font-black text-white tracking-tight">MTMS Pro</span>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 space-y-2 custom-scrollbar overflow-y-auto">
          <div className="mb-8 px-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold">
                {user.fullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">{user.fullName}</p>
                <p className="text-slate-500 text-xs uppercase font-semibold">{user.role === UserRole.USER ? 'موظف' : 'خزينة'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                  window.location.hash === (item.path === '/' ? '' : `#${item.path}`) || (item.path === '/' && window.location.hash === '#/')
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} text-lg`}></i>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-semibold"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Mobile */}
        <header className="lg:hidden bg-white px-6 py-4 flex items-center justify-between border-b shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-vault text-white text-sm"></i>
            </div>
            <span className="font-black text-slate-800">MTMS</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-slate-600 rounded-full bg-slate-100"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900 animate__animated animate__fadeIn">
             <div className="p-8 flex justify-between items-center border-b border-slate-800">
                <span className="text-xl font-bold text-white">القائمة</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 text-2xl">
                  <i className="fas fa-times"></i>
                </button>
             </div>
             <div className="p-6 space-y-4">
               {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigateTo(item.path)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800 text-white font-bold"
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </button>
               ))}
               <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-500/20 text-red-500 font-bold"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>تسجيل الخروج</span>
                </button>
             </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate__animated animate__fadeInUp">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
