import React from 'react';

export const Sparky3DMascot = ({ className = "w-32 h-32", mood = "happy", animated = true }) => {
  return (
    <div className={`relative inline-block select-none ${animated ? 'animate-float' : ''} ${className}`}>
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(124,58,237,0.5)]"
      >
        <defs>
          {/* 3D Gradients with high-gloss highlights */}
          <linearGradient id="bodyGrad" x1="20" y1="20" x2="180" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E0E7FF" />
            <stop offset="70%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>

          <linearGradient id="visorGrad" x1="40" y1="60" x2="160" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="eyeGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="pinkAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF4FA3" />
            <stop offset="100%" stopColor="#BE185D" />
          </linearGradient>

          <linearGradient id="goldAccent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD43B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <radialGradient id="highlight" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Floating Base Glow Shadow */}
        <ellipse cx="100" cy="205" rx="55" ry="12" fill="rgba(124, 58, 237, 0.35)" className="animate-pulse" />

        {/* Antenna */}
        <path d="M100 45 L100 20" stroke="#818CF8" strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="14" r="10" fill="url(#goldAccent)" />
        <circle cx="100" cy="14" r="5" fill="#FFFBEB" />

        {/* Robot Head Outer Shell (3D Pill) */}
        <rect x="35" y="40" width="130" height="110" rx="45" fill="url(#bodyGrad)" stroke="#C7D2FE" strokeWidth="3" />
        <rect x="35" y="40" width="130" height="110" rx="45" fill="url(#highlight)" />

        {/* Cyan Ear Pods with Sound Wave Rings */}
        <rect x="22" y="75" width="16" height="40" rx="8" fill="url(#pinkAccent)" />
        <rect x="162" y="75" width="16" height="40" rx="8" fill="url(#pinkAccent)" />

        {/* Cyber Visor Screen */}
        <rect x="52" y="60" width="96" height="66" rx="28" fill="url(#visorGrad)" stroke="#38BDF8" strokeWidth="2.5" />

        {/* High-Gloss Visor Reflection */}
        <path d="M58 72 Q 100 62 142 72 Q 100 80 58 72" fill="rgba(255,255,255,0.3)" />

        {/* 3D Glowing Cyan Eyes */}
        <g className="animate-pulse">
          <ellipse cx="78" cy="92" rx="10" ry="13" fill="url(#eyeGlow)" />
          <ellipse cx="122" cy="92" rx="10" ry="13" fill="url(#eyeGlow)" />
          {/* Eye Star Highlights */}
          <circle cx="75" cy="88" r="4" fill="#FFFFFF" />
          <circle cx="119" cy="88" r="4" fill="#FFFFFF" />
        </g>

        {/* Cute Smile */}
        <path d="M92 110 Q 100 118 108 110" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Robot Body Chest Pod */}
        <rect x="55" y="145" width="90" height="52" rx="24" fill="url(#bodyGrad)" stroke="#C7D2FE" strokeWidth="2.5" />
        <rect x="55" y="145" width="90" height="52" rx="24" fill="url(#highlight)" />

        {/* Chest Heart/Reactor Icon */}
        <circle cx="100" cy="170" r="14" fill="#1E1B4B" stroke="#FF4FA3" strokeWidth="2" />
        <path d="M100 164 L96 172 L104 172 Z" fill="#FFD43B" />
        <path d="M100 176 L96 168 L104 168 Z" fill="#FF4FA3" />

        {/* Floating Cyber Hands */}
        <g className="animate-wiggle origin-center">
          <circle cx="32" cy="155" r="13" fill="url(#bodyGrad)" stroke="#C7D2FE" strokeWidth="2" />
          <circle cx="32" cy="155" r="13" fill="url(#highlight)" />
          <path d="M26 153 Q 32 147 38 153" stroke="#FF4FA3" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g className="animate-bounce-soft origin-center">
          <circle cx="168" cy="155" r="13" fill="url(#bodyGrad)" stroke="#C7D2FE" strokeWidth="2" />
          <circle cx="168" cy="155" r="13" fill="url(#highlight)" />
          <path d="M162 153 Q 168 147 174 153" stroke="#FF4FA3" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export const Floating3DObjects = () => {
  return (
    <>
      {/* 3D Planet */}
      <div className="absolute -top-12 -left-8 w-28 h-28 pointer-events-none animate-float opacity-90 hidden sm:block">
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(255,79,163,0.5)]">
          <defs>
            <radialGradient id="planetGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFD43B" />
              <stop offset="40%" stopColor="#FF8A3D" />
              <stop offset="100%" stopColor="#FF4FA3" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="32" fill="url(#planetGrad)" />
          <ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke="#38BDF8" strokeWidth="4" transform="rotate(-25 50 50)" />
        </svg>
      </div>

      {/* 3D Gaming Controller */}
      <div className="absolute top-1/4 -right-10 w-28 h-28 pointer-events-none animate-bounce-soft opacity-90 hidden sm:block">
        <svg viewBox="0 0 120 100" className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(56,189,248,0.5)]">
          <defs>
            <linearGradient id="padGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <rect x="20" y="30" width="80" height="48" rx="24" fill="url(#padGrad)" stroke="#93C5FD" strokeWidth="3" />
          <circle cx="42" cy="54" r="8" fill="#1E293B" />
          <rect x="40" y="48" width="4" height="12" fill="#E2E8F0" rx="1" />
          <rect x="36" y="52" width="12" height="4" fill="#E2E8F0" rx="1" />
          <circle cx="78" cy="48" r="4" fill="#FF4FA3" />
          <circle cx="86" cy="56" r="4" fill="#FFD43B" />
        </svg>
      </div>

      {/* 3D Coding Block */}
      <div className="absolute -bottom-10 left-1/4 w-28 h-20 pointer-events-none animate-float opacity-90 hidden sm:block" style={{ animationDelay: '1.5s' }}>
        <div className="btn-3d-purple px-4 py-2.5 rounded-2xl text-white font-code font-black text-xs flex items-center gap-2 shadow-glow-purple rotate-[-8deg]">
          <span>🧩</span>
          <span>forever &#123; loop() &#125;</span>
        </div>
      </div>

      {/* 3D Glowing Gold Coin */}
      <div className="absolute top-10 right-1/4 w-16 h-16 pointer-events-none animate-wiggle opacity-90 hidden sm:block">
        <svg viewBox="0 0 60 60" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(255,212,59,0.6)]">
          <circle cx="30" cy="30" r="26" fill="#FFD43B" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="30" cy="30" r="20" fill="#FBBF24" />
          <text x="30" y="38" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#78350F">★</text>
        </svg>
      </div>
    </>
  );
};

