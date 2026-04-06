'use client';

import React, { useState, useEffect } from 'react';
import { SettingsHeader } from '@/src/components/admin/settings/SettingsHeader';
import { GeneralSettingsSection } from '@/src/components/admin/settings/GeneralSettingsSection';
import { LegalComplianceSection } from '@/src/components/admin/settings/LegalComplianceSection';
import { PaymentsSection } from '@/src/components/admin/settings/PaymentsSection';
import { SecuritySection } from '@/src/components/admin/settings/SecuritySection';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';

const DEFAULTS = {
  platformName: 'Nexus Enterprise',
  platformUrl: 'https://admin.nexus-ent.com',
  defaultLanguage: 'English (US)',
  timezone: '(GMT+05:30) India Standard Time',
  termsOfService: '## Platform Usage Rules\n1. Users must be 18+...\n2. All content must comply with global standards...',
  privacyPolicy: '## Data Privacy\nWe value your data security. This document outlines how we process information...',
  commission: 10,
  minPayout: 1000,
  currency: 'INR',
  transactionFee: 2,
  razorpayConnected: false,
  stripeConnected: false,
  twoFactorEnabled: true,
  botProtectionEnabled: false,
  sessionTimeout: '30 Minutes',
  minPasswordLength: 12,
};

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(DEFAULTS);

  const getErrorMessage = (error: any, fallback: string) => {
    return error?.response?.data?.message || error?.response?.data?.error || fallback;
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        setSettings({ ...DEFAULTS, ...res.data });
      } catch (error: any) {
        toast.error(getErrorMessage(error, 'Failed to load settings'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/admin/settings', settings);
      setSettings({ ...DEFAULTS, ...res.data });
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      toast.error(getErrorMessage(error, 'Failed to save settings'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to default? This cannot be undone.')) return;
    try {
      const res = await api.post('/admin/settings/reset');
      setSettings({ ...DEFAULTS, ...res.data });
      toast.success('Settings reset to default');
    } catch (error: any) {
      toast.error(getErrorMessage(error, 'Failed to reset settings'));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 w-full min-h-[calc(100vh-64px)] bg-[#F5F5F8] flex items-center justify-center">
        <p className="text-[#6B7280] font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes detailFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .detail-animate { opacity: 0; }
        .detail-animate.visible { animation: detailFadeUp 0.6s ease-out forwards; }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)' }}>
        <div className="max-w-[700px] mx-auto">
          
          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0ms' }}>
            <SettingsHeader onSave={handleSave} onReset={handleReset} isSaving={isSaving} />
          </div>

          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '100ms' }}>
            <GeneralSettingsSection settings={settings} onChange={handleChange} />
          </div>

          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '200ms' }}>
            <LegalComplianceSection settings={settings} onChange={handleChange} />
          </div>

          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '300ms' }}>
            <PaymentsSection settings={settings} onChange={handleChange} />
          </div>

          <div className={`detail-animate ${mounted ? 'visible' : ''}`} style={{ animationDelay: '400ms' }}>
            <SecuritySection settings={settings} onChange={handleChange} />
          </div>

        </div>
      </div>
    </>
  );
}
