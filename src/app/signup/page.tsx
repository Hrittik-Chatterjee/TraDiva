"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { MoirangPheePattern } from "@/components/shared/manipuri-patterns";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to sign up. Please try again.");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-canvas flex-1 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow font-sans text-2xl font-bold tracking-tighter text-primary shadow-sm border border-light-pink">
            TD
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-ink">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-steel">
          Join TraDiva to track orders and save your shipping details.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-canvas py-8 px-4 border border-light-pink rounded-3xl shadow-sm sm:px-10 overflow-hidden relative">
          <MoirangPheePattern height={8} className="absolute top-0 left-0 right-0 bg-canvas" />
          
          <form onSubmit={handleSignup} className="space-y-6 mt-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hrittik Chatterjee"
                className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. you@example.com"
                className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-stone mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-md border border-light-pink bg-transparent text-sm focus:border-dark-pink focus:outline-none"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl border border-brand-red bg-brand-red/10 text-xs font-semibold text-brand-red-dark">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary hover:bg-dark-pink transition-all active:scale-[0.98] disabled:bg-stone disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 border-t border-lightest-pink pt-6 text-center text-xs">
            <span className="text-stone">Already have an account? </span>
            <Link href="/login" className="font-semibold text-brand-blue hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
