"use client";

import React from 'react';
import { LayoutDashboard, Zap } from 'lucide-react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import { UserButton, SignedIn } from "@clerk/nextjs";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollDirection = useScrollDirection();

  return (
    <div className="flex min-h-screen flex-col bg-[#030303]">
      <nav className={`fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-2xl transition-transform duration-500 ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-white">Devlynix</span>
          </div>
          
          <div className="flex items-center gap-8">
            <SignedIn>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-white">Builder</span>
                  <span className="text-xs text-[#C6FF00] flex items-center gap-1"><Zap className="w-3 h-3"/> 14 Day Streak</span>
                </div>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
