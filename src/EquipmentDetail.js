// src/EquipmentDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

// Sample static data (you can replace this with dynamic data or fetch from backend)
const equipmentData = [
  { id: '1', name: "Tractor", description: "Reliable tractor for heavy-duty tasks.", rentalPrice: "₹200/day", available: true },
  { id: '2', name: "Harvester", description: "Efficient harvester for large farms.", rentalPrice: "₹500/day", available: false },
  { id: '3', name: "Plow", description: "Durable plow for field preparation.", rentalPrice: "₹100/day", available: true },
];

const EquipmentDetail = () => {
  const { id } = useParams();
  const equipment = equipmentData.find(item => item.id === id);

  if (!equipment) {
    return <p>Equipment not found.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{equipment.name}</h2>
      <p>{equipment.description}</p>
      <p><strong>{equipment.rentalPrice}</strong></p>
      {equipment.available ? (
        <div>
          <h3>This equipment is available for immediate rental.</h3>
          {/* Add functionality for immediate rental */}
          <button>Rent Now</button>
        </div>
      ) : (
        <div>
          <h3>This equipment is not available now.</h3>
          <p>You can book it for future use:</p>
          {/* Insert booking form or instructions here */}
        </div>
      )}
    </div>
  );
};

export default EquipmentDetail;
