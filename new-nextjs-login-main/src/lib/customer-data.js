// File: lib/customer-data.js
// This file centralizes customer data, with ALL details custom-defined.

// No longer need uuidv4 here as IDs will be custom-defined
// import { v4 as uuidv4 } from 'uuid';

// --- CUSTOM CUSTOMER DATA ---
// Define your initialCustomers array directly with all custom details for each customer.
export const initialCustomers = [
  {
    id: 'CUST001',
    name: 'Kommoju Kalavathi',
    email: 'kalavathi0001@gmail.com',
    registeredDate: '2022-08-06', // Format: YYYY-MM-DD
    status: 'Active', // Can be 'Active' or 'Inactive'
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kommoju+Kalavathi', // Custom avatar URL or initials
    phone: '+91 9959786382', // Custom phone number
    address: '22-74-1/12, skml temple road, S.K.M.l Narayana Nikethan, visakhaptnam-530001', // Custom address
    occupation: 'Homemaker', // Custom occupation
    preferredContactMethod: 'Phone', // Custom preferred contact method
  },
  {
    id: 'CUST002',
    name: 'Kommoju Chandra Mouli',
    email: 'moulichandra934@gmail.com',
    registeredDate: '2022-03-18',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kommoju+Chandra+Mouli',
    phone: '+91 7013956046',
    address: '50-94-8,Ratna Nivas,Near sai baba temple,Santhipuram,Gurudwar,visakhapatnam-530016',
    occupation: 'Wellness coach',
    preferredContactMethod: 'Phone',
  },
  {
    id: 'CUST003',
    name: 'Kommoju Lalitha Kumari',
    email: 'lalithakumarik120@gmail.com',
    registeredDate: '2022-03-18',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kommoju+Lalitha+Kumari',
    phone: '+91 6300271729',
    address: '50-94-8,Ratna Nivas,Near sai baba temple,Santhipuram,Gurudwar,visakhapatnam-530016',
    occupation: 'Homemajer',
    preferredContactMethod: 'Phone',
  },
  {
    id: 'CUST004',
    name: 'Kommoju Midhilesh',
    email: 'dreamdasher2010@gmail.com',
    registeredDate: '2022-03-18',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kommoju+Midhilesh',
    phone: '+91 7207897896',
    address: '50-94-8,Ratna Nivas,Near sai baba temple,Santhipuram,Gurudwar,visakhapatnam-530016',
    occupation: 'Student',
    preferredContactMethod: 'Email',
  },
  {
    id: 'CUST005',
    name: 'Dhakoju Parvathi',
    email: 'parvathidhakoju@gmail.com',
    registeredDate: '2022-04-14',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Dhakoju+Parvathi',
    phone: '+91 9247103873',
    address: 'Gajuwaka',
    occupation: 'Homemaker',
    preferredContactMethod: 'Phone',
  },
  {
    id: 'CUST006',
    name: 'Kommoju Gagan Deep',
    email: 'midhilesh0102@gmail.com',
    registeredDate: '2022-03-18',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kommoju+Gagan+Deep',
    phone: '+91 9247772602',
    address: '50-94-8,Ratna Nivas,Near sai baba temple,Santhipuram,Gurudwar,visakhapatnam-530016',
    occupation: 'student',
    preferredContactMethod: 'Phone',
  },
  // Add more customers here following the same structure:
  /*
  {
    id: 'CUST007',
    name: 'New Customer Name',
    email: 'new.customer@example.com',
    registeredDate: '2024-05-01',
    status: 'Active',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=New+Customer',
    phone: '+1 (111) 222-3333',
    address: '789 Test Rd, Test City, TS 12345',
    lastLogin: '2025-05-27 09:00 AM',
    notes: 'First interaction, seems promising.',
    occupation: 'Engineer',
    preferredContactMethod: 'Email',
  },
  */
];

// Function to find a customer by their ID
export function getCustomerById(id) {
  return initialCustomers.find(customer => customer.id === id);
}
