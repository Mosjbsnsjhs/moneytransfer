
import React, { useState, useMemo } from 'react';
import { Transfer, TransferStatus, User, UserRole } from '../types';
import { DB } from '../lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Reports: React.FC = () => {
  const transfers = useMemo(() => DB.getTransfers(), []);
  const allUsers = useMemo(() => DB.getUsers(), []);

  const stats = useMemo(() => {
    const totalCount = transfers.length;
    const reachedCount = transfers.filter(t => t.status === TransferStatus.REACHED).length;
    const totalAmount = transfers.reduce((sum, t) => sum + t.amount, 0);
    const reachedAmount = transfers
      .filter(t => t.status === TransferStatus.REACHED)
      .reduce((sum, t) => sum + t.amount, 0);

    const userCount = allUsers.filter(u => u.role === UserRole.USER).length;
    const treasuryCount = allUsers.filter(u => u.role === UserRole.TREASURY).length;

    return { totalCount, reachedCount, totalAmount, reachedAmount, userCount, treasuryCount };
  }, [transfers, allUsers]);

  const dailyData = useMemo(() => {
    const map: Record<string, { date: string, amount: number }> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(d => map[d] = { date: d, amount: 0 });

    transfers.forEach(t => {
      const day = t.createdAt.split('T')[0];
      if (map[day]) {
        map[day].amount += t.amount;
      }
    });

    return Object.values(map);
  }, [transfers]);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">التقارير وقاعدة البيانات</h1>
          <p className="text-gray-500">عرض وتحليل كافة البيانات المسجلة في النظام.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 text-indigo-700 text-xs font-bold">
            عدد المستخدمين: {stats.userCount}
          </div>
          <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-emerald-700 text-xs font-bold">
            عدد موظفي الخزينة: {stats.treasuryCount}
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">إجمالي الحوالات</p>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-black text-gray-800">{stats.totalCount}</span>
            <i className="fas fa-file-invoice-dollar text-indigo-300 text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">الحوالات الواصلة</p>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-black text-green-600">{stats.reachedCount}</span>
            <i className="fas fa-check-circle text-green-300 text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">إجمالي المبالغ</p>
          <div className="flex justify-between items-end mt-2">
            <span className="text-xl font-black text-gray-800">{Number(stats.totalAmount).toLocaleString('en-US')} دينار</span>
            <i className="fas fa-vault text-indigo-300 text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">المبالغ المستلمة</p>
          <div className="flex justify-between items-end mt-2">
            <span className="text-xl font-black text-green-600">{Number(stats.reachedAmount).toLocaleString('en-US')} دينار</span>
            <i className="fas fa-coins text-green-300 text-2xl"></i>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80">
        <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
          <i className="fas fa-chart-bar text-indigo-500"></i>
          حركة السيولة (آخر 7 أيام)
        </h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={(v) => v.split('-').reverse().slice(0,2).join('/')} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Database Users */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-indigo-900 text-white flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <i className="fas fa-users-cog"></i>
            الحسابات المسجلة في القاعدة
          </h2>
          <span className="text-xs opacity-75">إجمالي الحسابات: {allUsers.length}</span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-right">
            <thead className="sticky top-0 bg-gray-50 shadow-sm">
              <tr className="text-gray-500 text-xs">
                <th className="px-6 py-3 font-bold">الاسم الكامل</th>
                <th className="px-6 py-3 font-bold">اسم المستخدم</th>
                <th className="px-6 py-3 font-bold">نوع الحساب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allUsers.map(u => (
                <tr key={u.id} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-bold text-gray-700">{u.fullName}</td>
                  <td className="px-6 py-3 text-gray-500">{u.username}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === UserRole.TREASURY ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === UserRole.TREASURY ? 'خزينة' : 'مستخدم'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Full Transfers History */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-700 flex items-center gap-2">
            <i className="fas fa-history text-indigo-500"></i>
            سجلات الحوالات الكاملة
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs">
                <th className="px-6 py-4 font-bold">التاريخ</th>
                <th className="px-6 py-4 font-bold">الزبون</th>
                <th className="px-6 py-4 font-bold">الموظف</th>
                <th className="px-6 py-4 font-bold">المبلغ</th>
                <th className="px-6 py-4 font-bold text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">لا توجد بيانات مسجلة.</td>
                </tr>
              ) : (
                transfers.map(t => (
                  <tr key={t.id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs">{new Date(t.createdAt).toLocaleDateString('en-US')}</td>
                    <td className="px-6 py-4 font-bold">{t.customerName}</td>
                    <td className="px-6 py-4 text-xs font-medium">{t.creatorName}</td>
                    <td className="px-6 py-4 font-black text-indigo-700">{Number(t.amount).toLocaleString('en-US')}</td>
                    <td className="px-6 py-4 text-center">
                      {t.status === TransferStatus.REACHED ? (
                        <span className="text-green-600 text-lg" title="وصلت">✔</span>
                      ) : (
                        <span className="text-red-500 text-lg" title="لم تصل">✖</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
