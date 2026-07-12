"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsLoading(provider);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setErrorMsg("Failed to sign in with " + provider + ". Please try again.");
      setIsLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading("email");
    setErrorMsg("");
    setSuccessMsg("");

    if (isSignUp) {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          setErrorMsg("User already exists. Please sign in instead.");
        } else {
          setSuccessMsg("Check your email for the confirmation link!");
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/hub");
      }
    }
    setIsLoading(null);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "60px 60px",
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6 p-8 bg-[#111111] border border-white/10 rounded-3xl shadow-2xl">
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src="https://i.ibb.co/HDHsqdqL/1000100954.png"
            alt="Devlynix"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isSignUp ? "Join Devlynix." : "Welcome back, Builder."}
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-1">
              {isSignUp ? "Create an account to access the hub." : "Sign in to access your hub."}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="w-full bg-red-900/20 border border-red-500/50 text-red-500 text-xs p-3 rounded-xl font-mono text-center">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="w-full bg-emerald-900/20 border border-emerald-500/50 text-emerald-500 text-xs p-3 rounded-xl font-mono text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col w-full gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors text-sm"
              placeholder="builder@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading !== null}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C6FF00] px-4 py-3 text-sm font-bold text-black transition-all hover:bg-[#d4ff33] disabled:opacity-50 shadow-[0_0_15px_rgba(198,255,0,0.2)]"
          >
            {isLoading === 'email' ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              isSignUp ? "Sign Up" : "Sign In"
            )}
          </button>
        </form>

        <div className="w-full flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-gray-600 font-mono">OR</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading !== null}
            type="button"
            className="flex items-center justify-center gap-3 w-full bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white py-3 rounded-xl transition-colors font-medium disabled:opacity-50 text-sm"
          >
            {isLoading === 'google' ? (
              <span className="w-4 h-4 border-2 border-[#C6FF00] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthSignIn('github')}
            disabled={isLoading !== null}
            type="button"
            className="flex items-center justify-center gap-3 w-full bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white py-3 rounded-xl transition-colors font-medium disabled:opacity-50 text-sm"
          >
            {isLoading === 'github' ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            )}
            Continue with GitHub
          </button>
        </div>

        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-gray-500 hover:text-white transition-colors"
          type="button"
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>

        <p className="text-xs text-gray-700 font-mono flex items-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulse inline-block" />
          Secured for Engineers · Devlynix {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
