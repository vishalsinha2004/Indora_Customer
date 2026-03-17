import React from 'react';
import PromoBanners from './PromoBanners';

const Book = ({ 
    step, setStep, services, handleServiceSelect, vehicleType, 
    pickupAddress, setPickupAddress, setPickup, 
    dropoffAddress, setDropoffAddress, setDropoff, setOffer, 
    pickup, dropoff, offer, fetchPrice, bookRide, status, 
    driverName, driverPhone, isRated, rating, setRating, 
    feedback, setFeedback, submitRating, setOrderId,
    payForRide, hasPaid, setHasPaid
}) => {
  return (
    <div className="animate-fade-in h-full flex flex-col justify-between">
      {step === 'selection' && (
        <div className="flex flex-col h-full">
          <PromoBanners />
          <p className="text-lg font-black text-zinc-800 mb-3 tracking-tight">What are you moving?</p>
          <div className="grid grid-cols-2 gap-3 pb-2">
            {services.map((service) => (
              <div 
                key={service.id} onClick={() => handleServiceSelect(service)}
                className={`p-4 rounded-xl bg-white/50 backdrop-blur-lg transition-all duration-300 transform border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                  ${service.active ? 'cursor-pointer hover:bg-white hover:border-red-200 hover:shadow-[0_8px_25px_rgba(220,38,38,0.08)] active:scale-95 group' : 'opacity-50 cursor-not-allowed'}`}
              >
                <div className={`mb-2 p-2 w-fit rounded-xl transition-colors duration-300 ${service.active ? 'bg-zinc-100 group-hover:bg-red-50 group-hover:text-red-600' : 'bg-zinc-100'}`}>
                   {React.cloneElement(service.icon, { width: 24, height: 24 })} 
                </div>
                <div className="font-black text-base text-zinc-900">{service.name}</div>
                <div className="text-[10px] font-medium text-zinc-500 mt-0.5 leading-relaxed truncate">{service.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step !== 'selection' && (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200/50 mt-2 md:mt-0">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-zinc-100 rounded-xl shadow-sm text-zinc-900">{services.find(s => s.id === vehicleType)?.icon && React.cloneElement(services.find(s => s.id === vehicleType).icon, { width: 20, height: 20 })}</div>
                  <span className="font-black text-xl text-zinc-900 tracking-tight">{services.find(s => s.id === vehicleType)?.name}</span>
              </div>
              <button 
                onClick={() => { setStep('selection'); setOrderId(null); setOffer(null); setDropoff(null); }} 
                className="flex items-center gap-1 text-zinc-500 font-bold hover:text-red-600 transition-colors text-sm"
              >
                Cancel
              </button>
          </div>

          {status !== 'completed' && (
            <div className="space-y-3 mb-4">
              <div className="relative pl-5 border-l-4 border-zinc-900">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pickup</div>
                <div className="text-sm font-bold text-zinc-800 line-clamp-1 leading-tight mt-1">{pickupAddress || "Select on map..."}</div>
              </div>
              <div className="relative pl-5 border-l-4 border-red-500">
                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">Dropoff</div>
                <div className="text-sm font-bold text-zinc-800 line-clamp-1 leading-tight mt-1">{dropoffAddress || "Select on map..."}</div>
              </div>
            </div>
          )}

          {step === 'pickup' && (
            <div className="space-y-3 mt-auto">
              <div className="flex gap-2 p-1.5 bg-white/60 backdrop-blur-md rounded-xl border border-white/80 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-600/10 transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.02),0_4px_15px_rgba(0,0,0,0.03)]">
                <input type="text" placeholder="Search pickup..." value={pickupAddress} 
                  onChange={(e) => { setPickupAddress(e.target.value); setPickup(null); }} 
                  className="bg-transparent border-none flex-1 p-2.5 outline-none font-bold text-sm text-zinc-800 placeholder:text-zinc-400" />
                <button onClick={async () => {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupAddress)}`);
                    const data = await res.json();
                    if (data.length > 0) setPickup([parseFloat(data[0].lat), parseFloat(data[0].lon)]); 
                  }} className="p-2.5 bg-zinc-100 rounded-lg hover:bg-zinc-200 text-base active:scale-95 transition-all"
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
                    });
                  }
                }} className="w-full p-3 rounded-xl bg-white/50 backdrop-blur-sm text-zinc-900 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/80 shadow-sm hover:text-red-600 hover:border-red-100">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                Current Location
              </button>

              {pickup && (
                <button className="w-full p-4 mt-1 rounded-xl bg-zinc-900 text-white font-black text-base shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:bg-black active:scale-95 transition-all animate-fade-in-up" onClick={() => setStep('dropoff')}>
                  Confirm Pickup
                </button>
              )}
            </div>
          )}

          {step === 'dropoff' && (
            <div className="space-y-3 mt-auto">
              <div className="flex gap-2 p-1.5 bg-white/60 backdrop-blur-md rounded-xl border border-white/80 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-600/10 transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.02),0_4px_15px_rgba(0,0,0,0.03)]">
                <input type="text" placeholder="Search destination..." value={dropoffAddress} 
                  onChange={(e) => { setDropoffAddress(e.target.value); setOffer(null); setDropoff(null); }} 
                  className="bg-transparent border-none flex-1 p-2.5 outline-none font-bold text-sm text-zinc-800 placeholder:text-zinc-400" />
                <button onClick={async () => {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoffAddress)}`);
                    const data = await res.json();
                    if (data.length > 0) { setDropoff([parseFloat(data[0].lat), parseFloat(data[0].lon)]); setOffer(null); }
                  }} className="p-2.5 bg-zinc-100 rounded-lg hover:bg-zinc-200 text-base active:scale-95 transition-all"
                >🔍</button>
              </div>
              
              {dropoff && !offer && (
                <button className="w-full p-4 rounded-xl bg-zinc-900 text-white font-black text-base shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:bg-black active:scale-95 transition-all" onClick={fetchPrice}>Calculate Fare</button>
              )}

              {offer && (
                <div className="animate-fade-in-up mt-2">
                  <div className="bg-zinc-50 rounded-xl p-4 mb-3 border border-zinc-200 text-center shadow-inner flex items-center justify-between">
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Estimated Fare</p>
                    <p className="text-2xl font-black text-zinc-900 tracking-tighter">₹{offer.price}</p>
                  </div>
                  <button className="w-full p-4 rounded-xl bg-red-600 text-white font-black text-base shadow-[0_8px_20px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all" onClick={bookRide}>Confirm Booking</button>
                </div>
              )}
            </div>
          )}

          {step === 'finished' && status === 'requested' && (
            <div className="text-center py-6 mt-auto">
              <div className="w-10 h-10 border-4 border-zinc-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="font-black text-xl text-zinc-900">Finding Drivers...</h3>
              <p className="text-zinc-500 font-medium mt-1 text-xs">Connecting to nearby partners</p>
            </div>
          )}

          {status === 'accepted' && (
            <div className="p-5 mt-auto bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 text-center animate-fade-in shadow-sm">
              <h3 className="text-zinc-900 font-black text-lg mb-3">Driver Arriving!</h3>
              <div className="p-4 bg-white rounded-xl shadow-sm text-center border border-zinc-100">
                <p className="font-black text-zinc-900 text-lg">{driverName || "Your Driver"}</p>
                <p className="font-bold text-red-600 mt-1 text-base">📞 {driverPhone || "No phone"}</p>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center w-full mt-auto bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/80 shadow-sm">
              <h2 className="text-2xl font-black text-zinc-900 mb-1 italic tracking-tight">🏁 Finished!</h2>
              <p className="text-zinc-500 font-bold mb-4 text-sm">Total Fare: <span className="text-red-600">₹{offer?.price}</span></p>

              {!hasPaid ? (
                <div className="mb-4 space-y-2 animate-fade-in-up">
                  <button onClick={payForRide} className="w-full p-3 rounded-lg bg-zinc-900 text-white font-bold active:scale-95 transition-all hover:bg-black shadow-sm flex items-center justify-center gap-2 text-sm">
                    💳 Pay Online
                  </button>
                  <button onClick={() => setHasPaid(true)} className="w-full p-3 rounded-lg bg-white text-zinc-900 font-bold active:scale-95 transition-all hover:bg-zinc-50 border border-zinc-200 flex items-center justify-center gap-2 text-sm">
                    💵 Pay with Cash
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  {!isRated ? (
                    <div className="mb-4 p-4 bg-zinc-50/80 rounded-xl text-center border border-zinc-100">
                      <h4 className="font-black text-zinc-500 mb-3 text-xs uppercase tracking-wider">Rate your ride</h4>
                      <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button key={star} onClick={() => setRating(star)} className={`text-3xl transition-all hover:scale-110 ${star <= rating ? 'text-amber-400 drop-shadow-sm' : 'text-zinc-200'}`}>★</button>
                        ))}
                      </div>
                      <textarea placeholder="Leave feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-zinc-200 outline-none h-16 text-sm font-medium resize-none placeholder:text-zinc-400 focus:border-red-300 transition-colors"/>
                      <button onClick={submitRating} className="w-full mt-3 p-3 rounded-lg bg-zinc-900 text-white font-bold active:scale-95 transition-all text-sm hover:bg-black shadow-sm">Submit Feedback</button>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-emerald-50/50 rounded-xl text-emerald-600 font-bold text-xs border border-emerald-100">Feedback received ✓</div>
                  )}
                  <button className="w-full p-4 rounded-xl bg-red-600 text-white font-black text-sm hover:bg-red-700 active:scale-95 transition-all shadow-sm" onClick={() => { localStorage.removeItem('parceel_step'); localStorage.removeItem('parceel_order_id'); window.location.reload(); }}>Book Another Ride</button>
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