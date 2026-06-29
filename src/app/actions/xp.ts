"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function awardXP(amount: number, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) return { error: "Unauthorized" };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { auth_id: userId }
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
      where: { auth_id: userId },
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
