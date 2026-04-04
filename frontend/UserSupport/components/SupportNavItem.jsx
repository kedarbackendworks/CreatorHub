"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Headset } from 'lucide-react';
import { useNotifications as useModerationNotifications } from '@/Moderation/hooks/useNotifications';

export default function SupportNavItem({
  role,
  className = '',
  iconClassName = 'w-5 h-5 stroke-[1.5]',
  labelClassName = '',
  activeClassName = '',
  inactiveClassName = '',
}) {
  const pathname = usePathname();
  const { notifications } = useModerationNotifications();

  const href = role === 'creator' ? '/creator/support' : '/user/support';
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const hasUnreadResponse = notifications.some(
    (notification) =>
      !notification?.isRead &&
      notification?.type === 'report_update' &&
      notification?.metadata?.event === 'ticket_responded'
  );

  const resolvedClassName = `${className} ${isActive ? activeClassName : inactiveClassName}`.trim();

  return (
    <Link href={href} className={resolvedClassName}>
      <span className="relative inline-flex">
        <Headset className={iconClassName} />
        {hasUnreadResponse ? (
          <span className="absolute -right-1 -top-1 inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
        ) : null}
      </span>
      <span className={labelClassName || undefined}>Support</span>
    </Link>
  );
}
