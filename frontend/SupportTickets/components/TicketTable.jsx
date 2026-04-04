"use client";

import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import TicketTableRow from './TicketTableRow';

function pageWindow(page, totalPages) {
  const pages = [];
  const max = 5;
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + max - 1);
  for (let i = start; i <= end; i += 1) pages.push(i);
  return pages;
}

/**
 * @param {{tickets:any[],loading:boolean,activeTab:string,page:number,totalPages:number,setPage:(n:number)=>void,adminRole:string,onView:any,onAssign:any,onResolve:any,onEscalate:any}} props
 */
export default function TicketTable({ tickets, loading, activeTab, page, totalPages, setPage, adminRole, onView, onAssign, onResolve, onEscalate }) {
  const pages = pageWindow(page, totalPages);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#f8f9fa]">
            <tr>
              {['Ticket ID', 'Source', 'User', 'Issue Type', 'Description', 'Priority', 'Assigned To', 'Updated', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-4 text-xs font-bold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-sm text-slate-500">Loading tickets...</td></tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-14 text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-slate-400" />
                    <span>No {activeTab.replace('_', ' ')} tickets at the moment.</span>
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <TicketTableRow
                  key={ticket._id}
                  ticket={ticket}
                  adminRole={adminRole}
                  onView={onView}
                  onAssign={onAssign}
                  onResolve={onResolve}
                  onEscalate={onEscalate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
        <button className="p-1 text-slate-500 disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></button>
        {pages[0] > 1 ? <span className="px-2 text-xs text-slate-400">...</span> : null}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`h-8 min-w-8 rounded-full px-2 text-xs font-semibold ${p === page ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {p}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages ? <span className="px-2 text-xs text-slate-400">...</span> : null}
        <button className="p-1 text-slate-500 disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
