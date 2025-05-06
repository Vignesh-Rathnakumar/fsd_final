import React, { useState } from 'react';
import './ContactForm.css';
import { Property } from '../../types/property';

interface ContactFormProps {
  property: Property;
}

const ContactForm: React.FC<ContactFormProps> = ({ property }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in "${property.title}" priced at ₹${property.price.toLocaleString('en-IN')}. Please contact me for more information.`,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill all required fields');
      return;
    }
    
    // In a real app, this would send the data to a server
    console.log('Contact form submitted:', {
      propertyId: property._id,
      ...formData,
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="contact-form-success">
        <h3>Thank you for your interest!</h3>
        <p>Your message has been sent to the property owner. They will contact you shortly.</p>
        <button onClick={() => setSubmitted(false)} className="btn-secondary">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>Contact the Owner</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Your Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter your name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Enter your message"
        />
      </div>
      
      <button type="submit" className="btn-accent btn-contact">
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;