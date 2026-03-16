import React, { useEffect } from 'react';

// Passed 'totalBanners' as a prop so it dynamically knows how many to scroll through!
const AutoScroller = ({ totalBanners }) => {
  useEffect(() => {
    let currentBanner = 1;
    
    const interval = setInterval(() => {
      currentBanner = currentBanner >= totalBanners ? 1 : currentBanner + 1;
      const element = document.getElementById(`banner-${currentBanner}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 3000); 
    
    return () => clearInterval(interval);
  }, [totalBanners]);
  
  return null; 
};

const PromoBanners = () => {
  return (
    <>
      <div 
        className="flex overflow-x-auto gap-4 mb-8 pb-4 snap-x snap-mandatory shrink-0 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        {/* Banner 1: Deep Black */}
        <div className="min-w-[85%] flex-1 bg-gradient-to-br from-zinc-900 to-black p-7 rounded-[28px] text-white snap-center relative overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)]" id="banner-1">
          <div className="relative z-10">
            <span className="bg-white/15 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">First Ride</span>
            <h3 className="text-3xl font-black mt-4 text-white">50% OFF</h3>
            <p className="text-sm font-medium text-zinc-300 mb-2 mt-1">On all two-wheelers.</p>
          </div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-red-600/30 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Banner 2: Signature Red */}
        <div className="min-w-[85%] flex-1 bg-gradient-to-br from-red-600 to-red-700 p-7 rounded-[28px] text-white snap-center relative overflow-hidden shadow-[0_12px_30px_rgba(220,38,38,0.25)]" id="banner-2">
          <div className="relative z-10">
            <span className="bg-black/15 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-black/10">Premium</span>
            <h3 className="text-3xl font-black mt-4">Packers</h3>
            <p className="text-sm font-medium text-red-100 mb-2 mt-1">Safe home relocation.</p>
          </div>
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Banner 3: Glassy White */}
        <div className="min-w-[85%] flex-1 bg-white/60 backdrop-blur-2xl border border-white/80 p-7 rounded-[28px] text-zinc-900 snap-center relative overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.05)]" id="banner-3">
          <div className="relative z-10">
            <span className="bg-zinc-900/5 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-zinc-900/10 text-zinc-600">Speed</span>
            <h3 className="text-3xl font-black mt-4 text-zinc-900">Lightning</h3>
            <p className="text-sm font-medium text-zinc-500 mb-2 mt-1">Fast document delivery.</p>
          </div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Banner 4: Matte Charcoal with Red Glow */}
        <div className="min-w-[85%] flex-1 bg-gradient-to-br from-zinc-800 to-zinc-900 p-7 rounded-[28px] text-white snap-center relative overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] border border-zinc-700" id="banner-4">
          <div className="relative z-10">
            <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-red-500/20">Business</span>
            <h3 className="text-3xl font-black mt-4 text-white">B2B Delivery</h3>
            <p className="text-sm font-medium text-zinc-400 mb-2 mt-1">Special rates for partners.</p>
          </div>
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Banner 5: Platinum Frost with Red Accents */}
        <div className="min-w-[85%] flex-1 bg-gradient-to-br from-red-50 to-white backdrop-blur-2xl border border-red-100 p-7 rounded-[28px] text-zinc-900 snap-center relative overflow-hidden shadow-[0_12px_30px_rgba(220,38,38,0.05)]" id="banner-5">
          <div className="relative z-10">
            <span className="bg-red-600/10 text-red-600 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-red-200">Bonus</span>
            <h3 className="text-3xl font-black mt-4 text-zinc-900">Refer & Earn</h3>
            <p className="text-sm font-medium text-zinc-500 mb-2 mt-1">Get ₹100 on every invite.</p>
          </div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-red-500/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>

      {/* Passing 5 down to the AutoScroller so it knows exactly how many banners to loop! */}
      <AutoScroller totalBanners={5} />
    </>
  );
};

export default PromoBanners;