
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { UserRound, Phone, MapPin, IndianRupee, Calendar } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onCollect: (memberId: string) => void;
  onRemind: (memberId: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onCollect, onRemind }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
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
        <Button variant="outline" size="sm" onClick={() => onRemind(member.id)}>
          Send Reminder
        </Button>
        <Button size="sm" onClick={() => onCollect(member.id)}>
          Collect Fee
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberCard;
