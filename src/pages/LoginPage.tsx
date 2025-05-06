import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import UserContext from '../contexts/UserContext';
import { loginUser } from '../services/authService';
import './AuthPages.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        throw new Error('Please enter both email and password');
      }

      // In a real app, this would validate with a server
      // Here we're just simulating success for any non-empty values
      const userData = await loginUser(formData);
      
      // Save the user in context and localStorage
      login(userData);
      
      // Redirect to home
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <UserCircle size={40} />
            <h1>Login to House Finder</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-auth"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;