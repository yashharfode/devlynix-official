"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function awardXP(amount: number, reason: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const user = await prisma.user.findUnique({
      where: { clerk_user_id: userId }
    });

    if (!user) return { error: "User not found" };

    const newXP = user.xp + amount;
    
    // Calculate new level (simple logic for now)
    let newLevel = user.builder_level;
    if (newXP >= 5000) newLevel = "Elite Builder";
    else if (newXP >= 2000) newLevel = "Senior Builder";
    else if (newXP >= 500) newLevel = "Pro Builder";
    else newLevel = "Initiate";

    await prisma.user.update({
      where: { clerk_user_id: userId },
      data: { 
        xp: newXP,
        builder_level: newLevel
      }
    });

    revalidatePath("/community");
    revalidatePath("/hub");
    
    return { success: true, newXP, newLevel };
  } catch (error) {
    console.error("Error awarding XP:", error);
    return { error: "Failed to award XP" };
  }
}
