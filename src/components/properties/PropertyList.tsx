import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '../../types/property';
import './PropertyList.css';

interface PropertyListProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, loading, error }) => {
  if (loading) {
    return (
      <div className="property-list-loading">
        <div className="loader"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-list-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="property-list-empty">
        <p>No properties found. Please try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="property-list grid">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
};

export default PropertyList;