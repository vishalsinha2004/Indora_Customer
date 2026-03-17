import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndoraMap from './components/IndoraMap';
import api from './api/axios';
import Login from './components/Login'; 
import Signup from './components/Signup';
import io from 'socket.io-client';

// IMPORT SEPARATED COMPONENTS
import Book from './components/Book';
import Trips from './components/Trips';
import Profile from './components/Profile';
import Help from './components/Help';
import SplashScreen from './components/SplashScreen'; 

// --- PREMIUM SOFT ICONS (Neutral Black) ---
const Icons = {
  TwoWheeler: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900">
      <defs>
        <filter id="premium-shadow-scooter" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#dc2626" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#premium-shadow-scooter)">
        {/* Wheels (Slightly smaller and thicker for a scooter look) */}
        <circle cx="18" cy="16" r="3.5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="18" cy="16" r="1.5" fill="#dc2626"/>
        <circle cx="6" cy="16" r="3.5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="6" cy="16" r="1.5" fill="#dc2626"/>
        
        {/* Front Steering Column / Fork */}
        <path d="M18 16L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        
        {/* Solid Front Shield */}
        <path d="M14 15L15.5 9C16 8 17 8 17 8L16 15Z" fill="white" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        
        {/* Solid Floorboard & Rear Engine Body */}
        <path d="M14 15H5c-1.5 0-2.5-1-2-2.5l.5-1.5h7l3.5 4z" fill="white" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        
        {/* Handlebars */}
        <path d="M14 9l2-1 1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        
        {/* Red Headlight Accent */}
        <circle cx="17.5" cy="9.5" r="1" fill="#dc2626"/>
        
        {/* Red Premium Rounded Seat */}
        <path d="M3.5 11c0-1.5 1-2 2-2h4c1 0 1.5.5 1 2z" fill="#dc2626" stroke="#dc2626" strokeWidth="1" strokeLinejoin="round"/>
      </g>
    </svg>
  ),  
  
  Truck: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900">
      <defs>
        <filter id="premium-shadow-truck" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#dc2626" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#premium-shadow-truck)">
        {/* Cargo Box with Red Accent Fill */}
        <rect x="2" y="5" width="12" height="11" rx="1" fill="#dc2626" opacity="0.1"/>
        <rect x="2" y="5" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        {/* Front Cabin */}
        <path d="M14 8h3.5l3.5 4v4h-7V8z" fill="white" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M14 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Wheels */}
        <circle cx="5.5" cy="17.5" r="2.5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="5.5" cy="17.5" r="1" fill="#dc2626"/>
        <circle cx="17.5" cy="17.5" r="2.5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17.5" cy="17.5" r="1" fill="#dc2626"/>
      </g>
    </svg>
  ),
  
  Package: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900">
      <defs>
        <filter id="premium-shadow-box" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#dc2626" floodOpacity="0.18" />
        </filter>
      </defs>
      <g filter="url(#premium-shadow-box)">
        {/* Isometric Top */}
        <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" fill="#f4f4f5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Left Side */}
        <path d="M4 7.5v9L12 21v-9l-8-4.5z" fill="white" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Right Side */}
        <path d="M20 7.5v9L12 21v-9l8-4.5z" fill="#fafafa" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Premium Red Branding Tape */}
        <path d="M16 5.25l-8 4.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 18.75v-9" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  ),
  
  Key: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900">
      <defs>
        <filter id="premium-shadow-key" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#premium-shadow-key)">
        {/* Key Blade */}
        <path d="M12 12l-8 8v3h3v-2h2v-2h2l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Modern Car Fob */}
        <rect x="11" y="4" width="9" height="11" rx="3" fill="white" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 15.5 9.5)"/>
        {/* Fob Button */}
        <circle cx="16" cy="8" r="1.5" fill="#dc2626"/>
        <path d="M13.5 10.5l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    </svg>
  ),
  
  Custom: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-900">
      <defs>
        <filter id="premium-shadow-custom" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#dc2626" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#premium-shadow-custom)">
        {/* Realistic Shield Badge */}
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Express Lightning Bolt */}
        <path d="M13 7l-4 6h3l-1 5 5-7h-3l2-4z" fill="#dc2626" stroke="#dc2626" strokeWidth="1" strokeLinejoin="round"/>
      </g>
    </svg>
  ),

  // (Keep your existing NavHome, NavOrders, NavProfile, and NavHelp below this!)
  NavHome: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  NavOrders: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  NavProfile: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  NavHelp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
};

