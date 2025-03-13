
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
