"use client";

import { X } from 'lucide-react';
import AssignTicketDropdown from './AssignTicketDropdown';
import PriorityBadge from './PriorityBadge';
import TicketStatusBadge from './TicketStatusBadge';

/**
 * @param {{open:boolean,ticket:any,adminRole:string,onClose:()=>void,onAssign:(ticketId:string,adminId:string)=>void,onDismiss:(ticketId:string)=>void,onResolve:(ticketId:string,note:string)=>void,onEscalate:(ticketId:string,to:string)=>void}} props
 */
export default function TicketDetailDrawer({ open, ticket, adminRole, onClose, onAssign, onDismiss, onResolve, onEscalate }) {
  if (!open || !ticket) return null;

  const report = ticket.reportId || {};
  const otherReporterCount = Math.max(0, (ticket.reporterCount || 1) - 1);

  return (
    <div className="fixed inset-0 z-[260]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{ticket.ticketId}</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-500" /></button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <TicketStatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        <Section title="Reporter">
          <p className="text-sm text-slate-700">{report.reportedBy?.name} · {report.reportedBy?.email}</p>
        </Section>

        <Section title="Issue Type"><p className="text-sm capitalize text-slate-700">{ticket.issueType}</p></Section>
        <Section title="Reporter Comment"><p className="text-sm text-slate-700">{report.comment || 'No comment.'}</p></Section>

        <Section title="Reported Content">
          <pre className="max-h-56 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">{JSON.stringify(ticket.targetContent || {}, null, 2)}</pre>
        </Section>

        <Section title="Also Reported By"><p className="text-sm text-slate-700">{otherReporterCount} other users</p></Section>

        <Section title="Assigned To">
          <AssignTicketDropdown
            ticketId={ticket.ticketId}
            currentAssignee={ticket.assignedTo?._id || ''}
            onAssigned={(adminId) => onAssign(ticket.ticketId, adminId)}
          />
        </Section>

        <div className="mt-8 flex items-center justify-end gap-2">
          <button onClick={() => onDismiss(ticket.ticketId)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Dismiss</button>
          {adminRole !== 'support' ? (
            <button onClick={() => onEscalate(ticket.ticketId, adminRole === 'moderator' ? 'super_admin' : 'moderator')} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">Escalate</button>
          ) : (
            <button onClick={() => onEscalate(ticket.ticketId, 'moderator')} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">Escalate</button>
          )}
          <button onClick={() => onResolve(ticket.ticketId, 'Resolved from support dashboard')} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Resolve ✓</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
      {children}
    </div>
  );
}
