import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState('initial'); 

  useEffect(() => {
    // Highly precise timeline for a buttery-smooth reveal
    const popTimer = setTimeout(() => setStage('pop'), 100);        // Pin pops in
    const revealTimer = setTimeout(() => setStage('reveal'), 700);  // Text slides out, pushing pin left
    const fadeOutTimer = setTimeout(() => setStage('fadeOut'), 2400); // Screen fades to white
    const completeTimer = setTimeout(() => onComplete(), 2900);     // App loads

    return () => {
      clearTimeout(popTimer);
      clearTimeout(revealTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        stage === 'fadeOut' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-center relative">
        
        {/* 1. THE RED MAP PIN */}
        <div 
          className="relative z-20 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            transform: stage === 'initial' ? 'scale(0) translateY(20px)' : 'scale(1) translateY(0)',
            opacity: stage === 'initial' ? 0 : 1
          }}
        >
          {/* Deep Red Map Pin with a soft red glow */}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#dc2626" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_15px_rgba(220,38,38,0.25)] ">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>

        {/* 2. THE TEXT REVEAL ("PARCEEL!") */}
        <div 
          className="overflow-hidden whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center"
          style={{
            maxWidth: stage === 'reveal' || stage === 'fadeOut' ? '350px' : '0px',
            opacity: stage === 'reveal' || stage === 'fadeOut' ? 1 : 0,
          }}
        >
          {/* Deep Black Bold Text matching your UI */}
          <h1 className="gap-1 text-[56px] font-black text-zinc-900 tracking-tighter pl-2 mt-1 italic pr-4 drop-shadow-sm">
            PARCEEL!
          </h1>
        </div>

      </div>
    </div>
  );
};

export default SplashScreen;