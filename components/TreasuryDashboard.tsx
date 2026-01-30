
import React, { useState, useEffect } from 'react';
import { User, Transfer, TransferStatus } from '../types';
import { DB } from '../lib/db';
import Toast from './Toast';

interface TreasuryDashboardProps {
  user: User;
}

const TreasuryDashboard: React.FC<TreasuryDashboardProps> = ({ user }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filterStatus, setFilterStatus] = useState<TransferStatus | 'ALL'>('ALL');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string, current: TransferStatus, customerName: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = () => {
    setTransfers(DB.getTransfers());
  };

  const handleRequestUpdate = (id: string, current: TransferStatus, customerName: string) => {
    setPendingUpdate({ id, current, customerName });
    setShowConfirm(true);
  };

  const confirmUpdateStatus = () => {
    if (pendingUpdate) {
      try {
        const newStatus = pendingUpdate.current === TransferStatus.NOT_REACHED 
          ? TransferStatus.REACHED 
          : TransferStatus.NOT_REACHED;
        
        DB.updateTransferStatus(pendingUpdate.id, newStatus);
        loadTransfers();
        setToast({ 
          message: `تم تحديث حالة حوالة ${pendingUpdate.customerName} بنجاح`, 
          type: 'success' 
        });
      } catch (err) {
        setToast({ message: 'فشل تحديث الحالة', type: 'error' });
      } finally {
        setShowConfirm(false);
        setPendingUpdate(null);
      }
    }
  };

  const filteredTransfers = filterStatus === 'ALL' 
    ? transfers 
    : transfers.filter(t => t.status === filterStatus);

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900">إدارة الخزينة</h1>
          <p className="text-slate-500 font-medium">مراقبة وتأكيد وصول الحوالات المالية في الوقت الفعلي.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-4 min-w-[140px]">
             <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
               <i className="fas fa-clock"></i>
             </div>
             <div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">معلق</p>
               <p className="font-black text-xl text-slate-800">{transfers.filter(t => t.status === TransferStatus.NOT_REACHED).length}</p>
             </div>
           </div>
           <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-4 min-w-[140px]">
             <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
               <i className="fas fa-check-double"></i>
             </div>
             <div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">واصل</p>
               <p className="font-black text-xl text-slate-800">{transfers.filter(t => t.status === TransferStatus.REACHED).length}</p>
             </div>
           </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setFilterStatus('ALL')}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${filterStatus === 'ALL' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
        >
          عرض الكل
        </button>
        <button 
          onClick={() => setFilterStatus(TransferStatus.NOT_REACHED)}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${filterStatus === TransferStatus.NOT_REACHED ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
        >
          لم تصل
        </button>
        <button 
          onClick={() => setFilterStatus(TransferStatus.REACHED)}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${filterStatus === TransferStatus.REACHED ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
        >
          تم الوصول
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6">الموظف المرسل</th>
                <th className="px-8 py-6">الزبون المستلم</th>
                <th className="px-8 py-6">بيانات الحساب</th>
                <th className="px-8 py-6">القيمة</th>
                <th className="px-8 py-6 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-slate-300">
                     <i className="fas fa-search text-5xl mb-4 block"></i>
                     <p className="font-black">لا توجد طلبات في هذه الفئة حالياً</p>
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-sm">{t.creatorName.charAt(0)}</div>
                        <div>
                          <p className="font-black text-slate-800 text-sm">{t.creatorName}</p>
                          <p className="text-[10px] text-slate-400 font-bold">موظف حوالات</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-700">{t.customerName}</td>
                    <td className="px-8 py-6 text-slate-500 text-sm font-mono">{t.bankAccount}</td>
                    <td className="px-8 py-6 font-black text-indigo-600 text-lg">{Number(t.amount).toLocaleString('en-US')} دينار</td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => handleRequestUpdate(t.id, t.status, t.customerName)}
                        className={`w-12 h-12 rounded-2xl inline-flex items-center justify-center transition-all shadow-lg ${
                          t.status === TransferStatus.REACHED
                            ? 'bg-emerald-600 text-white shadow-emerald-600/20 hover:scale-110'
                            : 'bg-white text-slate-300 border border-slate-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                        }`}
                      >
                        <i className={`fas ${t.status === TransferStatus.REACHED ? 'fa-check-circle' : 'fa-circle-dot'} text-xl`}></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate__animated animate__fadeIn">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 animate__animated animate__zoomIn">
            <div className="text-center">
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl ${pendingUpdate?.current === TransferStatus.REACHED ? 'bg-red-50 text-red-500 shadow-red-100' : 'bg-emerald-50 text-emerald-600 shadow-emerald-100'}`}>
                <i className={`fas ${pendingUpdate?.current === TransferStatus.REACHED ? 'fa-triangle-exclamation' : 'fa-clipboard-check'} text-4xl`}></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">تحديث حالة الوصول</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10 px-4">
                هل تريد تغيير حالة حوالة الزبون 
                <span className="text-slate-900 font-black block my-1">"{pendingUpdate?.customerName}"</span> 
                إلى 
                <span className={`font-black underline decoration-2 underline-offset-4 ${pendingUpdate?.current === TransferStatus.REACHED ? 'text-red-500' : 'text-emerald-600'}`}>
                  {pendingUpdate?.current === TransferStatus.REACHED ? 'لم تصل بعد' : 'تم تأكيد الوصول'}
                </span> ؟
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmUpdateStatus}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                >
                  نعم، تأكيد التغيير
                </button>
                <button
                  onClick={() => { setShowConfirm(false); setPendingUpdate(null); }}
                  className="w-full py-5 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black hover:bg-slate-100 transition-all"
                >
                  تراجع عن العملية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreasuryDashboard;
