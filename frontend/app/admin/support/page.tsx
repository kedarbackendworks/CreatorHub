"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SupportPage() {
  const [ticketsData, setTicketsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/admin/data');
        if (res.data && res.data.tickets) setTicketsData(res.data.tickets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const getPriorityPill = (pri: string) => {
    switch (pri) {
      case 'High': return 'px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold';
      case 'Medium': return 'px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold';
      case 'Low': return 'px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold';
      default: return '';
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fa] min-h-[calc(100vh-64px)] font-sans">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Support</h2>
        <p className="text-sm font-medium text-slate-600 mt-1">Review flagged content and take action to keep the community safe.</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Open Tickets</h3>
          <h4 className="text-4xl font-bold text-slate-800">12</h4>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">In Progress</h3>
          <h4 className="text-4xl font-bold text-slate-800">5</h4>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Resolved Today</h3>
          <h4 className="text-4xl font-bold text-slate-800">8</h4>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">High Priority</h3>
          <h4 className="text-4xl font-bold text-slate-800">3</h4>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl shadow-sm">

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-8 text-sm font-bold border-b border-slate-200">
          <button className="text-slate-800 border-b-2 border-slate-800 pb-3">Open</button>
          <button className="text-slate-500 hover:text-slate-800 pb-3 transition-colors">In Progress</button>
          <button className="text-slate-500 hover:text-slate-800 pb-3 transition-colors">Resolved</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full bg-white">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f8f9fa] border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 font-bold text-slate-500">Ticket ID</th>
                <th className="px-6 py-5 font-bold text-slate-500">User</th>
                <th className="px-6 py-5 font-bold text-slate-500">Issue Type</th>
                <th className="px-6 py-5 font-bold text-slate-500">Description</th>
                <th className="px-6 py-5 font-bold text-slate-500">Priority</th>
                <th className="px-6 py-5 font-bold text-slate-500">Assigned To</th>
                <th className="px-6 py-5 font-bold text-slate-500">Updated</th>
                <th className="px-6 py-5 font-bold text-slate-500 text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ticketsData.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-6 font-bold text-slate-800 text-xs">{t.id}</td>
                  <td className="px-6 py-6 font-bold text-slate-700 text-xs">{t.user}</td>
                  <td className="px-6 py-6 text-slate-500 font-medium text-xs">{t.issue}</td>
                  <td className="px-6 py-6 font-bold text-slate-600 text-[11px]">{t.desc}</td>
                  <td className="px-6 py-6">
                    <span className={getPriorityPill(t.priority)}>{t.priority}</span>
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-800 text-xs">{t.assigned}</td>
                  <td className="px-6 py-6 text-slate-500 font-medium text-[11px]">{t.updated}</td>
                  <td className="px-6 py-6 text-right pr-8">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1.5 text-slate-600 bg-white hover:bg-slate-100 rounded-md transition-colors border border-slate-200 shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-600 bg-white hover:bg-slate-100 rounded-md transition-colors border border-slate-200 shadow-sm">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-600 bg-white hover:bg-slate-100 rounded-md transition-colors border border-slate-200 shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination md/sm */}
        <div className="flex items-center justify-center p-6 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <button className="p-1 text-slate-400 hover:text-slate-800"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-800 text-white shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">3</button>
            <button className="p-1 text-slate-600 hover:text-slate-800"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

      </div>

    </div>
  );
}
