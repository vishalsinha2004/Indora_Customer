import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndoraMap from './components/IndoraMap';
import api from './api/axios';
import Login from './components/Login'; 
import Signup from './components/Signup';

// --- CUSTOM CLAYMORPHISM SVG ICONS ---
const Icons = {
  TwoWheeler: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M12 17h5l2-5h-9l-2-5H3l2 5h4"/>
    </svg>
  ),
  Truck: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Package: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
  Key: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>
    </svg>
  ),
  Settings: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

function CustomerHome({ onLogout }) {
  const savedStep = localStorage.getItem('indora_step') || 'selection';
  const savedOrderId = localStorage.getItem('indora_order_id') || null;

  const [step, setStep] = useState(savedStep);
  const [orderId, setOrderId] = useState(savedOrderId);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [driverName, setDriverName] = useState(null); 
  const [rating, setRating] = useState(0);            
  const [feedback, setFeedback] = useState("");       
  const [isRated, setIsRated] = useState(false);      
  const [offer, setOffer] = useState(null);
  const [status, setStatus] = useState('requested');
  const [vehicleType, setVehicleType] = useState(null);

  useEffect(() => {
    localStorage.setItem('indora_step', step);
  }, [step]);

  useEffect(() => {
    if (orderId) {
      localStorage.setItem('indora_order_id', orderId);
    } else {
      localStorage.removeItem('indora_order_id');
    }
  }, [orderId]);

  const services = [
    { id: '2-wheeler', name: '2 Wheeler', icon: <Icons.TwoWheeler />, active: true, desc: 'Fast & Pocket Friendly' },
    { id: 'trucks', name: 'Trucks', icon: <Icons.Truck />, active: true, desc: 'Heavy Duty Moving' },
    { id: 'packers', name: 'Packers & Movers', icon: <Icons.Package />, active: true, desc: 'Professional Relocation' },
    { id: 'rent', name: 'Rent Vehicle', icon: <Icons.Key />, active: false, desc: 'Coming Soon' },
    { id: 'custom', name: 'Custom Vehicle', icon: <Icons.Settings />, active: false, desc: 'Coming Soon' },
  ];

  const handleServiceSelect = (service) => {
    if (service.active) {
      setVehicleType(service.id);
      setStep('pickup');
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
          setOrderId(response.data.id);
          setStep('finished');
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
          if ((currentStatus === 'accepted' || currentStatus === 'completed')) {
            if (response.data.driver_lat) setDriverLocation([response.data.driver_lat, response.data.driver_lng]);
            if (response.data.driver_name) setDriverName(response.data.driver_name);
            if (response.data.rating) {
              setIsRated(true);
              setRating(response.data.rating);
              if (response.data.feedback) setFeedback(response.data.feedback);
            }
          }
          if (currentStatus === 'completed') clearInterval(interval);
        } catch (error) { console.error("Polling Error:", error); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [orderId, step, status]);

  const submitRating = async () => {
    if (rating === 0) return alert("Please select a star rating");
    try {
      await api.post(`rides/${orderId}/rate_driver/`, { rating: rating, feedback: feedback });
      setIsRated(true);
    } catch (error) {
      console.error("Rating Error:", error);
    }
  };

  return (
    <div className="h-screen w-screen relative bg-slate-100 font-sans overflow-hidden">
      
      {/* 1. SELECTION PAGE */}
      {step === 'selection' && (
        <div className="p-8 max-w-2xl mx-auto h-full flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-black text-blue-600 tracking-tighter italic">INDORA</h1>
            <button 
              onClick={onLogout} 
              className="px-6 py-2 rounded-full bg-white text-slate-600 font-bold shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(0,0,0,0.05)] hover:scale-105 transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
          
          <p className="text-xl font-black text-slate-500 mb-8">What are you moving today?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-8 rounded-[40px] bg-white transition-all duration-300 transform
                  ${service.active 
                    ? 'cursor-pointer shadow-[20px_20px_40px_#e2e8f0,-20px_-20px_40px_#ffffff] hover:scale-[1.03] active:scale-[0.97]' 
                    : 'opacity-50 cursor-not-allowed border-4 border-dashed border-slate-200 shadow-none'}
                `}
              >
                <div className="mb-6 p-4 bg-slate-50 w-fit rounded-3xl shadow-inner">{service.icon}</div>
                <div className="font-black text-2xl text-slate-800">{service.name}</div>
                <div className="text-sm font-bold text-slate-400 mt-1">{service.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAP & BOOKING SECTION */}
      {step !== 'selection' && (
        <>
          <div className="absolute top-6 left-6 z-[2000]">
             <button 
                onClick={() => { setStep('selection'); setOrderId(null); }} 
                className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl font-black text-slate-700 shadow-[8px_8px_16px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] hover:bg-white transition-all flex items-center gap-2"
             >
               <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 12H5m7 7-7-7 7-7"/></svg>
               Back
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
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[92%] max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="p-3 bg-blue-50 rounded-2xl shadow-inner">
                  {services.find(s => s.id === vehicleType)?.icon}
                </div>
                <span className="font-black text-2xl text-slate-800">
                  {services.find(s => s.id === vehicleType)?.name}
                </span>
            </div>

            {status === 'completed' ? (
              <div className="text-center">
                <h2 className="text-3xl font-black text-green-500 mb-2 italic">🏁 Trip Finished!</h2>
                {driverName && <p className="text-lg font-bold text-slate-600 mb-6">Driver: {driverName}</p>}
                
                {!isRated ? (
                  <div className="mb-6 p-6 bg-slate-50 rounded-[30px] shadow-inner">
                    <h4 className="font-black text-slate-700 mb-4">How was your ride?</h4>
                    <div className="flex justify-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star} 
                          onClick={() => setRating(star)}
                          className={`text-4xl cursor-pointer transition-all hover:scale-125 ${star <= rating ? 'text-yellow-400 drop-shadow-md' : 'text-slate-200'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Leave feedback..." 
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-white border-none shadow-inner outline-none h-24 text-slate-600 font-bold placeholder:text-slate-300 resize-none"
                    />
                    <button onClick={submitRating} className="w-full mt-4 p-5 rounded-2xl bg-blue-600 text-white font-black shadow-[4px_4px_10px_rgba(37,99,235,0.4),inset_-4px_-4px_8px_rgba(0,0,0,0.2)] active:scale-95 transition-all">
                      Submit Feedback
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 p-6 bg-green-50 rounded-[30px] text-green-700 font-black shadow-inner">
                    Thank you! Feedback received ✓
                  </div>
                )}

                <button 
                   className="w-full p-4 rounded-2xl bg-slate-200 text-slate-700 font-black shadow-clay-btn active:scale-95 transition-all" 
                   onClick={() => { localStorage.removeItem('indora_step'); localStorage.removeItem('indora_order_id'); window.location.reload(); }}
                >
                  New Booking
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-5 mb-8">
                   <div className="relative pl-6 border-l-4 border-green-400">
                     <div className="text-[10px] font-black text-green-500 uppercase tracking-widest">Pickup</div>
                     <div className="text-sm font-black text-slate-700 line-clamp-1 truncate">{pickupAddress || "Select on map..."}</div>
                   </div>
                   <div className="relative pl-6 border-l-4 border-red-400">
                     <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">Dropoff</div>
                     <div className="text-sm font-black text-slate-700 line-clamp-1 truncate">{dropoffAddress || "Select on map..."}</div>
                   </div>
                </div>

                {step === 'pickup' && (
                  <button className="w-full p-5 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-[8px_8px_20px_rgba(37,99,235,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.2)] hover:bg-blue-700 active:scale-95 transition-all" onClick={() => setStep('dropoff')}>
                    Confirm Pickup
                  </button>
                )}

                {step === 'dropoff' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl shadow-inner border border-slate-100">
                      <input 
                        type="text" 
                        placeholder="Search destination..." 
                        value={dropoffAddress}
                        onChange={(e) => setDropoffAddress(e.target.value)}
                        className="bg-transparent border-none flex-1 p-3 outline-none font-black text-slate-700 placeholder:text-slate-300"
                      />
                      <button 
                        onClick={async () => {
                          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoffAddress)}`);
                          const data = await res.json();
                          if (data.length > 0) setDropoff([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                        }}
                        className="p-3 bg-white rounded-xl shadow-md text-xl"
                      >🔍</button>
                    </div>
                    {dropoff && (
                      <button className="w-full p-5 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl active:scale-95 transition-all" onClick={calculatePrice}>
                        Book Now
                      </button>
                    )}
                  </div>
                )}

                {step === 'finished' && (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="font-black text-2xl text-slate-800">Finding Drivers...</h3>
                    <p className="text-blue-600 font-black text-3xl mt-2 tracking-tighter">₹{offer?.price || '---'}</p>
                  </div>
                )}

                {status === 'accepted' && (
                  <div className="p-8 bg-green-50 rounded-[40px] shadow-inner border border-green-100 text-center animate-pulse">
                    <h3 className="text-green-600 font-black text-2xl">Driver Found!</h3>
                    {driverName && <p className="font-bold text-slate-600 mt-2">Driver: {driverName}</p>}
                    <div className="mt-4 p-4 bg-white rounded-2xl shadow-md inline-block">
                       <span className="text-xs font-black text-slate-400 block mb-1 uppercase tracking-widest">Your OTP</span>
                       <span className="text-4xl font-black text-slate-900 tracking-widest">4592</span>
                    </div>
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
    localStorage.removeItem('indora_step');
    localStorage.removeItem('indora_order_id');
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