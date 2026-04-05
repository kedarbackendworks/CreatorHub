'use client';

import React from 'react';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';

interface Props {
  settings: any;
  onChange: (key: string, value: any) => void;
}

export function LegalComplianceSection({ settings, onChange }: Props) {
  return (
    <div className="mb-12">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', marginBottom: 20 }}>
        Legal & Compliance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Terms of Service */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>Terms of Service</label>
          <div style={editorContainerStyle}>
            <div style={editorToolbarStyle}>
              <button type="button" style={toolbarIconStyle}><Bold size={14} /></button>
              <button type="button" style={toolbarIconStyle}><Italic size={14} /></button>
              <button type="button" style={toolbarIconStyle}><LinkIcon size={14} /></button>
            </div>
            <textarea
              style={textareaStyle}
              value={settings.termsOfService}
              onChange={(e) => onChange('termsOfService', e.target.value)}
            />
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>Privacy Policy</label>
          <div style={editorContainerStyle}>
            <div style={editorToolbarStyle}>
              <button type="button" style={toolbarIconStyle}><Bold size={14} /></button>
              <button type="button" style={toolbarIconStyle}><Italic size={14} /></button>
              <button type="button" style={toolbarIconStyle}><LinkIcon size={14} /></button>
            </div>
            <textarea
              style={textareaStyle}
              value={settings.privacyPolicy}
              onChange={(e) => onChange('privacyPolicy', e.target.value)}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

const editorContainerStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  background: 'white',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const editorToolbarStyle: React.CSSProperties = {
  borderBottom: '1px solid #F3F4F6',
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: '#FAFAFA',
};

const toolbarIconStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 4,
  color: '#4B5563',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  border: 'none',
  padding: '16px',
  minHeight: 160,
  resize: 'vertical',
  fontSize: 13,
  color: '#4B5563',
  fontFamily: 'monospace',
  lineHeight: 1.6,
  outline: 'none',
};
