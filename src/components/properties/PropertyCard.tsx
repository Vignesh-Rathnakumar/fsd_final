import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';
import { Property } from '../../types/property';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-card card animate-fade-in">
      <div className="property-image">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.title} 
            loading="lazy" 
          />
        ) : (
          <div className="property-no-image">No Image Available</div>
        )}
      </div>
      <div className="property-content">
        <h3 className="property-title">
          <Link to={`/properties/${property._id}`}>{property.title}</Link>
        </h3>
        <div className="property-location">
          <MapPin size={16} />
          <span>{property.location}</span>
        </div>
        <div className="property-price">
          <Tag size={16} />
          <span>{formatPrice(property.price)}</span>
        </div>
        <p className="property-description">
          {property.description.length > 100
            ? `${property.description.substring(0, 100)}...`
            : property.description}
        </p>
        <Link to={`/properties/${property._id}`} className="btn-view-property">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;