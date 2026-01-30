
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { DB } from './lib/db';
import Layout from './components/Layout';
import UserDashboard from './components/UserDashboard';
import TreasuryDashboard from './components/TreasuryDashboard';
import Reports from './components/Reports';

const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (DB.findUser(username)) {
        setError('اسم المستخدم موجود مسبقاً في النظام');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        password,
        fullName,
        role
      };
      DB.saveUser(newUser);
      onLogin(newUser);
    } else {
      const user = DB.findUser(username);
      if (user && user.password === password) {
        onLogin(user);
      } else {
        setError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -ml-64 -mb-64"></div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden m-4 relative z-10 animate__animated animate__zoomIn">
        
        {/* Hero Section */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-indigo-900 p-12 text-white flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-12">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-shield-halved text-2xl"></i>
               </div>
               <span className="text-2xl font-black tracking-widest">MTMS</span>
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">الجيل القادم من <br/> إدارة الحوالات المالية</h2>
            <p className="text-indigo-100 text-lg leading-relaxed opacity-80">
              نظام متكامل، آمن، وسهل الاستخدام لإدارة كافة عمليات التحويل المالي اليومية مع تقارير دقيقة ولحظية.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-700 bg-indigo-400"></div>
                ))}
             </div>
             <p className="text-sm font-medium opacity-75">انضم إلى أكثر من +1,000 مستخدم نشط</p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-[450px] bg-white p-8 md:p-12">
          <div className="mb-10 text-center md:text-right">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {isRegistering ? 'انضم إلينا' : 'مرحباً بك مجدداً'}
            </h1>
            <p className="text-slate-500 font-medium">
              {isRegistering ? 'ابدأ تجربتك الاحترافية الآن' : 'قم بتسجيل الدخول لمتابعة أعمالك'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate__animated animate__shakeX">
                <i className="fas fa-circle-exclamation text-lg"></i>
                {error}
              </div>
            )}

            {isRegistering && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الاسم الكامل</label>
                  <div className="relative">
                    <i className="fas fa-user absolute right-4 top-4 text-slate-400"></i>
                    <input 
                      type="text" 
                      required 
                      className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-semibold"
                      placeholder="أدخل اسمك الكامل..."
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">نوع الحساب</label>
                  <div className="relative">
                    <i className="fas fa-tags absolute right-4 top-4 text-slate-400"></i>
                    <select 
                      className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold appearance-none"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                      <option value={UserRole.USER}>موظف حوالات (مستخدم)</option>
                      <option value={UserRole.TREASURY}>موظف خزينة (محاسب)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">اسم المستخدم</label>
              <div className="relative">
                <i className="fas fa-at absolute right-4 top-4 text-slate-400"></i>
                <input 
                  type="text" 
                  required 
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-semibold"
                  placeholder="مثال: ahmed_99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">كلمة المرور</label>
              <div className="relative">
                <i className="fas fa-lock absolute right-4 top-4 text-slate-400"></i>
                <input 
                  type="password" 
                  required 
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-semibold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <span>{isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</span>
              <i className={`fas ${isRegistering ? 'fa-user-plus' : 'fa-arrow-right-to-bracket'}`}></i>
            </button>

            <div className="text-center pt-4">
              <button 
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                className="text-indigo-600 text-sm font-black hover:text-indigo-800 transition-colors uppercase tracking-tight"
              >
                {isRegistering ? 'لديك حساب؟ سجل دخول الآن' : 'ليس لديك حساب؟ اشترك معنا'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(DB.getCurrentUser());

  const handleLogin = (u: User) => {
    DB.setCurrentUser(u);
    setUser(u);
  };

  const handleLogout = () => {
    DB.setCurrentUser(null);
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route 
            path="/" 
            element={user.role === UserRole.USER ? <UserDashboard user={user} /> : <TreasuryDashboard user={user} />} 
          />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
