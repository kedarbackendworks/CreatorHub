"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyCreatorAppealRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/appeal');
  }, [router]);

  return null;
}
