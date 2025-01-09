import { Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RoleSelectProps {
  currentRole: Database['public']['Enums']['app_role'];
  userId: string;
  onRoleChange: (role: Database['public']['Enums']['app_role']) => void;
}

const RoleSelect = ({ currentRole, userId, onRoleChange }: RoleSelectProps) => {
  const { toast } = useToast();

  const handleRoleChange = async (newRole: Database['public']['Enums']['app_role']) => {
    try {
      // First check if the role already exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', newRole)
        .single();

      if (!existingRole) {
        // Insert the new role if it doesn't exist
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([
            { user_id: userId, role: newRole }
          ]);

        if (insertError) throw insertError;
      }

      onRoleChange(newRole);
      
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  return (
    <Select
      value={currentRole}
      onValueChange={handleRoleChange}
    >
      <SelectTrigger className="w-[140px] bg-dashboard-card border-dashboard-accent1/20 text-dashboard-text">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-dashboard-card border-white/10">
        <SelectItem value="admin" className="text-dashboard-text">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-dashboard-accent1" />
            Admin
          </div>
        </SelectItem>
        <SelectItem value="collector" className="text-dashboard-text">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-dashboard-accent2" />
            Collector
          </div>
        </SelectItem>
        <SelectItem value="member" className="text-dashboard-text">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-dashboard-accent3" />
            Member
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;