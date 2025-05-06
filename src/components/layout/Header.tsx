import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, LogOut } from 'lucide-react';
import UserContext from '../../contexts/UserContext';
import './Header.css';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <Home size={24} />
          <span>House Finder</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/properties/add" onClick={() => setMenuOpen(false)}>Add Property</Link>
                </li>
                <li>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                </li>
                <li className="nav-user">
                  <div className="user-menu">
                    <span className="user-greeting">Hello, {user?.name}</span>
                    <button onClick={handleLogout} className="logout-btn">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                </li>
                <li>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;