import React from 'react';
import PromoBanners from './PromoBanners';

const Book = ({ 
    step, setStep, services, handleServiceSelect, vehicleType, 
    pickupAddress, setPickupAddress, setPickup, setIsSheetExpanded, 
    dropoffAddress, setDropoffAddress, setDropoff, setOffer, 
    pickup, dropoff, offer, fetchPrice, bookRide, status, 
    driverName, driverPhone, isRated, rating, setRating, 
    feedback, setFeedback, submitRating, setOrderId,
    payForRide, hasPaid, setHasPaid
}) => {
  return (
    <div className="animate-fade-in h-full">
      {step === 'selection' && (
        <div className="flex flex-col h-full">
          
          {/* --- IMPORTED SEPARATED BANNERS --- */}
          <PromoBanners />
          
          <p className="text-lg font-black text-zinc-800 mb-4 tracking-tight">What are you moving?</p>
          <div className="grid grid-cols-2 gap-4 pb-4">
            {services.map((service) => (
              <div 
                key={service.id} onClick={() => handleServiceSelect(service)}
                className={`p-5 rounded-[24px] bg-white/50 backdrop-blur-lg transition-all duration-300 transform border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                  ${service.active ? 'cursor-pointer hover:bg-white hover:border-red-200 hover:shadow-[0_8px_25px_rgba(220,38,38,0.08)] active:scale-95 group' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className={`mb-4 p-3 w-fit rounded-2xl transition-colors duration-300 ${service.active ? 'bg-zinc-100 group-hover:bg-red-50 group-hover:text-red-600' : 'bg-zinc-100'}`}>
                   {service.icon}
                </div>
                <div className="font-black text-lg text-zinc-900">{service.name}</div>
                <div className="text-xs font-medium text-zinc-500 mt-1 leading-relaxed">{service.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step !== 'selection' && (
        <div className="flex flex-col h-full">
          <button 
            onClick={() => { setStep('selection'); setOrderId(null); setOffer(null); setDropoff(null); }} 
            className="hidden md:flex items-center gap-2 text-zinc-500 font-bold hover:text-red-600 transition-colors mb-6 w-fit"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back to Services
          </button>

          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-zinc-200/50 mt-2 md:mt-0">
              <div className="p-3 bg-white border border-zinc-100 rounded-2xl shadow-sm text-zinc-900">{services.find(s => s.id === vehicleType)?.icon}</div>
              <span className="font-black text-2xl text-zinc-900 tracking-tight">{services.find(s => s.id === vehicleType)?.name}</span>
          </div>

          {status !== 'completed' && (
            <div className="space-y-5 mb-8">
              <div className="relative pl-6 border-l-4 border-zinc-900">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pickup</div>
                <div className="text-sm font-bold text-zinc-800 line-clamp-2 leading-tight mt-1.5">{pickupAddress || "Select on map..."}</div>
              </div>
              <div className="relative pl-6 border-l-4 border-red-500">
                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">Dropoff</div>
                <div className="text-sm font-bold text-zinc-800 line-clamp-2 leading-tight mt-1.5">{dropoffAddress || "Select on map..."}</div>
              </div>
            </div>
          )}

          {step === 'pickup' && (
            <div className="space-y-4 mt-auto pb-4">
              <div className="flex gap-2 p-2 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 focus-within:border-red-300 focus-within:ring-4 focus-within:ring-red-600/10 transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.02),0_4px_15px_rgba(0,0,0,0.03)]">
                <input type="text" placeholder="Search pickup location..." value={pickupAddress} 
                  onFocus={() => setIsSheetExpanded(true)} 
                  onChange={(e) => { setPickupAddress(e.target.value); setPickup(null); }} 
                  className="bg-transparent border-none flex-1 p-3 outline-none font-bold text-zinc-800 placeholder:text-zinc-400" />
                <button onClick={async () => {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupAddress)}`);
                    const data = await res.json();
                    if (data.length > 0) setPickup([parseFloat(data[0].lat), parseFloat(data[0].lon)]); 
                    setIsSheetExpanded(false); 
                  }} className="p-3 bg-zinc-100 rounded-xl hover:bg-zinc-200 text-xl active:scale-95 transition-all"
                >🔍</button>
              </div>

              <button onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                      const lat = pos.coords.latitude; const lng = pos.coords.longitude; setPickup([lat, lng]);
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                        const data = await res.json();
                        setPickupAddress(data.display_name.split(",")[0] + ", " + data.display_name.split(",")[1]);
                      } catch (e) { setPickupAddress("GPS Location Selected"); }
                      setIsSheetExpanded(false); 
                    });
                  }
                }} className="w-full p-4 rounded-2xl bg-white/50 backdrop-blur-sm text-zinc-900 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:text-red-600 hover:border-red-100">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                Use Current Location
              </button>

              {pickup && (
                <button className="w-full p-5 mt-2 rounded-2xl bg-zinc-900 text-white font-black text-lg shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:bg-black active:scale-95 transition-all animate-fade-in-up" onClick={() => {setStep('dropoff'); setIsSheetExpanded(true);}}>
                  Confirm Pickup
                </button>
              )}
            </div>
          )}

          {step === 'dropoff' && (
            <div className="space-y-4 mt-auto pb-4">
              <div className="flex gap-2 p-2 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 focus-within:border-red-300 focus-within:ring-4 focus-within:ring-red-600/10 transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.02),0_4px_15px_rgba(0,0,0,0.03)]">
                <input type="text" placeholder="Search destination..." value={dropoffAddress} 
                  onFocus={() => setIsSheetExpanded(true)} 
                  onChange={(e) => { setDropoffAddress(e.target.value); setOffer(null); setDropoff(null); }} 
                  className="bg-transparent border-none flex-1 p-3 outline-none font-bold text-zinc-800 placeholder:text-zinc-400" />
                <button onClick={async () => {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoffAddress)}`);
                    const data = await res.json();
                    if (data.length > 0) { setDropoff([parseFloat(data[0].lat), parseFloat(data[0].lon)]); setOffer(null); }
                    setIsSheetExpanded(false); 
                  }} className="p-3 bg-zinc-100 rounded-xl hover:bg-zinc-200 text-xl active:scale-95 transition-all"
                >🔍</button>
              </div>
              
              {dropoff && !offer && (
                <button className="w-full p-5 rounded-2xl bg-zinc-900 text-white font-black text-lg shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:bg-black active:scale-95 transition-all" onClick={fetchPrice}>Calculate Fare</button>
              )}

              {offer && (
                <div className="animate-fade-in-up mt-4">
                  <div className="bg-zinc-50 rounded-2xl p-6 mb-4 border border-zinc-200 text-center shadow-inner">
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Estimated Fare</p>
                    <p className="text-4xl font-black text-zinc-900 tracking-tighter">₹{offer.price}</p>
                  </div>
                  <button className="w-full p-5 rounded-2xl bg-red-600 text-white font-black text-lg shadow-[0_10px_25px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all" onClick={bookRide}>Confirm Booking</button>
                </div>
              )}
            </div>
          )}

          {step === 'finished' && status === 'requested' && (
            <div className="text-center py-10 mt-auto">
              <div className="w-14 h-14 border-4 border-zinc-100 border-t-red-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="font-black text-2xl text-zinc-900">Finding Drivers...</h3>
              <p className="text-zinc-500 font-medium mt-2 text-sm">Connecting to nearby partners</p>
            </div>
          )}

          {status === 'accepted' && (
            <div className="p-6 mt-auto bg-white/60 backdrop-blur-xl rounded-[28px] border border-white/80 text-center animate-fade-in shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <h3 className="text-zinc-900 font-black text-xl mb-4">Driver Arriving!</h3>
              <div className="p-5 bg-white rounded-2xl shadow-sm text-center border border-zinc-100">
                <p className="font-black text-zinc-900 text-xl">{driverName || "Your Driver"}</p>
                <p className="font-bold text-red-600 mt-2 text-lg">📞 {driverPhone || "No phone"}</p>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center w-full mt-auto bg-white/80 backdrop-blur-xl p-8 rounded-[36px] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] pb-10">
              <h2 className="text-3xl font-black text-zinc-900 mb-2 italic tracking-tight">🏁 Finished!</h2>
              <p className="text-zinc-500 font-bold mb-6 text-lg">Total Fare: <span className="text-red-600">₹{offer?.price}</span></p>

              {!hasPaid ? (
                <div className="mb-6 space-y-3 animate-fade-in-up">
                  <button onClick={payForRide} className="w-full p-4 rounded-xl bg-zinc-900 text-white font-bold active:scale-95 transition-all hover:bg-black shadow-[0_8px_20px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2">
                    💳 Pay Online
                  </button>
                  <button onClick={() => setHasPaid(true)} className="w-full p-4 rounded-xl bg-white text-zinc-900 font-bold active:scale-95 transition-all hover:bg-zinc-50 border-2 border-zinc-200 flex items-center justify-center gap-2">
                    💵 Pay with Cash
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  {!isRated ? (
                    <div className="mb-6 p-6 bg-zinc-50/80 rounded-[24px] text-center border border-zinc-100">
                      <h4 className="font-black text-zinc-500 mb-4 text-sm uppercase tracking-wider">Rate your ride</h4>
                      <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => setRating(star)} className={`text-4xl transition-all hover:scale-110 ${star <= rating ? 'text-amber-400 drop-shadow-sm' : 'text-zinc-200'}`}>★</button>
                        ))}
                      </div>
                      <textarea placeholder="Leave feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-4 rounded-2xl bg-white border border-zinc-200 outline-none h-20 font-medium resize-none placeholder:text-zinc-400 focus:border-red-300 transition-colors"/>
                      <button onClick={submitRating} className="w-full mt-4 p-4 rounded-xl bg-zinc-900 text-white font-bold active:scale-95 transition-all hover:bg-black shadow-[0_8px_20px_rgba(0,0,0,0.15)]">Submit Feedback</button>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-emerald-50/50 rounded-2xl text-emerald-600 font-bold text-sm border border-emerald-100">Feedback received ✓</div>
                  )}
                  <button className="w-full p-5 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 active:scale-95 transition-all shadow-[0_10px_25px_rgba(220,38,38,0.3)]" onClick={() => { localStorage.removeItem('parceel_step'); localStorage.removeItem('parceel_order_id'); window.location.reload(); }}>Book Another Ride</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Book;