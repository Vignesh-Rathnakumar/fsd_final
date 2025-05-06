import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <Home size={24} />
            <span>House Finder</span>
          </div>
          <p className="footer-tagline">
            Finding your dream home made simple.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties/add">Add Property</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <MapPin size={16} />
              <span>123 Property Street, Real Estate City</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+91 9876543210</span>
            </li>
            <li>
              <Mail size={16} />
              <span>info@housefinder.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {year} House Finder. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;