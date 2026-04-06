"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter, Hourglass, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export default function FinancialPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/admin/data');
        if (res.data) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'Completed': 
        return <span className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Completed</span>;
      case 'Pending':
        return <span className="flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold leading-tight"><Hourglass className="w-3 h-3" /> Pending</span>;
      case 'Failed':
        return <span className="flex items-center justify-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Failed</span>;
      default:
        return null;
    }
  };

  if (loading || !data) {
    return <div className="p-4 sm:p-6 lg:p-8 text-slate-500">Loading financial data...</div>;
  }

  const txns = data.transactions || [];
  const dashboard = data.dashboard || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fa] min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Financial Overview</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track platform revenue, payouts, and transaction history.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Main Stats & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Total Revenue Area */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Revenue (YTD)</p>
              <h3 className="text-4xl font-bold text-slate-800 tracking-tight">₹12,40,000</h3>
              <p className="text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded inline-flex items-center gap-1">
                <span className="text-[10px]">▲</span> +14.5% from last year
              </p>
            </div>
            <select className="bg-[#f8f9fa] border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none">
               <option>This Year</option>
               <option>Last 6 Months</option>
               <option>Custom Range</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[220px] w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dashboard.revenueOverTime || []} barSize={28} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                 <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}k`} ticks={[0, 20, 40, 60, 80, 100]} />
                 <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                   {(dashboard.revenueOverTime || []).map((entry: any, index: number) => {
                     const colors = ['#e2e8f0','#cbd5e1','#cbd5e1','#f1f5f9','#f1f5f9','#e2e8f0','#e2e8f0','#f1f5f9','#1e293b','#0f172a','#1e293b'];
                     return <Cell key={`cell-${index}`} fill={colors[index] || '#111827'} />;
                   })}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pending Payouts</p>
          <h3 className="text-4xl font-bold text-slate-800 tracking-tight mb-2">₹45,250</h3>
          <p className="text-xs font-medium text-rose-600 bg-rose-50 inline-block px-2 py-1 rounded inline-flex items-center gap-1 mb-8 self-start">
             <span className="text-[10px]">▼</span> -2.4% vs last month
          </p>

          <h4 className="text-xs font-bold text-slate-700 mb-4">Payout Trends (6mo)</h4>
          <div className="flex-1 min-h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={dashboard.payoutsData || []} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} />
                 <YAxis tick={{fontSize: 10, fill: '#64748b'}} tickLine={false} axisLine={false} ticks={[0, 25, 50, 75, 100]} tickFormatter={v => `${v}k`} />
                 <Line type="monotone" dataKey="val" stroke="#64748b" strokeWidth={2} dot={{r: 4, fill: '#64748b'}} activeDot={{ r: 6 }} />
               </LineChart>
            </ResponsiveContainer>
          </div>
          <button className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
            Process All Payouts
          </button>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        
        {/* Table Header & Actions */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
           <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-bold rounded-lg shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Filter className="w-3.5 h-3.5 mr-2" /> Filter
              </button>
              <div className="relative">
                <input type="text" placeholder="Search transactions..." className="bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-300 w-full sm:w-64" />
              </div>
           </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-[#f8f9fa]/50">
               <tr>
                 <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Transaction ID</th>
                 <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">User</th>
                 <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Amount</th>
                 <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-center">Status</th>
                 <th className="px-6 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider">Date</th>
                 <th className="px-6 py-4"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {txns.map((txn: any) => (
                 <tr key={txn.txnId} className="hover:bg-slate-50/50 transition-colors">
                   <td className="px-6 py-4 text-xs font-bold text-slate-700">{txn.txnId}</td>
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                         {txn.initial}
                       </div>
                       <span className="font-bold text-slate-800 text-xs">{txn.user}</span>
                     </div>
                   </td>
                   <td className="px-6 py-4 text-sm font-bold text-slate-800">{txn.amount}</td>
                   <td className="px-6 py-4">
                     {getStatusDisplay(txn.status)}
                   </td>
                   <td className="px-6 py-4 text-xs font-medium text-slate-500">{txn.date}</td>
                   <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-semibold text-slate-500 text-center sm:text-left">Showing 1 to 5 of 2,450 entries</p>
           <div className="flex items-center gap-2">
             <button className="p-1 text-slate-400 hover:text-slate-800"><ChevronLeft className="w-4 h-4" /></button>
             <button className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 text-white text-xs font-bold shadow-sm">1</button>
             <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 text-xs font-bold">2</button>
             <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 text-xs font-bold">3</button>
             <span className="text-slate-400 text-xs font-bold px-1">...</span>
             <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 text-xs font-bold">49</button>
             <button className="p-1 text-slate-600 hover:text-slate-800"><ChevronRight className="w-4 h-4" /></button>
           </div>
        </div>

      </div>

    </div>
  );
}
