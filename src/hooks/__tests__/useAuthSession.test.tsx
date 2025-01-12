import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthSession } from '../useAuthSession';
import { supabase } from "@/integrations/supabase/client";

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    resetQueries: vi.fn(),
    clear: vi.fn(),
  }),
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('useAuthSession Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('initializes with loading state', () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuthSession());
    expect(result.current.loading).toBe(true);
  });

  it('handles successful session retrieval', async () => {
    const mockSession = {
      user: { id: '123', email: 'test@test.com' },
      access_token: 'token',
    };

    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    (supabase.auth.onAuthStateChange as any).mockImplementation((callback) => {
      callback('SIGNED_IN', mockSession);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    const { result } = renderHook(() => useAuthSession());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.loading).toBe(false);
  });

  it('handles sign out', async () => {
    (supabase.auth.signOut as any).mockResolvedValue({ error: null });
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const { result } = renderHook(() => useAuthSession());

    await act(async () => {
      await result.current.handleSignOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.session).toBeNull();
  });

  it('handles session error', async () => {
    const mockError = new Error('Session error');
    (supabase.auth.getSession as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthSession());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});