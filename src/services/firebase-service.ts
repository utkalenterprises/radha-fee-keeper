
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Member, Payment, Reminder } from '@/types';

// Collection references
const membersCollection = collection(db, 'members');
const paymentsCollection = collection(db, 'payments');
const remindersCollection = collection(db, 'reminders');

// Member functions
export const getMembers = async (): Promise<Member[]> => {
  const snapshot = await getDocs(membersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    joinDate: doc.data().joinDate?.toDate() || new Date(),
  } as Member));
};

export const getMember = async (id: string): Promise<Member | null> => {
  const docRef = doc(db, 'members', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      joinDate: data.joinDate?.toDate() || new Date(),
    } as Member;
  }
  
  return null;
};

export const addMember = async (member: Omit<Member, 'id'>): Promise<string> => {
  // Convert Date objects to Firestore Timestamps
  const memberData = {
    ...member,
    joinDate: member.joinDate ? Timestamp.fromDate(new Date(member.joinDate)) : serverTimestamp(),
    createdAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(membersCollection, memberData);
  return docRef.id;
};

export const updateMember = async (id: string, member: Partial<Member>): Promise<void> => {
  const memberRef = doc(db, 'members', id);
  
  // Convert Date objects to Firestore Timestamps
  const updateData = { ...member };
  if (member.joinDate) {
    updateData.joinDate = Timestamp.fromDate(new Date(member.joinDate));
  }
  
  await updateDoc(memberRef, updateData);
};

export const deleteMember = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'members', id));
};

// Payment functions
export const getPayments = async (): Promise<Payment[]> => {
  const snapshot = await getDocs(paymentsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate() || new Date(),
  } as Payment));
};

export const getPaymentsByMember = async (memberId: string): Promise<Payment[]> => {
  const q = query(paymentsCollection, where('memberId', '==', memberId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate() || new Date(),
  } as Payment));
};

export const addPayment = async (payment: Omit<Payment, 'id'>): Promise<string> => {
  const paymentData = {
    ...payment,
    date: payment.date ? Timestamp.fromDate(new Date(payment.date)) : serverTimestamp(),
    createdAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(paymentsCollection, paymentData);
  return docRef.id;
};

// Reminder functions
export const getReminders = async (): Promise<Reminder[]> => {
  const snapshot = await getDocs(remindersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dueDate: doc.data().dueDate?.toDate() || new Date(),
    sentDate: doc.data().sentDate?.toDate() || null,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  } as Reminder));
};

export const getRemindersByMember = async (memberId: string): Promise<Reminder[]> => {
  const q = query(remindersCollection, where('memberId', '==', memberId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    dueDate: doc.data().dueDate?.toDate() || new Date(),
    sentDate: doc.data().sentDate?.toDate() || null,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  } as Reminder));
};

export const addReminder = async (reminder: Omit<Reminder, 'id'>): Promise<string> => {
  const reminderData = {
    ...reminder,
    dueDate: reminder.dueDate ? Timestamp.fromDate(new Date(reminder.dueDate)) : null,
    sentDate: reminder.sentDate ? Timestamp.fromDate(new Date(reminder.sentDate)) : null,
    createdAt: reminder.createdAt ? Timestamp.fromDate(new Date(reminder.createdAt)) : serverTimestamp(),
  };
  
  const docRef = await addDoc(remindersCollection, reminderData);
  return docRef.id;
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
    },
  ];
  
  for (const reminder of reminders) {
    await addReminder(reminder);
  }
  
  console.log('Seed data added successfully');
};
