import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GitSyncLog {
  id: string;
  operation_type: string;
  status: string;
  message: string;
  created_at: string;
  error_details?: string;
}

const MASTER_REPO = 'https://github.com/imedia765/s-935078.git';

export const useGitSync = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOperation, setCurrentOperation] = useState('');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<GitSyncLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      console.log('Fetching git sync logs...');
      const { data, error } = await supabase
        .from('git_sync_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching logs:', error);
        throw error;
      }

      console.log('Fetched logs:', data);
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch operation logs",
        variant: "destructive",
      });
    }
  };

  const pullFromMaster = async (targetUrl: string) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      setProgress(10);
      setCurrentOperation('Initializing pull operation...');

      console.log('Starting pull from master to:', targetUrl);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      setProgress(30);
      setCurrentOperation('Authenticating with repositories...');

      const { data, error } = await supabase.functions.invoke('git-sync', {
        body: {
          operation: 'pull',
          customUrl: targetUrl
        }
      });

      if (error) {
        console.error('Pull operation error:', error);
        throw error;
      }

      console.log('Pull operation response:', data);
      setProgress(100);
      
      toast({
        title: "Success",
        description: "Successfully pulled from master repository",
      });

      await fetchLogs();
    } catch (error: any) {
      console.error('Pull error:', error);
      setError(error.message || "Failed to pull from master repository");
      
      toast({
        title: "Pull Failed",
        description: error.message || "Failed to pull from master repository",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentOperation('');
      setProgress(0);
    }
  };

  const pushToCustom = async (targetUrl: string) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      setProgress(10);
      setCurrentOperation('Initializing push operation...');

      console.log('Starting push to master from:', targetUrl);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      setProgress(30);
      setCurrentOperation('Authenticating with repositories...');

      const { data, error } = await supabase.functions.invoke('git-sync', {
        body: {
          operation: 'push',
          customUrl: targetUrl
        }
      });

      if (error) {
        console.error('Push operation error:', error);
        throw error;
      }

      console.log('Push operation response:', data);
      setProgress(100);
      
      toast({
        title: "Success",
        description: "Successfully pushed to master repository",
      });

      await fetchLogs();
    } catch (error: any) {
      console.error('Push error:', error);
      setError(error.message || "Failed to push to master repository");
      
      toast({
        title: "Push Failed",
        description: error.message || "Failed to push to master repository",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentOperation('');
      setProgress(0);
    }
  };

  return {
    isProcessing,
    currentOperation,
    progress,
    logs,
    error,
    pullFromMaster,
    pushToCustom
  };
};