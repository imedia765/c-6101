import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { clearAuthState, verifyMember, getAuthCredentials, handleSignInError } from './utils/authUtils';
import { updateMemberWithAuthId, addMemberRole } from './utils/memberUtils';

export const useLoginForm = () => {
  const [memberNumber, setMemberNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !memberNumber.trim()) return;
    
    try {
      setLoading(true);
      const isMobile = window.innerWidth <= 768;
      console.log('Starting login process on device type:', isMobile ? 'mobile' : 'desktop');

      // Skip clearing auth state on login attempt
      const member = await verifyMember(memberNumber);
      const { email, password } = getAuthCredentials(memberNumber);
      
      console.log('Attempting sign in with:', { email });
      
      // Try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails due to invalid credentials, try to sign up
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('Sign in failed, attempting signup');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              member_number: memberNumber,
            }
          }
        });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          throw signUpError;
        }

        if (signUpData.user) {
          await updateMemberWithAuthId(member.id, signUpData.user.id);
          await addMemberRole(signUpData.user.id);

          console.log('Member updated and role assigned, attempting final sign in');
          
          // Final sign in attempt after successful signup
          const { data: finalSignInData, error: finalSignInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (finalSignInError) {
            console.error('Final sign in error:', finalSignInError);
            throw finalSignInError;
          }

          if (!finalSignInData?.session) {
            throw new Error('Failed to establish session after signup');
          }
        }
      } else if (signInError) {
        await handleSignInError(signInError, email, password);
      }

      // Clear any existing queries before proceeding
      await queryClient.cancelQueries();
      await queryClient.clear();

      // Verify session is established
      console.log('Verifying session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session verification error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.error('No session established');
        throw new Error('Failed to establish session');
      }

      console.log('Session established successfully');
      await queryClient.invalidateQueries();

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Use replace to prevent back button issues
      if (isMobile) {
        window.location.href = '/';
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (error.message.includes('Member not found')) {
        errorMessage = 'Member number not found or inactive';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid member number. Please try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before logging in';
      } else if (error.message.includes('refresh_token_not_found')) {
        errorMessage = 'Session expired. Please try logging in again.';
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    memberNumber,
    setMemberNumber,
    loading,
    handleLogin,
  };
};