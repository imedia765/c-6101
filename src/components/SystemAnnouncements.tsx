import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { format } from 'date-fns';

const SystemAnnouncements = () => {
  const { data: announcements, refetch } = useQuery({
    queryKey: ['systemAnnouncements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('system_announcements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_announcements'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="dashboard-card h-[600px] transition-all duration-300 hover:shadow-lg overflow-y-auto bg-dashboard-card/50 backdrop-blur-sm border border-dashboard-cardBorder">
      <h2 className="text-2xl font-semibold mb-8 text-dashboard-accent1 tracking-wide">
        System Announcements
      </h2>
      <div className="space-y-6">
        {announcements?.map((announcement) => (
          <Alert 
            key={announcement.id} 
            variant={announcement.severity === "error" ? "destructive" : "default"}
            className={`
              bg-dashboard-card/80 
              border-l-4 
              ${announcement.severity === 'info' ? 'border-l-dashboard-info' : ''}
              ${announcement.severity === 'success' ? 'border-l-dashboard-success' : ''}
              ${announcement.severity === 'warning' ? 'border-l-dashboard-warning' : ''}
              ${announcement.severity === 'error' ? 'border-l-dashboard-error' : ''}
              p-6
              transition-all
              duration-200
              hover:bg-dashboard-cardHover/80
            `}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className={`
                h-5 w-5 mt-1
                ${announcement.severity === 'info' ? 'text-dashboard-info' : ''}
                ${announcement.severity === 'success' ? 'text-dashboard-success' : ''}
                ${announcement.severity === 'warning' ? 'text-dashboard-warning' : ''}
                ${announcement.severity === 'error' ? 'text-dashboard-error' : ''}
              `} />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <AlertTitle className="text-xl font-medium text-white tracking-wide">
                    {announcement.title}
                  </AlertTitle>
                  <span className="text-sm text-dashboard-muted">
                    {format(new Date(announcement.created_at), 'PPp')}
                  </span>
                </div>
                <AlertDescription className="text-dashboard-text text-base leading-relaxed whitespace-pre-wrap">
                  {announcement.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
        {(!announcements || announcements.length === 0) && (
          <Alert className="bg-dashboard-card border-dashboard-cardBorder">
            <AlertCircle className="h-5 w-5 text-dashboard-muted" />
            <AlertTitle className="text-lg font-medium text-dashboard-muted">No Announcements</AlertTitle>
            <AlertDescription className="text-dashboard-text">
              There are currently no system announcements.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SystemAnnouncements;