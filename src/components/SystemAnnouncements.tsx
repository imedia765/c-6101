import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SystemAnnouncements = () => {
  const { data: announcements } = useQuery({
    queryKey: ['systemAnnouncements'],
    queryFn: async () => {
      // For now, return a placeholder announcement since we haven't set up the announcements table yet
      return [{
        id: 1,
        title: "Welcome to the Dashboard",
        message: "System announcements will appear here. Stay tuned for important updates and notifications.",
        severity: "default"
      }];
    },
  });

  return (
    <div className="dashboard-card h-[400px] transition-all duration-300 hover:shadow-lg overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 text-dashboard-accent1">System Announcements</h2>
      <div className="space-y-4">
        {announcements?.map((announcement) => (
          <Alert key={announcement.id} variant={announcement.severity === "error" ? "destructive" : "default"} className="bg-dashboard-card border-dashboard-cardBorder">
            <AlertCircle className="h-4 w-4 text-dashboard-accent2" />
            <AlertTitle className="text-dashboard-accent2">{announcement.title}</AlertTitle>
            <AlertDescription className="text-dashboard-text">
              {announcement.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default SystemAnnouncements;