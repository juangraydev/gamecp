import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import CharacterSearch from './pages/CharacterSearch'; 
import CharacterLogs from './pages/CharacterLogs';
import AuthenticatedLayout from './components/AuthenticatedLayout';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages (Public) */}
        <Route path="/login" element={
          <div className="auth-container">
            <Login onLogin={() => setIsAuthenticated(true)} />
          </div>
        } />
        <Route path="/register" element={
          <div className="auth-container">
            <Register />
          </div>
        } />

        {/* Protected Dashboard (Private) */}
        <Route element={
          isAuthenticated ? 
          <AuthenticatedLayout onLogout={() => setIsAuthenticated(false)} /> : 
          <Navigate to="/login" />
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/character/search" element={<CharacterSearch />} />
          <Route path="/character/logs" element={<CharacterLogs />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}