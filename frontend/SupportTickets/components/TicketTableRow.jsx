"use client";

import { ArrowUp, Check, Eye, UserPlus } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

const { formatUpdated, truncateDescription } = require('../utils/ticketHelpers');

/**
 * @param {{
 *  ticket:any,
 *  adminRole:string,
 *  onView:(id:string)=>void,
 *  onAssign:(id:string)=>void,
 *  onResolve:(id:string)=>void,
 *  onEscalate:(id:string)=>void,
 * }} props
 */
export default function TicketTableRow({ ticket, adminRole, onView, onAssign, onResolve, onEscalate }) {
  const reporter = ticket?.reportId?.reportedBy;
  const submitter = ticket?.submittedBy;
  const sourceType = ticket?.sourceType || 'user_report';
  const sourceLabel = sourceType === 'user_submitted' ? 'Manual' : 'Auto';
  const sourceStyles = sourceType === 'user_submitted'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-slate-100 text-slate-600';

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-4 py-4 font-mono text-xs text-slate-500">{ticket.ticketId}</td>
      <td className="px-4 py-4">
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${sourceStyles}`}>{sourceLabel}</span>
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-slate-800">{reporter?.name || submitter?.name || 'Unknown'}</td>
      <td className="px-4 py-4 text-sm text-slate-600 capitalize">{ticket.issueType}</td>
      <td className="px-4 py-4 text-sm text-slate-600">{truncateDescription(ticket?.reportId?.comment || ticket?.description || ticket?.heading || 'No description')}</td>
      <td className="px-4 py-4"><PriorityBadge priority={ticket.priority} /></td>
      <td className="px-4 py-4 text-sm text-slate-600">
        {ticket.assignedTo?.name || <span className="italic text-slate-400">Unassigned</span>}
      </td>
      <td className="px-4 py-4 text-sm text-slate-500">{formatUpdated(ticket.lastActivityAt)}</td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="rounded border p-2 text-slate-500 hover:text-slate-900" onClick={() => onView(ticket.ticketId)}><Eye className="h-4 w-4" /></button>
          <button className="rounded border p-2 text-slate-500 hover:text-slate-900" onClick={() => onAssign(ticket.ticketId)}><UserPlus className="h-4 w-4" /></button>
          {['open', 'in_progress'].includes(ticket.status) ? (
            <button className="rounded border p-2 text-slate-500 hover:text-emerald-700" onClick={() => onResolve(ticket.ticketId)}><Check className="h-4 w-4" /></button>
          ) : null}
          {adminRole !== 'support' ? (
            <button className="rounded border p-2 text-slate-500 hover:text-amber-700" onClick={() => onEscalate(ticket.ticketId)}><ArrowUp className="h-4 w-4" /></button>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
