"use client";

/**
 * @param {{stats:{open:number,inProgress:number,resolvedToday:number,highPriority:number}}} props
 */
export default function SupportStatsBar({ stats }) {
  const cards = [
    { label: 'Open Tickets', value: stats.open },
    { label: 'In Progress', value: stats.inProgress },
    { label: 'Resolved Today', value: stats.resolvedToday },
    { label: 'High Priority', value: stats.highPriority },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[12px] border border-[#e8e8e8] bg-white p-5">
          <p className="text-sm font-semibold text-slate-500">{card.label}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{card.value || 0}</p>
        </div>
      ))}
    </div>
  );
}
