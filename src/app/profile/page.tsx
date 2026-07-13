import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/storefront/ProfileForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile Settings | TraDiva",
  description: "Manage your personal details, shipping address information, and security credentials.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const { user } = session;
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-canvas py-12 px-6 md:px-8 flex-1 flex flex-col justify-center">
      <div className="mx-auto max-w-5xl w-full space-y-8">
        {/* Profile Welcome Header */}
        <div className="border border-light-pink rounded-3xl bg-canvas overflow-hidden shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative">
          <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-brand-yellow font-sans text-3xl font-black text-primary flex items-center justify-center shadow-sm select-none">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left space-y-1.5">
            <span className="text-xs font-bold text-dark-pink uppercase tracking-widest bg-lightest-pink border border-light-pink px-3 py-1 rounded-full inline-block">
              {user.role === "admin" ? "👑 Admin Profile" : "✨ Customer Profile"}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs text-stone">
              Account member since <span className="font-semibold text-steel">{joinDate}</span>
            </p>
          </div>
        </div>

        {/* Update Form (Name, Password change) */}
        <ProfileForm initialName={user.name} userEmail={user.email} />
      </div>
    </div>
  );
}
