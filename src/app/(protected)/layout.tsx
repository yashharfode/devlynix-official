"use client";

import React, { useEffect, useState } from 'react';
import { Zap, LogOut } from 'lucide-react';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import { mockAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { extractUsernameFromUrl, fetchGithubProfile } from '@/lib/github';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollDirection = useScrollDirection();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string>("https://i.pravatar.cc/150");

  useEffect(() => {
    const localProfile = mockAuth.getProfile();
    if (localProfile) {
      setProfile(localProfile);
      
      const loadAvatar = async () => {
        const username = extractUsernameFromUrl(localProfile.githubUrl);
        if (username) {
          const user: any = await fetchGithubProfile(username);
          if (user?.avatar_url) {
            setAvatar(user.avatar_url);
          }
        }
      };
      loadAvatar();
    }
  }, []);

  const handleLogout = () => {
    mockAuth.logout();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#030303]">
      <nav className={`fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-2xl transition-transform duration-500 ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/hub')}>
            <img src="https://i.ibb.co/HDHsqdqL/1000100954.png" alt="Devlynix" className="h-8 w-8 object-contain transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold tracking-tight text-white">Devlynix</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-white">{profile ? profile.fullName.split(' ')[0] : 'Builder'}</span>
                <span className="text-xs text-[#C6FF00] flex items-center gap-1"><Zap className="w-3 h-3"/> 14 Day Streak</span>
              </div>
              <img 
                src={avatar} 
                className="w-10 h-10 rounded-full border-2 border-[#C6FF00] object-cover" 
                alt="User Avatar" 
              />
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-lg hover:bg-white/5"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
