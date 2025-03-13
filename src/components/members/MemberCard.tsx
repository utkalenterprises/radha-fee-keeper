
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { UserRound, Phone, MapPin, IndianRupee, Calendar } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CollectionForm from '@/components/collection/CollectionForm';
import ReminderForm from '@/components/reminders/ReminderForm';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { addPayment, addReminder } from '@/services/firebase-service';

interface MemberCardProps {
  member: Member;
  onCollect: (memberId: string) => void;
  onRemind: (memberId: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onCollect, onRemind }) => {
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [isReminderFormOpen, setIsReminderFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCollect = () => {
    setIsCollectionFormOpen(true);
  };

  const handleRemind = () => {
    setIsReminderFormOpen(true);
  };

  const handleCollectionSuccess = async (paymentData?: { 
    memberId: string;
    amount: number;
    date: Date;
    paymentMethod: 'cash' | 'online' | 'other';
    collectedBy: string;
    remarks?: string;
  }) => {
    if (paymentData) {
      try {
        await addPayment(paymentData);
        
        // Invalidate the payments query to refetch the data
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        
        toast({
          title: "Payment Recorded",
          description: "The payment has been successfully recorded.",
        });
        onCollect(member.id);
      } catch (error) {
        console.error("Error recording payment:", error);
        toast({
          title: "Error",
          description: "Failed to record payment. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setIsCollectionFormOpen(false);
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
        onRemind(member.id);
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
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                  {member.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span className="line-clamp-1">{member.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee size={14} />
                  <span>₹{member.subscriptionAmount}/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Member for {formatDistanceToNow(member.joinDate, { addSuffix: false })}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2 justify-end border-t border-border/30 mt-4">
          <Button variant="outline" size="sm" onClick={handleRemind}>
            Send Reminder
          </Button>
          <Button size="sm" onClick={handleCollect}>
            Collect Fee
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isCollectionFormOpen} onOpenChange={setIsCollectionFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <CollectionForm 
            members={[member]}
            selectedMemberId={member.id}
            onSuccess={handleCollectionSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isReminderFormOpen} onOpenChange={setIsReminderFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <ReminderForm 
            members={[member]}
            selectedMemberId={member.id}
            onSuccess={handleReminderSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberCard;
