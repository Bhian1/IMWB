import React, { useState } from 'react';

function App() {
  const [price, setPrice] = useState('');
  const [addressDisplay, setAddressDisplay] = useState('none');
  const [formData, setFormData] = useState({
    name: '',
    orderType: 'regular',
    weight: '',
    deliveryMethod: 'pickup',
    address: '',
  });

  const calculatePrice = () => {
    const weight = parseFloat(document.getElementById('weight').value);
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;

    const calculatedPrice = orderType === 'regular' ? weight * 29 : weight * 59;

    if (deliveryMethod === 'deliver') {
      setAddressDisplay('block');
    } else {
      setAddressDisplay('none');
    }

    setPrice(calculatedPrice.toFixed(2));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    calculatePrice();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const calculatedPrice = formData.orderType === 'regular' ? formData.weight * 29 : formData.weight * 59;
    const formattedPrice = calculatedPrice.toFixed(2);

    const isConfirmed = window.confirm(`Name: ${formData.name}\nOrder Type: ${formData.orderType}\nWeight: ${formData.weight} kg\nDelivery Method: ${formData.deliveryMethod}\n${formData.deliveryMethod === 'deliver' ? `Delivery Address: ${formData.address}\n` : ''}Price: ₱${formattedPrice}`);

    if (isConfirmed) {
      try {
        const response = await fetch('http://localhost:8081/submitOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            orderType: formData.orderType,
            weight: formData.weight,
            price: formattedPrice,
            deliveryMethod: formData.deliveryMethod,
            deliveryAddress: formData.address,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result);
          setFormData({
            name: '',
            orderType: 'regular',
            weight: '',
            deliveryMethod: 'pickup',
            address: '',
          });
          setPrice('');
          setAddressDisplay('none');
        } else {
          console.error(result);
          alert('Error submitting order. Please try again.');
        }
      } catch (error) {
        console.error(error);
        alert('Error submitting order. Please try again.');
      }
    }
  };

  return (
    <div className="App">
      <form id="orderForm" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required /><br /><br />

        <label>Order Type:</label>
        <input type="radio" id="regular" name="orderType" value="regular" checked={formData.orderType === 'regular'} onChange={handleInputChange} />
        <label htmlFor="regular">Regular</label>
        <input type="radio" id="rush" name="orderType" value="rush" checked={formData.orderType === 'rush'} onChange={handleInputChange} />
        <label htmlFor="rush">Rush</label><br /><br />

        <label htmlFor="weight">Weight (kg):</label>
        <input type="number" id="weight" name="weight" step="0.01" value={formData.weight} onChange={handleInputChange} required /><br /><br />

        <label>Delivery Method:</label>
        <input type="radio" id="pickup" name="deliveryMethod" value="pickup" checked={formData.deliveryMethod === 'pickup'} onChange={handleInputChange} />
        <label htmlFor="pickup">Pickup</label>
        <input type="radio" id="deliver" name="deliveryMethod" value="deliver" checked={formData.deliveryMethod === 'deliver'} onChange={handleInputChange} />
        <label htmlFor="deliver">Deliver</label><br /><br />

        <div id="addressDiv" style={{ display: addressDisplay }}>
          <label htmlFor="address">Delivery Address:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleInputChange}></textarea><br /><br />
        </div>

        <label htmlFor="price">Price:</label>
        <input type="text" id="price" name="price" value={price} readOnly /><br /><br />

        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
}

export default App;