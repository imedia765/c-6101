import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface AddRepositoryDialogProps {
  showAddRepo: boolean;
  setShowAddRepo: (show: boolean) => void;
  onRepositoryAdded: () => void;
}

export const AddRepositoryDialog = ({ showAddRepo, setShowAddRepo, onRepositoryAdded }: AddRepositoryDialogProps) => {
  const { toast } = useToast();
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoBranch, setNewRepoBranch] = useState('main');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateGitUrl = (url: string) => {
    const gitUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+(?:\.git)?$/;
    return gitUrlPattern.test(url);
  };

  const handleAddRepository = async () => {
    try {
      setIsSubmitting(true);
      
      if (!validateGitUrl(newRepoUrl)) {
        toast({
          title: "Invalid Repository URL",
          description: "Please enter a valid GitHub repository URL",
          variant: "destructive",
        });
        return;
      }

      console.log('Adding new repository:', { url: newRepoUrl, branch: newRepoBranch });

      const { data, error } = await supabase
        .from('git_repository_configs')
        .insert({
          repo_url: newRepoUrl,
          branch: newRepoBranch
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding repository:', error);
        throw error;
      }

      console.log('Repository added successfully:', data);

      toast({
        title: "Success",
        description: "Repository added successfully",
      });

      setShowAddRepo(false);
      setNewRepoUrl('');
      setNewRepoBranch('main');
      onRepositoryAdded();
    } catch (error) {
      console.error('Error adding repository:', error);
      toast({
        title: "Error",
        description: "Failed to add repository",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showAddRepo} onOpenChange={setShowAddRepo}>
      <DialogContent className="bg-dashboard-card border-dashboard-accent1/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Repository</DialogTitle>
          <DialogDescription className="text-dashboard-text">
            Enter the details of the repository you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="repoUrl" className="text-dashboard-text">Repository URL</Label>
            <Input
              id="repoUrl"
              value={newRepoUrl}
              onChange={(e) => setNewRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="bg-dashboard-dark border-dashboard-accent1/20 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="branch" className="text-dashboard-text">Branch</Label>
            <Input
              id="branch"
              value={newRepoBranch}
              onChange={(e) => setNewRepoBranch(e.target.value)}
              placeholder="main"
              className="bg-dashboard-dark border-dashboard-accent1/20 text-white"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAddRepo(false)}
            className="bg-transparent border-dashboard-accent1/20 text-dashboard-text hover:bg-dashboard-accent1/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddRepository}
            disabled={isSubmitting || !newRepoUrl.trim()}
            className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white"
          >
            {isSubmitting ? 'Adding...' : 'Add Repository'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};