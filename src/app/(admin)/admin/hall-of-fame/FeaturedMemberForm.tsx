"use client";

import { useTransition } from "react";
import { addFeaturedMember, editFeaturedMember } from "./actions";
import { Star, Link as LinkIcon, Image, Type, Users, Trophy } from "lucide-react";
import toast from "react-hot-toast";

type FeaturedMember = {
  id: string;
  name: string;
  avatar_url: string;
  social_url: string | null;
  achievement_title: string;
  category: string;
  project_name: string | null;
  project_description: string | null;
  thumbnail_url: string;
  demo_url: string | null;
  github_url: string | null;
  event_name: string | null;
};

export function FeaturedMemberForm({ initialData, onSuccess, onCancel }: { initialData?: FeaturedMember, onSuccess?: () => void, onCancel?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isEditing) {
          await editFeaturedMember(initialData.id, formData);
          toast.success("Featured Member successfully updated!");
        } else {
          await addFeaturedMember(formData);
          (e.target as HTMLFormElement).reset();
          toast.success("Featured Member successfully added to Hall of Fame!");
        }
        onSuccess?.();
      } catch (err: any) {
        toast.error(`Failed to ${isEditing ? 'update' : 'add'}: ` + (err.message || String(err)));
      }
    });
  };

  return (
    <div className={`bg-[#0A0A0A] border border-[#111] rounded-3xl p-8 ${!isEditing ? 'shadow-2xl mt-8' : ''}`}>
      {!isEditing && <h2 className="text-xl font-bold text-white mb-6">Add New Entry</h2>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4" /> Member Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Name / Username *</label>
              <input required name="name" defaultValue={initialData?.name} type="text" placeholder="e.g. John Doe or @johndoe" className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Avatar Image URL *</label>
              <div className="relative">
                <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input required name="avatar_url" defaultValue={initialData?.avatar_url} type="url" placeholder="https://..." className="w-full bg-[#111] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Social Link (Optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input name="social_url" defaultValue={initialData?.social_url || ""} type="url" placeholder="https://github.com/..." className="w-full bg-[#111] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-[#111]" />

        {/* Achievement Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Achievement / Badge
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Badge Category *</label>
              <input required name="category" defaultValue={initialData?.category} type="text" placeholder="e.g. 🌟 Community MVP, 🏆 Hackathon Winner" className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Achievement Title *</label>
              <input required name="achievement_title" defaultValue={initialData?.achievement_title} type="text" placeholder="e.g. Top Open Source Contributor" className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Event / Context Name (Optional)</label>
              <input name="event_name" defaultValue={initialData?.event_name || ""} type="text" placeholder="e.g. Summer Buildathon 2026 or Devlynix Community" className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
          </div>
        </div>

        <hr className="border-[#111]" />

        {/* Project Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
            <Type className="w-4 h-4" /> Project / Showcase (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-gray-400">Project Thumbnail Image URL * (Required for Grid UI)</label>
              <div className="relative">
                <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input required name="thumbnail_url" defaultValue={initialData?.thumbnail_url} type="url" placeholder="https://..." className="w-full bg-[#111] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Project Name</label>
              <input name="project_name" defaultValue={initialData?.project_name || ""} type="text" placeholder="e.g. Next.js Boilerplate" className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Project Description</label>
              <input name="project_description" defaultValue={initialData?.project_description || ""} type="text" placeholder="Short description..." className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Live Demo URL</label>
              <input name="demo_url" defaultValue={initialData?.demo_url || ""} type="url" placeholder="https://..." className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">GitHub Repo URL</label>
              <input name="github_url" defaultValue={initialData?.github_url || ""} type="url" placeholder="https://github.com/..." className="w-full bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          {isEditing && (
            <button 
              type="button" 
              onClick={onCancel}
              className="text-gray-400 hover:text-white font-bold py-3 px-6 transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-amber-500 text-black font-bold py-3 px-8 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {isPending ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Entry" : "Add to Hall of Fame")}
          </button>
        </div>
      </form>
    </div>
  );
}
