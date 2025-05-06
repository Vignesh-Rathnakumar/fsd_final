import React, { useState, useEffect } from 'react';
import { Home as HomeIcon } from 'lucide-react';
import PropertyList from '../components/properties/PropertyList';
import SearchFilter, { SearchFilters } from '../components/search/SearchFilter';
import { Property } from '../types/property';
import { getAllProperties } from '../services/propertyService';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch properties';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    let results = [...properties];
    
    // Filter by search query (title or description)
    if (newFilters.query) {
      const query = newFilters.query.toLowerCase();
      results = results.filter(
        property => 
          property.title.toLowerCase().includes(query) || 
          property.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by location
    if (newFilters.location) {
      const location = newFilters.location.toLowerCase();
      results = results.filter(
        property => property.location.toLowerCase().includes(location)
      );
    }
    
    // Filter by min price
    if (newFilters.minPrice) {
      const minPrice = parseInt(newFilters.minPrice);
      results = results.filter(property => property.price >= minPrice);
    }
    
    // Filter by max price
    if (newFilters.maxPrice) {
      const maxPrice = parseInt(newFilters.maxPrice);
      results = results.filter(property => property.price <= maxPrice);
    }
    
    setFilteredProperties(results);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>
              <span className="hero-title-icon"><HomeIcon size={36} /></span>
              Find Your Dream Home
            </h1>
            <p className="hero-subtitle">
              Discover the perfect property that meets all your requirements
            </p>
            <SearchFilter onSearch={handleSearch} initialFilters={filters} />
          </div>
        </div>
      </section>

      <section className="properties-section">
        <div className="container">
          <h2>Available Properties</h2>
          {filteredProperties.length === 0 && !loading && !error ? (
            <div className="no-results">
              <p>No properties match your search criteria.</p>
              <button 
                onClick={() => handleSearch({ query: '', location: '', minPrice: '', maxPrice: '' })}
                className="btn-reset-search"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <PropertyList 
              properties={filteredProperties} 
              loading={loading} 
              error={error} 
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;