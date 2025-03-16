import React from 'react';

// Sample hard-coded equipment data
const equipmentData = [
  {
    id: 1,
    name: "Tractor",
    description: "Reliable tractor for farm tasks.",
    imageUrl: "https://via.placeholder.com/150",
    rentalPrice: "₹200/day"
  },
  {
    id: 2,
    name: "Harvester",
    description: "Efficient harvester for crop collection.",
    imageUrl: "https://via.placeholder.com/150",
    rentalPrice: "₹500/day"
  },
  {
    id: 3,
    name: "Plow",
    description: "Durable plow for field preparation.",
    imageUrl: "https://via.placeholder.com/150",
    rentalPrice: "₹100/day"
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
