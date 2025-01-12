import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DatabaseEnums } from "@/integrations/supabase/types/enums";
import DiagnosticsPanel from './diagnostics/DiagnosticsPanel';

type UserRole = DatabaseEnums['app_role'];

interface UserRoleData {
  role: UserRole;
}

interface UserData {
  id: string;
  user_id: string;
  full_name: string;
  member_number: string;
  role: UserRole;
  auth_user_id: string;
  user_roles: UserRoleData[];
}

interface UserRoleCardProps {
  user: UserData;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

const UserRoleCard = ({ user, onRoleChange }: UserRoleCardProps) => {
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const { data: userDiagnostics, isLoading } = useQuery({
    queryKey: ['userDiagnostics', user.id, showDiagnosis],
    queryFn: async () => {
      if (!showDiagnosis) return null;
      
      addLog('Starting user diagnostics...');
      
      try {
        // Fetch user roles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.auth_user_id);

        if (rolesError) {
          addLog(`Error fetching roles: ${rolesError.message}`);
          throw rolesError;
        }
        addLog(`Found ${roles?.length || 0} roles`);

        // Fetch member profile
        const { data: member, error: memberError } = await supabase
          .from('members')
          .select('*')
          .eq('auth_user_id', user.auth_user_id)
          .maybeSingle();

        if (memberError && memberError.code !== 'PGRST116') {
          addLog(`Error fetching member: ${memberError.message}`);
          throw memberError;
        }
        addLog(member ? 'Found member profile' : 'No member profile found');

        // Fetch collector info if exists
        const { data: collector, error: collectorError } = await supabase
          .from('members_collectors')
          .select('*')
          .eq('member_number', member?.member_number);

        if (collectorError) {
          addLog(`Error fetching collector info: ${collectorError.message}`);
          throw collectorError;
        }
        addLog(`Found ${collector?.length || 0} collector records`);

        // Fetch audit logs
        const { data: auditLogs, error: auditError } = await supabase
          .from('audit_logs')
          .select('*')
          .eq('user_id', user.auth_user_id)
          .order('timestamp', { ascending: false })
          .limit(10);

        if (auditError) {
          addLog(`Error fetching audit logs: ${auditError.message}`);
          throw auditError;
        }
        addLog(`Found ${auditLogs?.length || 0} audit logs`);

        // Fetch payment records
        const { data: payments, error: paymentsError } = await supabase
          .from('payment_requests')
          .select('*')
          .eq('member_number', member?.member_number)
          .order('created_at', { ascending: false })
          .limit(10);

        if (paymentsError) {
          addLog(`Error fetching payments: ${paymentsError.message}`);
          throw paymentsError;
        }
        addLog(`Found ${payments?.length || 0} payment records`);

        return {
          roles: roles || [],
          member: member || null,
          collector: collector || [],
          auditLogs: auditLogs || [],
          payments: payments || [],
          accessibleTables: [
            'members',
            'user_roles',
            'payment_requests',
            'members_collectors',
            'audit_logs'
          ],
          permissions: {
            canManageRoles: roles?.some(r => r.role === 'admin') || false,
            canCollectPayments: (collector?.length || 0) > 0,
            canAccessAuditLogs: roles?.some(r => r.role === 'admin') || false,
            canManageMembers: roles?.some(r => ['admin', 'collector'].includes(r.role)) || false
          },
          routes: {
            dashboard: true,
            profile: true,
            payments: true,
            settings: roles?.some(r => r.role === 'admin') || false,
            system: roles?.some(r => r.role === 'admin') || false,
            audit: roles?.some(r => r.role === 'admin') || false
          },
          timestamp: new Date().toISOString()
        };
      } catch (error: any) {
        console.error('Error in diagnostics:', error);
        toast({
          title: "Error running diagnostics",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: showDiagnosis
  });

  return (
    <Card className="p-4 bg-dashboard-card border-dashboard-cardBorder">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-white">{user.full_name}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[600px] bg-dashboard-card border-dashboard-cardBorder">
            <DiagnosticsPanel
              isLoading={isLoading}
              userDiagnostics={userDiagnostics}
              logs={logs}
              onRunDiagnostics={() => {
                setShowDiagnosis(true);
                setLogs([]);
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default UserRoleCard;