import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Repository {
  id: string;
  repo_url: string;
  branch: string;
}

export const useGitOperations = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentOperation, setCurrentOperation] = useState('');
  const [progress, setProgress] = useState(0);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [showAddRepo, setShowAddRepo] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const { data, error } = await supabase
        .from('git_repository_configs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRepositories(data || []);
      if (data && data.length > 0) {
        setSelectedRepo(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch repositories",
        variant: "destructive",
      });
    }
  };

  const fetchLogs = async () => {
    try {
      console.log('Fetching git operation logs...');
      const { data, error } = await supabase
        .from('git_operations_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      console.log('Fetched logs:', data);
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch operation logs",
        variant: "destructive",
      });
    }
  };

  const handlePushToRepo = async () => {
    if (isProcessing || !selectedRepo) return;
    
    try {
      setIsProcessing(true);
      setProgress(10);
      setCurrentOperation('Initializing git operation...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      setProgress(30);
      setCurrentOperation('Authenticating with GitHub...');

      setProgress(50);
      setCurrentOperation('Preparing to push changes...');

      const { data, error } = await supabase.functions.invoke('git-custom-repo', {
        body: {
          repoId: selectedRepo,
          commitMessage: 'Force commit: Pushing all files'
        }
      });

      if (error) throw error;

      console.log('Push operation response:', data);
      setProgress(100);
      
      toast({
        title: "Success",
        description: "Successfully pushed changes to repository",
      });

    } catch (error: any) {
      console.error('Push error:', error);
      
      toast({
        title: "Push Failed",
        description: error.message || "Failed to push changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentOperation('');
      setProgress(0);
      await fetchLogs();
    }
  };

  return {
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
  };
};