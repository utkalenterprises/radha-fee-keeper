
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Member, Payment } from '@/types';
import { format } from 'date-fns';
import { Search, Download, Plus, IndianRupee, Calendar, User } from 'lucide-react';
import CollectionForm from '@/components/collection/CollectionForm';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const samplePayments: (Payment & { memberName: string })[] = [
  { 
    id: 'p1', 
    memberId: '1', 
    memberName: 'Amit Sharma',
    amount: 1000, 
    date: new Date(2023, 5, 15), 
    collectedBy: 'Rajesh Kumar', 
    paymentMethod: 'cash' 
  },
  { 
    id: 'p2', 
    memberId: '2', 
    memberName: 'Priya Patel',
    amount: 500, 
    date: new Date(2023, 5, 20), 
    collectedBy: 'Sanjay Gupta', 
    paymentMethod: 'online' 
  },
  { 
    id: 'p3', 
    memberId: '1', 
    memberName: 'Amit Sharma',
    amount: 1000, 
    date: new Date(2023, 4, 15), 
    collectedBy: 'Rajesh Kumar', 
    paymentMethod: 'cash' 
  },
  { 
    id: 'p4', 
    memberId: '3', 
    memberName: 'Rahul Singh',
    amount: 750, 
    date: new Date(2023, 4, 22), 
    collectedBy: 'Rajesh Kumar', 
    paymentMethod: 'cash',
    remarks: 'Paid for two months in advance'
  },
];

const Collections: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState(samplePayments);
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | undefined>(undefined);
  const [monthFilter, setMonthFilter] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.collectedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (monthFilter === 'all') return matchesSearch;
    
    const paymentMonth = payment.date.getMonth();
    const currentMonth = new Date().getMonth();
    
    if (monthFilter === 'current') {
      return matchesSearch && paymentMonth === currentMonth;
    } else if (monthFilter === 'previous') {
      return matchesSearch && paymentMonth === currentMonth - 1;
    }
    
    return matchesSearch;
  });

  const handleNewCollection = () => {
    setSelectedMember(undefined);
    setIsCollectionFormOpen(true);
  };

  const handleCollectionSuccess = () => {
    setIsCollectionFormOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Collections</h1>
            <p className="text-muted-foreground">
              Record and manage subscription fee collections
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={handleNewCollection} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6 animate-slide-up">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search collections..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by:</span>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="previous">Previous Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full animate-slide-up" style={{ animationDelay: '100ms' }}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="all">All Collections</TabsTrigger>
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Collection Records</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPayments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPayments.map((payment, index) => (
                      <React.Fragment key={payment.id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <IndianRupee className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                              <Badge variant={payment.paymentMethod === 'cash' ? 'outline' : 'secondary'}>
                                {payment.paymentMethod === 'cash' ? 'Cash' : 'Online'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm">{payment.memberName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {format(payment.date, 'PPP')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:items-end">
                            <p className="text-sm">Collected by: {payment.collectedBy}</p>
                            {payment.remarks && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Note: {payment.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="rounded-full bg-primary/10 p-4 mx-auto w-fit mb-4">
                      <IndianRupee className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No collections found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery 
                        ? `No results for "${searchQuery}"` 
                        : "There are no collection records yet."}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleNewCollection}>
                        <Plus className="mr-2 h-4 w-4" />
                        Record New Collection
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cash">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Cash Collections</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPayments.filter(p => p.paymentMethod === 'cash').length > 0 ? (
                  <div className="space-y-4">
                    {filteredPayments
                      .filter(p => p.paymentMethod === 'cash')
                      .map((payment, index) => (
                        <React.Fragment key={payment.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <IndianRupee className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                                <Badge variant="outline">Cash</Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{payment.memberName}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {format(payment.date, 'PPP')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:items-end">
                              <p className="text-sm">Collected by: {payment.collectedBy}</p>
                              {payment.remarks && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Note: {payment.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No cash collections found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="online">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Online Collections</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPayments.filter(p => p.paymentMethod === 'online').length > 0 ? (
                  <div className="space-y-4">
                    {filteredPayments
                      .filter(p => p.paymentMethod === 'online')
                      .map((payment, index) => (
                        <React.Fragment key={payment.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <IndianRupee className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                                <Badge variant="secondary">Online</Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{payment.memberName}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {format(payment.date, 'PPP')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:items-end">
                              <p className="text-sm">Collected by: {payment.collectedBy}</p>
                              {payment.remarks && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Note: {payment.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No online collections found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isCollectionFormOpen} onOpenChange={setIsCollectionFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <CollectionForm 
            members={sampleMembers}
            selectedMemberId={selectedMember}
            onSuccess={handleCollectionSuccess}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Collections;
