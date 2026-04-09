"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, Library, MessageSquare, Megaphone, Receipt, PlusCircle, PenTool, Video, MoreVertical, FileText, X, ChevronDown, History, Menu, Lock, Scale } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/src/lib/api';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useBanStore } from '@/src/store/useBanStore';
import { useNotifications } from '@/src/hooks/useNotifications';
import BanPopup from '@/src/components/ban/BanPopup';
import SupportNavItem from '@/UserSupport/components/SupportNavItem';
import SubscriptionNavItem from '@/CreatorSubscription/components/SubscriptionNavItem';
import OnboardingSubscriptionPopup from '@/CreatorSubscription/components/OnboardingSubscriptionPopup';
import { useSubscription } from '@/CreatorSubscription/hooks/useSubscription';
import { useOnboardingPopup } from '@/CreatorSubscription/hooks/useOnboardingPopup';
import BrandLogo from '@/src/components/BrandLogo';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [createOpen, setCreateOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const unreadCount = useAuthStore((state) => state.unreadCount);
  const logout = useAuthStore((state) => state.logout);
  const activeBan = useBanStore((state) => state.activeBan);
  const setBanData = useBanStore((state) => state.setBanData);
  const clearBanState = useBanStore((state) => state.clearBanState);
  const openBanPopup = useBanStore((state) => state.openBanPopup);
  const canAppeal = useBanStore((state) => state.canAppeal);
  const { subscription, refresh: refreshSubscription } = useSubscription();
  const {
    showPopup,
    isExistingCreator,
    dismissPopup,
    setShowPopup,
  } = useOnboardingPopup(user?.role === 'creator');

  useNotifications(user?.role === 'creator' ? 'creator' : 'user');

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!token || user?.role !== 'creator') {
      clearBanState();
      return;
    }

    let cancelled = false;

    const syncBanState = async () => {
      try {
        const res = await api.get('/appeals/my-appeal');
        if (cancelled) return;
        setBanData({
          activeBan: res.data?.activeBan ?? null,
          appeal: res.data?.appeal ?? null
        });
      } catch {
        if (!cancelled) {
          clearBanState();
        }
      }
    };

    syncBanState();

    return () => {
      cancelled = true;
    };
  }, [pathname, token, user?.role, setBanData, clearBanState]);

  const isBanned = Boolean(activeBan?.isActive);
  const showAppealBadge = isBanned && canAppeal;
  const subscriptionData =
    subscription && typeof subscription === 'object'
      ? (subscription as Record<string, unknown>)
      : null;
  const currentPlan =
    typeof subscriptionData?.plan === 'string' ? subscriptionData.plan : 'free';
  const currentStatus =
    typeof subscriptionData?.status === 'string' ? subscriptionData.status : 'active';

  const activateFreeFromPopup = async () => {
    try {
      await api.post('/creator/subscription/free');
      await refreshSubscription();
    } catch (_error) {
      // non-blocking
    }
    setShowPopup(false);
  };

  const activateProFromPopup = async () => {
    try {
      await api.post('/creator/subscription/pro');
      await refreshSubscription();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to activate Pro plan');
    }
    setShowPopup(false);
  };

  const enterpriseSubmittedFromPopup = async () => {
    await refreshSubscription();
    setShowPopup(false);
  };

  const onRestrictedNavClick = () => {
    if (!isBanned) return;
    openBanPopup();
    toast.error('Your account is suspended. Go to Appeal.');
  };

  const isActive = (path: string) => {
    return pathname === path 
      ? "flex items-center gap-4 px-3 py-2 text-sm font-semibold text-rose-500 bg-rose-50/50 rounded-lg relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-rose-500 before:rounded-r-md"
      : "flex items-center gap-4 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors rounded-lg mb-2";
  };

  return (
    <div className="flex min-h-screen bg-[#f9f9f9] text-slate-800 font-sans relative overflow-x-hidden">
      {mobileNavOpen && (
        <button
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-30"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation"
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[280px] bg-[#f9f9f9] flex flex-col pt-6 pb-6 h-screen fixed lg:sticky top-0 left-0 border-r border-slate-200/60 shrink-0 z-40 lg:z-20 transition-transform duration-300 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-8 mb-10">
          <BrandLogo
            iconSize={24}
            showTrademark
            textClassName="text-xl font-bold tracking-tight text-slate-800"
            trademarkClassName="text-xs align-top font-black"
          />
        </div>

        <nav className="flex-1 overflow-y-auto px-5">
          <Link href="/creator" className={isActive('/creator')}>
            <Home className="w-5 h-5 stroke-[1.5]" /> Home
          </Link>
          <Link href="/creator/notifications" className={isActive('/creator/notifications')}>
            <span className="relative inline-flex">
              <Bell className="w-5 h-5 stroke-[1.5]" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#f95c4b] text-white rounded-full text-[10px] min-w-[16px] h-[16px] flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            Notifications
          </Link>
          <Link href="/creator/library" className={isActive('/creator/library')}>
            <Library className="w-5 h-5 stroke-[1.5]" /> My library
          </Link>
          <Link href="/creator/messages" className={isActive('/creator/messages')}>
            <MessageSquare className="w-5 h-5 stroke-[1.5]" /> Messages
          </Link>
          <Link href="/creator/insights" className={isActive('/creator/insights')}>
            <Megaphone className="w-5 h-5 stroke-[1.5]" /> Insights
          </Link>
          <Link href="/appeal" className={isActive('/appeal')}>
            <span className="relative inline-flex">
              <Scale className="w-5 h-5 stroke-[1.5]" />
              {showAppealBadge && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </span>
            Appeal
          </Link>
          <SubscriptionNavItem
            currentPlan={currentPlan}
            status={currentStatus}
            className={isActive('/creator/subscription')}
          />
          {isBanned ? (
            <button
              type="button"
              title="Account suspended"
              onClick={onRestrictedNavClick}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-400 rounded-lg mb-2 cursor-not-allowed"
            >
              <span className="flex items-center gap-4">
                <Receipt className="w-5 h-5 stroke-[1.5]" /> Payouts
              </span>
              <Lock className="w-4 h-4 text-red-500" />
            </button>
          ) : (
            <Link href="/creator/payout" className={isActive('/creator/payout')}>
              <Receipt className="w-5 h-5 stroke-[1.5]" /> Payouts
            </Link>
          )}
          <SupportNavItem role="creator" className={isActive('/creator/support')} />

          <div className="mt-4">
             <button 
               onClick={() => setCreateOpen(!createOpen)}
               className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
             >
               <div className="flex items-center gap-4">
                 <PlusCircle className="w-5 h-5 stroke-[1.5]" /> Create
               </div>
               <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${createOpen ? 'rotate-180' : ''}`} />
             </button>
             
             {createOpen && (
               <div className="ml-5 mt-2 space-y-2 border-l border-slate-200">
                  {isBanned ? (
                    <button
                      type="button"
                      title="Account suspended"
                      onClick={onRestrictedNavClick}
                      className="w-full flex items-center justify-between px-6 py-2 text-[13px] font-semibold text-slate-400 cursor-not-allowed"
                    >
                      <span className="flex items-center gap-3">
                        <PenTool className="w-4 h-4 stroke-[1.5]" /> Create Post
                      </span>
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  ) : (
                    <Link href="/creator/post" className="flex items-center gap-3 px-6 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                      <PenTool className="w-4 h-4 stroke-[1.5]" /> Create Post
                    </Link>
                  )}
                  {isBanned ? (
                    <button
                      type="button"
                      title="Account suspended"
                      onClick={onRestrictedNavClick}
                      className="w-full flex items-center justify-between px-6 py-2 text-[13px] font-semibold text-slate-400 cursor-not-allowed"
                    >
                      <span className="flex items-center gap-3">
                        <Video className="w-4 h-4 stroke-[1.5]" /> Upload
                      </span>
                      <Lock className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  ) : (
                    <Link href="/creator/livestream" className="flex items-center gap-3 px-6 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                      <Video className="w-4 h-4 stroke-[1.5]" /> Upload
                    </Link>
                  )}
               </div>
             )}
          </div>
        </nav>

        <div className="px-6 mt-auto relative">
          {profileMenuOpen && (
            <div className="absolute bottom-20 left-6 right-6 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-[100] animate-in fade-in slide-in-from-bottom-4">
              <Link 
                href="/creator/profile" 
                className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => setProfileMenuOpen(false)}
              >
                View Profile
              </Link>
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
          <div 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex justify-between items-center pt-6 border-t border-slate-200/80 cursor-pointer group"
          >
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                 {user?.name?.charAt(0) || 'U'}
               </div>
               <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 line-clamp-1">{user?.name || 'Profile'}</span>
             </div>
             <MoreVertical className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${profileMenuOpen ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:ml-0">
        {/* Top Header */}
        <header className="h-[72px] shrink-0 border-b border-slate-200/80 flex items-center justify-between px-4 md:px-8 bg-[#f9f9f9] z-10 w-full">
           {/* Left side info */}
           <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600"
                aria-label="Open navigation"
              >
                <Menu className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold text-slate-500 leading-tight">Your page is not published yet</h2>
           </div>

           {/* Right side actions */}
           <div className="flex items-center gap-3 md:gap-8">
              <button 
                onClick={() => setPublishModalOpen(true)}
                className="hidden sm:flex px-6 py-2 bg-[#d94828] hover:bg-[#c93d1f] text-white text-sm font-bold rounded-full transition-all shadow-md items-center gap-2"
              >
                Publish Now <FileText className="w-4 h-4" />
              </button>

              <div className="hidden sm:block h-6 w-px bg-slate-200 mx-2"></div>

              <div className="flex items-center gap-3 md:gap-5">
                  <Link href="/creator/library" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <History className="w-5 h-5 stroke-[1.5]" />
                  </Link>
                  <Link href="/creator/notifications" className="text-slate-400 hover:text-slate-600 transition-colors relative">
                    <Bell className="w-5 h-5 stroke-[1.5]" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 border border-white rounded-full"></div>
                  </Link>
                 
                 <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="text-right hidden md:block">
                       <p className="text-sm font-extrabold text-[#1c1917] leading-tight capitalize">{user?.name || 'Guest User'}</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{user?.role || 'Creator'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-rose-500 font-bold">
                       {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto w-full">
           {children}
        </div>
      </main>

      {/* Global Publish Modal (Image 2) */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
           <div className="bg-white rounded-3xl shadow-2xl w-[440px] p-10 relative flex flex-col">
              <button 
                onClick={() => setPublishModalOpen(false)}
                className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-bold text-[#1c1917] mb-8 pr-12 leading-tight">Ready to publish your page?</h3>
              
              <p className="text-sm font-bold text-[#44403c] mb-4 leading-relaxed tracking-tight">
                To continue, <span className="font-extrabold text-[#111827]">please enter your legal name and country of residence.</span>
              </p>
              
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed tracking-tight">
                We use this for purposes like tax and payout, and it&apos;s never shown publicly. <a href="#" className="text-rose-500 hover:underline">Learn More</a>
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2.5 ml-1 uppercase tracking-wider">First name</label>
                   <input type="text" placeholder="Name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300 shadow-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-700 mb-2.5 ml-1 uppercase tracking-wider">Surname</label>
                   <input type="text" placeholder="Last name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300 shadow-sm" />
                 </div>
              </div>

              <div className="mb-10">
                 <label className="block text-xs font-bold text-slate-700 mb-2.5 ml-1 uppercase tracking-wider text-[11px]">Country of residence</label>
                 <div className="relative">
                   <select className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-10 py-3 text-sm font-bold text-[#1c1917] appearance-none focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300 cursor-pointer shadow-sm">
                     <option value="IN">India</option>
                     <option value="US">United States</option>
                     <option value="GB">United Kingdom</option>
                     <option value="AU">Australia</option>
                   </select>
                   <div className="absolute left-4 top-3 text-[18px]">🇮🇳</div>
                   <div className="absolute right-4 top-3.5 pointer-events-none">
                     <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                   </div>
                 </div>
              </div>

              <button className="w-full py-3.5 bg-[#d94828] hover:bg-[#c93d1f] text-white text-base font-bold rounded-full transition-all shadow-md active:scale-95">
                 Continue
              </button>
           </div>
        </div>
      )}

      <BanPopup />
      {showPopup && user?.role === 'creator' ? (
        <OnboardingSubscriptionPopup
          isExistingCreator={isExistingCreator}
          subscription={subscription}
          onSkip={dismissPopup}
          onActivateFree={activateFreeFromPopup}
          onActivatePro={activateProFromPopup}
          onEnterpriseSubmitted={enterpriseSubmittedFromPopup}
        />
      ) : null}
    </div>
  );
}
