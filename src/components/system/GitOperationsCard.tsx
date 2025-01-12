import { useState, useEffect } from 'react';
import { GitBranch, AlertCircle, Plus, Key } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { GitOperationProgress } from '@/components/system/git/GitOperationProgress';
import { GitOperationLogs } from '@/components/system/git/GitOperationLogs';
import { QuickPushButton } from '@/components/system/git/QuickPushButton';
import { AddRepositoryDialog } from '@/components/system/git/AddRepositoryDialog';
import { useGitOperations } from '@/components/system/git/useGitOperations';
import { Input } from "@/components/ui/input";

const GitOperationsCard = () => {
  const { toast } = useToast();
  const { 
    isProcessing,
    logs,
    currentOperation,
    progress,
    repositories,
    selectedRepo,
    showAddRepo,
    setShowAddRepo,
    setSelectedRepo,
    handlePushToRepo,
    fetchRepositories
  } = useGitOperations();

  const [showTokenDialog, setShowTokenDialog] = useState(false);

  const handleTokenUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = formData.get('github_token') as string;

    try {
      console.log('Updating GitHub token...');
      const { error } = await supabase.functions.invoke('update-github-token', {
        body: { token }
      });

      if (error) {
        console.error('Token update error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "GitHub token updated successfully",
      });
      setShowTokenDialog(false);
    } catch (error: any) {
      console.error('Token update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update GitHub token",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-dashboard-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-dashboard-accent1" />
            <CardTitle className="text-xl text-white">Git Operations</CardTitle>
          </div>
          <div className="flex gap-2">
            <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Key className="w-4 h-4" />
                  Update Token
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dashboard-card text-white">
                <DialogHeader>
                  <DialogTitle>Update GitHub Token</DialogTitle>
                  <DialogDescription className="text-dashboard-muted">
                    Enter your GitHub Personal Access Token (PAT) with repository access.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTokenUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="github_token">GitHub Token</Label>
                    <input
                      id="github_token"
                      name="github_token"
                      type="password"
                      required
                      className="w-full p-2 mt-1 bg-dashboard-card border border-white/10 rounded-md"
                      placeholder="ghp_************************************"
                    />
                  </div>
                  <Button type="submit" className="w-full">Update Token</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              onClick={() => setShowAddRepo(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Repository
            </Button>
          </div>
        </div>
        <CardDescription className="text-dashboard-muted">
          Manage Git operations and repository synchronization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-dashboard-card/50 border-dashboard-accent1/20">
          <AlertCircle className="h-4 w-4 text-dashboard-accent1" />
          <AlertTitle className="text-dashboard-accent1">Important</AlertTitle>
          <AlertDescription className="text-dashboard-muted">
            Make sure your GitHub token has the correct repository permissions and is properly configured.
          </AlertDescription>
        </Alert>

        <QuickPushButton isProcessing={isProcessing} />

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="repository">Custom Repository</Label>
            <select
              id="repository"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full p-2 rounded-md bg-dashboard-card border border-white/10 text-white"
            >
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.source_url} ({repo.branch})
                </option>
              ))}
            </select>
          </div>
        </div>

        {isProcessing && (
          <GitOperationProgress 
            currentOperation={currentOperation}
            progress={progress}
          />
        )}

        <Button
          onClick={handlePushToRepo}
          disabled={isProcessing || !selectedRepo}
          className="w-full bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
        >
          Push to Selected Repository
        </Button>

        <GitOperationLogs logs={logs} />

        <AddRepositoryDialog
          showAddRepo={showAddRepo}
          setShowAddRepo={setShowAddRepo}
          onRepositoryAdded={fetchRepositories}
        />
      </CardContent>
    </Card>
  );
};

export default GitOperationsCard;
