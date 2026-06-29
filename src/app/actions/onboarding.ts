"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  
  return await prisma.user.findUnique({ 
    where: { clerk_user_id: userId } 
  });
}

export async function checkUsername(username: string) {
  const { userId } = await auth();
  
  const existing = await prisma.user.findUnique({ 
    where: { username } 
  });
  
  if (existing && existing.clerk_user_id !== userId) {
    return { available: false };
  }
  return { available: true };
}

export async function saveProfile(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (data.username) {
    const existing = await prisma.user.findUnique({ where: { username: data.username } });
    if (existing && existing.clerk_user_id !== userId) {
      return { success: false, error: "Username is already taken" };
    }
  }

  await prisma.user.upsert({
    where: { clerk_user_id: userId },
    update: {
      full_name: data.fullName,
      username: data.username,
      bio: data.bio,
      college: data.college,
      year_of_study: data.yearOfStudy,
      primary_role: data.primaryRole,
      experience: data.experience,
      skills: data.skills,
      interests: data.interests,
      github_url: data.githubUrl,
      linkedin_url: data.linkedinUrl,
      portfolio_url: data.portfolioUrl,
    },
    create: {
      clerk_user_id: userId,
      email: data.email || null,
      full_name: data.fullName,
      username: data.username,
      bio: data.bio,
      college: data.college,
      year_of_study: data.yearOfStudy,
      primary_role: data.primaryRole,
      experience: data.experience,
      skills: data.skills,
      interests: data.interests,
      github_url: data.githubUrl,
      linkedin_url: data.linkedinUrl,
      portfolio_url: data.portfolioUrl,
      xp: 100,
      builder_level: "Initiate",
      streak_days: 1,
    }
  });

  return { success: true };
}
