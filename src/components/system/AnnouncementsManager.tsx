import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { AlertCircle, Trash2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

const AnnouncementsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [deceasedName, setDeceasedName] = useState('');
  const [location, setLocation] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['systemAnnouncements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('system_announcements')
        .insert([{ title, message, severity }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemAnnouncements'] });
      toast({
        title: "Announcement Created",
        description: "Your announcement has been published successfully.",
      });
      setTitle('');
      setMessage('');
      setSeverity('info');
      setDeceasedName('');
      setLocation('');
      setFamilyMembers('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create announcement: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('system_announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemAnnouncements'] });
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete announcement: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate();
  };

  const applyDeathTemplate = () => {
    const template = `إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
"Inna lillahi wa inna ilayhi raji'un"
(Indeed, to Allah we belong and indeed, to Him we will return)

It is with profound sadness that we announce the passing of ${deceasedName || '[Deceased Name]'}.

Location: ${location || '[Location]'}
Family Members: ${familyMembers || '[Family Members]'}

May Allah (SWT) grant the deceased the highest ranks in Jannatul Firdaus and grant patience and strength to the bereaved family during this difficult time.

Please remember the deceased and their family in your prayers.`;

    setTitle(`Death Announcement: ${deceasedName || 'Family Member'}`)
    setMessage(template);
    setSeverity('info');
  };

  const previewTemplate = () => {
    const template = `إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ
"Inna lillahi wa inna ilayhi raji'un"
(Indeed, to Allah we belong and indeed, to Him we will return)

It is with profound sadness that we announce the passing of ${deceasedName || '[Deceased Name]'}.

Location: ${location || '[Location]'}
Family Members: ${familyMembers || '[Family Members]'}

May Allah (SWT) grant the deceased the highest ranks in Jannatul Firdaus and grant patience and strength to the bereaved family during this difficult time.

Please remember the deceased and their family in your prayers.`;

    return template;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-dashboard-card border-dashboard-cardBorder">
        <h3 className="text-lg font-medium mb-4 text-white">Create Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Announcement Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text"
            />
          </div>
          <div>
            <Textarea
              placeholder="Announcement Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text min-h-[200px]"
            />
          </div>
          <div>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            disabled={createMutation.isPending}
            className="bg-dashboard-accent1 hover:bg-dashboard-accent1/80 text-white"
          >
            Publish Announcement
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-dashboard-card border-dashboard-cardBorder">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Death Announcement Template</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 bg-dashboard-card border-dashboard-cardBorder text-dashboard-text"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Deceased Name"
              value={deceasedName}
              onChange={(e) => setDeceasedName(e.target.value)}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text"
            />
          </div>
          <div>
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text"
            />
          </div>
          <div>
            <Textarea
              placeholder="Family Members (one per line)"
              value={familyMembers}
              onChange={(e) => setFamilyMembers(e.target.value)}
              className="bg-dashboard-card border-dashboard-cardBorder text-dashboard-text"
            />
          </div>
          {showPreview && (
            <div className="mt-4 p-4 rounded-lg bg-dashboard-cardHover border border-dashboard-cardBorder">
              <p className="whitespace-pre-wrap text-dashboard-text">{previewTemplate()}</p>
            </div>
          )}
          <Button 
            onClick={applyDeathTemplate}
            className="bg-dashboard-accent2 hover:bg-dashboard-accent2/80 text-white"
          >
            Apply Death Announcement Template
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-dashboard-card border-dashboard-cardBorder">
        <h3 className="text-lg font-medium mb-4 text-white">Current Announcements</h3>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-dashboard-muted">Loading announcements...</p>
          ) : announcements?.length === 0 ? (
            <p className="text-dashboard-muted">No announcements found.</p>
          ) : (
            announcements?.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start justify-between p-4 border border-dashboard-cardBorder rounded-lg bg-dashboard-card/50 hover:bg-dashboard-cardHover/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className={`h-4 w-4 
                      ${announcement.severity === 'info' ? 'text-dashboard-info' : ''}
                      ${announcement.severity === 'success' ? 'text-dashboard-success' : ''}
                      ${announcement.severity === 'warning' ? 'text-dashboard-warning' : ''}
                      ${announcement.severity === 'error' ? 'text-dashboard-error' : ''}
                    `} />
                    <h4 className="font-medium text-white">{announcement.title}</h4>
                  </div>
                  <p className="mt-1 text-sm text-dashboard-text whitespace-pre-wrap">{announcement.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-dashboard-card text-dashboard-muted">
                      {announcement.severity}
                    </span>
                    <span className="text-xs text-dashboard-muted">
                      {format(new Date(announcement.created_at), 'PPp')}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(announcement.id)}
                  disabled={deleteMutation.isPending}
                  className="text-dashboard-muted hover:text-dashboard-error"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnnouncementsManager;
