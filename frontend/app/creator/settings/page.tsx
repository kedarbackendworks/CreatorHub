"use client"

import React, { useState } from 'react';
import { Copy } from 'lucide-react';

export default function SettingsPage() {
  const [toggles, setToggles] = useState({
    twoFA: true,
    apiAccess: true,
    aiInsights: false,
    emailNotif: true,
    adminNotif: true,
    systemNotif: true,
  });

  const ToggleSwitch = ({ label, desc, isChecked, onChange }: any) => (
    <div className="flex items-center justify-between py-4">
      <div>
         <p className="text-xs font-bold text-slate-800">{label}</p>
         {desc && <p className="text-[11px] font-medium text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button 
        onClick={onChange}
        className={`w-10 h-6 rounded-full relative transition-colors ${isChecked ? 'bg-slate-800' : 'bg-slate-200'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-[4px] transition-transform ${isChecked ? 'translate-x-[20px]' : 'translate-x-[4px]'}`}></div>
      </button>
    </div>
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fa] min-h-[calc(100vh-64px)] font-sans pb-16">
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Settings</h2>
        <p className="text-sm font-medium text-slate-600 mt-1">Configure your platform preferences and security parameters.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-start gap-3 mb-8">
        <button className="px-5 py-2.5 bg-slate-200 text-slate-800 text-xs font-bold rounded-full transition-colors">General</button>
        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-full transition-colors">Payments</button>
        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-full transition-colors">Security</button>
        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-full transition-colors">Features</button>
        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-full transition-colors">Notifications</button>
        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-full transition-colors">Maintenance</button>
      </div>

      <div className="space-y-6 max-w-5xl">
         
         {/* General Information */}
         <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl p-8 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-6">General Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Platform Name</label>
                  <input type="text" defaultValue="Enterprise Admin" className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Support Email</label>
                  <input type="text" defaultValue="support@platform.com" className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none" />
               </div>
               <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Time Zone</label>
                  <select className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none appearance-none">
                    <option>(GMT+05:30) India Standard Time</option>
                  </select>
                  <span className="absolute right-4 top-10 text-[10px] text-slate-500">▼</span>
               </div>
               <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Language</label>
                  <select className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none appearance-none">
                    <option>English (US)</option>
                  </select>
                  <span className="absolute right-4 top-10 text-[10px] text-slate-500">▼</span>
               </div>
             </div>
         </div>

         {/* Payments */}
         <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl p-8 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-1">Payments</h3>
             <p className="text-xs font-medium text-slate-500 mb-6">Configure your revenue collections.</p>
             <div className="space-y-6">
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Payment Gateway</label>
                  <input type="text" defaultValue="Stripe Connect" className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Live API Key</label>
                  <div className="relative">
                    <input type="text" defaultValue="sk_live_51P2u8H920192..." readOnly className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none text-slate-600" />
                    <Copy className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 cursor-pointer" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-1.5 ml-1">Used for all transactions across the platform.</p>
               </div>
             </div>
         </div>

         {/* Security & Authentication */}
         <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl p-8 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-6">Security & Authentication</h3>
             <ToggleSwitch label="Two-Factor Authentication (2FA)" desc="Add an extra layer of security to all admin accounts." isChecked={toggles.twoFA} onChange={() => setToggles({...toggles, twoFA: !toggles.twoFA})} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Minimum Password Length</label>
                  <input type="number" defaultValue="12" className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Session Timeout (Minutes)</label>
                  <input type="number" defaultValue="30" className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-3 text-xs font-semibold text-slate-800 outline-none" />
               </div>
             </div>
         </div>

         {/* Product Features */}
         <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl p-8 shadow-sm space-y-2">
             <h3 className="text-sm font-bold text-slate-800 mb-2">Product Features</h3>
             <ToggleSwitch label="Public API Access" desc="Allow third-party integrations." isChecked={toggles.apiAccess} onChange={() => setToggles({...toggles, apiAccess: !toggles.apiAccess})} />
             <div className="border-t border-slate-100 pt-3">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 mt-4">Beta Features</h4>
               <ToggleSwitch label="AI Reporting Insights" desc="Automated trend analysis on your dashboard." isChecked={toggles.aiInsights} onChange={() => setToggles({...toggles, aiInsights: !toggles.aiInsights})} />
             </div>
         </div>

         {/* Notifications & Alerts */}
         <div className="bg-white border flex flex-col items-stretch border-slate-200 rounded-xl p-8 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-4">Notifications & Alerts</h3>
             <div className="divide-y divide-slate-100 border-y border-slate-100">
               <div className="flex items-center justify-between py-4">
                 <p className="text-xs font-bold text-slate-700">Email Notifications</p>
                 <button onClick={() => setToggles({...toggles, emailNotif: !toggles.emailNotif})} className={`w-10 h-6 rounded-full relative transition-colors ${toggles.emailNotif ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-[4px] transition-transform ${toggles.emailNotif ? 'translate-x-[20px]' : 'translate-x-[4px]'}`}></div>
                 </button>
               </div>
               <div className="flex items-center justify-between py-4">
                 <p className="text-xs font-bold text-slate-700">Admin Activity Reports</p>
                 <button onClick={() => setToggles({...toggles, adminNotif: !toggles.adminNotif})} className={`w-10 h-6 rounded-full relative transition-colors ${toggles.adminNotif ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-[4px] transition-transform ${toggles.adminNotif ? 'translate-x-[20px]' : 'translate-x-[4px]'}`}></div>
                 </button>
               </div>
               <div className="flex items-center justify-between py-4">
                 <p className="text-xs font-bold text-slate-700">System Health Alerts</p>
                 <button onClick={() => setToggles({...toggles, systemNotif: !toggles.systemNotif})} className={`w-10 h-6 rounded-full relative transition-colors ${toggles.systemNotif ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-[4px] transition-transform ${toggles.systemNotif ? 'translate-x-[20px]' : 'translate-x-[4px]'}`}></div>
                 </button>
               </div>
             </div>
         </div>

         {/* Maintenance Mode */}
         <div className="bg-rose-50/50 border flex flex-col items-stretch border-rose-200 rounded-xl p-8 shadow-sm">
             <h3 className="text-sm font-bold text-rose-800 mb-1">Maintenance Mode</h3>
             <p className="text-xs font-bold text-rose-600 mb-6">Control site availability for scheduled updates.</p>
             <div className="bg-[#f8f9fa] border border-rose-200 p-4 rounded-lg text-xs font-medium text-slate-600 mb-6">
                Warning: Activating maintenance mode will immediately terminate all active user sessions. Users will not be able to access the platform until deactivated.
             </div>
             <div>
                <button className="px-6 py-2.5 bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                  Activate Maintenance
                </button>
             </div>
         </div>

      </div>

    </div>
  );
}
