"use client";

import type { ComponentType } from 'react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useBanStore } from '@/src/store/useBanStore';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function withBanCheck<P extends object>(WrappedComponent: ComponentType<P>) {
  function BanProtectedComponent(props: P) {
    const router = useRouter();
    const hasShownToastRef = useRef(false);
    const token = useAuthStore((state) => state.token);
    const activeBan = useBanStore((state) => state.activeBan);
    const openBanPopup = useBanStore((state) => state.openBanPopup);
    const hasCheckedBan = useBanStore((state) => state.hasCheckedBan);

    useEffect(() => {
      if (!activeBan?.isActive) {
        hasShownToastRef.current = false;
        return;
      }

      openBanPopup();
      if (!hasShownToastRef.current) {
        toast.error('Your account is suspended. Go to Appeal.');
        hasShownToastRef.current = true;
      }
      router.replace('/appeal');
    }, [activeBan?.isActive, openBanPopup, router]);

    if (token && !hasCheckedBan) {
      return null;
    }

    if (activeBan?.isActive) {
      return null;
    }

    return <WrappedComponent {...props} />;
  }

  BanProtectedComponent.displayName = `withBanCheck(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return BanProtectedComponent;
}
