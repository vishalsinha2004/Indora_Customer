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
import SplashScreen from './components/SplashScreen'; // <--- IMPORT SPLASH SCREEN

// --- PREMIUM SOFT ICONS (Neutral Black) ---
const Icons = {
  TwoWheeler: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900">
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M12 17h5l2-5h-9l-2-5H3l2 5h4"/>
    </svg>
  ),
  Truck: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Package: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
  Key: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>
    </svg>
  ),
  NavHome: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  NavOrders: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  NavProfile: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  NavHelp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
};

function CustomerHome({ onLogout }) {
  const [currentTab, setCurrentTab] = useState('home'); 
  const [profileView, setProfileView] = useState('main'); 
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const touchStartY = useRef(0);

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

  useEffect(() => {
    if (step !== 'selection') setIsSheetExpanded(true);
    else setIsSheetExpanded(false);
  }, [step]);

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

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const distance = touchStartY.current - touchEndY;
    if (distance > 40) setIsSheetExpanded(true);
    else if (distance < -40) setIsSheetExpanded(false);
  };

  const services = [
    { id: '2-wheeler', name: '2 Wheeler', icon: <Icons.TwoWheeler />, active: true, desc: 'Fast & Pocket Friendly' },
    { id: 'trucks', name: 'Trucks', icon: <Icons.Truck />, active: true, desc: 'Heavy Duty Moving' },
    { id: 'packers', name: 'Packers & Movers', icon: <Icons.Package />, active: true, desc: 'Professional Relocation' },
    { id: 'rent', name: 'Rent Vehicle', icon: <Icons.Key />, active: false, desc: 'Coming Soon' },
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
      setIsSheetExpanded(true);
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
      setIsSheetExpanded(false);
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
      
      <div className="absolute inset-0 z-0 md:left-[420px] md:w-[calc(100vw-420px)] w-full transition-all duration-500 bg-zinc-200">
        <IndoraMap 
          pickup={pickup} setPickup={setPickup} dropoff={dropoff} setDropoff={setDropoff}
          driverLocation={driverLocation} pickupAddress={pickupAddress} dropoffAddress={dropoffAddress}
          setPickupAddress={setPickupAddress} setDropoffAddress={setDropoffAddress}
          step={step} setStep={setStep} routeGeometry={offer ? offer.route_geometry : null}
        />
      </div>

      <div className="md:hidden absolute top-6 left-6 right-6 flex justify-between items-center z-[1000] pointer-events-auto">
         {step === 'selection' && currentTab === 'home' && (
            <h1 className="text-3xl font-black text-red-600 italic drop-shadow-sm bg-white/70 backdrop-blur-xl border border-white/50 px-6 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">PARCEEL</h1>
         )}
         {step !== 'selection' && currentTab === 'home' && (
           <button onClick={() => { setStep('selection'); setOrderId(null); setOffer(null); setDropoff(null); }} className="bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-zinc-900 hover:text-red-600 active:scale-90 transition-all">
             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7-7-7 7-7"/></svg>
           </button>
         )}
      </div>

      <div className={`
        fixed bottom-[72px] md:bottom-0 left-0 w-full z-[2000] flex flex-col pointer-events-auto
        md:relative md:w-[420px] md:h-full md:max-h-full
        bg-white/75 backdrop-blur-3xl md:bg-white/85
        rounded-t-[36px] md:rounded-none
        shadow-[0_-20px_50px_rgba(0,0,0,0.06)] md:shadow-[15px_0_50px_rgba(0,0,0,0.04)]
        border-t border-white/60 md:border-t-0 md:border-r transition-all duration-400 ease-out
        ${isSheetExpanded ? 'h-[85vh] md:h-full' : 'h-[50vh] md:h-full'} 
      `}>
        
        <div 
          className="md:hidden w-full pt-5 pb-3 flex justify-center items-center cursor-grab active:cursor-grabbing shrink-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
        >
          <div className="w-16 h-1.5 bg-zinc-300/80 rounded-full"></div>
        </div>

        <div className="hidden md:flex flex-col p-8 pb-6 shrink-0 border-b border-zinc-200/50 bg-white/40">
           <h1 className="text-4xl font-black text-red-600 italic tracking-tighter mb-6 cursor-pointer drop-shadow-sm" onClick={() => {setCurrentTab('home'); setStep('selection');}}>PARCEEL</h1>
           <div className="flex flex-wrap gap-1">
              <DesktopNavBtn id="home" label="Book" />
              <DesktopNavBtn id="orders" label="Trips" />
              <DesktopNavBtn id="profile" label="Profile" />
              <DesktopNavBtn id="help" label="Help" />
           </div>
        </div>

        <div className={`flex-1 overflow-y-auto px-6 py-2 md:px-8 md:py-8 pb-[100px] md:pb-8 ${hideScrollbar}`}>
          
          {currentTab === 'home' && (
            <Book 
              step={step} setStep={setStep} services={services} handleServiceSelect={handleServiceSelect} vehicleType={vehicleType}
              pickupAddress={pickupAddress} setPickupAddress={setPickupAddress} setPickup={setPickup} setIsSheetExpanded={setIsSheetExpanded}
              dropoffAddress={dropoffAddress} setDropoffAddress={setDropoffAddress} setDropoff={setDropoff} setOffer={setOffer}
              pickup={pickup} dropoff={dropoff} offer={offer} fetchPrice={fetchPrice} bookRide={bookRide} status={status}
              driverName={driverName} driverPhone={driverPhone} isRated={isRated} rating={rating} setRating={setRating}
              feedback={feedback} setFeedback={setFeedback} submitRating={submitRating} setOrderId={setOrderId}
              payForRide={payForRide} hasPaid={hasPaid} setHasPaid={setHasPaid}
            />
          )}

          {currentTab === 'orders' && (
            <Trips loadingHistory={loadingHistory} orderHistory={orderHistory} />
          )}

          {currentTab === 'profile' && (
            <Profile 
              profileView={profileView} setProfileView={setProfileView} userInfo={userInfo} 
              setUserInfo={setUserInfo} handleProfileSave={handleProfileSave} onLogout={onLogout} 
            />
          )}

          {currentTab === 'help' && (
            <Help expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
          )}

        </div>
      </div>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl border-t border-white/60 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)] z-[3000] pointer-events-auto transition-transform duration-400 ease-out ${step !== 'selection' && currentTab === 'home' ? 'translate-y-full' : 'translate-y-0'}`}>
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
  
  // --- FIXED: Use sessionStorage to only show splash ONCE per tab session ---
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('parceel_splash_seen') !== 'true';
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('parceel_splash_seen', 'true'); // Save that they saw it
    setShowSplash(false); // Hide the splash screen
  };

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

  return (
    <>
      {/* OVERLAY SPLASH SCREEN */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {/* REST OF THE APP */}
      {!isLoggedIn ? (
        showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} switchToSignup={() => setShowLogin(false)} />
        ) : (
          <Signup onSignupSuccess={() => setShowLogin(true)} switchToLogin={() => setShowLogin(true)} />
        )
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CustomerHome onLogout={handleLogout} />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;