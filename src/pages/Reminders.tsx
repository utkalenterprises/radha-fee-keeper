
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const Reminders: React.FC = () => {
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
          <Button className="w-full md:w-auto">
            <Bell className="mr-2 h-4 w-4" />
            Send New Reminder
          </Button>
        </section>

        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>No Reminders Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You haven't sent any reminders yet. Use this feature to notify members about their pending subscriptions.
            </p>
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Create Your First Reminder
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reminders;
