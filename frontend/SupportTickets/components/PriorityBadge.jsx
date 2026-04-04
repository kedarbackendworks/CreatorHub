"use client";

const { PRIORITY_STYLES } = require('../utils/ticketConstants');

/**
 * @param {{priority:'low'|'medium'|'high'}} props
 */
export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.low;
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{ background: style.bg, color: style.text }}
    >
      {priority}
    </span>
  );
}
