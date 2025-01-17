import { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEnhancedRoleAccess } from '@/hooks/useEnhancedRoleAccess';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Toaster } from "@/components/ui/toaster";
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import ProtectedRoutes from '@/components/routing/ProtectedRoutes';

function App() {
  const { session, loading: sessionLoading } = useAuthSession();
  const { isLoading: rolesLoading } = useEnhancedRoleAccess();

  const appState = useMemo(() => ({
    sessionLoading,
    rolesLoading,
    hasSession: !!session,
    currentPath: window.location.pathname,
    timestamp: new Date().toISOString()
  }), [sessionLoading, rolesLoading, session]);

  useEffect(() => {
    console.log('App render state:', appState);
  }, [appState]);

  // Only show loading during initial session check
  if (sessionLoading && !session) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/" element={<ProtectedRoutes session={session} />}>
          <Route index element={<Index />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;