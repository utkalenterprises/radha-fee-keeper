
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Member, Payment, Reminder } from '@/types';
import { format } from 'date-fns';

// Collection references
const membersCollection = collection(db, 'members');
const paymentsCollection = collection(db, 'payments');
const remindersCollection = collection(db, 'reminders');

// Convert Firestore timestamp to Date
const convertTimestampToDate = (data: DocumentData): any => {
  const result: any = { ...data };
  
  // Convert timestamp fields to Date objects
  Object.keys(result).forEach(key => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
  });
  
  return result;
};

// Convert Date to Firestore timestamp
const convertDateToTimestamp = (data: any): any => {
  const result: any = { ...data };
  
  // Convert Date objects to Firestore timestamps
  Object.keys(result).forEach(key => {
    if (result[key] instanceof Date) {
      result[key] = Timestamp.fromDate(result[key]);
    }
  });
  
  return result;
};

// MEMBERS
export const getMembers = async (): Promise<Member[]> => {
  try {
    const snapshot = await getDocs(query(membersCollection, orderBy('name')));
    const members: Member[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      members.push({
        id: doc.id,
        ...convertTimestampToDate(data)
      } as Member);
    });
    
    return members;
  } catch (error) {
    console.error('Error getting members:', error);
    return [];
  }
};

export const addMember = async (member: Omit<Member, 'id'>): Promise<string> => {
  try {
    // Convert Date objects to Firestore timestamps
    const memberData = convertDateToTimestamp(member);
    
    const docRef = await addDoc(membersCollection, memberData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

// PAYMENTS
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const snapshot = await getDocs(query(paymentsCollection, orderBy('date', 'desc')));
    const payments: Payment[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      payments.push({
        id: doc.id,
        ...convertTimestampToDate(data)
      } as Payment);
    });
    
    return payments;
  } catch (error) {
    console.error('Error getting payments:', error);
    return [];
  }
};

export const addPayment = async (payment: Omit<Payment, 'id'>): Promise<string> => {
  try {
    // Convert Date objects to Firestore timestamps
    const paymentData = convertDateToTimestamp(payment);
    
    const docRef = await addDoc(paymentsCollection, paymentData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding payment:', error);
    throw error;
  }
};

// REMINDERS
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const snapshot = await getDocs(query(remindersCollection, orderBy('createdAt', 'desc')));
    const reminders: Reminder[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      reminders.push({
        id: doc.id,
        ...convertTimestampToDate(data)
      } as Reminder);
    });
    
    return reminders;
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

export const addReminder = async (reminder: Omit<Reminder, 'id'>): Promise<string> => {
  try {
    // Convert Date objects to Firestore timestamps
    const reminderData = convertDateToTimestamp(reminder);
    
    const docRef = await addDoc(remindersCollection, reminderData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding reminder:', error);
    throw error;
  }
};

// Seed initial data for testing
export const seedInitialData = async (): Promise<void> => {
  // Check if we already have data
  const membersSnapshot = await getDocs(membersCollection);
  if (!membersSnapshot.empty) {
    console.log('Database already has data, skipping seed');
    return;
  }
  
  console.log('Seeding initial data...');
  
  // Add some sample members
  const members: Omit<Member, 'id'>[] = [
    {
      name: 'Rahul Sharma',
      phone: '9876543210',
      address: '123 Main St, Bangalore',
      subscriptionAmount: 500,
      status: 'active',
      joinDate: new Date('2023-01-15'),
    },
    {
      name: 'Priya Patel',
      phone: '8765432109',
      address: '456 Park Ave, Mumbai',
      subscriptionAmount: 750,
      status: 'active',
      joinDate: new Date('2023-02-20'),
    },
    {
      name: 'Amit Kumar',
      phone: '7654321098',
      address: '789 Lake View, Delhi',
      subscriptionAmount: 500,
      status: 'inactive',
      joinDate: new Date('2023-03-10'),
    },
  ];
  
  // Add members and collect their IDs
  const memberIds: string[] = [];
  for (const member of members) {
    const id = await addMember(member);
    memberIds.push(id);
  }
  
  // Add some sample payments
  const payments: Omit<Payment, 'id'>[] = [
    {
      memberId: memberIds[0],
      amount: 500,
      date: new Date('2023-02-05'),
      paymentMethod: 'cash',
      collectedBy: 'Admin',
      remarks: 'Monthly subscription',
    },
    {
      memberId: memberIds[0],
      amount: 500,
      date: new Date('2023-03-07'),
      paymentMethod: 'online',
      collectedBy: 'Admin',
      remarks: 'Monthly subscription',
    },
    {
      memberId: memberIds[1],
      amount: 750,
      date: new Date('2023-03-15'),
      paymentMethod: 'cash',
      collectedBy: 'Admin',
      remarks: 'Monthly subscription',
    },
  ];
  
  for (const payment of payments) {
    await addPayment(payment);
  }
  
  // Add some sample reminders
  const reminders: Omit<Reminder, 'id'>[] = [
    {
      memberId: memberIds[2],
      message: 'Your subscription payment is due. Please pay at your earliest convenience.',
      dueDate: new Date('2023-04-10'),
      status: 'sent',
      sentDate: new Date('2023-04-01'),
      createdAt: new Date('2023-04-01'), // Added createdAt field
    },
  ];
  
  for (const reminder of reminders) {
    await addReminder(reminder);
  }
  
  console.log('Seed data added successfully');
};
