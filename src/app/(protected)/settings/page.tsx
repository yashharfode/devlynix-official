"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
        <p className="text-gray-400">Manage your profile, security, and account preferences.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-[#111] rounded-3xl p-8 flex flex-col gap-6 items-start">
        <div className="text-white font-mono">
          Email: {user?.email}
        </div>
        
        <button 
          onClick={handleSignOut}
          className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
