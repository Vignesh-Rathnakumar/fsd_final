import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Tag, Calendar, User, Edit, Trash2, ArrowLeft, ChevronLeft, ChevronRight 
} from 'lucide-react';
import UserContext from '../contexts/UserContext';
import ContactForm from '../components/forms/ContactForm';
import { Property } from '../types/property';
import { getPropertyById, deleteProperty } from '../services/propertyService';
import './PropertyDetailPage.css';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch property details';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);
  
  const handlePrevImage = () => {
    if (!property?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    if (!property?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteProperty(id);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete property';
      setError(message);
    }
  };
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="loader"></div>
        <p>Loading property details...</p>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="property-detail-error">
        <p>{error || 'Property not found'}</p>
        <Link to="/" className="btn-back">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    );
  }
  
  const isOwner = user && user.id === property.owner;
  
  return (
    <div className="property-detail-page">
      <div className="container">
        <Link to="/" className="btn-back">
          <ArrowLeft size={16} />
          Back to Listings
        </Link>
        
        <div className="property-detail-content">
          <div className="property-detail-main">
            <div className="property-detail-header">
              <h1>{property.title}</h1>
              <div className="property-meta">
                <div className="property-meta-item">
                  <MapPin size={16} />
                  <span>{property.location}</span>
                </div>
                <div className="property-meta-item">
                  <Calendar size={16} />
                  <span>Listed on {formatDate(property.createdAt)}</span>
                </div>
                {property.owner && (
                  <div className="property-meta-item">
                    <User size={16} />
                    <span>Posted by {property.ownerName || 'Anonymous'}</span>
                  </div>
                )}
              </div>
              
              {isOwner && (
                <div className="property-actions">
                  <Link to={`/properties/edit/${property._id}`} className="btn-edit">
                    <Edit size={16} />
                    Edit
                  </Link>
                  <button onClick={() => setShowDeleteModal(true)} className="btn-delete">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            <div className="property-image-gallery">
              {property.images && property.images.length > 0 ? (
                <>
                  <div className="property-main-image">
                    <img src={property.images[currentImageIndex]} alt={property.title} />
                    
                    {property.images.length > 1 && (
                      <>
                        <button 
                          className="image-nav prev" 
                          onClick={handlePrevImage}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          className="image-nav next" 
                          onClick={handleNextImage}
                          aria-label="Next image"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {property.images.length > 1 && (
                    <div className="property-thumbnails">
                      {property.images.map((image, index) => (
                        <div 
                          key={index}
                          className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          role="button"
                          aria-label={`Image ${index + 1}`}
                        >
                          <img src={image} alt={`${property.title} - Image ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="property-no-image">No images available</div>
              )}
            </div>
            
            <div className="property-price-tag">
              <Tag size={20} />
              <span>{formatPrice(property.price)}</span>
            </div>
            
            <div className="property-description">
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>
          </div>
          
          <div className="property-detail-sidebar">
            <ContactForm property={property} />
          </div>
        </div>
      </div>
      
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this property? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;