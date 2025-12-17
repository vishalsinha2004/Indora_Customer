import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndoraMap from './components/IndoraMap';
import api from './api/axios';

function CustomerHome() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");

  const [step, setStep] = useState('pickup');
  const [offer, setOffer] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState('requested');

  const calculatePrice = async () => {
    if (!pickup || !dropoff) return;
    try {
      const response = await api.post('rides/', {
        pickup_lat: pickup[0], pickup_lng: pickup[1],
        dropoff_lat: dropoff[0], dropoff_lng: dropoff[1],
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress
      });
      setOffer(response.data);
      setOrderId(response.data.id);
      setStep('finished');
      setStatus('requested');
    } catch (error) {
      alert("Error connecting to server!");
    }
  };

  // --- REVISED POLLING LOGIC ---
  useEffect(() => {
    let interval;
    if (orderId && step === 'finished') {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`rides/${orderId}/`);
          const currentStatus = response.data.status.toLowerCase();

          // 1. Update overall status
          if (currentStatus !== status) {
            setStatus(currentStatus);
          }

          // 2. Update Driver Location (Option A)
          if (currentStatus === 'accepted' && response.data.driver_lat) {
            setDriverLocation([response.data.driver_lat, response.data.driver_lng]);
          }

          // 3. Stop polling if trip is finished
          if (currentStatus === 'completed') {
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Polling Error:", error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [orderId, step, status]);

  return (
    <div>
      <IndoraMap 
        pickup={pickup} setPickup={setPickup} 
        dropoff={dropoff} setDropoff={setDropoff}
        driverLocation={driverLocation}
        setPickupAddress={setPickupAddress}
        setDropoffAddress={setDropoffAddress}
        step={step} 
        routeGeometry={offer ? offer.route_geometry : null}
      />
      
      <div style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 1000, 
        background: 'white', padding: '20px', borderRadius: '10px', width: '320px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h2>Indora Booking</h2>

        {/* TRIP FINISHED SCREEN */}
        {status === 'completed' ? (
          <div style={{textAlign: 'center'}}>
            <h2 style={{color: '#27ae60'}}>🏁 Trip Finished!</h2>
            <p>Thank you for riding with Indora.</p>
            <div style={{fontSize: '50px', margin: '15px'}}>⭐</div>
            <button className="btn-primary" onClick={() => window.location.reload()}>Book New Ride</button>
          </div>
        ) : (
          <>
            {step === 'pickup' && (
              <div>
                <p>📍 Set <b>Pickup</b></p>
                <p style={{fontSize: '14px', color: '#666'}}>{pickupAddress || "Click on map..."}</p>
                {pickup && <button className="btn-primary" onClick={() => setStep('dropoff')}>Confirm Pickup</button>}
              </div>
            )}

            {step === 'dropoff' && (
              <div>
                <p>🏁 Set <b>Dropoff</b></p>
                <p style={{fontSize: '14px', color: '#666'}}>{dropoffAddress || "Click on map..."}</p>
                {dropoff && <button className="btn-primary" onClick={calculatePrice}>Calculate Price</button>}
              </div>
            )}

            {step === 'finished' && status === 'requested' && (
              <div style={{textAlign: 'center'}}>
                <h3>Looking for Drivers...</h3>
                <div className="loader"></div>
                <p>💰 Price: <b>₹{offer?.price}</b></p>
              </div>
            )}

            {status === 'accepted' && (
              <div style={{textAlign: 'center'}}>
                <h3 style={{color: 'green'}}>🎉 Driver Found!</h3>
                <p>Your taxi is arriving.</p>
                <div style={{fontSize: '40px'}}>🚖</div>
                <p><b>OTP: 4592</b></p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;