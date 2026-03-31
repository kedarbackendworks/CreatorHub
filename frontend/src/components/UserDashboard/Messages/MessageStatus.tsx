import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export type Status = 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';

export default function MessageStatus({ status }: { status: Status }) {
  if (status === 'sending') {
    return <Clock className="w-3 h-3 text-[#aaa]" />;
  }

  if (status === 'failed') {
    return <AlertCircle className="w-3 h-3 text-[#f95c4b]" />;
  }

  if (status === 'sent') {
    return (
      <span className="flex items-center">
        <Check className="w-3 h-3 text-[#aaa]" strokeWidth={2.5} />
      </span>
    );
  }

  if (status === 'delivered') {
    return (
      <span className="flex items-center -space-x-1.5">
        <Check className="w-3 h-3 text-[#aaa]" strokeWidth={2.5} />
        <Check className="w-3 h-3 text-[#aaa]" strokeWidth={2.5} />
      </span>
    );
  }

  if (status === 'seen') {
    return (
      <span className="flex items-center -space-x-1.5">
        <Check className="w-3 h-3 text-[#f95c4b]" strokeWidth={2.5} />
        <Check className="w-3 h-3 text-[#f95c4b]" strokeWidth={2.5} />
      </span>
    );
  }

  return null;
}
