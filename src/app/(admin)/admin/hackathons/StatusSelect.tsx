"use client";

import { useTransition } from "react";

export function StatusSelect({ 
  hackathonId, 
  currentStatus, 
  action 
}: { 
  hackathonId: string, 
  currentStatus: string, 
  action: (formData: FormData) => Promise<void> 
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={action} className="inline-block relative">
      <input type="hidden" name="hackathonId" value={hackathonId} />
      <select 
        name="status" 
        defaultValue={currentStatus}
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
        <option value="PENDING">PENDING</option>
        <option value="APPROVED">APPROVED</option>
        <option value="REJECTED">REJECTED</option>
      </select>
    </form>
  );
}
