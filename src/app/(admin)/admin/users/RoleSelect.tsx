"use client";

import { useTransition } from "react";

export function RoleSelect({ 
  userId, 
  currentRole, 
  action 
}: { 
  userId: string, 
  currentRole: string, 
  action: (formData: FormData) => Promise<void> 
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={action} className="inline-block relative">
      <input type="hidden" name="userId" value={userId} />
      <select 
        name="role" 
        defaultValue={currentRole}
        disabled={isPending}
        className="bg-[#111] border border-white/5 text-xs rounded-md px-2 py-1 text-gray-300 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
        onChange={(e) => {
          const form = e.target.form;
          if (form) {
            startTransition(() => {
              form.requestSubmit();
            });
          }
        }}
      >
        <option value="HACKER">HACKER</option>
        <option value="ORGANIZER">ORGANIZER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
    </form>
  );
}
