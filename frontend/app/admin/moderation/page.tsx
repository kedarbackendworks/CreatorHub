"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Check, CheckCircle2 } from 'lucide-react';

export default function ModerationPage() {
  const [moderationData, setModerationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/admin/data');
        if (res.data && res.data.reports) setModerationData(res.data.reports);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const getStatusDisplay = (status: string) => {
    if (status === 'Pending') {
      return <span className="flex items-center gap-2 text-slate-800 text-xs font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Pending</span>;
    }
    return <span className="flex items-center gap-2 text-slate-800 text-xs font-semibold"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Reviewed</span>;
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fa] min-h-[calc(100vh-64px)] font-sans">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Content Moderation</h2>
        <p className="text-sm font-medium text-slate-600 mt-1">Review flagged content and take action to keep the community safe.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl shadow-sm">

        {/* Filters Top */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 px-6 border-b border-slate-100 gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded-lg shadow-sm flex items-center justify-between w-40 hover:bg-slate-50">
              All Reports <span className="text-[10px] text-slate-500 ml-2">▼</span>
            </button>
            <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded-lg shadow-sm flex items-center justify-between w-40 hover:bg-slate-50">
              All Status <span className="text-[10px] text-slate-500 ml-2">▼</span>
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search table..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-700 placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-white">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 whitespace-nowrap">Content Preview</th>
                <th className="px-6 py-4 font-bold text-slate-500">Creator</th>
                <th className="px-6 py-4 font-bold text-slate-500">Reason</th>
                <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-center pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {moderationData.map((item, index) => (
                <tr key={`${item.id}-${index}`} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={item.img} alt="" className="w-12 h-12 rounded bg-slate-100 object-cover" />
                      <div className="font-bold text-slate-800 text-sm">{item.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                    {item.creator}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                      {item.reason}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusDisplay(item.status)}
                  </td>
                  <td className="px-6 py-5 text-center pr-10">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 shadow-sm transition-colors">
                        Review
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center p-6 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <button className="p-1 text-slate-400 hover:text-slate-800"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-800 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">3</button>
            <button className="p-1 text-slate-600 hover:text-slate-800"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

    </div>
  );
}
