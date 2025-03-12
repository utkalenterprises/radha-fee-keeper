
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Member } from '@/types';
import RemindersList from '@/components/reminders/RemindersList';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState } from 'react';
import ReminderForm from '@/components/reminders/ReminderForm';
import { useToast } from '@/hooks/use-toast';

// Sample data for members
const sampleMembers: Member[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    phone: '9876543210',
    email: 'amit.sharma@example.com',
    address: '123 Main Street, Delhi',
    joinDate: new Date(2022, 3, 15),
    subscriptionAmount: 1000,
    status: 'active',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '8765432109',
    email: 'priya.patel@example.com',
    address: '456 Park Avenue, Mumbai',
    joinDate: new Date(2022, 5, 10),
    subscriptionAmount: 500,
    status: 'active',
  },
  {
    id: '3',
    name: 'Rahul Singh',
    phone: '7654321098',
    email: 'rahul.singh@example.com',
    address: '789 Gandhi Road, Kolkata',
    joinDate: new Date(2022, 7, 22),
    subscriptionAmount: 750,
    status: 'inactive',
  },
];

const Reminders: React.FC = () => {
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const { toast } = useToast();

  const handleNewReminder = () => {
    setIsReminderFormOpen(true);
  };

  const handleReminderSuccess = (reminderData?: { memberId: string; message: string; dueDate: Date }) => {
    setIsReminderFormOpen(false);
    toast({
      title: "Reminder Sent",
      description: "The reminder has been sent successfully.",
    });
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

        <RemindersList members={sampleMembers} />

        <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <ReminderForm 
              members={sampleMembers}
              onSuccess={handleReminderSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Reminders;
