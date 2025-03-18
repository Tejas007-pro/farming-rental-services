import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import tractorImage from './sss.jfif';
import  harvesterImage from './harvester.jfif';
import  plowImage from './plow.jfif';



// Sample hard-coded equipment data
const staticEquipment = [
  {
    _id: 'static-1',
    name: "Tractor",
    description: "Reliable tractor for farm tasks.",
    imageUrl: tractorImage,
    rentalPrice: "₹1200/day",
    available: true,
  },
  {
    _id: 'static-2',
    name: "Harvester",
    description: "Efficient harvester for crop collection.",
    imageUrl: harvesterImage,
    rentalPrice: "₹5000/day",
    available: true,
  },
  {
    _id: 'static-3',
    name: "Plow",
    description: "Durable plow for field preparation.",
    imageUrl: plowImage,
    rentalPrice: "₹500/day",
    available: true,
  },
];

const EquipmentListing = () => {
  // Hooks must be declared inside the component function
  const [equipment, setEquipment] = useState(staticEquipment);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/equipment')
      .then(response =>  {
        // Merge fetched data with static data
        // Optionally, filter out duplicates or replace static items if desired
        setEquipment([...staticEquipment, ...response.data.equipment]);
      })
      .catch(err => setError('Failed to fetch equipment.'));
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px'
    }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {equipment.map(item => (
        <div key={item._id} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          width: '250px',
          padding: '16px'
        }}>
         <img
            src={
                  item.imageUrl &&
                  typeof item.imageUrl === 'string' &&
                  (item.imageUrl.startsWith('/uploads') || item.imageUrl.startsWith('uploads'))
                  ? `http://localhost:5000${item.imageUrl.startsWith('/') ? item.imageUrl : '/' + item.imageUrl}`
                  : item.imageUrl || 'https://via.placeholder.com/150'
            }
            alt={item.name}
            style={{ width: '250px',
              height: '150px',
              objectFit: 'cover',  // Ensures the image covers the area while maintaining aspect ratio
              borderRadius: '4px' }}
/>


          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p><strong>{item.rentalPrice}</strong></p>
          <Link to={`/equipment/${item._id}`}>
            <button style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Rent Now
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EquipmentListing;
