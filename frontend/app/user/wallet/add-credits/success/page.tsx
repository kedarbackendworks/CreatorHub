import React from 'react';
import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';

type SuccessPageProps = {
  searchParams: Promise<{
    amount?: string;
    tax?: string;
    total?: string;
  }>;
};

export default async function AddCreditsSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const rawAmount = Number(params.amount);
  const amount = Number.isFinite(rawAmount) ? rawAmount : 80;
  const rawTax = Number(params.tax);
  const tax = Number.isFinite(rawTax) ? rawTax : 2;
  const rawTotal = Number(params.total);
  const total = Number.isFinite(rawTotal) ? rawTotal : amount + tax;

  const formatMoney = (value: number) => `$ ${Number.isFinite(value) ? value : 0}`;

  return (
    <div className="bg-[var(--bg,#f6f4f1)] min-h-screen w-full flex relative items-center justify-center overflow-x-hidden p-[42px] sm:p-[20px]">
      <div className="flex flex-col gap-[42px] items-center w-full max-w-[775px]">
        {/* Header Section */}
        <div className="flex flex-col gap-[16px] items-center w-full">
          <div className="flex gap-[8px] items-center justify-center w-full">
            <BadgeCheck className="size-[60px] text-[#059669]" />
            <h1 className="font-[family-name:var(--font-fjalla)] font-normal text-[48px] leading-[67.9px] tracking-[0.96px] text-[var(--heading,#1a1a1a)] text-center whitespace-nowrap">
              Payment Successful
            </h1>
          </div>
          
          <p className="font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px] text-[var(--sub-head,#3a3a3a)] text-center w-full max-w-[932px]">
            Your subscription has been activated and your access has been upgraded. You can now explore the full content library and premium features without limits. A payment confirmation and invoice have been sent to your registered email address.
          </p>
          
          <p className="font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px] text-[var(--sub-head,#3a3a3a)] text-center whitespace-nowrap">
            If you notice any billing issues or access problems, our support team is ready to help you quickly. Contact Support: <span className="text-[#f95c4b]">support@yourdomain.com</span>
          </p>
        </div>

        {/* Invoice Summary Box */}
        <div className="flex flex-col gap-[16px] items-start w-full max-w-[775px]">
          <div className="flex flex-col gap-[12px] items-start w-[324px]">
            <p className="font-[family-name:var(--font-figtree)] font-semibold text-[19px] leading-[29.2px] tracking-[0.38px] text-[#404040]">
              Adding credit to my wallet
            </p>
            <div className="flex items-center flex-nowrap whitespace-nowrap leading-[0]">
              <span className="font-[family-name:var(--font-fjalla)] font-normal text-[33px] leading-[48.6px] tracking-[0.66px] text-[#121212]">${amount}</span>
              <span className="font-[family-name:var(--font-figtree)] font-light text-[32px] leading-normal text-[#8a8a8a] ml-1 mr-1">/</span>
              <span className="font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px] text-[#8a8a8a] mt-2">month</span>
            </div>
          </div>

          <div className="flex flex-col gap-[16px] items-start w-full">
            <div className="flex flex-col gap-[8px] items-start pb-[20px] w-full border-b-[0.7px] border-b-[#ccc]">
              <div className="flex flex-col gap-[8px] items-start w-full">
                <div className="flex items-center justify-between w-full font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px] text-[var(--sub-head,#3a3a3a)]">
                  <span>Content name / event name</span>
                  <span className="font-bold">{formatMoney(amount)}</span>
                </div>
                <div className="flex items-center justify-between w-full font-[family-name:var(--font-figtree)] font-medium text-[13px] leading-[18.3px] tracking-[0.26px] text-[var(--place-holder,#9a9a9a)]">
                  <span>Billed monthly</span>
                  <span>{formatMoney(amount)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full font-[family-name:var(--font-figtree)] font-medium text-[16px] leading-[25.8px] tracking-[0.32px]">
                <span className="text-[var(--sub-head,#3a3a3a)]">Tax</span>
                <span className="font-bold text-[#272727]">{formatMoney(tax)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between w-full font-[family-name:var(--font-figtree)] font-bold text-[19px] leading-[29.2px] tracking-[0.38px] text-[var(--heading,#1a1a1a)]">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/user/wallet" className="w-full mt-2">
          <div className="bg-[var(--cta,#f95c4b)] hover:bg-[#e05243] transition-colors flex h-[40px] items-center justify-center px-[16px] py-[8px] rounded-[40px] w-full max-w-[775px]">
            <span className="font-[family-name:var(--font-figtree)] font-bold text-[16px] leading-[25.8px] tracking-[0.32px] text-white">
              Go to wallet page
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
