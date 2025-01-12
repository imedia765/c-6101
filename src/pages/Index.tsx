import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import DashboardView from '@/components/DashboardView';
import MembersList from '@/components/MembersList';
import MemberSearch from '@/components/MemberSearch';
import SystemToolsView from '@/components/SystemToolsView';
import CollectorFinancialsView from '@/components/CollectorFinancialsView';
import PlanningView from '@/components/planning/PlanningView';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/layout/MainLayout';
import { useQueryClient } from '@tanstack/react-query';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole, roleLoading, canAccessTab } = useRoleAccess();
  const queryClient = useQueryClient();

  const handleSessionError = async () => {
    console.log('Session error detected, cleaning up...');
    
    try {
      await queryClient.invalidateQueries();
      await queryClient.resetQueries();
      localStorage.clear();
      await supabase.auth.signOut();
      
      toast({
        title: "Session expired",
        description: "Please sign in again",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Cleanup error:', error);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          await handleSessionError();
          return;
        }

        if (!session) {
          console.log('No active session found');
          await handleSessionError();
          return;
        }

        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('User verification failed:', userError);
          await handleSessionError();
          return;
        }

        console.log('Active session found for user:', session.user.id);
      } catch (error: any) {
        console.error('Authentication check failed:', error);
        await handleSessionError();
      }
    };

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        await handleSessionError();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!roleLoading && !canAccessTab(activeTab)) {
      setActiveTab('dashboard');
      toast({
        title: "Access Restricted",
        description: "You don't have permission to access this section.",
        variant: "destructive",
      });
    }
  }, [activeTab, roleLoading, userRole]);

  const renderContent = () => {
    if (!canAccessTab(activeTab)) {
      return <DashboardView />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'users':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2 text-white">Members</h1>
              <p className="text-dashboard-muted">View and manage member information</p>
            </header>
            <MemberSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <MembersList searchTerm={searchTerm} userRole={userRole} />
          </>
        );
      case 'financials':
        return <CollectorFinancialsView />;
      case 'system':
        return <SystemToolsView />;
      case 'planning':
        return <PlanningView />;
      default:
        return null;
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      userRole={userRole}
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default Index;