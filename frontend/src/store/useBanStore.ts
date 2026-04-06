import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppealStatus = 'pending' | 'approved' | 'rejected';

export interface ActiveBanInfo {
  isActive: boolean;
  banType: 'temporary' | 'permanent';
  reason: string;
  endDate: string | null;
  remainingDays: number | null;
}

export interface AppealInfo {
  _id: string;
  status: AppealStatus;
  reason: string;
  supportingInfo: string;
  submittedAt: string;
  reviewedAt: string | null;
  adminNote: string;
  ban: {
    reason: string;
    banType: 'temporary' | 'permanent';
    startDate: string;
    endDate: string | null;
  } | null;
}

interface BanState {
  activeBan: ActiveBanInfo | null;
  appeal: AppealInfo | null;
  canAppeal: boolean;
  showBanPopup: boolean;
  banDismissed: boolean;
  hasCheckedBan: boolean;
  setBanData: (payload: { activeBan: ActiveBanInfo | null; appeal: AppealInfo | null }) => void;
  openBanPopup: () => void;
  dismissForViewerSession: () => void;
  clearBanState: () => void;
}

export const useBanStore = create<BanState>()(
  persist(
    (set) => ({
      activeBan: null,
      appeal: null,
      canAppeal: true,
      showBanPopup: false,
      banDismissed: false,
      hasCheckedBan: false,
      setBanData: ({ activeBan, appeal }) => {
        const isActive = Boolean(activeBan?.isActive);
        const canAppeal = !appeal || appeal.status === 'approved';

        set((state) => ({
          activeBan: activeBan ?? null,
          appeal: appeal ?? null,
          canAppeal,
          showBanPopup: isActive ? !state.banDismissed : false,
          banDismissed: isActive ? state.banDismissed : false,
          hasCheckedBan: true
        }));
      },
      openBanPopup: () => set((state) => (state.activeBan?.isActive ? { showBanPopup: true } : state)),
      dismissForViewerSession: () => set({ showBanPopup: false, banDismissed: true }),
      clearBanState: () => set({
        activeBan: null,
        appeal: null,
        canAppeal: true,
        showBanPopup: false,
        banDismissed: false,
        hasCheckedBan: true
      })
    }),
    {
      name: 'ban-session-state',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        banDismissed: state.banDismissed
      })
    }
  )
);
