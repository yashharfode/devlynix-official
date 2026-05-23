import { auth } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { Terminal, Calendar, Users, Trophy, Building2, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function HackathonsPage() {
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });
  const client = createClerkSupabaseClient(token!);
  
  const { data: hackathons, error } = await client
    .from('hackathons')
    .select('*')
    .eq('approval_status', 'APPROVED')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hackathons:', error);
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-[#C6FF00]/10 rounded-2xl mb-2">
            <Terminal className="w-8 h-8 text-[#C6FF00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Active Hackathons</h1>
          <p className="text-[#B3B4BD] text-lg max-w-2xl mx-auto">
            Discover and participate in top-tier hackathons. Build alongside the top 1% of developers globally.
          </p>
        </div>

        {/* Hackathons Grid */}
        {hackathons && hackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <SpotlightCard key={hackathon.id} className="p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-[#B3B4BD] font-mono">{hackathon.organization_name}</div>
                      {hackathon.is_featured && (
                        <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded uppercase mt-0.5 w-fit">
                          <Sparkles className="w-3 h-3" /> Featured
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-mono px-2 py-1 bg-white/5 rounded border border-white/10 text-gray-300">
                    {hackathon.mode}
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold text-white line-clamp-1">{hackathon.title}</h3>
                  <p className="text-sm text-[#B3B4BD] line-clamp-2 min-h-[40px]">{hackathon.tagline}</p>
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <Calendar className="w-4 h-4 text-[#C6FF00]" />
                      {new Date(hackathon.start_date).toLocaleDateString()} - {new Date(hackathon.end_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <Trophy className="w-4 h-4 text-[#C6FF00]" />
                      {hackathon.prize_pool}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <Users className="w-4 h-4 text-[#C6FF00]" />
                      Max Team: {hackathon.max_team_size}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-[#C6FF00] transition-colors flex items-center justify-center gap-2">
                    View Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0A0A0A] rounded-3xl border border-white/5">
            <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No active hackathons</h3>
            <p className="text-[#B3B4BD]">Check back later for new opportunities.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 bg-gradient-to-br from-[#C6FF00]/10 to-black border border-[#C6FF00]/20 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-[#C6FF00]/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Want to hire top 1% developers?</h2>
            <p className="text-[#B3B4BD] text-lg max-w-xl mx-auto">
              Launch your own hackathon on Devlynix and get thousands of elite builders working on your technology.
            </p>
            <Link href="/host" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C6FF00] text-black font-bold hover:bg-[#C6FF00]/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(198,255,0,0.3)]">
              Host a Hackathon on Devlynix <Building2 className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
