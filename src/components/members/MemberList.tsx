
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Member } from '@/types';
import MemberCard from './MemberCard';
import { PlusCircle, Search, UserRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemberListProps {
  members: Member[];
  onAddMember: () => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, onAddMember }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery) ||
      member.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCollect = (memberId: string) => {
    // Navigate to collection form or open modal
    console.log('Collect from member:', memberId);
    toast({
      title: "Collection initiated",
      description: "Opening collection form for this member",
    });
  };

  const handleRemind = (memberId: string) => {
    // Send reminder or open reminder form
    console.log('Send reminder to member:', memberId);
    toast({
      title: "Reminder Sent",
      description: "The reminder has been sent to the member",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onAddMember} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onCollect={handleCollect}
              onRemind={handleRemind}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <UserRound className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">No members found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "You haven't added any members yet."}
          </p>
          {!searchQuery && (
            <Button onClick={onAddMember}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Member
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberList;
