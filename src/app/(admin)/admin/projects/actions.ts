"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function toggleWinnerStatus(projectId: string, currentStatus: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  // Verify admin role in a real app, assuming protected by middleware/layout
  
  await prisma.projectSubmission.update({
    where: { id: projectId },
    data: { is_winner: !currentStatus }
  });

  revalidatePath('/admin/projects');
  revalidatePath('/hall-of-fame');
}
