import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardView from '@/components/DashboardView';
import AuditLogsView from '@/components/AuditLogsView';
import MemberSearch from '@/components/MemberSearch';
import SystemToolsView from '@/components/SystemToolsView';
import CollectorFinancialsView from '@/components/CollectorFinancialsView';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/layout/MainLayout';
import InvalidateRolesButton from '@/components/debug/InvalidateRolesButton';

const Index = () => {
  const navigate = useNavigate();
  const { userRole, canAccessTab } = useRoleAccess();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!canAccessTab(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeTab, canAccessTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <DashboardView />
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 max-w-md mx-auto">
                <InvalidateRolesButton />
              </div>
            )}
          </>
        );
      case 'users':
        return <MemberSearch onSearchChange={setSearchTerm} searchTerm={searchTerm} />;
      case 'financials':
        return <CollectorFinancialsView />;
      case 'system':
        return <SystemToolsView />;
      case 'audit':
        return <AuditLogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <MainLayout activeTab={activeTab} userRole={userRole} isSidebarOpen={true} onSidebarToggle={() => {}} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
};

export default Index;