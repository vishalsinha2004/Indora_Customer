import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete, isServerReady }) => {
  const [stage, setStage] = useState('initial'); 
  const [showWaitingText, setShowWaitingText] = useState(false);

  useEffect(() => {
    // 1. The initial pop and reveal animation
    const popTimer = setTimeout(() => setStage('pop'), 100);        
    const revealTimer = setTimeout(() => setStage('reveal'), 700);  
    
    // 2. If Render is asleep (takes more than 2.5s), show a loading message
    const waitingTimer = setTimeout(() => setShowWaitingText(true), 2500);

    return () => {
      clearTimeout(popTimer);
      clearTimeout(revealTimer);
      clearTimeout(waitingTimer);
    };
  }, []);

  useEffect(() => {
    // 3. When the server is officially awake, trigger the fade out!
    // We wrap it in a 1.5s timeout just to make sure the intro animation finishes playing.
    if (isServerReady) {
      const hideTimer = setTimeout(() => {
        setStage('fadeOut');
        setTimeout(() => onComplete(), 500); // Wait 500ms for fade CSS to finish
      }, 1500);
      return () => clearTimeout(hideTimer);
    }
  }, [isServerReady, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
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
          <h1 className="text-[56px] font-black text-zinc-900 tracking-tighter mt-1 italic pl-2 pr-4 drop-shadow-sm">
            PARCEEL!
          </h1>
        </div>
      </div>

      {/* 3. WAKING UP SERVER MESSAGE (Only shows if Render is asleep) */}
      <div 
        className={`absolute bottom-20 flex flex-col items-center transition-opacity duration-1000 ${
          showWaitingText && !isServerReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin mb-3"></div>
        <p className="text-zinc-500 font-bold text-sm tracking-wide">Waking up secure server...</p>
        <p className="text-zinc-400 font-medium text-xs mt-1">(This can take up to 50 seconds)</p>
      </div>

    </div>
  );
};

export default SplashScreen;