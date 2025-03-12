
export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  joinDate: Date;
  subscriptionAmount: number;
  status: 'active' | 'inactive';
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: Date;
  collectedBy: string;
  paymentMethod: 'cash' | 'online' | 'other';
  remarks?: string;
}

export interface Reminder {
  id: string;
  memberId: string;
  dueDate: Date;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  sentDate?: Date;
  createdAt: Date; // Added the createdAt field to the Reminder interface
}

export interface CollectionSummary {
  totalMembers: number;
  activeMembers: number;
  collectedThisMonth: number;
  pendingThisMonth: number;
  totalCollectedYearly: number;
}

export interface MonthlyStats {
  month: string;
  collected: number;
  pending: number;
}
