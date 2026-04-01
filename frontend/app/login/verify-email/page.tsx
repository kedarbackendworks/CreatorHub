'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VerifyEmail from '../VerifyEmail';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return <VerifyEmail initialEmail={email} />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f4f1] flex items-center justify-center italic text-slate-500">Loading...</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
