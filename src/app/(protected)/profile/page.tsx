import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User, Zap, Trophy, Briefcase, GitBranch, Link2, Globe, Edit } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) redirect("/sign-in");

  const dbProfile = await prisma.user.findUnique({
    where: { auth_id: userId },
    include: { submissions: true }
  });

  const profile = dbProfile || {
    full_name: user?.user_metadata?.full_name || 'Builder',
    username: user?.user_metadata?.user_name || '',
    primary_role: 'N/A',
    builder_level: 'Initiate',
    xp: 0,
    streak_days: 0,
    bio: 'Profile not found. Please complete onboarding.',
    skills: [],
    submissions: []
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="bg-[#0A0A0A] border border-[#111] rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <User className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#111] border border-[#222] rounded-2xl flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{profile.full_name || profile.username || 'Anonymous'}</h1>
              <div className="text-gray-400 text-lg mb-2">@{profile.username}</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[#111] border border-[#222] text-xs font-mono text-gray-400">
                  {profile.primary_role || 'Hacker'}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#111] border border-[#222] text-xs font-mono text-gray-400">
                  {profile.builder_level}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex gap-4 w-full">
              <div className="flex-1 bg-[#111] rounded-2xl p-4 text-center border border-[#222] min-w-[100px]">
                <div className="text-2xl font-black text-emerald-500 mb-1 flex items-center justify-center gap-1">
                  <Trophy className="w-5 h-5" /> {profile.xp}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">XP</div>
              </div>
              <div className="flex-1 bg-[#111] rounded-2xl p-4 text-center border border-[#222] min-w-[100px]">
                <div className="text-2xl font-black text-amber-500 mb-1 flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5" /> {profile.streak_days}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">Streak</div>
              </div>
            </div>
            
            <Link 
              href="/profile/edit" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest font-mono">About</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {profile.bio || "No bio provided."}
            </p>
            
            <div className="space-y-3">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <GitBranch className="w-4 h-4" /> GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Link2 className="w-4 h-4" /> LinkedIn
                </a>
              )}
              {profile.portfolio_url && (
                <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" /> Portfolio
                </a>
              )}
            </div>
          </div>
          
          <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest font-mono">Skills</h3>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg bg-[#C6FF00]/10 text-[#C6FF00] text-xs font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills added yet.</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0A0A0A] border border-[#111] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Project Submissions</h3>
              <span className="px-3 py-1 rounded-full bg-[#111] text-gray-400 text-xs font-mono">
                {profile.submissions.length} Total
              </span>
            </div>
            
            {profile.submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Briefcase className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm">You haven't submitted any projects yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.submissions.map(sub => (
                  <div key={sub.id} className="p-4 rounded-xl border border-[#111] bg-[#050505] hover:border-gray-800 transition-colors">
                    <h4 className="font-bold text-white mb-1">{sub.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{sub.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
