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

  let profile = await checkOnboardingComplete(user.id);
  
  if (!profile) {
    try {
      profile = await prisma.user.create({
        data: {
          auth_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Builder',
          username: user.user_metadata?.user_name || `user_${Math.floor(Math.random() * 1000000)}`,
          role: user.email === 'yashharfode123@gmail.com' ? 'ADMIN' : 'HACKER'
        },
        select: { id: true, role: true, xp: true, streak_days: true, full_name: true }
      });
    } catch (err) {
      console.error('Failed to auto-create profile:', err);
    }
  }

  return <ProtectedLayoutClient profile={profile} user={user}>{children}</ProtectedLayoutClient>;
}