'use client';

import React from 'react';

interface Props {
  settings: any;
  onChange: (key: string, value: any) => void;
}

export function GeneralSettingsSection({ settings, onChange }: Props) {
  return (
    <div className="mb-12">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', marginBottom: 20 }}>
        General Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Platform Name */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>Platform Name</label>
          <input
            type="text"
            value={settings.platformName}
            onChange={(e) => onChange('platformName', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Platform URL */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>Platform URL</label>
          <input
            type="text"
            value={settings.platformUrl}
            onChange={(e) => onChange('platformUrl', e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Default Language */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>Default Language</label>
          <div className="relative">
            <select
              value={settings.defaultLanguage}
              onChange={(e) => onChange('defaultLanguage', e.target.value)}
              style={selectStyle}
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>Hindi</option>
            </select>
            {/* Custom dropdown arrow */}
            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>Timezone</label>
          <div className="relative">
            <select
              value={settings.timezone}
              onChange={(e) => onChange('timezone', e.target.value)}
              style={selectStyle}
            >
              <option>(GMT+05:30) India Standard Time</option>
              <option>(GMT+00:00) UTC</option>
              <option>(GMT-08:00) Pacific Time</option>
              <option>(GMT+01:00) Central European Time</option>
            </select>
            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  background: 'white',
  fontSize: 13,
  color: '#111827',
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  cursor: 'pointer',
  paddingRight: 40,
};
