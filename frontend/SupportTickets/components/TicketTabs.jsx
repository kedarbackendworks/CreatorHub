"use client";

const TABS = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

/**
 * @param {{activeTab: string, onChange: (tab:string)=>void}} props
 */
export default function TicketTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-8 border-b border-slate-200">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`pb-3 text-sm ${activeTab === tab.key ? 'border-b-2 border-[#1a1a1a] font-bold text-[#1a1a1a]' : 'text-slate-500'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
