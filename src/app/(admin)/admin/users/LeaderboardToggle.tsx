"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LeaderboardToggle({ 
  userId, 
  isHidden, 
  action 
}: { 
  userId: string; 
  isHidden: boolean; 
  action: (formData: FormData) => Promise<void> 
}) {
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async (formData) => {
        setLoading(true);
        await action(formData);
        setLoading(false);
      }}
      className="inline-flex"
    >
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="currentHidden" value={String(isHidden)} />
      <button 
        type="submit" 
        disabled={loading}
        title={isHidden ? "Hidden from leaderboard" : "Visible on leaderboard"}
        className={`p-1.5 rounded-lg transition-colors ml-2 disabled:opacity-50 ${
          isHidden 
            ? 'text-red-400 bg-red-900/20 hover:bg-red-900/40' 
            : 'text-emerald-400 bg-emerald-900/20 hover:bg-emerald-900/40'
        }`}
      >
        {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </form>
  );
}
