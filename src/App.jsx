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

  // Step starts at 'selection' (Porter Style)
  const [step, setStep] = useState('selection');
  const [offer, setOffer] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [status, setStatus] = useState('requested');
  const [vehicleType, setVehicleType] = useState(null);

  const services = [
    { id: '2-wheeler', name: '2 Wheeler', icon: '🏍️', active: true, desc: 'Fast & Pocket Friendly' },
    { id: 'trucks', name: 'Trucks', icon: '🚛', active: true, desc: 'Fast & Pocket Friendly' },
    { id: 'packers', name: 'Packers & Movers', icon: '📦', active: true, desc: 'Fast & Pocket Friendly' },
    { id: 'rent', name: 'Rent Vehicle', icon: '🔑', active: false, desc: 'Coming Soon' },
    { id: 'custom', name: 'Custom Vehicle', icon: '🛠️', active: false, desc: 'Coming Soon' },
  ];

  const handleServiceSelect = (service) => {
    if (service.active) {
      setVehicleType(service.id);
      setStep('pickup'); // Go to Map/Pickup selection
    }
  };

  const calculatePrice = async () => {
    try {
      const response = await api.post('rides/', {
        pickup_lat: pickup[0], 
        pickup_lng: pickup[1],
        dropoff_lat: dropoff[0], 
        dropoff_lng: dropoff[1],
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        vehicle_type: vehicleType
      });

      setOffer(response.data);

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
      console.error("Pricing Error:", error);
      alert(`❌ Error: ${error.response?.data?.detail || "Could not calculate price"}`);
    }
  };

  useEffect(() => {
    let interval;
    if (orderId && step === 'finished') {
      interval = setInterval(async () => {
        try {
          const response = await api.get(`rides/${orderId}/`);
          const currentStatus = response.data.status.toLowerCase();
          if (currentStatus !== status) setStatus(currentStatus);
          if (currentStatus === 'accepted' && response.data.driver_lat) {
            setDriverLocation([response.data.driver_lat, response.data.driver_lng]);
          }
          if (currentStatus === 'completed') clearInterval(interval);
        } catch (error) { console.error("Polling Error:", error); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [orderId, step, status]);

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: '#f8f9fa' }}>
      
      {/* 1. INITIAL SELECTION PAGE (PORTER STYLE) */}
      {step === 'selection' && (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontWeight: '800', color: '#2563eb' }}>INDORA</h1>
            <button onClick={onLogout} style={{ background: 'none', border: '1px solid #ddd', padding: '5px 15px', borderRadius: '20px' }}>Logout</button>
          </div>
          <p style={{ color: '#666', marginBottom: '20px' }}>What are you moving today?</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'white',
                  border: '2px solid #eee',
                  cursor: service.active ? 'pointer' : 'not-allowed',
                  opacity: service.active ? 1 : 0.7,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{service.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{service.name}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>{service.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAP & BOOKING SECTION */}
      {step !== 'selection' && (
        <>
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 2000 }}>
             <button 
                onClick={() => setStep('selection')} 
                style={{ background: 'white', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
             >
               ← Back
             </button>
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

          {/* Bottom Booking Card */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, 
            background: 'white', padding: '20px', borderRadius: '20px', width: '90%', maxWidth: '400px',
            boxShadow: '0 -5px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{services.find(s => s.id === vehicleType)?.icon}</span>
                <span style={{ fontWeight: 'bold' }}>{services.find(s => s.id === vehicleType)?.name}</span>
            </div>

            {status === 'completed' ? (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#27ae60' }}>🏁 Trip Finished!</h2>
                <button className="btn-primary" style={{width:'100%'}} onClick={() => window.location.reload()}>Book New Ride</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '15px' }}>
                   <div style={{ fontSize: '12px', color: '#27ae60', fontWeight: 'bold' }}>● PICKUP</div>
                   <div style={{ fontSize: '14px', marginBottom: '10px' }}>{pickupAddress || "Select on map..."}</div>
                   <div style={{ fontSize: '12px', color: '#e74c3c', fontWeight: 'bold' }}>● DROPOFF</div>
                   <div style={{ fontSize: '14px' }}>{dropoffAddress || "Select on map..."}</div>
                </div>

                {step === 'pickup' && (
                  <button className="btn-primary" style={{ width: '100%' }} onClick={() => setStep('dropoff')}>
                    Confirm Pickup Location
                  </button>
                )}

                {step === 'dropoff' && (
                  <div>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Search destination..." 
                        value={dropoffAddress}
                        onChange={(e) => setDropoffAddress(e.target.value)}
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', flex: 1 }}
                      />
                      <button 
                        onClick={async () => {
                          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoffAddress)}`);
                          const data = await res.json();
                          if (data.length > 0) setDropoff([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                        }}
                        style={{ padding: '10px', borderRadius: '10px', background: '#eee', border: 'none' }}
                      >🔍</button>
                    </div>
                    {dropoff && <button className="btn-primary" onClick={calculatePrice} style={{ width: '100%' }}>Book Now</button>}
                  </div>
                )}

                {step === 'finished' && (
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div className="loader" style={{ marginBottom: '10px' }}></div>
                    <h3 style={{ margin: 0 }}>Finding Drivers...</h3>
                    <p>Estimated Price: <b>₹{offer?.price}</b></p>
                  </div>
                )}

                {status === 'accepted' && (
                  <div style={{ textAlign: 'center', background: '#f0fff4', padding: '15px', borderRadius: '10px' }}>
                    <h3 style={{ color: 'green', margin: '0 0 5px 0' }}>Driver Found!</h3>
                    <p style={{ margin: 0 }}>Give OTP: <b style={{ fontSize: '20px' }}>4592</b></p>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// App component remains the same
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