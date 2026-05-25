import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import "./i18n";
import EquipmentListing from './equipmentListing';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import EquipmentDetail from './EquipmentDetail';
import AddEquipment from './AddEquipment';
import Header from './Header';
import './App.css';
import './styles.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<EquipmentListing searchQuery={searchQuery} />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/add-equipment" element={<AddEquipment />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;