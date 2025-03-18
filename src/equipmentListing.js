import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import tractorImage from './sss.jfif';
import  harvesterImage from './harvester.jfif';
import  plowImage from './plow.jfif';

// Sample hard-coded equipment data
const equipmentData = [
  {
    id: 1,
    name: "Tractor",
    description: "Reliable tractor for farm tasks.",
    imageUrl: tractorImage, // Use the imported image
    rentalPrice: "₹1200/day"
  },
  {
    id: 2,
    name: "Harvester",
    description: "Efficient harvester for crop collection.",
    imageUrl: harvesterImage,
    rentalPrice: "₹5000/day"
  },
  {
    id: 3,
    name: "Plow",
    description: "Durable plow for field preparation.",
    imageUrl: plowImage,
    rentalPrice: "₹500/day"
  }
];

const EquipmentListing = () => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px'
    }}>
      {equipmentData.map(item => (
        <div key={item.id} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          width: '250px',
          padding: '16px'
        }}>
          <img src={item.imageUrl} alt={item.name} style={{
            width: '100%',
            borderRadius: '4px'
          }} />
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p><strong>{item.rentalPrice}</strong></p>
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
        </div>
      ))}
    </div>
  );
};

export default EquipmentListing;
