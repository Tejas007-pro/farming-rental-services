import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EquipmentListing from './equipmentListing'; // adjust the path as needed
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import './App.css';


function App() {
  return (
    <Router>
      <div>
        <header style={{ padding: '16px', textAlign: 'center' }}>
          <h1>Farming Rental Equipment Service</h1>
          <nav style={{ margin: '16px 0' }}>
            <Link to="/equipment" style={{ marginRight: '16px' }}>Equipment</Link>
            <Link to="/register" style={{ marginRight: '16px' }}>Register</Link>
            <Link to="/login">Login</Link>
          </nav>
        </header>
        <Routes>
            <Route path="/equipment" element={<EquipmentListing />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<EquipmentListing />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;