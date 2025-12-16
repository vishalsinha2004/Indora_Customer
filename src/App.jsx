import React, { useState } from 'react';
import IndoraMap from './components/IndoraMap';
import api from './api/axios'; // The file we created earlier

function App() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [step, setStep] = useState('pickup'); // 'pickup', 'dropoff', or 'finished'
  const [offer, setOffer] = useState(null);

  const calculatePrice = async () => {
    if (!pickup || !dropoff) return;

    try {
      // Call your Django API
      const response = await api.post('rides/', {
        pickup_lat: pickup[0],
        pickup_lng: pickup[1],
        dropoff_lat: dropoff[0],
        dropoff_lng: dropoff[1]
      });
      
      console.log("API Response:", response.data);
      setOffer(response.data); // Save price and distance
      setStep('finished');
    } catch (error) {
      console.error("Error calculating price:", error);
      alert("Error connecting to server!");
    }
  };

  return (
    <div className="App">
      {/* MAP LAYER */}
      <IndoraMap 
        pickup={pickup} 
        setPickup={setPickup} 
        dropoff={dropoff} 
        setDropoff={setDropoff} 
        step={step}
      />
      
      {/* UI OVERLAY */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 1000, 
        background: 'white', padding: '20px', borderRadius: '10px', width: '300px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h2>Indora Booking</h2>
        
        {step === 'pickup' && (
          <div>
            <p>📍 Click on the map to set <b>Pickup</b></p>
            {pickup && <button className="btn-primary" onClick={() => setStep('dropoff')}>Confirm Pickup</button>}
          </div>
        )}

        {step === 'dropoff' && (
          <div>
             <p>🏁 Click on the map to set <b>Dropoff</b></p>
             {dropoff && <button className="btn-primary" onClick={calculatePrice}>Calculate Price</button>}
          </div>
        )}

        {step === 'finished' && offer && (
          <div>
            <h3>Ride Estimate</h3>
            <p>📏 Distance: <b>{offer.distance_km} km</b></p>
            <p>💰 Price: <b>₹{offer.price}</b></p>
            <button className="btn-primary" style={{backgroundColor: 'green'}}>Confirm Booking</button>
            <br/><br/>
            <button onClick={() => { setStep('pickup'); setPickup(null); setDropoff(null); setOffer(null); }}>
              Book Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;