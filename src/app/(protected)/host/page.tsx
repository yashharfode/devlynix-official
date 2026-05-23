"use client";

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createClerkSupabaseClient } from '@/lib/supabase';
import { Building2, Calendar, Users, Trophy, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import Link from 'next/link';

export default function HostHackathonPage() {
  const { getToken } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    description: "",
    organization_name: "",
    theme: "Open Innovation",
    mode: "Online",
    start_date: "",
    end_date: "",
    prize_pool: "",
    max_team_size: 4,
  });

  const updateForm = (key: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    // Validation
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (endDate <= startDate) {
      setErrorMsg("End date must be after the start date.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) throw new Error("Authentication token not found.");
      
      const client = createClerkSupabaseClient(token);
      
      const { error } = await client.from('hackathons').insert({
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        organization_name: formData.organization_name,
        theme: formData.theme,
        mode: formData.mode,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        prize_pool: formData.prize_pool,
        max_team_size: Number(formData.max_team_size),
        // approval_status, is_featured, created_at, id will use DB defaults
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Failed to host hackathon:", err);
      setErrorMsg(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <SpotlightCard className="max-w-xl w-full p-12 text-center flex flex-col items-center border border-emerald-500/30">
          <div className="w-20 h-20 bg-[#C6FF00]/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#C6FF00]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
          <p className="text-[#B3B4BD] mb-8">
            Your hackathon "{formData.title}" has been successfully submitted and is pending admin approval. We will review the details and notify you once it goes live.
          </p>
          <Link href="/hackathons" className="px-6 py-3 bg-[#C6FF00] text-black font-bold rounded-xl hover:bg-[#C6FF00]/90 transition-colors">
            Back to Directory
          </Link>
        </SpotlightCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-white mb-4">Host a Hackathon</h1>
        <p className="text-[#B3B4BD] text-lg">
          Bring the best developers globally to build on your technology.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6FF00]/5 rounded-full blur-[80px] pointer-events-none" />
        
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <div className="space-y-8 relative z-10">
          {/* Organization & Basic Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Building2 className="w-5 h-5 text-[#C6FF00]" /> Organization Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Organization Name *</label>
                <input required type="text" value={formData.organization_name} onChange={e => updateForm('organization_name', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors"
                  placeholder="e.g. Acme Corp, SuperDAO" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Hackathon Title *</label>
                <input required type="text" value={formData.title} onChange={e => updateForm('title', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors"
                  placeholder="e.g. Global Web3 Buildathon" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Catchy Tagline *</label>
              <input required type="text" value={formData.tagline} onChange={e => updateForm('tagline', e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors"
                placeholder="A short punchy subtitle to attract builders" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Description *</label>
              <textarea required value={formData.description} onChange={e => updateForm('description', e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors h-32 resize-none"
                placeholder="Detail the problem statements, rules, and expectations..." />
            </div>
          </div>

          {/* Logistics & Theme */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-5 h-5 text-[#C6FF00]" /> Logistics & Theme
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Theme / Category *</label>
                <select required value={formData.theme} onChange={e => updateForm('theme', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors appearance-none">
                  <option value="Open Innovation">Open Innovation</option>
                  <option value="Web3 & Blockchain">Web3 & Blockchain</option>
                  <option value="AI / Machine Learning">AI / Machine Learning</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mode *</label>
                <select required value={formData.mode} onChange={e => updateForm('mode', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors appearance-none">
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates & Prizes */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Calendar className="w-5 h-5 text-[#C6FF00]" /> Timeline & Rewards
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Start Date & Time *</label>
                <input required type="datetime-local" value={formData.start_date} onChange={e => updateForm('start_date', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">End Date & Time *</label>
                <input required type="datetime-local" value={formData.end_date} onChange={e => updateForm('end_date', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors [color-scheme:dark]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#C6FF00]" /> Total Prize Pool *
                </label>
                <input required type="text" value={formData.prize_pool} onChange={e => updateForm('prize_pool', e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors"
                  placeholder="e.g. $10,000 USD" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C6FF00]" /> Max Team Size *
                </label>
                <input required type="number" min="1" max="10" value={formData.max_team_size} onChange={e => updateForm('max_team_size', Number(e.target.value))}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C6FF00] transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="px-8 py-4 bg-[#C6FF00] text-black font-bold rounded-xl hover:bg-[#C6FF00]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(198,255,0,0.3)]">
            {isSubmitting ? (
              <><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting...</>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
