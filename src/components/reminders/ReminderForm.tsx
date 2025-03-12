
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Bell, User, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Member } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface ReminderFormProps {
  members: Member[];
  selectedMemberId?: string;
  onSuccess: () => void;
}

const reminderTemplates = [
  {
    id: 'template1',
    title: 'Monthly Subscription Reminder',
    content: 'Radha Giridhari Sevaashram: Your monthly subscription of ₹{amount} is due. Please arrange for payment at your earliest convenience.'
  },
  {
    id: 'template2',
    title: 'Payment Collection Notice',
    content: 'Radha Giridhari Sevaashram: Our representative will visit your address on {date} for monthly subscription collection of ₹{amount}. Thank you.'
  },
  {
    id: 'template3',
    title: 'Pending Payment Reminder',
    content: 'Radha Giridhari Sevaashram: Your subscription payment of ₹{amount} is pending. Please make the payment to continue supporting our services.'
  }
];

const ReminderForm: React.FC<ReminderFormProps> = ({ members, selectedMemberId, onSuccess }) => {
  const { toast } = useToast();
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [memberId, setMemberId] = useState(selectedMemberId || '');
  const [message, setMessage] = useState('');
  const [sendMethod, setSendMethod] = useState('sms');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sendNow, setSendNow] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMember = members.find(m => m.id === memberId);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = reminderTemplates.find(t => t.id === templateId);
    if (template && selectedMember) {
      let content = template.content;
      content = content.replace('{amount}', selectedMember.subscriptionAmount.toString());
      content = content.replace('{date}', dueDate ? format(dueDate, 'PPP') : 'the scheduled date');
      setMessage(content);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log({
        memberId,
        dueDate,
        message,
        sendMethod,
        sendNow
      });
      
      toast({
        title: sendNow ? "Reminder Sent" : "Reminder Scheduled",
        description: sendNow 
          ? "The reminder has been sent successfully." 
          : `The reminder has been scheduled for ${dueDate ? format(dueDate, 'PPP') : 'the selected date'}.`,
      });
      
      setIsSubmitting(false);
      onSuccess();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Send Reminder</CardTitle>
        <CardDescription>Send payment reminder to members</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Member</Label>
            <Select
              value={memberId}
              onValueChange={setMemberId}
            >
              <SelectTrigger id="member" className="w-full">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center">
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMember && (
            <div className="bg-secondary/50 p-3 rounded-md text-sm">
              <p className="font-medium mb-2">Member Details</p>
              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {selectedMember.name} ({selectedMember.phone})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="template">Message Template</Label>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {reminderTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reminder message..."
              rows={4}
              required
            />
            <p className="text-muted-foreground text-xs">
              Character count: {message.length}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-method">Send Via</Label>
            <Select
              value={sendMethod}
              onValueChange={setSendMethod}
            >
              <SelectTrigger id="send-method">
                <SelectValue placeholder="Select send method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                {selectedMember?.email && <SelectItem value="email">Email</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="send-now"
              checked={sendNow}
              onCheckedChange={(checked) => setSendNow(checked as boolean)}
            />
            <Label
              htmlFor="send-now"
              className="text-sm font-normal cursor-pointer"
            >
              Send reminder immediately
            </Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border/30 pt-4">
        <Button variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? 'Sending...' : 'Send Reminder'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReminderForm;
