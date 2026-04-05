import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import { useTranslation } from "react-i18next";
import "./i18n";
import EquipmentListing from './equipmentListing';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import EquipmentDetail from './EquipmentDetail';
import AddEquipment from './AddEquipment';
import Header from './Header'; // Using the Material UI Header component
import './App.css';
import './styles.css';

function App() {
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(''); // Corrected useState

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Router>
      <div>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} changeLanguage={changeLanguage}  />

        <div style={{ textAlign: "right", padding: "10px" }}>
          <label htmlFor="language-select">Language: </label>
          <select id="language-select" onChange={changeLanguage} defaultValue={i18n.language}>
            <option value="en">English</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<EquipmentListing searchQuery={searchQuery} />} /> {/* Fixed */}
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
