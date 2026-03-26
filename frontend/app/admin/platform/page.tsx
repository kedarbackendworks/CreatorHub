"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Edit2, CheckCircle2, MoreVertical, LayoutGrid, Upload, Loader2 } from 'lucide-react';

export default function PlatformPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/admin/data');
        if (res.data && res.data.settings) setSettings(res.data.settings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      toggles: { ...settings.toggles, [key]: !settings.toggles[key] }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5001/api/admin/settings', settings);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ label, isChecked, onChange, sub }: any) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-xs font-bold text-slate-700">{label}</p>
        {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={onChange}
        className={`w-9 h-5 rounded-full relative transition-colors ${isChecked ? 'bg-slate-800' : 'bg-slate-200'}`}
      >
        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${isChecked ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}></div>
      </button>
    </div>
  );

  if (loading || !settings) {
    return <div className="p-8 text-slate-500">Loading platform settings...</div>;
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fa] min-h-[calc(100vh-64px)] font-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Platform</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage platform features, pricing, and templates.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-700 transition-colors flex flex-items gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Settings
          </button>
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            Preview Platform
          </button>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 flex flex-col items-stretch overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">Subscription Plans</h3>
          <button className="text-xs font-bold text-slate-800 hover:text-slate-600">Add Plan</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-[#f8f9fa]">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">Plan Name</th>
                <th className="px-6 py-4 font-bold text-slate-600">Price</th>
                <th className="px-6 py-4 font-bold text-slate-600">Platform Fee</th>
                <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                <th className="px-6 py-4 font-bold text-slate-600 justify-end flex">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 font-bold text-slate-800 text-xs">Free</td>
                <td className="px-6 py-5 text-slate-600 font-medium text-xs">₹0/mo</td>
                <td className="px-6 py-5 text-slate-600 font-medium text-xs">10%</td>
                <td className="px-6 py-5"><span className="text-emerald-500 bg-emerald-50 px-3 py-1 font-bold text-[10px] rounded">Active</span></td>
                <td className="px-6 py-5 text-right font-bold text-xs text-slate-800 cursor-pointer hover:underline">Edit</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 font-bold text-slate-800 text-xs">Pro</td>
                <td className="px-6 py-5 text-slate-600 font-medium text-xs">₹999/mo</td>
                <td className="px-6 py-5 text-slate-600 font-medium text-xs">5%</td>
                <td className="px-6 py-5"><span className="text-emerald-500 bg-emerald-50 px-3 py-1 font-bold text-[10px] rounded">Active</span></td>
                <td className="px-6 py-5 text-right font-bold text-xs text-slate-800 cursor-pointer hover:underline">Edit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Template Management */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-6">Template Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white group cursor-pointer hover:border-slate-300">
              <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                <img src={`https://images.unsplash.com/photo-1542382121-6549a0224a1b?w=600&q=80`} alt="Template" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-0.5">{i % 2 === 0 ? 'Commerce Store' : 'Minimal Portfolio'}</h4>
                  <p className="text-[10px] font-medium text-slate-400">{i * 2}.2k creators active</p>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="px-6 py-2.5 bg-[#1e293b] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-colors">
            VIEW MORE
          </button>
        </div>
      </div>

      {/* Payment & Fees Config */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Payment & Fees Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Platform Commission (%)</label>
            <input type="text" value={settings.commission} onChange={e => setSettings({ ...settings, commission: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300" />
            <p className="text-[10px] text-slate-400 font-medium mt-1.5">Percentage taken from creator earnings</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Transaction Fees</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-xs font-bold text-slate-500">₹</span>
              <input type="text" value={settings.transactionFee} onChange={e => setSettings({ ...settings, transactionFee: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg pl-8 pr-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1.5">Flat fee per transaction</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Minimum Payout</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-xs font-bold text-slate-500">₹</span>
              <input type="text" value={settings.minPayout} onChange={e => setSettings({ ...settings, minPayout: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg pl-8 pr-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Default Currency</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-xs font-bold text-slate-500">₹</span>
              <input type="text" value={settings.currency || 'INR'} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg pl-8 pr-8 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300" />
              <span className="absolute right-4 top-3.5 text-[8px] font-bold text-slate-500 pointer-events-none">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Feature Toggles */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Feature Toggles</h3>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Content Features</p>
            <ToggleSwitch label="Livestream Capabilities" isChecked={settings.toggles.livestream} onChange={() => handleToggle('livestream')} />
            <ToggleSwitch label="Online Courses" isChecked={settings.toggles.courses} onChange={() => handleToggle('courses')} />
          </div>

          <div className="pt-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Monetization</p>
            <ToggleSwitch label="Creator Tips/Donations" isChecked={settings.toggles.tips} onChange={() => handleToggle('tips')} />
          </div>

          <div className="pt-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Engagement</p>
            <ToggleSwitch label="Direct Messaging" isChecked={settings.toggles.dm} onChange={() => handleToggle('dm')} />
            <ToggleSwitch label="Community Forums" isChecked={settings.toggles.forums} onChange={() => handleToggle('forums')} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Branding Identiy */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 h-full">
            <h3 className="text-sm font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Branding & Identity</h3>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2">Platform Name</label>
              <input type="text" value={settings.platformName} onChange={e => setSettings({ ...settings, platformName: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300" />
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 mb-2">Brand Logo</label>
                <div className="border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-2" />
                  <span className="text-[10px] font-bold text-slate-600">Upload Image</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 mb-2">Favicon</label>
                <div className="border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-2" />
                  <span className="text-[10px] font-bold text-slate-600">Upload Image</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Live Preview</label>
              <div className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-4 text-xs font-bold text-slate-800 flex items-center justify-center">
                {settings.platformName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules & Policies bottom */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 w-full mb-10">
        <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Rules & Policies</h3>
        <ToggleSwitch label="Content Guidelines" sub="Enforce AI-based moderation" isChecked={settings.toggles.AI} onChange={() => handleToggle('AI')} />
        <ToggleSwitch label="Age Restrictions" sub="Identity verification for 18+" isChecked={settings.toggles.ageRes} onChange={() => handleToggle('ageRes')} />
      </div>

    </div>
  );
}
