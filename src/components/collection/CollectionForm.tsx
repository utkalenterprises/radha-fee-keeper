import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Member } from '@/types';

interface CollectionFormProps {
  members: Member[];
  selectedMemberId?: string;
  onSuccess: (paymentData?: { 
    memberId: string;
    amount: number;
    date: Date;
    paymentMethod: 'cash' | 'online' | 'other';
    collectedBy: string;
    remarks?: string;
  }) => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ members, selectedMemberId, onSuccess }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [memberId, setMemberId] = useState(selectedMemberId || '');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [collectedBy, setCollectedBy] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberId || !amount || !date || !collectedBy) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare payment data
    const paymentData = {
      memberId,
      amount: Number(amount),
      date: date as Date,
      paymentMethod: paymentMethod as 'cash' | 'online' | 'other',
      collectedBy,
      remarks: remarks || undefined
    };
    
    // Call the onSuccess callback with the payment data
    onSuccess(paymentData);
    setIsSubmitting(false);
  };

  const selectedMember = members.find(m => m.id === memberId);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Record Payment</CardTitle>
        <CardDescription>Record a subscription fee payment from a member</CardDescription>
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
              <p className="font-medium mb-2">Subscription Details</p>
              <p className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Monthly Amount: ₹{selectedMember.subscriptionAmount}
              </p>
              <p className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                Member Status: {selectedMember.status}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online Transfer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collected-by">Collected By</Label>
            <Input
              id="collected-by"
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value)}
              placeholder="Name of collector"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border/30 pt-4">
        <Button variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? 'Recording...' : 'Record Payment'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollectionForm;