function CustomerHome({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('home'); 
  const [profileView, setProfileView] = useState('main'); 
  const [expandedFaq, setExpandedFaq] = useState(null);

  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('parceel_customer_username') || "Customer",
    phone: localStorage.getItem('parceel_customer_phone') || "+91 9876543210",
    email: localStorage.getItem('parceel_customer_email') || "customer@parceel.in"
  });

  const savedStep = localStorage.getItem('parceel_step') || 'selection';
  const savedOrderId = localStorage.getItem('parceel_order_id') || null;

  const [step, setStep] = useState(savedStep);
  const [orderId, setOrderId] = useState(savedOrderId);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [driverName, setDriverName] = useState(""); 
  const [driverPhone, setDriverPhone] = useState(""); 
  const [rating, setRating] = useState(0);            
  const [feedback, setFeedback] = useState("");       
  const [isRated, setIsRated] = useState(false);      
  const [offer, setOffer] = useState(null);
  const [status, setStatus] = useState('requested');
  const [vehicleType, setVehicleType] = useState(null);
  
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [hasPaid, setHasPaid] = useState(false);

  // --- SMART FULLSCREEN LOGIC ---
  // Returns true if we are on Profile, Trips, Help, OR the initial Selection screen
  const isFullScreen = currentTab !== 'home' || step === 'selection';

  useEffect(() => { localStorage.setItem('parceel_step', step); }, [step]);
  useEffect(() => {
    if (orderId) localStorage.setItem('parceel_order_id', orderId);
    else localStorage.removeItem('parceel_order_id');
  }, [orderId]);

  useEffect(() => {
    if (currentTab !== 'profile') setProfileView('main');
    if (currentTab !== 'help') setExpandedFaq(null);
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === 'orders') {
      setLoadingHistory(true);
      api.get('/api/rides/')
        .then(res => setOrderHistory(res.data.sort((a, b) => b.id - a.id)))
        .catch(err => console.error(err))
        .finally(() => setLoadingHistory(false));
    }
  }, [currentTab]);

  const services = [
    { id: '2-wheeler', name: '2 Wheeler', icon: <Icons.TwoWheeler />, active: true, desc: 'Fast & Pocket Friendly' },
    { id: 'trucks', name: 'Trucks', icon: <Icons.Truck />, active: true, desc: 'Heavy Duty Moving' },
    { id: 'packers', name: 'Packers & Movers', icon: <Icons.Package />, active: true, desc: 'Professional Relocation' },
    { id: 'rent', name: 'Rent Vehicle', icon: <Icons.Key />, active: false, desc: 'Coming Soon' },
    { id: ' Custom Vehicle', name: 'Custom Vehicle', icon: <Icons.Custom />, active: false, desc: 'Coming Soon' },

  ];

  const handleServiceSelect = (service) => {
    if (service.active) {
      setVehicleType(service.id);
      setStep('pickup');
    }
  };

  const fetchPrice = async () => {
    try {
      const response = await api.post('/api/rides/calculate_fare/', {
        pickup_lat: pickup[0], pickup_lng: pickup[1],
        dropoff_lat: dropoff[0], dropoff_lng: dropoff[1]
      });
      setOffer(response.data);
    } catch (error) { alert(`❌ Error: ${error.response?.data?.detail || "Could not calculate price"}`); }
  };

  const bookRide = async () => {
    if (!offer) return;
    try {
      const response = await api.post('/api/rides/', {
        pickup_lat: pickup[0], pickup_lng: pickup[1],
        dropoff_lat: dropoff[0], dropoff_lng: dropoff[1],
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        vehicle_type: vehicleType
      });
      setOrderId(response.data.id);
      setStep('finished');
    } catch (error) {
      alert("❌ Failed to book ride. Please try again.");
    }
  };

  const payForRide = async () => {
    if (!offer || !orderId) return;
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SHfqRqFecIslSG", 
      amount: parseInt(offer.price * 100), 
      currency: "INR",
      name: "Parceel Rides",
      order_id: offer.razorpay_order_id,
      handler: async function (res) {
        try {
          await api.post(`/api/rides/${orderId}/verify_payment/`, {
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature
          });
        } catch (error) {
          console.error("Backend sync failed, but payment went through.");
        } finally {
          setHasPaid(true); 
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
        alert("Payment Failed. You can try again or Pay with Cash.");
    });
    rzp.open();
  };

  useEffect(() => {
    if (!orderId || step !== 'finished') return;
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://parceel-api.onrender.com';
    const socket = io(socketUrl);
    socket.emit('join_order', { order_id: orderId });

    const fetchCurrentStatus = async () => {
      try {
        const response = await api.get(`/api/rides/${orderId}/`);
        setStatus(response.data.status.toLowerCase());
        setOffer(response.data); 

        if (response.data.driver_name) setDriverName(response.data.driver_name);
        if (response.data.driver_phone) setDriverPhone(response.data.driver_phone);
        if (response.data.driver_lat) setDriverLocation([response.data.driver_lat, response.data.driver_lng]);
        if (response.data.rating) {
          setIsRated(true); setRating(response.data.rating); setFeedback(response.data.feedback || "");
        }
      } catch (error) {}
    };

    fetchCurrentStatus();
    socket.on('ride_accepted_event', fetchCurrentStatus);
    socket.on('ride_completed_event', fetchCurrentStatus);
    socket.on('driver_location_update', (data) => {
        if (data.lat && data.lng) setDriverLocation([data.lat, data.lng]);
    });

    const interval = setInterval(fetchCurrentStatus, 3000); 
    return () => {
      clearInterval(interval);
      socket.off('ride_accepted_event'); socket.off('ride_completed_event'); socket.off('driver_location_update');
      socket.disconnect();
    };
  }, [orderId, step]);

  const submitRating = async () => {
    if (rating === 0) return alert("Please select a star rating");
    try {
      await api.post(`/api/rides/${orderId}/rate_driver/`, { rating: rating, feedback: feedback });
      setIsRated(true);
    } catch (error) {}
  };

  const handleProfileSave = () => {
    localStorage.setItem('parceel_customer_username', userInfo.name);
    localStorage.setItem('parceel_customer_phone', userInfo.phone);
    localStorage.setItem('parceel_customer_email', userInfo.email);
    alert("Profile Updated Successfully!");
    setProfileView('main');
  };

  const hideScrollbar = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']";

  const DesktopNavBtn = ({ id, label }) => (
    <button 
      onClick={() => setCurrentTab(id)}
      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${currentTab === id ? 'bg-zinc-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] scale-105' : 'text-zinc-500 hover:bg-zinc-100/50 hover:text-zinc-900'}`}
    >
      {label}
    </button>
  );

  const MobileNavBtn = ({ id, icon, label }) => (
    <button 
      onClick={() => setCurrentTab(id)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${currentTab === id ? 'text-red-600' : 'text-zinc-400 hover:text-zinc-700'}`}
    >
      <div className={`mb-1 transition-transform duration-300 ${currentTab === id ? 'scale-110 drop-shadow-[0_2px_8px_rgba(220,38,38,0.3)]' : 'scale-100'}`}>{icon}</div>
      <span className={`text-[10px] font-black uppercase tracking-wider ${currentTab === id ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-screen bg-zinc-50 font-sans flex overflow-hidden relative selection:bg-red-200 selection:text-red-900">
      
      {/* MAP LAYER: Hidden on full-screen tabs. Takes 40vh when booking! */}
      <div className={`absolute top-0 left-0 right-0 z-0 transition-opacity duration-500 bg-zinc-200 
        ${isFullScreen ? 'hidden md:block md:w-[calc(100vw-420px)] md:h-full md:left-[420px]' : 'h-[40vh] md:h-full md:w-[calc(100vw-420px)] md:left-[420px]'}`}
      >
        <IndoraMap 
          pickup={pickup} setPickup={setPickup} dropoff={dropoff} setDropoff={setDropoff}
          driverLocation={driverLocation} pickupAddress={pickupAddress} dropoffAddress={dropoffAddress}
          setPickupAddress={setPickupAddress} setDropoffAddress={setDropoffAddress}
          step={step} setStep={setStep} routeGeometry={offer ? offer.route_geometry : null}
          vehicleType={vehicleType}
        />
      </div>

      {/* --- SMART DYNAMIC PANEL --- */}
      <div className={`
        fixed md:bottom-0 left-0 w-full z-[2000] flex flex-col pointer-events-auto
        md:relative md:w-[420px] md:h-full md:max-h-full
        bg-white/75 backdrop-blur-3xl md:bg-white/85
        md:rounded-none
        shadow-[0_-20px_50px_rgba(0,0,0,0.06)] md:shadow-[15px_0_50px_rgba(0,0,0,0.04)]
        border-t border-white/60 md:border-t-0 md:border-r transition-all duration-400 ease-out
        ${isFullScreen ? 'top-0 h-[calc(100vh-64px)] pt-6 rounded-none' : 'bottom-[64px] h-[60vh] rounded-t-[36px]'} 
      `}>
        
        {/* MOBILE FULL-SCREEN BRANDING HEADER (Inside the panel so it doesn't overlap!) */}
        {isFullScreen && (
          <div className="md:hidden px-6 pb-2 shrink-0 animate-fade-in">
             <h1 className="text-3xl font-black text-red-600 italic tracking-tighter drop-shadow-sm">PARCEEL</h1>
          </div>
        )}

        <div className="hidden md:flex flex-col p-8 pb-6 shrink-0 border-b border-zinc-200/50 bg-white/40">
           <h1 className="text-4xl font-black text-red-600 italic tracking-tighter mb-6 cursor-pointer drop-shadow-sm" onClick={() => {setCurrentTab('home'); setStep('selection');}}>PARCEEL</h1>
           <div className="flex flex-wrap gap-1">
              <DesktopNavBtn id="home" label="Book" />
              <DesktopNavBtn id="orders" label="Trips" />
              <DesktopNavBtn id="profile" label="Profile" />
              <DesktopNavBtn id="help" label="Help" />
           </div>
        </div>

        {/* CONTENT AREA: Hidden scroll on booking steps, active scroll on full screen */}
        <div className={`flex-1 px-5 md:px-8 py-2 md:py-8 pb-4 md:pb-8 ${!isFullScreen ? 'overflow-hidden' : `overflow-y-auto ${hideScrollbar}`}`}>
          
          {currentTab === 'home' && (
            <Book 
              step={step} setStep={setStep} services={services} handleServiceSelect={handleServiceSelect} vehicleType={vehicleType}
              pickupAddress={pickupAddress} setPickupAddress={setPickupAddress} setPickup={setPickup}
              dropoffAddress={dropoffAddress} setDropoffAddress={setDropoffAddress} setDropoff={setDropoff} setOffer={setOffer}
              pickup={pickup} dropoff={dropoff} offer={offer} fetchPrice={fetchPrice} bookRide={bookRide} status={status}
              driverName={driverName} driverPhone={driverPhone} isRated={isRated} rating={rating} setRating={setRating}
              feedback={feedback} setFeedback={setFeedback} submitRating={submitRating} setOrderId={setOrderId}
              payForRide={payForRide} hasPaid={hasPaid} setHasPaid={setHasPaid}
            />
          )}

          {currentTab === 'orders' && <Trips loadingHistory={loadingHistory} orderHistory={orderHistory} />}
          
          {currentTab === 'profile' && (
            <Profile 
              profileView={profileView} setProfileView={setProfileView} userInfo={userInfo} 
              setUserInfo={setUserInfo} handleProfileSave={handleProfileSave} onLogout={onLogout} 
            />
          )}

          {currentTab === 'help' && <Help expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />}

        </div>
      </div>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl border-t border-white/60 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)] z-[3000] pointer-events-auto transition-transform duration-400 ease-out`}>
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
          <MobileNavBtn id="home" icon={<Icons.NavHome />} label="Book" />
          <MobileNavBtn id="orders" icon={<Icons.NavOrders />} label="Trips" />
          <MobileNavBtn id="profile" icon={<Icons.NavProfile />} label="Profile" />
          <MobileNavBtn id="help" icon={<Icons.NavHelp />} label="Help" />
        </div>
      </div>
      
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('server_awake') !== 'true';
  });
  
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    if (!showSplash) return;

    const wakeUpServer = async () => {
      try {
        await api.get('/api/rides/'); 
      } catch (error) {
      } finally {
        setIsServerReady(true); 
        sessionStorage.setItem('server_awake', 'true'); 
      }
    };

    wakeUpServer();
  }, [showSplash]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = (username, token) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('parceel_customer_username', username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('parceel_step');
    localStorage.removeItem('parceel_order_id');
    localStorage.removeItem('parceel_customer_username');
    setIsLoggedIn(false);
    window.location.reload();
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} isServerReady={isServerReady} />;
  }

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