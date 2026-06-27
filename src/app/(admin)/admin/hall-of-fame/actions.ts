"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function addFeaturedMember(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const avatar_url = formData.get("avatar_url") as string;
  const social_url = formData.get("social_url") as string | null;
  const achievement_title = formData.get("achievement_title") as string;
  const category = formData.get("category") as string;
  const project_name = formData.get("project_name") as string | null;
  const project_description = formData.get("project_description") as string | null;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const demo_url = formData.get("demo_url") as string | null;
  const github_url = formData.get("github_url") as string | null;
  const event_name = formData.get("event_name") as string | null;

  if (!name || !avatar_url || !achievement_title || !category || !thumbnail_url) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.featuredMember.create({
      data: {
        name,
        avatar_url,
        social_url: social_url || null,
        achievement_title,
        category,
        project_name: project_name || null,
        project_description: project_description || null,
        thumbnail_url,
        demo_url: demo_url || null,
        github_url: github_url || null,
        event_name: event_name || null,
      },
    });
  } catch (error: any) {
    console.error("Prisma create error:", error);
    throw new Error("Database error: " + error.message);
  }

  revalidatePath('/admin/hall-of-fame');
  revalidatePath('/hall-of-fame');
}

export async function editFeaturedMember(id: string, formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const avatar_url = formData.get("avatar_url") as string;
  const social_url = formData.get("social_url") as string | null;
  const achievement_title = formData.get("achievement_title") as string;
  const category = formData.get("category") as string;
  const project_name = formData.get("project_name") as string | null;
  const project_description = formData.get("project_description") as string | null;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const demo_url = formData.get("demo_url") as string | null;
  const github_url = formData.get("github_url") as string | null;
  const event_name = formData.get("event_name") as string | null;

  if (!name || !avatar_url || !achievement_title || !category || !thumbnail_url) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.featuredMember.update({
      where: { id },
      data: {
        name,
        avatar_url,
        social_url: social_url || null,
        achievement_title,
        category,
        project_name: project_name || null,
        project_description: project_description || null,
        thumbnail_url,
        demo_url: demo_url || null,
        github_url: github_url || null,
        event_name: event_name || null,
      },
    });
  } catch (error: any) {
    console.error("Prisma update error:", error);
    throw new Error("Database error: " + error.message);
  }

  revalidatePath('/admin/hall-of-fame');
  revalidatePath('/hall-of-fame');
}

export async function deleteFeaturedMember(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.featuredMember.delete({
    where: { id }
  });

  revalidatePath('/admin/hall-of-fame');
  revalidatePath('/hall-of-fame');
}

export async function updateProjectSubmissionDisplay(projectId: string, thumbnailUrl: string, category: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.projectSubmission.update({
    where: { id: projectId },
    data: {
      thumbnail_url: thumbnailUrl,
      category: category
    }
  });

  revalidatePath('/admin/projects');
  revalidatePath('/hall-of-fame');
}
