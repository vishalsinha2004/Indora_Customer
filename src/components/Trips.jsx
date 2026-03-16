import React from 'react';

const Trips = ({ loadingHistory, orderHistory }) => {
  return (
    <div className="animate-fade-in-up mt-4 md:mt-0">
      <h2 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight">My Trips</h2>
      {loadingHistory ? (
        <div className="text-center p-10 text-zinc-400 font-bold">Loading...</div>
      ) : orderHistory.length === 0 ? (
        <div className="text-center p-10 bg-white/50 backdrop-blur-md rounded-3xl border border-white/60">
          <p className="text-zinc-500 font-medium">No past trips found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orderHistory.map(order => (
            <div key={order.id} className="p-6 bg-white/70 backdrop-blur-xl rounded-[24px] border border-white/80 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all cursor-pointer">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                <span className="font-black text-zinc-900">Order #{order.id}</span>
                <span className={`font-black px-3 py-1 rounded-md text-[10px] uppercase tracking-widest ${order.status === 'completed' ? 'bg-zinc-100 text-zinc-600' : 'bg-red-50 text-red-600'}`}>{order.status}</span>
              </div>
              <div className="text-xs font-medium text-zinc-500 flex flex-col gap-2.5 py-1">
                <p className="line-clamp-1"><span className="text-zinc-900 mr-2 text-sm">●</span>{order.pickup_address || "GPS Location Saved"}</p>
                <p className="line-clamp-1"><span className="text-red-500 mr-2 text-sm">●</span>{order.dropoff_address || "GPS Location Saved"}</p>
              </div>
              <div className="mt-1 text-right font-black text-2xl text-zinc-900 tracking-tight">₹{order.price}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;