// src/AddEquipment.js
import React, { useState } from 'react';
import axios from 'axios';

const AddEquipment = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    rentalPrice: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/equipment', formData);
      setMessage(response.data.message);
      // Optionally, clear the form or update state
    } catch (err) {
      setError(err.response?.data.error || 'Failed to add equipment.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Add Equipment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Image URL:</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </div>
        <div>
          <label>Rental Price:</label>
          <input type="text" name="rentalPrice" value={formData.rentalPrice} onChange={handleChange} required />
        </div>
        <button type="submit">Add Equipment</button>
      </form>
    </div>
  );
};

export default AddEquipment;
