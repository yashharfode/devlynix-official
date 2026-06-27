import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new NextResponse('Verification failed', { status: 400 });
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, username, image_url: _imageUrl, public_metadata, created_at } = evt.data;
    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name ?? ''} ${last_name ?? ''}`.trim();

    const { error } = await supabase.from('profiles').upsert({
      clerk_user_id: id,
      email,
      full_name: fullName || null,
      username: username || null,
      xp: 0,
      builder_level: 'Initiate',
      streak_days: 0,
      role: (public_metadata?.role as string) || 'HACKER',
      created_at: created_at ? new Date(created_at).toISOString() : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'clerk_user_id' });

    if (error) {
      console.error('Failed to create profile via webhook:', error);
      return new NextResponse('Failed to create profile', { status: 500 });
    }
  }

  if (evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, username, image_url: _imageUrl, public_metadata } = evt.data;
    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name ?? ''} ${last_name ?? ''}`.trim();

    const { error } = await supabase.from('profiles').update({
      email,
      full_name: fullName || null,
      username: username || null,
      role: (public_metadata?.role as string) || 'HACKER',
      updated_at: new Date().toISOString(),
    }).eq('clerk_user_id', id);

    if (error) {
      console.error('Failed to update profile via webhook:', error);
      return new NextResponse('Failed to update profile', { status: 500 });
    }
  }

  if (evt.type === 'user.deleted') {
    const { id } = evt.data;
    const { error } = await supabase.from('profiles').delete().eq('clerk_user_id', id);
    if (error) {
      console.error('Failed to delete profile via webhook:', error);
      return new NextResponse('Failed to delete profile', { status: 500 });
    }
  }

  return new NextResponse('OK', { status: 200 });
}