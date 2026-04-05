"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, ChevronDown, Loader2 } from 'lucide-react';
import api from '@/src/lib/api';
import { useAuthStore } from '@/src/store/useAuthStore';
import toast from 'react-hot-toast';
import CaptchaChallenge from '@/src/components/common/CaptchaChallenge';

const getInitials = (name?: string, email?: string) => {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  return email?.[0]?.toUpperCase() || 'U';
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
    return response?.data?.message || response?.data?.error || fallback;
  }

  return fallback;
};

export default function SettingsAccountTab() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [displayName, setDisplayName] = useState(user?.name || '');
  const [country, setCountry] = useState(user?.countryOfResidence || 'All courses');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaRefreshNonce, setCaptchaRefreshNonce] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayName(user?.name || '');
    setAvatarPreview(user?.avatar || '');
    setCountry(user?.countryOfResidence || 'All courses');
  }, [user?.name, user?.avatar, user?.countryOfResidence]);

  useEffect(() => {
    if (resetCooldown <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setResetCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resetCooldown]);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const initials = useMemo(
    () => getInitials(displayName || user?.name, user?.email),
    [displayName, user?.name, user?.email]
  );

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return previewUrl;
    });
  };

  const handleSaveChanges = async () => {
    if (!user?._id) {
      toast.error('Please log in to update your profile');
      return;
    }

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      toast.error('Display name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('countryOfResidence', country);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await api.put('/user/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(res.data);
      setAvatarFile(null);
      setAvatarPreview(res.data.avatar || '');
      setCountry(res.data.countryOfResidence || 'All courses');
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error('No email found for this account');
      return;
    }

    if (captchaRequired && !captchaToken) {
      toast.error('Please complete the security check');
      return;
    }

    setIsSendingReset(true);
    setResetCooldown(60);
    try {
      await api.post('/auth/forgot-password', { email: user.email, captchaToken });
      setCaptchaToken('');
      setCaptchaRefreshNonce((prev) => prev + 1);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to send password reset link');
      if (String(message).toLowerCase().includes('captcha')) {
        setCaptchaToken('');
        setCaptchaRefreshNonce((prev) => prev + 1);
      }
      toast.error(message);
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="flex flex-col gap-[24px] w-full max-w-[760px]">
      {/* Profile Information */}
      <div className="bg-[#faf8f5] border border-[var(--alt-sec,#e4ded2)] rounded-[12px] p-[24px] flex flex-col gap-[16px]">
        <p className="font-[family-name:var(--font-figtree)] font-bold text-[16px] text-[var(--heading,#1a1a1a)]">
          Profile Information
        </p>

        {/* Avatar */}
        <div className="relative w-fit group">
          <div className="size-[88px] rounded-full bg-[#9a9a9a] overflow-hidden flex items-center justify-center">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="font-[family-name:var(--font-figtree)] font-bold text-[24px] text-white">{initials}</span>
            )}
          </div>
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 size-[28px] bg-white border border-[#e4ded2] rounded-full flex items-center justify-center shadow-sm hover:bg-[#f6f4f1] transition-colors opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <Camera className="size-[14px] text-[#757575]" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Display Name */}
        <div className="flex flex-col gap-[6px]">
          <label className="font-[family-name:var(--font-figtree)] font-semibold text-[14px] text-[var(--heading,#1a1a1a)]">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="w-full h-[44px] px-[16px] bg-white border border-[var(--alt-sec,#e4ded2)] rounded-[8px] font-[family-name:var(--font-figtree)] font-medium text-[14px] text-[var(--heading,#1a1a1a)] outline-none focus:border-[var(--cta,#f95c4b)] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-[6px]">
          <label className="font-[family-name:var(--font-figtree)] font-semibold text-[14px] text-[var(--heading,#1a1a1a)]">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            readOnly
            className="w-full h-[44px] px-[16px] bg-[#f6f4f1] border border-[var(--alt-sec,#e4ded2)] rounded-[8px] font-[family-name:var(--font-figtree)] font-medium text-[14px] text-[#757575] outline-none cursor-not-allowed"
          />
        </div>

        {/* Country of residence */}
        <div className="flex flex-col gap-[6px]">
          <label className="font-[family-name:var(--font-figtree)] font-semibold text-[14px] text-[var(--heading,#1a1a1a)]">
            Country of residence
          </label>
          <div className="relative">
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full h-[44px] px-[16px] pr-[40px] bg-white border border-[var(--alt-sec,#e4ded2)] rounded-[8px] font-[family-name:var(--font-figtree)] font-medium text-[14px] text-[var(--heading,#1a1a1a)] outline-none focus:border-[var(--cta,#f95c4b)] transition-colors appearance-none cursor-pointer"
            >
              <option>All courses</option>
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
            <ChevronDown className="absolute right-[12px] top-1/2 -translate-y-1/2 size-[16px] text-[#757575] pointer-events-none" />
          </div>
        </div>

        <div className="flex justify-end pt-[8px]">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="h-[44px] px-[32px] bg-[var(--cta,#f95c4b)] rounded-[32px] font-[family-name:var(--font-figtree)] font-bold text-[16px] text-white hover:bg-[#e8503f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-[8px]">
                <Loader2 className="size-[16px] animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Reset Password */}
      <div className="bg-[#faf8f5] border border-[var(--alt-sec,#e4ded2)] rounded-[12px] p-[24px] flex flex-col gap-[12px]">
        <p className="font-[family-name:var(--font-figtree)] font-bold text-[16px] text-[var(--heading,#1a1a1a)]">
          Reset password
        </p>
        <p className="font-[family-name:var(--font-figtree)] font-medium text-[14px] leading-[22px] text-[#757575]">
          If you have forgot password for your account and want to change it , click on this button to receive the recovery link in your email.
        </p>
        <CaptchaChallenge
          onTokenChange={setCaptchaToken}
          onRequirementChange={setCaptchaRequired}
          refreshNonce={captchaRefreshNonce}
        />
        <button
          type="button"
          onClick={handleResetPassword}
          disabled={isSendingReset || resetCooldown > 0}
          className="w-fit px-[20px] py-[8px] bg-transparent border border-[var(--alt-sec,#e4ded2)] rounded-[8px] font-[family-name:var(--font-figtree)] font-semibold text-[14px] text-[var(--heading,#1a1a1a)] hover:bg-[#f6f4f1] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSendingReset ? 'Sending...' : resetCooldown > 0 ? `Reset Password (${resetCooldown}s)` : 'Reset Password'}
        </button>
      </div>

      {/* Logged in with this account */}
      <div className="bg-[#faf8f5] border border-[var(--alt-sec,#e4ded2)] rounded-[12px] p-[24px] flex flex-col gap-[12px]">
        <p className="font-[family-name:var(--font-figtree)] font-bold text-[16px] text-[var(--heading,#1a1a1a)]">
          Logged in with this account
        </p>
        <div className="flex items-center gap-[12px] py-[8px]">
          {avatarPreview ? (
            <div className="size-[36px] rounded-full bg-[#9a9a9a] overflow-hidden flex items-center justify-center shrink-0">
              <img src={avatarPreview} alt="Account avatar" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="size-[36px] rounded-full bg-[#9a9a9a] flex items-center justify-center shrink-0">
              <span className="font-[family-name:var(--font-figtree)] font-bold text-[14px] text-white">{initials}</span>
            </div>
          )}
          <p className="font-[family-name:var(--font-figtree)] font-medium text-[14px] text-[var(--heading,#1a1a1a)] flex-1">
            {user?.email || 'No account email'}
          </p>
          <button
            type="button"
            onClick={logout}
            className="font-[family-name:var(--font-figtree)] font-medium text-[14px] text-[#757575] hover:text-[var(--heading,#1a1a1a)] transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
