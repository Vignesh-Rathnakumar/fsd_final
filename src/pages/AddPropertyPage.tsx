import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropertyForm from '../components/forms/PropertyForm';
import UserContext from '../contexts/UserContext';
import { createProperty } from '../services/propertyService';
import './PropertyFormPages.css';

const AddPropertyPage: React.FC = () => {
  const { user, isAuthenticated } = useContext(UserContext);

  const handleSubmit = async (propertyData: FormData) => {
    if (!user) throw new Error('You must be logged in to add a property');
    
    // Add the user ID to the property data
    propertyData.append('owner', user.id);
    propertyData.append('ownerName', user.name);
    
    // Submit the property data
    await createProperty(propertyData);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="property-form-page">
      <div className="container">
        <div className="page-header">
          <h1>Add a New Property</h1>
          <p>Fill out the form below to list your property</p>
        </div>
        
        <PropertyForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddPropertyPage;