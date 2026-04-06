'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionPlanCard } from '@/src/components/admin/platform/SubscriptionPlanCard';
import { FeatureToggleRow } from '@/src/components/admin/platform/FeatureToggleRow';
import api from '@/src/lib/api';

export default function PlatformPage() {
  const [mounted, setMounted] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [editingPlan, setEditingPlan] = useState<any>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/platform/settings');
      if (res.data) {
        setPlans(res.data.subscriptionPlans);
        
        // Transform the dictionary response into array for UI
        const tObj = res.data.toggles;
        setFeatures([
          { id: 'feat_livestreaming', title: 'Livestreaming', description: 'Enable creators to broadcast high-definition video in real-time.', isEnabled: tObj.livestreaming },
          { id: 'feat_messaging', title: 'Direct Messaging', description: 'Allow private communication between creators and their subscribers.', isEnabled: tObj.messaging },
          { id: 'feat_tips', title: 'Tips/Donations', description: 'Enable one-time financial support directly on creator profiles.', isEnabled: tObj.tips },
          { id: 'feat_content_lock', title: 'Paid Content Lock', description: 'Allow individual posts to be gated behind a one-time purchase.', isEnabled: tObj.contentLock },
          { id: 'feat_community', title: 'Community/Forums', description: 'Enable discussion boards and threads for fan interaction.', isEnabled: tObj.community },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (id: string, isEnabled: boolean) => {
    setFeatures(prev =>
      prev.map((f) => (f.id === id ? { ...f, isEnabled } : f))
    );

    try {
      await api.put('/admin/platform/settings/toggle', { featureId: id, isEnabled });
    } catch(err) {
      console.error('Failed to update toggle', err);
      setFeatures(prev =>
        prev.map((f) => (f.id === id ? { ...f, isEnabled: !isEnabled } : f))
      );
    }
  };

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      const payload = {
        ...editingPlan,
        features: typeof editingPlan.features === 'string' 
          ? editingPlan.features.split(',').map((f: string) => f.trim()) 
          : editingPlan.features
      };
      await api.put(`/admin/platform/plans/${editingPlan.id}`, payload);
      setEditingPlan(null);
      fetchSettings();
    } catch(err) {
      console.error('Failed to update plan', err);
    }
  };

  if (isLoading) {
    return (
       <div className="p-6 w-full min-h-[calc(100vh-64px)] bg-[#F5F5F8] flex items-center justify-center">
        <p className="text-[#6B7280] font-medium animate-pulse">Loading platform settings...</p>
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
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .detail-animate { opacity: 0; }
        .detail-animate.visible { animation: detailFadeUp 0.6s ease-out forwards; }
      `}</style>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 'clamp(12px, 2.8vw, 24px)', background: '#F5F5F8', minHeight: 'calc(100vh - 56px)', position: 'relative' }}>
        
        {/* Header */}
        <div className={`detail-animate mb-8 ${mounted ? 'visible' : ''}`} style={{ animationDelay: '0ms' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Platform
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            Manage monetization, templates, and feature configuration across the platform ecosystem.
          </p>
        </div>

        {/* 01 / Subscription Plans */}
        <div className="mb-10">
          <h2
            className={`detail-animate ${mounted ? 'visible' : ''}`}
            style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', marginBottom: 20, animationDelay: '50ms' }}
          >
            01 / Subscription Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, index) => (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                delay={100 + index * 50}
                onEdit={() => setEditingPlan({...plan, features: plan.features.join(', ')})}
              />
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div>
          <h2
            className={`detail-animate ${mounted ? 'visible' : ''}`}
            style={{ fontSize: 16, fontWeight: 700, color: '#4B5563', marginBottom: 20, animationDelay: '250ms' }}
          >
            Feature Toggles
          </h2>
          <div
            className={`bg-white rounded-xl p-8 detail-animate ${mounted ? 'visible' : ''}`}
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              animationDelay: '300ms',
            }}
          >
            <div className="flex flex-col -my-6">
              {features.map((feature, index) => (
                <FeatureToggleRow
                  key={feature.id}
                  feature={feature}
                  delay={350 + index * 50}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Edit {editingPlan.planName} Plan</h3>
                <button onClick={() => setEditingPlan(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <form onSubmit={savePlan} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Plan Name</label>
                  <input 
                    type="text" 
                    value={editingPlan.planName} 
                    onChange={e => setEditingPlan({...editingPlan, planName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                  <input 
                    type="text" 
                    value={editingPlan.price} 
                    onChange={e => setEditingPlan({...editingPlan, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Billing Frequency</label>
                  <input 
                    type="text" 
                    value={editingPlan.frequency} 
                    onChange={e => setEditingPlan({...editingPlan, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Features (comma separated)</label>
                  <textarea 
                    value={editingPlan.features} 
                    onChange={e => setEditingPlan({...editingPlan, features: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:outline-none h-24 resize-none"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setEditingPlan(null)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 px-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
