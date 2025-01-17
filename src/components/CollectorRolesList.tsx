import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, User, Shield, Clock, Activity, Database, RefreshCw, HardDrive } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useEnhancedRoleAccess } from "@/hooks/useEnhancedRoleAccess";
import { useRoleSync } from "@/hooks/useRoleSync";
import { useRoleStore } from "@/store/roleStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CollectorInfo {
  full_name: string;
  member_number: string;
  roles: string[];
  auth_user_id: string;
  role_details: {
    role: string;
    created_at: string;
  }[];
}

const CollectorRolesList = () => {
  const { toast } = useToast();
  const { userRole, userRoles, roleLoading, error: roleError, permissions } = useRoleAccess();
  const { userRoles: enhancedRoles, isLoading: enhancedLoading } = useEnhancedRoleAccess();
  const { syncStatus, syncRoles } = useRoleSync();
  const roleStore = useRoleStore();

  const { data: collectors, isLoading, error } = useQuery({
    queryKey: ['collectors-roles'],
    queryFn: async () => {
      console.log('Fetching collectors and roles data...');
      
      try {
        // First get active collectors
        const { data: activeCollectors, error: collectorsError } = await supabase
          .from('members_collectors')
          .select('member_number, name')
          .eq('active', true);

        if (collectorsError) {
          console.error('Error fetching collectors:', collectorsError);
          throw collectorsError;
        }

        console.log('Active collectors:', activeCollectors);

        // Then get member details and roles for each collector
        const collectorsWithRoles = await Promise.all(
          activeCollectors.map(async (collector) => {
            try {
              // Get member data
              const { data: memberData, error: memberError } = await supabase
                .from('members')
                .select('full_name, member_number, auth_user_id')
                .eq('member_number', collector.member_number)
                .single();

              if (memberError) {
                console.error('Error fetching member data:', memberError);
                throw memberError;
              }

              console.log('Member data:', memberData);

              // Get user roles with creation timestamp
              const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('role, created_at')
                .eq('user_id', memberData.auth_user_id)
                .order('created_at', { ascending: true });

              if (rolesError) {
                console.error('Error fetching roles:', rolesError);
                throw rolesError;
              }

              console.log('User roles:', roles);

              return {
                full_name: memberData.full_name,
                member_number: memberData.member_number,
                auth_user_id: memberData.auth_user_id,
                roles: roles?.map(r => r.role) || [],
                role_details: roles?.map(r => ({
                  role: r.role,
                  created_at: r.created_at
                })) || []
              };
            } catch (err) {
              console.error('Error processing collector:', collector.member_number, err);
              toast({
                title: "Error loading collector data",
                description: `Could not load data for collector ${collector.member_number}`,
                variant: "destructive",
              });
              return null;
            }
          })
        );

        // Filter out any null results from errors
        const validCollectors = collectorsWithRoles.filter(c => c !== null);
        console.log('Final collectors data:', validCollectors);
        return validCollectors;
      } catch (err) {
        console.error('Error in collector roles query:', err);
        toast({
          title: "Error loading collectors",
          description: "There was a problem loading the collectors list",
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  if (error || roleError) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        <AlertCircle className="w-4 h-4 mr-2" />
        <span>Error loading collectors</span>
      </div>
    );
  }

  if (isLoading || roleLoading || enhancedLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#F2FCE2]">Active Collectors and Roles</h2>
        <Badge variant="outline" className="text-[#D3E4FD]">
          {collectors?.length || 0} Collectors
        </Badge>
      </div>

      <div className="grid gap-6">
        {collectors?.map((collector) => (
          <Card key={collector.member_number} className="p-6 bg-dashboard-card border-dashboard-cardBorder hover:border-dashboard-accent1/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-dashboard-accent1" />
                    <h3 className="text-lg font-medium text-[#F3F3F3]">{collector.full_name}</h3>
                  </div>
                  <p className="text-sm text-[#D6BCFA]">Member #: {collector.member_number}</p>
                  <p className="text-xs text-[#E5DEFF] font-mono">ID: {collector.auth_user_id}</p>
                </div>
              </div>

              <Separator className="bg-dashboard-cardBorder" />

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="roles">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#FDE1D3]" />
                      <span className="text-[#FDE1D3]">Role Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {collector.role_details.map((roleDetail, index) => (
                        <div 
                          key={`${roleDetail.role}-${index}`}
                          className="flex items-center justify-between bg-dashboard-card/50 rounded-md p-2"
                        >
                          <Badge 
                            variant="outline"
                            className="bg-[#9B87F5]/10 text-[#D6BCFA] border-[#9B87F5]/20"
                          >
                            {roleDetail.role}
                          </Badge>
                          <span className="text-xs text-[#F1F0FB]">
                            Added: {format(new Date(roleDetail.created_at), 'PPp')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="roleAccess">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-[#F2FCE2]" />
                      <span className="text-[#F2FCE2]">Role Access Status</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-[#D3E4FD]">Current Role:</span>
                        <Badge variant="outline" className="text-[#FEF7CD]">{userRole}</Badge>
                        <span className="text-[#D3E4FD]">Loading:</span>
                        <Badge variant={roleLoading ? "destructive" : "secondary"}>
                          {roleLoading ? "Loading" : "Ready"}
                        </Badge>
                        <span className="text-[#D3E4FD]">Permissions:</span>
                        <div className="space-y-1">
                          {Object.entries(permissions).map(([key, value]) => (
                            <Badge 
                              key={key}
                              variant={value ? "secondary" : "outline"}
                              className="mr-1 text-[#FEC6A1]"
                            >
                              {key}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="enhancedAccess">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-[#F2FCE2]" />
                      <span className="text-[#F2FCE2]">Enhanced Role Status</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-[#D3E4FD]">Query Status:</span>
                        <Badge variant={enhancedLoading ? "destructive" : "secondary"}>
                          {enhancedLoading ? "Loading" : "Ready"}
                        </Badge>
                        <span className="text-[#D3E4FD]">Enhanced Roles:</span>
                        <div className="space-y-1">
                          {enhancedRoles?.map((role) => (
                            <Badge 
                              key={role}
                              variant="outline"
                              className="mr-1"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="roleSync">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-[#F2FCE2]" />
                      <span className="text-[#F2FCE2]">Role Sync Status</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-[#D3E4FD]">Sync Status:</span>
                        <Badge variant={syncStatus ? "secondary" : "outline"}>
                          {syncStatus ? "Synced" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="roleStore">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-[#F2FCE2]" />
                      <span className="text-[#F2FCE2]">Role Store Status</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-[#D3E4FD]">Store Status:</span>
                        <Badge variant={roleStore.isLoading ? "destructive" : "secondary"}>
                          {roleStore.isLoading ? "Loading" : "Ready"}
                        </Badge>
                        <span className="text-[#D3E4FD]">Store Error:</span>
                        <Badge variant={roleStore.error ? "destructive" : "secondary"}>
                          {roleStore.error ? "Error" : "None"}
                        </Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CollectorRolesList;
