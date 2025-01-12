import { useState } from 'react';
import { GitBranch, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGitSync } from './useGitSync';
import { GitSyncLogs } from './GitSyncLogs';
import { GitSyncProgress } from './GitSyncProgress';

const GitSyncCard = () => {
  const { toast } = useToast();
  const [customRepoUrl, setCustomRepoUrl] = useState('');
  const { 
    isProcessing,
    currentOperation,
    progress,
    logs,
    pullFromMaster,
    pushToCustom,
    error
  } = useGitSync();

  const handlePullFromMaster = async () => {
    try {
      if (!customRepoUrl?.trim()) {
        toast({
          title: "Missing Repository URL",
          description: "Please enter a valid custom repository URL",
          variant: "destructive",
        });
        return;
      }
      console.log('Initiating pull from master to:', customRepoUrl);
      await pullFromMaster(customRepoUrl);
    } catch (error) {
      console.error('Pull from master error:', error);
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "Failed to pull from master",
        variant: "destructive",
      });
    }
  };

  const handlePushToMaster = async () => {
    try {
      if (!customRepoUrl?.trim()) {
        toast({
          title: "Missing Repository URL",
          description: "Please enter a valid custom repository URL",
          variant: "destructive",
        });
        return;
      }
      console.log('Initiating push from custom to master:', customRepoUrl);
      await pushToCustom(customRepoUrl);
    } catch (error) {
      console.error('Push to master error:', error);
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "Failed to push to master",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-dashboard-card border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-dashboard-accent1" />
          <CardTitle className="text-xl text-white">Git Repository Sync</CardTitle>
        </div>
        <CardDescription className="text-dashboard-muted">
          Sync between master and custom repositories
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-dashboard-card/50 border-dashboard-accent1/20">
          <AlertCircle className="h-4 w-4 text-dashboard-accent1" />
          <AlertTitle className="text-dashboard-accent1">Important</AlertTitle>
          <AlertDescription className="text-dashboard-muted">
            Make sure you have the correct repository permissions before syncing.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="repoUrl">Custom Repository URL</Label>
            <Input
              id="repoUrl"
              value={customRepoUrl}
              onChange={(e) => setCustomRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo.git"
              className="bg-dashboard-dark border-white/10"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isProcessing && (
            <GitSyncProgress 
              currentOperation={currentOperation}
              progress={progress}
            />
          )}

          <div className="flex gap-4">
            <Button
              onClick={handlePullFromMaster}
              disabled={isProcessing || !customRepoUrl.trim()}
              className="flex-1 bg-dashboard-accent1 hover:bg-dashboard-accent1/80"
            >
              Pull from Master
            </Button>
            <Button
              onClick={handlePushToMaster}
              disabled={isProcessing || !customRepoUrl.trim()}
              className="flex-1 bg-dashboard-accent2 hover:bg-dashboard-accent2/80"
            >
              Push to Master
            </Button>
          </div>
        </div>

        <GitSyncLogs logs={logs} />
      </CardContent>
    </Card>
  );
};

export default GitSyncCard;