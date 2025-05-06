import { User } from '../contexts/UserContext';

// In a real app, these would be API calls to a server
// Here we'll use localStorage as a simple database since we don't have a real backend

// Mock API URL
const API_URL = '/api/auth';

// Helper function to get users from localStorage
const getUsersFromStorage = (): any[] => {
  const usersJSON = localStorage.getItem('users');
  return usersJSON ? JSON.parse(usersJSON) : [];
};

// Helper function to save users to localStorage
const saveUsersToStorage = (users: any[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Register a new user
export const registerUser = async (userData: any): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsersFromStorage();
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Create a new user
  const newUser = {
    id: Date.now().toString(), // Simple ID generation
    name: userData.name,
    email: userData.email,
    password: userData.password, // In a real app, this would be hashed
    createdAt: new Date().toISOString(),
  };
  
  // Add the new user to the array
  users.push(newUser);
  
  // Save to localStorage
  saveUsersToStorage(users);
  
  // Return user data (without password)
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
};

// Login a user
export const loginUser = async (userData: any): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const users = getUsersFromStorage();
  
  // Find the user by email
  const user = users.find(user => user.email === userData.email);
  
  // Check if user exists and password matches
  if (!user || user.password !== userData.password) {
    throw new Error('Invalid email or password');
  }
  
  // Return user data (without password)
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};