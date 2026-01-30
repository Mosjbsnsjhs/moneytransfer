
import React, { useState, useEffect } from 'react';
import { User, Transfer, TransferStatus } from '../types';
import { DB } from '../lib/db';
import Toast from './Toast';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [form, setForm] = useState({ customerName: '', bankAccount: '', amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = () => {
    const all = DB.getTransfers();
    setTransfers(all.filter(t => t.createdBy === user.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.bankAccount || !form.amount) return;

    setIsSubmitting(true);
    try {
      DB.createTransfer({
        customerName: form.customerName,
        bankAccount: form.bankAccount,
        amount: parseFloat(form.amount),
        createdBy: user.id,
        creatorName: user.fullName
      });
      setForm({ customerName: '', bankAccount: '', amount: '' });
      loadTransfers();
      setToast({ message: 'تم إرسال الحوالة بنجاح للخزينة', type: 'success' });
    } catch (err) {
      setToast({ message: 'حدث خطأ أثناء الإرسال', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800">إرسال حوالة جديدة</h1>
          <p className="text-slate-500 font-medium">قم بتعبئة البيانات بدقة لضمان سرعة الوصول.</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <i className="fas fa-paper-plane text-xl"></i>
        </div>
      </header>

      <section className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 overflow-hidden relative">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 block">اسم الزبون المستلم</label>
            <div className="relative">
              <i className="fas fa-user absolute right-4 top-4 text-slate-300"></i>
              <input
                type="text"
                required
                className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                placeholder="الاسم الثلاثي..."
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 block">رقم الحساب البنكي</label>
            <div className="relative">
              <i className="fas fa-credit-card absolute right-4 top-4 text-slate-300"></i>
              <input
                type="text"
                required
                className="w-full pr-12 pl-4 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                value={form.bankAccount}
                onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                placeholder="0000-0000-0000"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 block">القيمة المالية</label>
            <div className="relative">
              <i className="fas fa-money-bill-wave absolute right-4 top-4 text-slate-300"></i>
              <input
                type="number"
                required
                className="w-full pr-12 pl-16 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
              />
              <span className="absolute left-4 top-4 font-black text-slate-400">دينار</span>
            </div>
          </div>
          <div className="md:col-span-3 flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fas fa-check-double"></i>
                  <span>تأكيد الإرسال الآن</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-slate-800">السجلات الأخيرة</h2>
           <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">العدد: {transfers.length}</span>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">تاريخ الطلب</th>
                <th className="px-8 py-5">المستلم</th>
                <th className="px-8 py-5">الحساب</th>
                <th className="px-8 py-5">المبلغ</th>
                <th className="px-8 py-5 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <i className="fas fa-box-open text-6xl"></i>
                      <p className="font-bold">لا توجد حوالات مسجلة في حسابك</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-5">
                      <p className="text-slate-800 font-bold text-sm">{new Date(t.createdAt).toLocaleDateString('en-US')}</p>
                      <p className="text-slate-400 text-xs">{new Date(t.createdAt).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-700">{t.customerName}</td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-lg">{t.bankAccount}</span>
                    </td>
                    <td className="px-8 py-5 font-black text-indigo-600 text-lg">{Number(t.amount).toLocaleString('en-US')} دينار</td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black ${
                        t.status === TransferStatus.REACHED ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${t.status === TransferStatus.REACHED ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        {t.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden space-y-4">
          {transfers.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-bold mb-1">{new Date(t.createdAt).toLocaleString('en-US')}</p>
                    <h3 className="font-black text-slate-800">{t.customerName}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black ${
                    t.status === TransferStatus.REACHED ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {t.status}
                  </div>
               </div>
               <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">الحساب</p>
                    <p className="font-bold text-slate-600 text-sm">{t.bankAccount}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">المبلغ</p>
                    <p className="font-black text-indigo-600 text-xl">{Number(t.amount).toLocaleString('en-US')} <span className="text-xs">دينار</span></p>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
