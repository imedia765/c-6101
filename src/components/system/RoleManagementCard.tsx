import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import MemberSearch from '@/components/MemberSearch';
import RoleManagementList from './roles/RoleManagementList';
import { useState } from 'react';

const RoleManagementCard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Card className="bg-dashboard-card border-white/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-dashboard-accent1" />
            <CardTitle className="text-xl font-semibold text-white">Role Management</CardTitle>
          </div>
        </div>
        <CardDescription className="text-dashboard-text mt-2">
          Manage user roles, permissions and access control
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <MemberSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <RoleManagementList searchTerm={searchTerm} />
      </CardContent>
    </Card>
  );
};

export default RoleManagementCard;