import { prisma } from "@/lib/prisma";
import { Trophy, Medal, Star, Zap, Users, Briefcase, ExternalLink, GitBranch, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default async function HallOfFamePage() {
  // Fetch top 50 users ranked by XP
  const topUsers = await prisma.user.findMany({
    take: 50,
    orderBy: [
      { xp: "desc" },
      { streak_days: "desc" }
    ],
    select: {
      id: true,
      username: true,
      builder_level: true,
      xp: true,
      streak_days: true,
      clerk_user_id: true,
    }
  });

  // Fetch winning projects from platform
  const winningProjects = await prisma.projectSubmission.findMany({
    where: { is_winner: true },
    include: { user: true }
  });

  // Fetch manual featured members
  const featuredMembers = await prisma.featuredMember.findMany();

  // Unify them into a single array
  const allFeatures = [
    ...winningProjects.map(p => ({
      id: p.id,
      name: p.user?.username || 'Unknown',
      avatar_url: null, // We'll fallback to a generic avatar
      social_url: p.user?.github_url || null,
      achievement_title: p.title,
      category: p.category || "🏆 Hackathon Winner",
      project_name: p.title,
      project_description: p.description,
      thumbnail_url: p.thumbnail_url,
      demo_url: p.demo_url,
      github_url: p.github_url,
      event_name: null,
      date_achieved: p.created_at,
      isPlatformUser: true,
      userObj: p.user
    })),
    ...featuredMembers.map(m => ({
      id: m.id,
      name: m.name,
      avatar_url: m.avatar_url,
      social_url: m.social_url,
      achievement_title: m.achievement_title,
      category: m.category,
      project_name: m.project_name,
      project_description: m.project_description,
      thumbnail_url: m.thumbnail_url,
      demo_url: m.demo_url,
      github_url: m.github_url,
      event_name: m.event_name,
      date_achieved: m.date_achieved,
      isPlatformUser: false,
      userObj: null
    }))
  ].sort((a, b) => new Date(b.date_achieved).getTime() - new Date(a.date_achieved).getTime());

  return (
    <div className="bg-[#030303] min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-16 text-center pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Trophy className="w-4 h-4" /> The Best of the Best
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Fame</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Celebrating the elite builders, top hackathon winners, and highest-ranked engineers on Devlynix.
          </p>
        </div>

        {/* Featured Grid Section */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-amber-500" fill="currentColor" />
            <h2 className="text-3xl font-black text-white tracking-tight">Featured Members</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.length === 0 ? (
              <div className="col-span-full text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                <Briefcase className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No members featured yet</h3>
                <p className="text-gray-500">Stay tuned for the results of our upcoming events!</p>
              </div>
            ) : (
              allFeatures.map((entry) => (
                <div key={entry.id} className="group flex flex-col bg-[#0A0A0A] border border-[#111] rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                  
                  {/* Thumbnail Image */}
                  <div className="w-full h-48 bg-[#111] relative border-b border-[#111] overflow-hidden flex-shrink-0">
                    {entry.thumbnail_url ? (
                      <img src={entry.thumbnail_url} alt={entry.achievement_title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-mono">No Image</span>
                      </div>
                    )}
                    
                    {/* Glowing Category Badge overlay */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-lg shadow-xl inline-flex items-center gap-1.5">
                        {entry.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] -z-10 group-hover:bg-amber-500/10 transition-all duration-500" />
                    
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{entry.achievement_title}</h3>
                      {entry.event_name && (
                        <p className="text-amber-500/80 text-xs font-mono mt-1">{entry.event_name}</p>
                      )}
                    </div>
                    
                    {entry.project_description && (
                      <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">{entry.project_description}</p>
                    )}
                    
                    <div className="flex items-center gap-3 mb-6 mt-auto">
                      {entry.avatar_url ? (
                        <img src={entry.avatar_url} alt={entry.name} className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-xs text-white border border-white/10 shrink-0">
                          {entry.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                      
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-gray-200 block truncate">
                          {entry.isPlatformUser ? `@${entry.name}` : entry.name}
                        </span>
                        {entry.isPlatformUser && entry.userObj && (
                          <span className="text-[10px] text-emerald-500 font-mono">XP: {entry.userObj.xp.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    {(entry.demo_url || entry.github_url) && (
                      <div className="flex gap-2 pt-4 border-t border-[#111]">
                        {entry.demo_url && (
                          <a href={entry.demo_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#111] hover:bg-[#222] text-white py-2 rounded-xl text-xs font-bold transition-colors border border-white/5">
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Demo
                          </a>
                        )}
                        {entry.github_url && (
                          <a href={entry.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#111] hover:bg-[#222] text-white py-2 rounded-xl text-xs font-bold transition-colors border border-white/5">
                            <GitBranch className="w-3.5 h-3.5 text-blue-400" /> Source
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Builders Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-[#C6FF00]" fill="currentColor" />
            <h2 className="text-3xl font-black text-white tracking-tight">Top Engineers</h2>
          </div>

          <div className="bg-[#0A0A0A] border border-[#111] rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 gap-4 p-5 border-b border-[#111] bg-[#050505] text-xs font-mono text-gray-600 uppercase tracking-wider">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-5 md:col-span-4">Builder</div>
              <div className="col-span-2 text-center hidden md:block">Level</div>
              <div className="col-span-5 md:col-span-4 text-right pr-4">Total XP</div>
            </div>

            <div className="divide-y divide-[#111]">
              {topUsers.map((user, index) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-[#111]/50 transition-colors">
                  <div className="col-span-2 flex justify-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                      index === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
                      'text-gray-500 bg-[#111]'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center shrink-0 border border-white/5">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        @{user.username || 'Anonymous'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3 text-[#C6FF00]" /> {user.streak_days} days
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 hidden md:flex justify-center items-center">
                    <span className="px-3 py-1 rounded-full border border-white/5 bg-white/5 text-xs text-gray-400 font-mono">
                      {user.builder_level}
                    </span>
                  </div>

                  <div className="col-span-5 md:col-span-4 text-right pr-4 font-mono font-bold text-[#C6FF00]">
                    {user.xp.toLocaleString()}
                  </div>
                </div>
              ))}
              
              {topUsers.length === 0 && (
                <div className="p-16 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No builders ranked yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
