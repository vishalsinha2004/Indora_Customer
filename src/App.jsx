import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndoraMap from './components/IndoraMap';
import api from './api/axios';
import Login from './components/Login'; 
import Signup from './components/Signup';

function CustomerHome({ onLogout }) {
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
    try {
        // Ensure these keys (pickup_lat, etc.) match your views.py exactly
        const response = await api.post('rides/', {
            pickup_lat: pickup[0], 
            pickup_lng: pickup[1],
            dropoff_lat: dropoff[0], 
            dropoff_lng: dropoff[1],
            pickup_address: pickupAddress,
            dropoff_address: dropoffAddress
        });

        setOffer(response.data); // Save the price/order info

        const options = {
            key: "rzp_test_SHfqRqFecIslSG", 
            amount: response.data.price * 100, 
            currency: "INR",
            name: "Indora Rides",
            order_id: response.data.razorpay_order_id,
            handler: async function (res) {
                await api.post(`rides/${response.data.id}/verify_payment/`, {
                    razorpay_order_id: res.razorpay_order_id,
                    razorpay_payment_id: res.razorpay_payment_id,
                    razorpay_signature: res.razorpay_signature
                });
                setStep('finished');
                setOrderId(response.data.id);
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Full Error Object:", error);
        // This will show you exactly what the server said
        const errorMsg = error.response?.data?.detail || error.message || "Unknown Error";
        alert(`❌ Pricing Error: ${errorMsg}`);
    }
};
  useEffect(() => {
    let interval;
    if (orderId && step === 'finished') {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`rides/${orderId}/`);
          const currentStatus = response.data.status.toLowerCase();

          if (currentStatus !== status) {
            setStatus(currentStatus);
          }

          if (currentStatus === 'accepted' && response.data.driver_lat) {
            setDriverLocation([response.data.driver_lat, response.data.driver_lng]);
          }

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
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2000 }}>
        <button onClick={onLogout} style={{ padding: '5px 15px', borderRadius: '20px', background: 'white', border: '1px solid red', color: 'red', cursor: 'pointer' }}>Logout</button>
      </div>

      <IndoraMap 
        pickup={pickup} setPickup={setPickup} 
        dropoff={dropoff} setDropoff={setDropoff}
        driverLocation={driverLocation}
        pickupAddress={pickupAddress}
        dropoffAddress={dropoffAddress}
        setPickupAddress={setPickupAddress}
        setDropoffAddress={setDropoffAddress}
        step={step} 
        setStep={setStep}
        routeGeometry={offer ? offer.route_geometry : null}
      />
      
      <div style={{
        position: 'absolute', top: '20px', left: '20px', zIndex: 1000, 
        background: 'white', padding: '20px', borderRadius: '10px', width: '320px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{marginTop: 0}}>Indora Booking</h2>

        {/* --- REAL-TIME ADDRESS DISPLAY SECTION --- */}
        <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' }}>
          <div style={{ marginBottom: '8px', borderLeft: '3px solid #27ae60', paddingLeft: '10px' }}>
            <small style={{ color: 'gray', fontSize: '10px', display: 'block' }}>PICKUP</small>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#333' }}>
              {pickupAddress || "Not set"}
            </p>
          </div>

          <div style={{ borderLeft: '3px solid #e74c3c', paddingLeft: '10px' }}>
            <small style={{ color: 'gray', fontSize: '10px', display: 'block' }}>DROPOFF</small>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: '#333' }}>
              {dropoffAddress || "Not set"}
            </p>
          </div>
        </div>
        {/* --------------------------------------- */}

        {status === 'completed' ? (
          <div style={{textAlign: 'center'}}>
            <h2 style={{color: '#27ae60'}}>🏁 Trip Finished!</h2>
            <p>Thank you for riding with Indora.</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>Book New Ride</button>
          </div>
        ) : (
          <>
            {step === 'pickup' && (
              <div>
                <p>📍 Set your <b>Pickup</b> location</p>
                {pickup && <button className="btn-primary" style={{width: '100%'}} onClick={() => setStep('dropoff')}>Confirm Pickup Location</button>}
              </div>
            )}

            {step === 'dropoff' && (
              <div>
                <p>🏁 Search for <b>Dropoff</b></p>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter destination..." 
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', flex: 1 }}
                  />
                  <button 
                    onClick={async () => {
                      if(!dropoffAddress) return;
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoffAddress)}`);
                        const data = await res.json();
                        if (data.length > 0) {
                          const { lat, lon } = data[0];
                          setDropoff([parseFloat(lat), parseFloat(lon)]);
                        } else {
                          alert("❌ Address not found.");
                        }
                      } catch (err) { console.error(err); }
                    }}
                    style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '5px', background: '#eee', border: '1px solid #ccc' }}
                  >
                    Search
                  </button>
                </div>
                
                {dropoff && (
                  <button className="btn-primary" onClick={calculatePrice} style={{ width: '100%' }}>
                    Confirm & Calculate Price
                  </button>
                )}
              </div>
            )}

            {step === 'finished' && status === 'requested' && (
              <div style={{textAlign: 'center'}}>
                <h3>Looking for Drivers...</h3>
                <p>💰 Price: <b>₹{offer?.price}</b></p>
              </div>
            )}

            {status === 'accepted' && (
              <div style={{textAlign: 'center'}}>
                <h3 style={{color: 'green'}}>🎉 Driver Found!</h3>
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = (username, token) => {
    localStorage.setItem('access_token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  if (!isLoggedIn) {
    return showLogin ? 
      <Login onLoginSuccess={handleLoginSuccess} switchToSignup={() => setShowLogin(false)} /> : 
      <Signup onSignupSuccess={() => setShowLogin(true)} switchToLogin={() => setShowLogin(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerHome onLogout={handleLogout} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;