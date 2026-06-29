"use client";

import { useState, useTransition } from "react";
import { deleteFeaturedMember } from "./actions";
import { Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { FeaturedMemberForm } from "./FeaturedMemberForm";
import { Eye, EyeOff } from "lucide-react";
import { toggleFeaturedMemberVisibility } from "./actions";

type Member = {
  id: string;
  name: string;
  avatar_url: string;
  social_url: string | null;
  category: string;
  achievement_title: string;
  project_name: string | null;
  project_description: string | null;
  thumbnail_url: string;
  demo_url: string | null;
  github_url: string | null;
  event_name: string | null;
  is_hidden: boolean;
};

export function FeaturedMemberList({ members }: { members: Member[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the Hall of Fame?`)) return;
    
    startTransition(async () => {
      try {
        await deleteFeaturedMember(id);
        toast.success(`${name} removed successfully!`);
      } catch (err: any) {
        toast.error("Failed to remove: " + (err.message || String(err)));
      }
    });
  };

  const handleToggleVisibility = (id: string, isHidden: boolean, name: string) => {
    startTransition(async () => {
      try {
        await toggleFeaturedMemberVisibility(id, isHidden);
        toast.success(`${name} is now ${isHidden ? 'visible' : 'hidden'}!`);
      } catch (err: any) {
        toast.error("Failed to update visibility: " + (err.message || String(err)));
      }
    });
  };

  if (members.length === 0) return null;

  return (
    <div className="bg-[#0A0A0A] border border-[#111] rounded-3xl p-8 shadow-2xl mt-8">
      <h2 className="text-xl font-bold text-white mb-6">Manage Featured Members</h2>
      <div className="space-y-4">
        {members.map((m) => (
          <div key={m.id} className="flex flex-col bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <img src={m.thumbnail_url} alt={m.name} className="w-12 h-12 rounded-lg object-cover bg-black" />
                <div>
                  <h3 className="font-bold text-white text-sm">{m.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md border border-amber-500/20">{m.category}</span>
                    <span className="text-xs text-gray-500">{m.achievement_title}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggleVisibility(m.id, m.is_hidden, m.name)}
                  disabled={isPending}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                    m.is_hidden 
                      ? 'text-red-500 hover:bg-red-500/10' 
                      : 'text-emerald-500 hover:bg-emerald-500/10'
                  }`}
                  title={m.is_hidden ? "Hidden from Hall of Fame" : "Visible on Hall of Fame"}
                >
                  {m.is_hidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setEditingId(editingId === m.id ? null : m.id)}
                  className={`p-2 rounded-lg transition-colors ${editingId === m.id ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  title="Edit entry"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(m.id, m.name)}
                  disabled={isPending}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  title="Remove from Hall of Fame"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {editingId === m.id && (
              <div className="border-t border-white/5 bg-[#050505] p-6">
                <FeaturedMemberForm 
                  initialData={m} 
                  onSuccess={() => setEditingId(null)} 
                  onCancel={() => setEditingId(null)} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
