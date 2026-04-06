"use client" 

import React, { useState, useEffect } from 'react';
import { ArrowRight, Landmark, FileText, UserCheck } from 'lucide-react';
import api from '@/src/lib/api';
import toast from 'react-hot-toast';
import withBanCheck from '@/src/hoc/withBanCheck';

function PayoutSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await api.get('/creator/payout-settings');
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching payouts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'verified': return { bg: 'bg-[#ecfdf5]', text: 'text-[#065f46]', dot: 'bg-[#10b981]', label: 'Verified' };
      case 'pending': return { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]', dot: 'bg-[#f59e0b]', label: 'Pending' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400', label: 'Required' };
    }
  };

  const updateSetting = async (type: string, data: any) => {
    try {
      const res = await api.put('/creator/payout-settings', { type, data });
      setSettings(res.data);
      toast.success(`${type.toUpperCase()} information updated.`);
    } catch (err) {
      toast.error("Failed to update.");
    }
  };

  if (loading || !settings) return <div className="p-12 text-center text-slate-500 font-bold">Loading payout configurations...</div>;

  const kyc = getStatusStyle(settings.kyc.status);
  const billing = getStatusStyle(settings.billing.status);
  const bank = getStatusStyle(settings.bank.status);

  return (
    <div className="p-12 max-w-6xl w-full mx-auto font-sans bg-[#f9f9f9] min-h-screen">
       
       <header className="mb-12">
          <h1 className="text-[34px] font-bold text-[#1c1917] tracking-tight mb-2">Payout Settings</h1>
          <p className="text-base font-medium text-slate-500 max-w-3xl leading-relaxed">
            Manage your institutional disbursement configurations, statutory KYC documentation, and verified banking channels.
          </p>
       </header>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: KYC Verification */}
          <div className={`rounded-3xl p-10 border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer h-full ${settings.kyc.status === 'verified' ? 'bg-[#f0fdf4] border-[#dcfce7]' : 'bg-[#fff1e7] border-[#fee2d1]'}`}>
             <div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-lg mb-6 border ${kyc.bg} ${kyc.text}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${kyc.dot}`}></div> {kyc.label}
                </span>
                <h3 className="text-[26px] font-bold text-[#1c1917] mb-4 flex items-center gap-3">
                   KYC Verification
                </h3>
                <p className="text-base font-medium text-slate-600 mb-10 leading-relaxed">
                   Verify your identity by submitting PAN and Aadhaar details to enable secure payouts.
                </p>
             </div>
             
             <button 
                disabled={settings.kyc.status === 'verified'}
                onClick={() => updateSetting('kyc', { pan: 'ABCDE1234F' })}
                className="flex items-center gap-2 text-base font-bold text-[#d94828] hover:gap-4 transition-all self-end disabled:opacity-50"
             >
                {settings.kyc.status === 'verified' ? 'Verified' : 'Complete KYC'} <ArrowRight className="w-5 h-5" />
             </button>
          </div>

          {/* Card 2: Billing Details */}
          <div className={`rounded-3xl p-10 border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer h-full ${settings.billing.status === 'verified' ? 'bg-[#fdfaff] border-[#f5f3ff]' : 'bg-[#f5f3ff] border-[#ede9fe]'}`}>
             <div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-lg mb-6 border ${billing.bg} ${billing.text}`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${billing.dot}`}></div> {billing.label}
                </span>
                <h3 className="text-[26px] font-bold text-[#1c1917] mb-4">
                   Billing Details
                </h3>
                <p className="text-base font-medium text-slate-600 mb-10 leading-relaxed">
                   Provide your billing information for invoices, tax records, and payment tracking.
                </p>
             </div>
             
             <button 
                onClick={() => updateSetting('billing', { address: 'Sample Address' })}
                className="flex items-center gap-2 text-base font-bold text-[#d94828] hover:gap-4 transition-all self-end"
             >
                {settings.billing.status === 'verified' ? 'Update Info' : 'Add Billing Info'} <ArrowRight className="w-5 h-5" />
             </button>
          </div>

          {/* Card 3: Bank Account Setup */}
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer h-full">
             <div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-lg mb-6 border ${bank.bg} ${bank.text}`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${bank.dot}`}></div> {bank.label}
                </span>
                <h3 className="text-[26px] font-bold text-[#1c1917] mb-4">
                   Bank Account Setup
                </h3>
                <p className="text-base font-medium text-slate-600 mb-10 leading-relaxed">
                   Add your bank account information to receive payments directly and securely.
                </p>
             </div>
             
             <button 
                onClick={() => updateSetting('bank', { accountNumber: '1234567890' })}
                className="flex items-center gap-2 text-base font-bold text-[#d94828] hover:gap-4 transition-all self-end mt-auto"
             >
                {settings.bank.status === 'verified' ? 'Update Account' : 'Complete setup'} <ArrowRight className="w-5 h-5" />
             </button>
          </div>

       </div>

    </div>
  );
}

export default withBanCheck(PayoutSettingsPage);
