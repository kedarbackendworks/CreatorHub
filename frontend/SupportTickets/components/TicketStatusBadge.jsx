"use client";

const { STATUS_STYLES } = require('../utils/ticketConstants');

/**
 * @param {{status:string}} props
 */
export default function TicketStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.dismissed;
  return (
    <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase" style={{ background: style.bg, color: style.text }}>
      {status.replace('_', ' ')}
    </span>
  );
}
