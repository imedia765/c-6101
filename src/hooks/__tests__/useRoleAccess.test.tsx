import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRoleAccess } from '../useRoleAccess';
import { supabase } from "@/integrations/supabase/client";

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(),
        single: vi.fn(),
      })),
    })),
  },
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useRoleAccess Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useRoleAccess());
    expect(result.current.roleLoading).toBe(true);
  });

  it('correctly identifies admin access', async () => {
    const mockUser = { id: '123', user_metadata: { member_number: 'TM10003' } };
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    const { result } = renderHook(() => useRoleAccess());

    await waitFor(() => {
      expect(result.current.canAccessTab('system')).toBe(true);
    });
  });

  it('handles unauthorized access correctly', async () => {
    const mockUser = { id: '123', user_metadata: { member_number: 'TEST123' } };
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    const { result } = renderHook(() => useRoleAccess());

    await waitFor(() => {
      expect(result.current.canAccessTab('system')).toBe(false);
    });
  });

  it('restricts access for non-admin users', async () => {
    const mockUser = { id: '123', user_metadata: { member_number: 'TEST123' } };
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    const { result } = renderHook(() => useRoleAccess());

    await waitFor(() => {
      expect(result.current.canAccessTab('dashboard')).toBe(true);
      expect(result.current.canAccessTab('system')).toBe(false);
      expect(result.current.canAccessTab('audit')).toBe(false);
    });
  });
});