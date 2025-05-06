import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types/property';
import './PropertyForm.css';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmit: (propertyData: FormData) => Promise<void>;
  isEditing?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    location: initialData.location || '',
    price: initialData.price?.toString() || '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialData.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    
    // Create URL previews for the new files
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    // Create new arrays without the item at the index
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    // Only remove from images array if it's a new upload (not from initialData)
    if (index < images.length) {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.title || !formData.location || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      // Check if a new property has at least one image
      if (!isEditing && images.length === 0) {
        throw new Error('Please upload at least one image');
      }

      // Create FormData to handle file uploads
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('price', formData.price);

      // Append existing images if editing
      if (isEditing && initialData.images) {
        initialData.images.forEach((url, index) => {
          submitData.append('existingImages', url);
        });
      }

      // Append new images
      images.forEach((file) => {
        submitData.append('images', file);
      });

      await onSubmit(submitData);
      
      // Form submitted successfully, navigate back
      navigate(isEditing ? `/properties/${initialData._id}` : '/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        // Don't revoke initial images passed as props
        if (!initialData.images?.includes(preview)) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews, initialData.images]);

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter property title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe the property"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="Enter property location"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price (₹) *</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          placeholder="Enter property price"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="images">Images {!isEditing && '*'}</label>
        <input
          type="file"
          id="images"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div className="image-previews">
          {previews.map((preview, index) => (
            <div key={index} className="preview-container">
              <img src={preview} alt={`Preview ${index + 1}`} />
              <button 
                type="button" 
                className="remove-image" 
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          onClick={() => navigate(isEditing ? `/properties/${initialData._id}` : '/')}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;