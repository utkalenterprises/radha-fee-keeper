
import { db } from "@/lib/firebase";
import { Member, Payment, Reminder } from "@/types";
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy,
  Timestamp,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Convert Firebase timestamp to Date object
const convertTimestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  return timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
};

// Members Collection
export const getMembers = async (): Promise<Member[]> => {
  try {
    const q = query(collection(db, "members"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        joinDate: convertTimestampToDate(data.joinDate),
        subscriptionAmount: data.subscriptionAmount,
        status: data.status
      };
    });
  } catch (error) {
    console.error("Error getting members:", error);
    return [];
  }
};

export const addMember = async (member: Omit<Member, 'id'>): Promise<Member | null> => {
  try {
    const newId = uuidv4();
    const memberRef = doc(db, "members", newId);
    
    const memberData = {
      ...member,
      joinDate: serverTimestamp(),
      createdAt: serverTimestamp()
    };
    
    await setDoc(memberRef, memberData);
    
    return {
      id: newId,
      ...member,
      joinDate: new Date()
    };
  } catch (error) {
    console.error("Error adding member:", error);
    return null;
  }
};

// Payments Collection
export const getPayments = async (): Promise<(Payment & { memberName: string })[]> => {
  try {
    const q = query(collection(db, "payments"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const members = await getMembers();
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const member = members.find(m => m.id === data.memberId);
      
      return {
        id: doc.id,
        memberId: data.memberId,
        memberName: member?.name || "Unknown Member",
        amount: data.amount,
        date: convertTimestampToDate(data.date),
        collectedBy: data.collectedBy,
        paymentMethod: data.paymentMethod,
        remarks: data.remarks
      };
    });
  } catch (error) {
    console.error("Error getting payments:", error);
    return [];
  }
};

export const addPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment | null> => {
  try {
    const paymentsRef = collection(db, "payments");
    
    const paymentData = {
      ...payment,
      date: payment.date || new Date(),
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(paymentsRef, paymentData);
    
    return {
      id: docRef.id,
      ...payment
    };
  } catch (error) {
    console.error("Error adding payment:", error);
    return null;
  }
};

// Reminders Collection
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const q = query(collection(db, "reminders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        memberId: data.memberId,
        message: data.message,
        dueDate: convertTimestampToDate(data.dueDate),
        status: data.status,
        sentDate: data.sentDate ? convertTimestampToDate(data.sentDate) : undefined,
        createdAt: convertTimestampToDate(data.createdAt)
      };
    });
  } catch (error) {
    console.error("Error getting reminders:", error);
    return [];
  }
};

export const addReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder | null> => {
  try {
    const remindersRef = collection(db, "reminders");
    
    const reminderData = {
      ...reminder,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(remindersRef, reminderData);
    
    return {
      id: docRef.id,
      ...reminder,
      createdAt: new Date()
    };
  } catch (error) {
    console.error("Error adding reminder:", error);
    return null;
  }
};

// Initial data seeding
export const seedInitialData = async (): Promise<void> => {
  try {
    // Check if members collection is empty
    const membersSnapshot = await getDocs(collection(db, "members"));
    
    if (membersSnapshot.empty) {
      console.log("Seeding initial data...");
      
      // Sample members
      const sampleMembers = [
        {
          name: 'Amit Sharma',
          phone: '9876543210',
          email: 'amit.sharma@example.com',
          address: '123 Main Street, Delhi',
          joinDate: new Date(2022, 3, 15),
          subscriptionAmount: 1000,
          status: 'active',
        },
        {
          name: 'Priya Patel',
          phone: '8765432109',
          email: 'priya.patel@example.com',
          address: '456 Park Avenue, Mumbai',
          joinDate: new Date(2022, 5, 10),
          subscriptionAmount: 500,
          status: 'active',
        },
        {
          name: 'Rahul Singh',
          phone: '7654321098',
          email: 'rahul.singh@example.com',
          address: '789 Gandhi Road, Kolkata',
          joinDate: new Date(2022, 7, 22),
          subscriptionAmount: 750,
          status: 'inactive',
        },
      ];
      
      // Add sample members
      const memberPromises = sampleMembers.map(member => addMember(member));
      const addedMembers = await Promise.all(memberPromises);
      
      // Add sample payments if members were added successfully
      if (addedMembers.length > 0 && addedMembers[0]) {
        const samplePayments = [
          { 
            memberId: addedMembers[0].id, 
            amount: 1000, 
            date: new Date(2023, 5, 15), 
            collectedBy: 'Rajesh Kumar', 
            paymentMethod: 'cash' 
          },
          { 
            memberId: addedMembers[1].id, 
            amount: 500, 
            date: new Date(2023, 5, 20), 
            collectedBy: 'Sanjay Gupta', 
            paymentMethod: 'online' 
          },
          { 
            memberId: addedMembers[0].id, 
            amount: 1000, 
            date: new Date(2023, 4, 15), 
            collectedBy: 'Rajesh Kumar', 
            paymentMethod: 'cash' 
          },
        ];
        
        const paymentPromises = samplePayments.map(payment => addPayment(payment));
        await Promise.all(paymentPromises);
      }
      
      console.log("Initial data seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
};
