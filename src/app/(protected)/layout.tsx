import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProtectedLayoutClient from './ProtectedLayoutClient';

async function checkOnboardingComplete(clerkUserId: string) {
  try {
    const profile = await prisma.user.findUnique({
      where: { clerk_user_id: clerkUserId },
      select: { id: true }
    });
    return !!profile;
  } catch (error) {
    console.error('Prisma error checking onboarding:', error);
    return false;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated || !userId) {
    redirect('/sign-in');
  }

  const hasCompletedOnboarding = await checkOnboardingComplete(userId);

  if (!hasCompletedOnboarding) {
    redirect('/onboarding');
  }

  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}