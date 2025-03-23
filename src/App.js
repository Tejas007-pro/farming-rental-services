import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import EquipmentListing from './equipmentListing';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import EquipmentDetail from './EquipmentDetail';
import AddEquipment from './AddEquipment';
import BookingForm from './BookingForm';
import Header from './Header'; // Using the Material UI Header component
import './App.css';
import './styles.css';

function App() {
  const [searchQuery, setSearchQuery] = useState(''); // Corrected useState

  return (
    <Router>
      <div>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<EquipmentListing searchQuery={searchQuery} />} /> {/* Fixed */}
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/add-equipment" element={<AddEquipment />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booking" element={<BookingForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
