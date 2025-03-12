
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MemberList from '@/components/members/MemberList';
import { Member } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data
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

const Members: React.FC = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    subscriptionAmount: 500,
    status: 'active',
  });

  const handleAddMember = () => {
    setIsDialogOpen(true);
  };

  const handleCreateMember = () => {
    const member: Member = {
      id: uuidv4(),
      name: newMember.name || '',
      phone: newMember.phone || '',
      email: newMember.email,
      address: newMember.address || '',
      joinDate: new Date(),
      subscriptionAmount: newMember.subscriptionAmount || 500,
      status: newMember.status as 'active' | 'inactive' || 'active',
    };

    setMembers([member, ...members]);
    setIsDialogOpen(false);
    setNewMember({
      name: '',
      phone: '',
      email: '',
      address: '',
      subscriptionAmount: 500,
      status: 'active',
    });

    toast({
      title: "Member Added",
      description: `${member.name} has been added successfully.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Members</h1>
            <p className="text-muted-foreground">
              Manage trust members and their subscription details
            </p>
          </div>
        </section>

        <Tabs defaultValue="all" className="w-full animate-slide-up">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <MemberList members={members} onAddMember={handleAddMember} />
          </TabsContent>
          <TabsContent value="active">
            <MemberList 
              members={members.filter(m => m.status === 'active')} 
              onAddMember={handleAddMember} 
            />
          </TabsContent>
          <TabsContent value="inactive">
            <MemberList 
              members={members.filter(m => m.status === 'inactive')} 
              onAddMember={handleAddMember} 
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new trust member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="col-span-3"
                placeholder="Full name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                className="col-span-3"
                placeholder="Mobile number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="col-span-3"
                placeholder="Email address (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={newMember.address}
                onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                className="col-span-3"
                placeholder="Full address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (₹)
              </Label>
              <Input
                id="amount"
                type="number"
                value={newMember.subscriptionAmount}
                onChange={(e) => setNewMember({...newMember, subscriptionAmount: Number(e.target.value)})}
                className="col-span-3"
                placeholder="Monthly subscription amount"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMember}>
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Members;
