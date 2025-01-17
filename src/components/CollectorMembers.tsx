import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/types/member";
import { Loader2, MoreVertical } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const CollectorMembers = ({ collectorName }: { collectorName: string }) => {
  const { session } = useAuthSession();
  const { toast } = useToast();
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newCollector, setNewCollector] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication and roles...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Current auth user:', user);
      
      if (authError) {
        console.error('Auth error:', authError);
        return;
      }
      
      if (user) {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          return;
        }
        
        console.log('User roles:', roles);
      }
    };
    
    checkAuth();
  }, []);

  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['collectorMembers', collectorName],
    queryFn: async () => {
      console.log('Starting member fetch for collector:', collectorName);
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('collector', collectorName);

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      console.log('Members data fetched:', data);
      return data as Member[];
    },
    enabled: !!collectorName && !!session,
  });

  const handleStatusChange = async (member: Member, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ status: newStatus })
        .eq('id', member.id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Member ${member.full_name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status.",
        variant: "destructive",
      });
    }
  };

  const handleMoveMember = async () => {
    if (!selectedMember || !newCollector) return;

    try {
      const { error } = await supabase
        .from('members')
        .update({ collector: newCollector })
        .eq('id', selectedMember.id);

      if (error) throw error;

      toast({
        title: "Member Moved",
        description: `${selectedMember.full_name} has been moved to collector ${newCollector}.`,
      });

      setMoveDialogOpen(false);
      setNewCollector('');
      setSelectedMember(null);
      refetch();
    } catch (error) {
      console.error('Error moving member:', error);
      toast({
        title: "Error",
        description: "Failed to move member to new collector.",
        variant: "destructive",
      });
    }
  };

  if (!session) {
    console.log('No active session, skipping member fetch');
    return null;
  }

  if (isLoading) {
    console.log('Component in loading state');
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Component in error state:', error);
    return (
      <div className="p-4 text-red-500">
        Error loading members: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!members || members.length === 0) {
    console.log('No members found for collector:', collectorName);
    return (
      <div className="p-4 text-gray-500">
        No members found for collector: {collectorName}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {members.map((member) => (
          <li 
            key={member.id}
            className="bg-dashboard-card p-4 rounded-lg border border-dashboard-cardBorder hover:border-dashboard-cardBorderHover hover:bg-dashboard-cardHover transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-dashboard-highlight">{member.full_name}</p>
                <p className="text-sm text-dashboard-accent2">
                  Member #: {member.member_number}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  member.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {member.status || 'pending'}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(
                      member, 
                      member.status === 'active' ? 'inactive' : 'active'
                    )}
                  >
                    {member.status === 'active' ? 'Deactivate' : 'Activate'} Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedMember(member);
                      setMoveDialogOpen(true);
                    }}
                  >
                    Move to Different Collector
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Member to Different Collector</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="newCollector" className="text-sm font-medium">
                New Collector Name
              </label>
              <Input
                id="newCollector"
                value={newCollector}
                onChange={(e) => setNewCollector(e.target.value)}
                placeholder="Enter collector name"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setMoveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleMoveMember}>
                Move Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectorMembers;
