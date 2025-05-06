import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PropertyForm from '../components/forms/PropertyForm';
import UserContext from '../contexts/UserContext';
import { getPropertyById, updateProperty } from '../services/propertyService';
import { Property } from '../types/property';
import './PropertyFormPages.css';

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useContext(UserContext);
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        
        // Check if the user is the owner of the property
        if (user && data.owner !== user.id) {
          setNotAuthorized(true);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch property details';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchProperty();
    } else {
      setLoading(false);
    }
  }, [id, user, isAuthenticated]);
  
  const handleSubmit = async (propertyData: FormData) => {
    if (!user) throw new Error('You must be logged in to edit a property');
    if (!id) throw new Error('Property ID is missing');
    
    // Submit the property data
    await updateProperty(id, propertyData);
  };
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Redirect to home if not authorized
  if (notAuthorized) {
    return <Navigate to="/" />;
  }
  
  if (loading) {
    return (
      <div className="property-form-loading">
        <div className="loader"></div>
        <p>Loading property data...</p>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="property-form-error">
        <p>{error || 'Property not found'}</p>
      </div>
    );
  }

  return (
    <div className="property-form-page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Property</h1>
          <p>Update the details of your property listing</p>
        </div>
        
        <PropertyForm 
          initialData={property} 
          onSubmit={handleSubmit} 
          isEditing={true} 
        />
      </div>
    </div>
  );
};

export default EditPropertyPage;