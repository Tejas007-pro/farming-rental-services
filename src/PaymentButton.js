// PaymentButton.js
import React from 'react';
import Button from '@mui/material/Button';

const PaymentButton = ({ amount }) => {
  const handlePayment = () => {
    const options = {
      key: 'rzp_test_ZGJM0lCLHewefx', // Replace with your Razorpay Test Key ID
      amount: amount * 100, // Convert rupees to paise
      currency: 'INR',
      name: 'Rental Service',
      description: 'Equipment Rental Payment',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // You might also send response details to your backend for verification
      },
      prefill: {
        name: 'Test User',
        email: 'test.user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Button 
      variant="contained"
      onClick={handlePayment}
      sx={{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '8px',
        boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
        transition: 'background 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
        },
      }}
    >
      Pay Now
    </Button>
  );
};

export default PaymentButton;
