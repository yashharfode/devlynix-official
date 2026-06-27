import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ProtectedLayoutClient from './ProtectedLayoutClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function checkOnboardingComplete(clerkUserId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .maybeSingle();

  if (error) {
    console.error('Supabase error checking onboarding:', error);
    return false;
  }

  return !!data;
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