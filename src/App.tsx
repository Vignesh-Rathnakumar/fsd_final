import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import UserDashboardPage from './pages/UserDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <UserProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/properties/add" element={<AddPropertyPage />} />
            <Route path="/properties/edit/:id" element={<EditPropertyPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}

export default App;