
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Member, Reminder } from '@/types';
import RemindersList from '@/components/reminders/RemindersList';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ReminderForm from '@/components/reminders/ReminderForm';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMembers, addReminder, getReminders } from '@/services/firebase-service';

const Reminders: React.FC = () => {
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch members
  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers
  });

  // Fetch reminders
  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: getReminders
  });

  const handleNewReminder = () => {
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
    <Layout>
      <div className="space-y-8">
        <section className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
            <p className="text-muted-foreground">
              Send reminders to members about their pending subscriptions.
            </p>
          </div>
          <Button className="w-full md:w-auto" onClick={handleNewReminder}>
            <Bell className="mr-2 h-4 w-4" />
            Send New Reminder
          </Button>
        </section>

        <RemindersList members={members} reminders={reminders} />

        <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <ReminderForm 
              members={members}
              onSuccess={handleReminderSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Reminders;
