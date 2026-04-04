"use client";

import { TAG_DESCRIPTIONS, TICKET_TAGS } from '../utils/supportConstants';

function toLabel(tag) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

export default function TicketTagSelector({ value, onChange, error }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TICKET_TAGS.map((tag) => {
          const selected = value === tag;
          return (
            <button
              key={tag}
              type="button"
              title={TAG_DESCRIPTIONS[tag]}
              onClick={() => onChange(tag)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                selected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {toLabel(tag)}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
