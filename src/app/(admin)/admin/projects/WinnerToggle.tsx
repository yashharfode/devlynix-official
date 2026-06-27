"use client";

import { useTransition } from "react";
import { toggleWinnerStatus } from "./actions";
import { Trophy } from "lucide-react";

export function WinnerToggle({ projectId, isWinner }: { projectId: string, isWinner: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleWinnerStatus(projectId, isWinner);
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
        isWinner 
          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/50" 
          : "bg-[#111] text-gray-500 hover:text-gray-300 hover:bg-[#222] border border-white/5"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Trophy className="w-4 h-4" />
      {isWinner ? "Winner" : "Mark Winner"}
    </button>
  );
}
