
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MonthlyStats } from '@/types';

interface CollectionSummaryProps {
  data: MonthlyStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-border text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-primary">
          Collected: ₹{payload[0].value.toLocaleString()}
        </p>
        <p className="text-accent">
          Pending: ₹{payload[1].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const CollectionSummary: React.FC<CollectionSummaryProps> = ({ data }) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Collection Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="collected" 
                name="Collected" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                dataKey="pending" 
                name="Pending" 
                fill="hsl(var(--accent))" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={300}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionSummary;
