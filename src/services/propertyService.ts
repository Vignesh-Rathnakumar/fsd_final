import axios from 'axios';
import { Property } from '../types/property';

// In a real app, these would be API calls to a server
// Here we'll use localStorage as a simple database since we don't have a real backend

// Mock API URL
const API_URL = '/api/properties';

// Helper function to get all properties from localStorage
const getPropertiesFromStorage = (): Property[] => {
  const propertiesJSON = localStorage.getItem('properties');
  return propertiesJSON ? JSON.parse(propertiesJSON) : [];
};

// Helper function to save properties to localStorage
const savePropertiesToStorage = (properties: Property[]) => {
  localStorage.setItem('properties', JSON.stringify(properties));
};

// Get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return getPropertiesFromStorage();
};

// Get a property by ID
export const getPropertyById = async (id: string): Promise<Property> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const properties = getPropertiesFromStorage();
  const property = properties.find(p => p._id === id);
  
  if (!property) {
    throw new Error('Property not found');
  }
  
  return property;
};

// Get properties by user ID
export const getUserProperties = async (userId: string): Promise<Property[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const properties = getPropertiesFromStorage();
  return properties.filter(p => p.owner === userId);
};

// Create a new property
export const createProperty = async (propertyData: FormData): Promise<Property> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const properties = getPropertiesFromStorage();
  
  // Extract data from FormData
  const newProperty: Property = {
    _id: Date.now().toString(), // Simple ID generation
    title: propertyData.get('title') as string,
    description: propertyData.get('description') as string,
    location: propertyData.get('location') as string,
    price: parseInt(propertyData.get('price') as string),
    images: [], // We'll handle this separately
    owner: propertyData.get('owner') as string,
    ownerName: propertyData.get('ownerName') as string,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // In a real app, we would upload the images to a server
  // Here we'll just use the file names as fake URLs for demonstration
  const fileList = propertyData.getAll('images') as File[];
  newProperty.images = fileList.map(file => URL.createObjectURL(file));
  
  // Add the new property to the array
  properties.push(newProperty);
  
  // Save to localStorage
  savePropertiesToStorage(properties);
  
  return newProperty;
};

// Update a property
export const updateProperty = async (id: string, propertyData: FormData): Promise<Property> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const properties = getPropertiesFromStorage();
  const propertyIndex = properties.findIndex(p => p._id === id);
  
  if (propertyIndex === -1) {
    throw new Error('Property not found');
  }
  
  // Get the existing property
  const existingProperty = properties[propertyIndex];
  
  // Extract data from FormData
  const updatedProperty: Property = {
    ...existingProperty,
    title: propertyData.get('title') as string,
    description: propertyData.get('description') as string,
    location: propertyData.get('location') as string,
    price: parseInt(propertyData.get('price') as string),
    updatedAt: new Date().toISOString(),
  };
  
  // Handle existing images
  const existingImages = propertyData.getAll('existingImages') as string[];
  
  // Handle new images
  const fileList = propertyData.getAll('images') as File[];
  const newImageUrls = fileList.map(file => URL.createObjectURL(file));
  
  // Combine existing and new images
  updatedProperty.images = [...existingImages, ...newImageUrls];
  
  // Update the property in the array
  properties[propertyIndex] = updatedProperty;
  
  // Save to localStorage
  savePropertiesToStorage(properties);
  
  return updatedProperty;
};

// Delete a property
export const deleteProperty = async (id: string): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const properties = getPropertiesFromStorage();
  const filteredProperties = properties.filter(p => p._id !== id);
  
  // Save to localStorage
  savePropertiesToStorage(filteredProperties);
};