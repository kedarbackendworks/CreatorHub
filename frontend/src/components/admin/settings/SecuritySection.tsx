'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/src/lib/api';
import { useAuthStore } from '@/src/store/useAuthStore';

interface Props {
  settings: any;
  onChange: (key: string, value: any) => void;
}

interface AdminSession {
  sessionId: string;
  browser: string;
  os: string;
  ipAddress: string;
  createdAt: string;
  isCurrent: boolean;
}

export function SecuritySection({ settings, onChange }: Props) {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    let mounted = true;

    const fetchSessions = async () => {
      try {
        const res = await api.get('/admin/sessions');
        if (!mounted) return;
        setSessions(res.data?.sessions || []);
      } catch {
        if (!mounted) return;
        setSessions([]);
        toast.error('Failed to load active sessions');
      } finally {
        if (mounted) setSessionsLoading(false);
      }
    };

    fetchSessions();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    if (!sessionId || revokingSessionId) return;

    setRevokingSessionId(sessionId);
    try {
      await api.delete(`/admin/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((session) => session.sessionId !== sessionId));
      toast.success('Session revoked successfully');
    } catch {
      toast.error('Failed to revoke session');
    } finally {
      setRevokingSessionId(null);
    }
  };

  const handleLogoutAllSessions = async () => {
    const confirmed = window.confirm('Log out all other sessions?');
    if (!confirmed) return;

    setLoggingOutAll(true);
    try {
      await api.delete('/admin/sessions');
      toast.success('Logged out from all other sessions');
      logout();
    } catch {
      toast.error('Failed to log out other sessions');
    } finally {
      setLoggingOutAll(false);
    }
  };

  return (
    <div className="mb-12">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', marginBottom: 20 }}>
        Security
      </h3>

      {/* 2FA Toggle */}
      <div style={toggleBoxStyle} className="mb-6 cursor-pointer" onClick={() => onChange('twoFactorEnabled', !settings.twoFactorEnabled)}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>Two-Factor Authentication</h4>
          <p style={{ fontSize: 12, color: '#6B7280' }}>Add an extra layer of security</p>
        </div>
        <CSSSwitch enabled={settings.twoFactorEnabled} />
      </div>

      <div className="flex flex-col gap-6 mb-6">
        {/* Session Timeout */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Session Timeout</label>
          <div className="relative">
            <select value={settings.sessionTimeout} onChange={(e) => onChange('sessionTimeout', e.target.value)} style={inputStyle}>
              <option>30 Minutes</option>
              <option>1 Hour</option>
              <option>12 Hours</option>
              <option>24 Hours</option>
            </select>
            <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>

        {/* Password Length */}
        <div className="flex flex-col gap-2">
          <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Minimum Password Length</label>
          <input
            type="number"
            value={settings.minPasswordLength}
            onChange={(e) => onChange('minPasswordLength', Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Bot Protection Toggle */}
      <div style={toggleBoxStyle} className="mb-8 cursor-pointer" onClick={() => onChange('botProtectionEnabled', !settings.botProtectionEnabled)}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>Bot Protection (CAPTCHA)</h4>
        </div>
        <CSSSwitch enabled={settings.botProtectionEnabled} />
      </div>

      {/* Active Sessions */}
      <div className="mb-6">
        <label style={{ fontSize: 12, fontWeight: 700, color: '#4B5563', marginBottom: 16, display: 'block' }}>Active Sessions</label>

        <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, background: 'white' }}>
          {sessionsLoading ? (
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>Loading active sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>No active sessions found.</p>
            </div>
          ) : (
            sessions.map((session, index) => (
              <div
                key={session.sessionId}
                style={{
                  padding: '20px',
                  borderBottom: index < sessions.length - 1 ? '1px solid #F3F4F6' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#4B5563', marginBottom: 4 }}>
                    {session.browser} on {session.os}{session.isCurrent ? ' (Current)' : ''}
                  </h4>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                    {session.ipAddress} • {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>

                {!session.isCurrent ? (
                  <button
                    onClick={() => handleRevokeSession(session.sessionId)}
                    disabled={revokingSessionId === session.sessionId}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#EF4444',
                      cursor: 'pointer',
                      opacity: revokingSessionId === session.sessionId ? 0.6 : 1,
                    }}
                  >
                    {revokingSessionId === session.sessionId ? 'Revoking...' : 'Revoke'}
                  </button>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>Current</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log out all */}
      <button
        onClick={handleLogoutAllSessions}
        disabled={loggingOutAll}
        style={{
          width: '100%',
          padding: '12px 0',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 8,
          color: '#EF4444',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          opacity: loggingOutAll ? 0.6 : 1,
        }}
      >
        {loggingOutAll ? 'Logging out...' : 'Log out all sessions'}
      </button>

    </div>
  );
}

// Reusable micro switch
function CSSSwitch({ enabled }: { enabled: boolean }) {
  return (
    <div
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: enabled ? '#111827' : '#E5E7EB',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          background: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: 2,
          left: enabled ? 22 : 2,
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
}

const toggleBoxStyle: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  padding: '20px 24px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  background: 'white',
  fontSize: 13,
  color: '#111827',
  fontWeight: 600,
  outline: 'none',
  appearance: 'none',
};
