"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialName: string;
  userEmail: string;
}

export default function ProfileForm({ initialName, userEmail }: ProfileFormProps) {
  const router = useRouter();

  // Name form state
  const [name, setName] = useState(initialName);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setNameLoading(true);
    setNameSuccess(false);
    setNameError(null);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        setNameError(error.message || "Failed to update profile name.");
      } else {
        setNameSuccess(true);
        router.refresh(); // Refresh page to propagate new name to layout/navbar
      }
    } catch (err: any) {
      setNameError(err.message || "An unexpected error occurred.");
    } finally {
      setNameLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassLoading(true);
    setPassSuccess(false);
    setPassError(null);

    if (newPassword !== confirmPassword) {
      setPassError("New password and confirmation do not match.");
      setPassLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPassError("New password must be at least 8 characters long.");
      setPassLoading(false);
      return;
    }

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setPassError(error.message || "Password update failed. Confirm current password.");
      } else {
        setPassSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setPassError(err.message || "An unexpected error occurred.");
    } finally {
      setPassLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Edit Profile Name */}
      <div className="border border-light-pink p-6 md:p-8 rounded-3xl bg-canvas space-y-6">
        <h3 className="text-lg font-bold text-ink flex items-center gap-2">
          <span>👤</span> Personal Information
        </h3>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
              Email Address (Login ID)
            </label>
            <input
              type="email"
              id="email"
              disabled
              value={userEmail}
              className="w-full h-10 px-3 rounded-md border border-light-pink bg-lightest-pink/30 text-stone text-sm cursor-not-allowed outline-none"
            />
            <p className="text-[10px] text-stone mt-1">To ensure security, contact support if you need to update your email.</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Recipient Full Name"
              className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
            />
          </div>

          {nameError && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600">
              ⚠️ {nameError}
            </div>
          )}

          {nameSuccess && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-600">
              🎉 Name updated successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={nameLoading || name.trim() === initialName}
            className="w-full h-10 inline-flex items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98] disabled:bg-stone/50 disabled:cursor-not-allowed cursor-pointer"
          >
            {nameLoading ? "Updating Details..." : "Save Profile Details"}
          </button>
        </form>
      </div>

      {/* Edit Password */}
      <div className="border border-light-pink p-6 md:p-8 rounded-3xl bg-canvas space-y-6">
        <h3 className="text-lg font-bold text-ink flex items-center gap-2">
          <span>🔒</span> Security & Credentials
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
              New Password (Min 8 chars)
            </label>
            <input
              type="password"
              id="newPassword"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
            />
          </div>

          {passError && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600">
              ⚠️ {passError}
            </div>
          )}

          {passSuccess && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-600">
              🎉 Password changed successfully! Other sessions logged out.
            </div>
          )}

          <button
            type="submit"
            disabled={passLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full h-10 inline-flex items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98] disabled:bg-stone/50 disabled:cursor-not-allowed cursor-pointer"
          >
            {passLoading ? "Updating Credentials..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
