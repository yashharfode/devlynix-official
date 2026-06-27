"use client";

import { useState, useTransition } from "react";
import { updateProjectSubmissionDisplay } from "../hall-of-fame/actions";

export function ProjectDisplayForm({ projectId, initialThumbnail, initialCategory }: { projectId: string, initialThumbnail: string | null, initialCategory: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const thumbnail = formData.get("thumbnail_url") as string;
    const category = formData.get("category") as string;

    startTransition(async () => {
      try {
        await updateProjectSubmissionDisplay(projectId, thumbnail, category);
        setIsOpen(false);
      } catch (err) {
        alert("Failed to update display settings.");
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
      >
        Edit Display Settings
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-[#111] p-4 rounded-xl border border-white/5 w-full max-w-sm">
      <div className="space-y-1">
        <label className="text-[10px] text-gray-500 uppercase tracking-widest">Thumbnail URL</label>
        <input 
          name="thumbnail_url" 
          defaultValue={initialThumbnail || ""} 
          type="url" 
          placeholder="https://..." 
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50" 
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-gray-500 uppercase tracking-widest">Category Badge</label>
        <input 
          name="category" 
          defaultValue={initialCategory || "🏆 Hackathon Winner"} 
          type="text" 
          placeholder="e.g. 🏆 Hackathon Winner" 
          className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50" 
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button 
          type="button" 
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold hover:bg-blue-500/30 transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
