import { DashboardTabs, DashboardTabsContent, DashboardTabsList, DashboardTabsTrigger } from "@/components/ui/dashboard-tabs";
import SystemHealthCheck from "./system/SystemHealthCheck";
import GitOperationsCard from "./system/GitOperationsCard";
import RoleManagementCard from "./system/RoleManagementCard";
import UserManual from "./documentation/UserManual";
import AnnouncementsManager from "./system/AnnouncementsManager";
import LegalDocumentsView from "./system/LegalDocumentsView";
import { Route, GitBranch, UserCog, Book, Bell, FileText } from "lucide-react";

const SystemToolsView = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-medium mb-2 text-white">System Tools</h1>
        <p className="text-dashboard-muted">Manage system settings and monitor performance</p>
      </header>

      <DashboardTabs defaultValue="health" className="space-y-4">
        <DashboardTabsList className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0 bg-dashboard-card p-1 rounded-lg overflow-x-auto scrollbar-none">
          <DashboardTabsTrigger value="health" className="min-w-[120px]">
            <Route className="w-4 h-4 mr-2" />
            System Health
          </DashboardTabsTrigger>
          <DashboardTabsTrigger value="git" className="min-w-[120px]">
            <GitBranch className="w-4 h-4 mr-2" />
            Git Operations
          </DashboardTabsTrigger>
          <DashboardTabsTrigger value="roles" className="min-w-[120px]">
            <UserCog className="w-4 h-4 mr-2" />
            Role Management
          </DashboardTabsTrigger>
          <DashboardTabsTrigger value="manual" className="min-w-[120px]">
            <Book className="w-4 h-4 mr-2" />
            User Manual
          </DashboardTabsTrigger>
          <DashboardTabsTrigger value="announcements" className="min-w-[120px]">
            <Bell className="w-4 h-4 mr-2" />
            Announcements
          </DashboardTabsTrigger>
          <DashboardTabsTrigger value="legal" className="min-w-[120px]">
            <FileText className="w-4 h-4 mr-2" />
            Legal Documents
          </DashboardTabsTrigger>
        </DashboardTabsList>

        <DashboardTabsContent value="health" className="space-y-4">
          <SystemHealthCheck />
        </DashboardTabsContent>

        <DashboardTabsContent value="git" className="space-y-4">
          <GitOperationsCard />
        </DashboardTabsContent>

        <DashboardTabsContent value="roles" className="space-y-4">
          <RoleManagementCard />
        </DashboardTabsContent>

        <DashboardTabsContent value="manual" className="space-y-4">
          <UserManual />
        </DashboardTabsContent>

        <DashboardTabsContent value="announcements" className="space-y-4">
          <AnnouncementsManager />
        </DashboardTabsContent>

        <DashboardTabsContent value="legal" className="space-y-4">
          <LegalDocumentsView />
        </DashboardTabsContent>
      </DashboardTabs>
    </div>
  );
};

export default SystemToolsView;