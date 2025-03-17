import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EquipmentListing from './equipmentListing'; // adjust the path as needed
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import EquipmentDetail from './EquipmentDetail';
import AddEquipment from './AddEquipment';
import BookingForm from './BookingForm';
import './App.css';


function App() {
  return (
    <Router>
      <div>
        <header style={{ padding: '16px', textAlign: 'center' }}>
          <h1>Farming Rental Equipment Service</h1>
          <nav style={{ margin: '16px 0' }}>
            <Link to="/equipment" style={{ marginRight: '16px' }}>Equipment</Link>
            <Link to="/add-equipment" style={{ marginRight: '16px' }}>Add Equipment</Link>
            <Link to="/register" style={{ marginRight: '16px' }}>Register</Link>
            <Link to="/login" style={{ marginRight: '16px' }}>Login</Link>
            <Link to="/dashboard" style={{ marginRight: '16px' }}>Dashboard</Link>
            <Link to="/booking">Booking</Link>
          </nav>
        </header>
        <Routes>
            <Route path="/equipment" element={<EquipmentListing />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/add-equipment" element={<AddEquipment />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/" element={<EquipmentListing />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;