import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from '@tanstack/react-query';

export const clearAuthState = async () => {
  console.log('Clearing existing session...');
  await supabase.auth.signOut();
  await new QueryClient().clear();
  localStorage.clear();
};

export const verifyMember = async (memberNumber: string) => {
  console.log('Verifying member:', memberNumber);
  const { data: members, error: memberError } = await supabase
    .from('members')
    .select('id, member_number, status')
    .eq('member_number', memberNumber)
    .eq('status', 'active')
    .limit(1);

  if (memberError) {
    console.error('Member verification error:', memberError);
    throw memberError;
  }

  if (!members || members.length === 0) {
    throw new Error('Member not found or inactive');
  }

  return members[0];
};

export const getAuthCredentials = (memberNumber: string) => ({
  email: `${memberNumber.toLowerCase()}@temp.com`,
  password: memberNumber,
});

export const handleSignInError = async (error: any, email: string, password: string) => {
  console.error('Sign in error:', error);
  if (error.message.includes('refresh_token_not_found')) {
    console.log('Refresh token error detected, clearing session and retrying...');
    await clearAuthState();
    
    // Retry sign in after clearing session
    const { error: retryError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (retryError) {
      throw retryError;
    }
  } else {
    throw error;
  }
};