"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleWinnerStatus(projectId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) throw new Error("Unauthorized");
  
  // Verify admin role in a real app, assuming protected by middleware/layout
  
  await prisma.projectSubmission.update({
    where: { id: projectId },
    data: { is_winner: !currentStatus }
  });

  revalidatePath('/admin/projects');
  revalidatePath('/hall-of-fame');
}
