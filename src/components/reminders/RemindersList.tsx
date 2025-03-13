
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, User } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Reminder, Member } from '@/types';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ReminderForm from './ReminderForm';
import { useQueryClient } from '@tanstack/react-query';
import { addReminder } from '@/services/firebase-service';

interface RemindersListProps {
  members: Member[];
  reminders: Reminder[];
}

const RemindersList: React.FC<RemindersListProps> = ({ members, reminders }) => {
  const { toast } = useToast();
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const handleSendReminder = (memberId?: string) => {
    setSelectedMemberId(memberId);
    setIsReminderFormOpen(true);
  };

  const handleReminderSuccess = async (reminderData?: { memberId: string; message: string; dueDate: Date }) => {
    if (reminderData) {
      try {
        const newReminder = {
          memberId: reminderData.memberId,
          message: reminderData.message,
          dueDate: reminderData.dueDate,
          status: 'sent' as const,
          sentDate: new Date(),
          createdAt: new Date(), // Make sure to include createdAt
        };
        
        await addReminder(newReminder);
        
        // Invalidate the reminders query to refetch the data
        queryClient.invalidateQueries({ queryKey: ['reminders'] });
        
        toast({
          title: "Reminder Sent",
          description: "The reminder has been sent successfully.",
        });
      } catch (error) {
        console.error("Error sending reminder:", error);
        toast({
          title: "Error",
          description: "Failed to send reminder. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setIsReminderFormOpen(false);
  };

  return (
    <>
      {reminders.length > 0 ? (
        <div className="space-y-4">
          {reminders.map((reminder) => {
            const member = members.find(m => m.id === reminder.memberId);
            return (
              <Card key={reminder.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{member?.name || "Unknown Member"}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(reminder.dueDate, 'PPP')}</span>
                          </div>
                        </div>
                        <Badge variant={reminder.status === 'sent' ? 'default' : 'secondary'}>
                          {reminder.status === 'sent' ? 'Sent' : 'Pending'}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <p className="text-sm">{reminder.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>No Reminders Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You haven't sent any reminders yet. Use this feature to notify members about their pending subscriptions.
            </p>
            <Button variant="outline" onClick={() => handleSendReminder()}>
              <Bell className="mr-2 h-4 w-4" />
              Create Your First Reminder
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <ReminderForm 
            members={members}
            selectedMemberId={selectedMemberId}
            onSuccess={handleReminderSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemindersList;
