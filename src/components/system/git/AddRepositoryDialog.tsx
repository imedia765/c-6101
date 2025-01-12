import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddRepositoryDialogProps {
  showAddRepo: boolean;
  setShowAddRepo: (show: boolean) => void;
  onRepositoryAdded: () => void;
}

export const AddRepositoryDialog = ({ 
  showAddRepo, 
  setShowAddRepo, 
  onRepositoryAdded 
}: AddRepositoryDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const repoUrl = formData.get('repo_url') as string;
      const branch = formData.get('branch') as string;

      const { error } = await supabase
        .from('git_repositories')
        .insert([
          { 
            name,
            source_url: repoUrl,
            branch: branch || 'main',
            is_master: false,
            status: 'active'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Repository added successfully",
      });
      
      setShowAddRepo(false);
      onRepositoryAdded();
    } catch (error: any) {
      console.error('Error adding repository:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add repository",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showAddRepo} onOpenChange={setShowAddRepo}>
      <DialogContent className="bg-dashboard-card text-white">
        <DialogHeader>
          <DialogTitle>Add New Repository</DialogTitle>
          <DialogDescription className="text-dashboard-muted">
            Add a new repository to sync with the master repository.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Repository Name</Label>
            <Input
              id="name"
              name="name"
              required
              className="bg-dashboard-card border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo_url">Repository URL</Label>
            <Input
              id="repo_url"
              name="repo_url"
              required
              placeholder="https://github.com/username/repo.git"
              className="bg-dashboard-card border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch">Branch (optional)</Label>
            <Input
              id="branch"
              name="branch"
              placeholder="main"
              className="bg-dashboard-card border-white/10"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Adding...' : 'Add Repository'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};