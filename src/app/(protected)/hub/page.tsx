"use client";

import React, { useState } from 'react';
import { FolderGit2, Trophy, Zap, Check } from 'lucide-react';
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver';
import { useUser } from '@clerk/nextjs';

export default function HubPage() {
  const { isLoaded, user } = useUser();
  useIntersectionObserver();
  const [claimedProjects, setClaimedProjects] = useState<number[]>([]);

  const activeProjects = [
    { id: 1, title: "SaaS Analytics Dashboard", tech: ["Next.js", "Tailwind", "Recharts"], difficulty: "Hard", points: 500 },
    { id: 2, title: "Real-time Chat Engine", tech: ["Node.js", "Socket.io", "Redis"], difficulty: "Medium", points: 300 },
  ];

  const claimProject = (id: number) => {
    if (!claimedProjects.includes(id)) {
      setClaimedProjects([...claimedProjects, id]);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C6FF00] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section id="hub" className="min-h-[80vh] pt-32 pb-20 bg-[#050505] relative border-b border-white/5">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#C6FF00]/5 to-transparent pointer-events-none"></div>
      
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 reveal-element">
          <div>
            <h2 className="text-4xl font-black text-white mb-2">Welcome back, {user?.firstName || 'Builder'} 🚀</h2>
            <p className="text-gray-400 text-lg">Community workspace mein aapka swagat hai.</p>
          </div>
          <div className="flex items-center gap-6 bg-[#111] border border-white/10 rounded-2xl p-4">
            <div className="text-center px-4 border-r border-white/10">
              <div className="text-2xl font-bold text-[#C6FF00]">14</div>
              <div className="text-xs text-gray-500 uppercase font-mono mt-1">Day Streak</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-white">{claimedProjects.length}</div>
              <div className="text-xs text-gray-500 uppercase font-mono mt-1">Active Bounties</div>
            </div>
          </div>
        </div>
        {/* ... rest of the content ... */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 reveal-element delay-100">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2"><FolderGit2 className="text-[#C6FF00]"/> Open Community Projects</h3>
            </div>

            <div className="grid gap-4">
              {activeProjects.map((project) => {
                const isClaimed = claimedProjects.includes(project.id);
                return (
                  <div key={project.id} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 transition-colors hover:border-white/20">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-white">{project.title}</h4>
                          {isClaimed && <span className="bg-[#C6FF00]/10 text-[#C6FF00] text-xs px-2 py-1 rounded-md font-medium border border-[#C6FF00]/20 flex items-center gap-1"><Check className="w-3 h-3"/> Claimed</span>}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map(t => <span key={t} className="text-xs bg-[#111] text-gray-300 border border-white/5 px-3 py-1 rounded-full font-mono">{t}</span>)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#C6FF00] font-bold text-lg mb-1 flex items-center justify-end gap-1"><Trophy className="w-4 h-4"/> {project.points} XP</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <button 
                        onClick={() => claimProject(project.id)}
                        disabled={isClaimed}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${isClaimed ? 'bg-[#111] text-gray-600 cursor-not-allowed' : 'bg-[#C6FF00] text-black hover:bg-[#aee600]'}`}
                      >
                        {isClaimed ? 'Workspace Created' : 'Claim Project'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8 reveal-element delay-200">
            <div className="bg-gradient-to-b from-[#111] to-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C6FF00]/10 blur-2xl rounded-full"></div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Trophy className="text-yellow-400 w-5 h-5"/> Top Builders</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold w-4 text-center ${i===1?'text-yellow-400':i===2?'text-gray-300':'text-orange-400'}`}>#{i}</span>
                      <img src={`https://i.pravatar.cc/100?img=${i+40}`} className="w-8 h-8 rounded-full border border-white/10" alt="dev"/>
                      <span className="text-sm text-gray-300">Dev_{i}</span>
                    </div>
                    <span className="text-sm font-mono text-[#C6FF00]">{5000 - (i*400)} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
