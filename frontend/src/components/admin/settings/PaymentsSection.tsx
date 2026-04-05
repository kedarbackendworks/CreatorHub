'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  settings: any;
  onChange: (key: string, value: any) => void;
}

export function PaymentsSection({ settings, onChange }: Props) {
  return (
    <div className="mb-12">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', marginBottom: 20 }}>
        Payments
      </h3>

      {/* Gateway Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Razorpay */}
        <div style={connectionCardStyle}>
          <div className="flex items-center gap-4">
            <div style={iconBoxStyle}>RP</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>Razorpay</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: settings.razorpayConnected ? '#10B981' : '#6B7280' }}>
                {settings.razorpayConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onChange('razorpayConnected', !settings.razorpayConnected)}
            style={{ ...connectBtnStyle, color: settings.razorpayConnected ? '#EF4444' : '#111827' }}
          >
            {settings.razorpayConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {/* Stripe */}
        <div style={connectionCardStyle}>
          <div className="flex items-center gap-4">
            <div style={iconBoxStyle}>ST</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>Stripe</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: settings.stripeConnected ? '#10B981' : '#6B7280' }}>
                {settings.stripeConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onChange('stripeConnected', !settings.stripeConnected)}
            style={{ ...connectBtnStyle, color: settings.stripeConnected ? '#EF4444' : '#111827' }}
          >
            {settings.stripeConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label style={{ fontSize: 10, fontWeight: 800, color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Platform Commission (%)
          </label>
          <div style={{ display: 'flex', width: '100%' }}>
            <input
              type="number"
              value={settings.commission}
              onChange={(e) => onChange('commission', Number(e.target.value))}
              style={{ ...paymentInputStyle, borderRadius: '8px 0 0 8px', borderRight: 'none', flex: 1 }}
            />
            <div
              style={{
                background: '#E5E7EB',
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderLeft: 'none',
                borderRadius: '0 8px 8px 0',
                fontSize: 13,
                fontWeight: 600,
                color: '#4B5563',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              %
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <AlertTriangle size={12} color="#EF4444" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444' }}>
              Changing commission impacts creator earnings
            </span>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 10, fontWeight: 800, color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Minimum Payout (₹)
          </label>
          <input
            type="number"
            value={settings.minPayout}
            onChange={(e) => onChange('minPayout', Number(e.target.value))}
            style={{ ...paymentInputStyle, width: '100%', borderRadius: 8 }}
          />
        </div>
      </div>
    </div>
  );
}

const connectionCardStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  padding: '16px 20px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const iconBoxStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 8,
  background: '#F3F4F6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 800,
  color: '#4B5563',
  letterSpacing: '-0.02em',
};

const connectBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
};

const paymentInputStyle: React.CSSProperties = {
  padding: '12px 16px',
  border: '1px solid #E5E7EB',
  background: '#F3F4F6',
  fontSize: 13,
  color: '#111827',
  fontWeight: 600,
  outline: 'none',
};
