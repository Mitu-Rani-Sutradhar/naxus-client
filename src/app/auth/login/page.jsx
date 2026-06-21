"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function getErrorMessage(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email and password don't match our records.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    default:
      return "Something went wrong while signing in. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, loginWithDemo } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoFilled, setDemoFilled] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function handleDemoLogin() {
    setServerError(null);
    setDemoFilled(true);
    setDemoLoading(true);
    setValue("email", "demo@naxusai.app");
    setValue("password", "Demo@12345");
    try {
      await loginWithDemo();
      router.push("/");
    } catch {
      setServerError("Demo sign-in is unavailable right now. Please try again shortly.");
    } finally {
      setDemoLoading(false);
    }
  }

  async function onSubmit(values) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await loginWithEmail(values.email, values.password);
      router.push("/");
    } catch (err) {
      setServerError(getErrorMessage(err?.code ?? ""));
    } finally {
      setIsSubmitting(false);
    }
  }

  const anyLoading = isSubmitting || demoLoading;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0e1a] px-4 py-12">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-700/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              N
            </span>
            <span className="text-2xl font-bold tracking-tight text-white">
              Naxus<span className="text-violet-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to continue to your dashboard.
          </p>

          {/* Demo button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={anyLoading}
            className="mt-6 w-full rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 px-4 py-3 text-sm font-semibold text-violet-300 transition-all hover:border-violet-500/70 hover:from-violet-600/30 hover:to-indigo-600/30 hover:text-violet-200 disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              {demoLoading ? (
                <><Spinner className="h-4 w-4" /> Signing in…</>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Try Demo Account
                  <span className="rounded-md border border-violet-500/30 bg-violet-500/20 px-1.5 py-0.5 text-xs font-medium text-violet-300">
                    Auto-fill
                  </span>
                </>
              )}
            </span>
          </button>

          {/* Error */}
          {serverError && (
            <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wider text-slate-500">or sign in with email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-violet-400 transition-colors hover:text-violet-300 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {demoFilled && (
              <p className="flex items-center gap-1 text-xs text-violet-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Demo credentials auto-filled
              </p>
            )}

            <button
              type="submit"
              disabled={anyLoading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" /> Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/login/register" className="font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-slate-500 underline hover:text-slate-400">Terms</Link>{" "}
          &amp;{" "}
          <Link href="/privacy" className="text-slate-500 underline hover:text-slate-400">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function Spinner({ className = "h-4 w-4" }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
