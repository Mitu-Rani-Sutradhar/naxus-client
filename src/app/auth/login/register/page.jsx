"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name (min 2 characters)"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function getErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Choose a stronger password (at least 6 characters).";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    default:
      return "Something went wrong while creating your account. Please try again.";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const passwordValue = watch("password", "");

  const passwordStrength = (() => {
    if (!passwordValue) return 0;
    let score = 0;
    if (passwordValue.length >= 6) score++;
    if (passwordValue.length >= 10) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/\d/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][passwordStrength] || "";
  const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500", "bg-emerald-400"][passwordStrength] || "";
  const strengthTextColor = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-emerald-400", "text-emerald-300"][passwordStrength] || "";

  async function onSubmit(values) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await registerWithEmail(values.name, values.email, values.password);
      router.push("/");
    } catch (err) {
      setServerError(getErrorMessage(err?.code ?? ""));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0e1a] px-4 py-12">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-700/20 blur-[120px]" />
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Start in less than a minute. No credit card required.
          </p>

          {/* Error */}
          {serverError && (
            <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                {...register("name")}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min 6 chars, 1 uppercase, 1 number"
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
              {/* Strength bar */}
              {passwordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColor : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${strengthTextColor}`}>{strengthLabel}</p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Confirm password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" /> Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-violet-400 transition-colors hover:text-violet-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          By creating an account, you agree to our{" "}
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
