import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProtectedLayoutClient from './ProtectedLayoutClient';

async function checkOnboardingComplete(authId: string) {
  try {
    const profile = await prisma.user.findUnique({
      where: { auth_id: authId },
      select: { id: true, role: true, xp: true, streak_days: true, full_name: true }
    });
    return profile;
  } catch (error) {
    console.error('Prisma error checking onboarding:', error);
    return null;
  }
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const profile = await checkOnboardingComplete(user.id);

  if (!profile) {
    redirect('/onboarding');
  }

  return <ProtectedLayoutClient profile={profile} user={user}>{children}</ProtectedLayoutClient>;
}