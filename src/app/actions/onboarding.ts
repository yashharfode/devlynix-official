"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) return null;
  
  return await prisma.user.findUnique({ 
    where: { auth_id: userId } 
  });
}

export async function checkUsername(username: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  
  const existing = await prisma.user.findUnique({ 
    where: { username } 
  });
  
  if (existing && existing.auth_id !== userId) {
    return { available: false };
  }
  return { available: true };
}

export async function saveProfile(data: any) {
  try {
    const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (data.username) {
      const existing = await prisma.user.findUnique({ where: { username: data.username } });
      if (existing && existing.auth_id !== userId) {
        return { success: false, error: "Username is already taken" };
      }
    }

    await prisma.user.upsert({
      where: { auth_id: userId },
      update: {
        full_name: data.fullName,
        username: data.username,
        bio: data.bio,
        college: data.college,
        year_of_study: data.yearOfStudy,
        primary_role: data.primaryRole,
        experience: data.experience,
        skills: data.skills || [],
        interests: data.interests || [],
        github_url: data.githubUrl,
        linkedin_url: data.linkedinUrl,
        portfolio_url: data.portfolioUrl,
      },
      create: {
        auth_id: userId,
        email: data.email || null,
        full_name: data.fullName,
        username: data.username,
        bio: data.bio,
        college: data.college,
        year_of_study: data.yearOfStudy,
        primary_role: data.primaryRole,
        experience: data.experience,
        skills: data.skills || [],
        interests: data.interests || [],
        github_url: data.githubUrl,
        linkedin_url: data.linkedinUrl,
        portfolio_url: data.portfolioUrl,
        xp: 100,
        builder_level: "Initiate",
        streak_days: 1,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error in saveProfile action:", error);
    return { success: false, error: error?.message || "Internal server error while saving profile" };
  }
}
