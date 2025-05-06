import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { PlusCircle, Home as HomeIcon } from 'lucide-react';
import UserContext from '../contexts/UserContext';
import PropertyList from '../components/properties/PropertyList';
import { getUserProperties } from '../services/propertyService';
import { Property } from '../types/property';
import './UserDashboardPage.css';

const UserDashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useContext(UserContext);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProperties = async () => {
      if (!user) return;
      
      try {
        const data = await getUserProperties(user.id);
        setProperties(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch your properties';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchUserProperties();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>Welcome, {user?.name}</h1>
            <p>Manage your property listings</p>
          </div>
          
          <Link to="/properties/add" className="btn-add-property">
            <PlusCircle size={20} />
            Add New Property
          </Link>
        </div>
        
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Your Properties</h2>
            
            {properties.length === 0 && !loading && !error ? (
              <div className="no-properties">
                <div className="no-properties-icon">
                  <HomeIcon size={48} />
                </div>
                <h3>No Properties Yet</h3>
                <p>You haven't listed any properties yet. Add your first property to get started!</p>
                <Link to="/properties/add" className="btn-add-first">
                  Add Your First Property
                </Link>
              </div>
            ) : (
              <PropertyList 
                properties={properties} 
                loading={loading} 
                error={error} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;