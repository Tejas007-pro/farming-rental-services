// src/AddEquipment.js
import React, { useState } from 'react';
import axios from 'axios';

const AddEquipment = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rentalPrice: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Create FormData to send text fields and file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('rentalPrice', formData.rentalPrice);
      if (selectedFile) {
        data.append('image', selectedFile);
      }
      const response = await axios.post('http://localhost:5000/api/equipment', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
      // Optionally clear the form fields here
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
          <label>Rental Price:</label>
          <input type="text" name="rentalPrice" value={formData.rentalPrice} onChange={handleChange} required />
        </div>
        <div>
          <label>Select Image:</label>
          <input type="file" name="image" onChange={handleFileChange} required />
        </div>
        <button type="submit">Add Equipment</button>
      </form>
    </div>
  );
};

export default AddEquipment;
