import React from 'react';

const Help = ({ expandedFaq, setExpandedFaq }) => {
  return (
    <div className="animate-fade-in-up mt-4 md:mt-0">
      <h2 className="text-3xl font-black text-zinc-900 mb-6 tracking-tight">Support</h2>
      <div className="bg-gradient-to-br from-zinc-900 to-black text-white p-7 rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.15)] mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Need immediate help?</h3>
          <p className="text-sm font-medium text-zinc-400 mb-6">Available 24/7 in Ahmedabad.</p>
          <a href="tel:6354327209" className="inline-block bg-white text-red-600 font-black text-sm px-6 py-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all">
            📞 Call 6354327209
          </a>
        </div>
        <div className="absolute -right-5 -bottom-5 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      <h3 className="text-lg font-black text-zinc-800 mb-4 tracking-tight">FAQ</h3>
      <div className="space-y-3">
        {[
          { q: 'How are prices calculated?', a: 'Prices are calculated based on the total distance, vehicle type, and live demand.' },
          { q: 'Can I cancel my booking?', a: 'Yes, you can cancel before the driver arrives. A small fee may apply if they are near.' },
          { q: 'What items are restricted?', a: 'We strictly prohibit hazardous materials, illegal substances, weapons, and live animals.' }
        ].map((faq, i) => (
          <div key={i} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.02)] cursor-pointer hover:bg-white transition-colors">
            <div className="flex justify-between items-center">
              <p className="font-bold text-zinc-800 text-sm pr-4">{faq.q}</p>
              <span className={`text-zinc-300 font-black transition-transform duration-300 ${expandedFaq === i ? 'rotate-180 text-red-600' : ''}`}>↓</span>
            </div>
            {expandedFaq === i && (
              <div className="mt-3 pt-3 border-t border-zinc-100 text-xs font-medium text-zinc-500 animate-fade-in-up leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;