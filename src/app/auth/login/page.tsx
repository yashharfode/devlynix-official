"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockAuth } from '@/lib/auth';
import { GitBranch, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      mockAuth.login({ id: 'dummy_123', email: 'builder@devlynix.com', authenticated: true });
      router.push('/onboarding');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-complex opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C6FF00]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="mb-10 flex flex-col items-center">
          <Link href="/" className="mb-6 block transition-transform hover:scale-105">
            <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix Logo" className="w-16 h-16" />
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 text-center">System Authentication</h1>
          <p className="text-gray-400 text-center text-sm font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-pulse"></span>
            Terminal Access Required
          </p>
        </div>

        <div className="bg-[#0A0A0A]/80 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-xl transition-all hover:bg-[#C6FF00] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  <GitBranch className="w-5 h-5" />
                  Authenticate with GitHub
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative bg-[#0A0A0A] px-4 text-xs font-mono text-gray-500 uppercase">
                Mock Auth Mode
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
              By authenticating, you are connecting to the Devlynix core network.
              Prepare for deployment.
            </p>
          </form>
        </div>
      </div>
      
      {/* Styles for grid */}
      <style dangerouslySetInnerHTML={{__html: `
        .bg-grid-complex {
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 10%, transparent 80%);
        }
      `}} />
    </div>
  );
}
