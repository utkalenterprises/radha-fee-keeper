
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardCard from '@/components/dashboard/DashboardCard';
import CollectionSummary from '@/components/dashboard/CollectionSummary';
import { IndianRupee, Users, UserCheck, Clock, CalendarClock } from 'lucide-react';
import { CollectionSummary as CollectionSummaryType, MonthlyStats, Member, Payment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';

// Sample data
const summaryData: CollectionSummaryType = {
  totalMembers: 128,
  activeMembers: 112,
  collectedThisMonth: 56000,
  pendingThisMonth: 12000,
  totalCollectedYearly: 620000,
};

const monthlyData: MonthlyStats[] = [
  { month: 'Jan', collected: 48000, pending: 10000 },
  { month: 'Feb', collected: 52000, pending: 8000 },
  { month: 'Mar', collected: 50000, pending: 12000 },
  { month: 'Apr', collected: 55000, pending: 6000 },
  { month: 'May', collected: 53000, pending: 9000 },
  { month: 'Jun', collected: 54000, pending: 7000 },
];

const recentMembers: Pick<Member, 'id' | 'name' | 'joinDate'>[] = [
  { id: 'm1', name: 'Amit Sharma', joinDate: new Date(2023, 5, 15) },
  { id: 'm2', name: 'Priya Patel', joinDate: new Date(2023, 5, 20) },
  { id: 'm3', name: 'Rahul Singh', joinDate: new Date(2023, 6, 5) },
];

const recentPayments: (Payment & { memberName: string })[] = [
  { 
    id: 'p1', 
    memberId: 'm1', 
    memberName: 'Amit Sharma',
    amount: 1000, 
    date: new Date(2023, 6, 15), 
    collectedBy: 'Rajesh Kumar', 
    paymentMethod: 'cash' 
  },
  { 
    id: 'p2', 
    memberId: 'm2', 
    memberName: 'Priya Patel',
    amount: 500, 
    date: new Date(2023, 6, 16), 
    collectedBy: 'Rajesh Kumar', 
    paymentMethod: 'cash' 
  },
  { 
    id: 'p3', 
    memberId: 'm3', 
    memberName: 'Rahul Singh',
    amount: 750, 
    date: new Date(2023, 6, 17), 
    collectedBy: 'Sanjay Gupta', 
    paymentMethod: 'online' 
  },
];

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to Radha Giridhari Sevaashram's fee collection system.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button className="w-full md:w-auto">Collect New Payment</Button>
            <Button variant="outline" className="w-full md:w-auto">Send Reminders</Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <DashboardCard
            title="Total Members"
            value={summaryData.totalMembers}
            icon={<Users size={18} />}
            description={`${summaryData.activeMembers} active members`}
          />
          <DashboardCard
            title="Collected This Month"
            value={`₹${summaryData.collectedThisMonth.toLocaleString()}`}
            icon={<IndianRupee size={18} />}
            description="From member subscriptions"
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <DashboardCard
            title="Pending Collections"
            value={`₹${summaryData.pendingThisMonth.toLocaleString()}`}
            icon={<Clock size={18} />}
            description="Pending for this month"
            variant="accent"
          />
          <DashboardCard
            title="Total Collected (Yearly)"
            value={`₹${summaryData.totalCollectedYearly.toLocaleString()}`}
            icon={<CalendarClock size={18} />}
            description="Total yearly collection"
            trend={{ value: 8, isPositive: true }}
          />
        </section>

        <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CollectionSummary data={monthlyData} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentMembers.map((member, index) => (
                  <React.Fragment key={member.id}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {formatDistanceToNow(member.joinDate, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentPayments.map((payment, index) => (
                  <React.Fragment key={payment.id}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <IndianRupee className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            From {payment.memberName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{payment.paymentMethod}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(payment.date, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
