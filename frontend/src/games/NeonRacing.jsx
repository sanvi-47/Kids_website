import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Zap, Trophy, Gauge } from 'lucide-react';

const CAR_OPTIONS = [
  { id: 'turbo_red', name: 'Inferno GT', emoji: '🏎️', color: '#ef4444', topSpeed: 11 },
  { id: 'cyber_blue', name: 'Cyber Phantom', emoji: '🚀', color: '#06b6d4', topSpeed: 12 },
  { id: 'neon_green', name: 'Viper Drift', emoji: '🚗', color: '#10b981', topSpeed: 10 }
];

const NeonRacing = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('neonracing_hi') || 0));
  const [selectedCar, setSelectedCar] = useState(CAR_OPTIONS[0]);
  const [boostActive, setBoostActive] = useState(false);
  const [speedKmh, setSpeedKmh] = useState(120);
  const [muted, setMuted] = useState(false);

  const stateRef = useRef({
    carX: 300,
    carY: 380,
    carVx: 0,
    obstacles: [], // Rival cars, oil slicks, speed ramps
    coins: [],
    roadOffset: 0,
    speed: 7,
    keys: {},
    particles: []
  });

  const handleStart = () => {
    const s = stateRef.current;
    s.carX = 300;
    s.carVx = 0;
    s.obstacles = [];
    s.coins = [];
    s.particles = [];
    s.speed = 7;
    setScore(0);
    setBoostActive(false);
    setIsGameOver(false);
    setIsPlaying(true);
    sounds.powerup();
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const s = stateRef.current;
      const key = e.key.toLowerCase();
      s.keys[key] = true;

      // Space for Nitro Boost
      if (key === ' ' || key === 'shift') {
        setBoostActive(true);
        sounds.laser();
        e.preventDefault();
      }
    };

    const onKeyUp = (e) => {
      const s = stateRef.current;
      const key = e.key.toLowerCase();
      s.keys[key] = false;
      if (key === ' ' || key === 'shift') {
        setBoostActive(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = () => {
      const s = stateRef.current;

      if (isPlaying && !isGameOver) {
        // Boost factor
        const currentMaxSpeed = boostActive ? selectedCar.topSpeed * 1.4 : selectedCar.topSpeed;
        s.speed = Math.min(currentMaxSpeed, s.speed + 0.04);
        setSpeedKmh(Math.round(s.speed * 20));

        // Score distance
        setScore((sc) => {
          const nxt = sc + Math.round(s.speed * 0.8);
          if (nxt > highScore) {
            setHighScore(nxt);
            localStorage.setItem('neonracing_hi', nxt);
          }
          if (onScoreUpdate) onScoreUpdate(nxt);
          return nxt;
        });

        // Car Steering
        if (s.keys['arrowleft'] || s.keys['a']) s.carVx = -7;
        else if (s.keys['arrowright'] || s.keys['d']) s.carVx = 7;
        else s.carVx *= 0.8;

        s.carX += s.carVx;
        // Clamp to road boundaries (Road is 120px to 480px)
        s.carX = Math.max(140, Math.min(460, s.carX));

        // Spawn Rival Cars & Oil
        if (Math.random() < 0.035) {
          const lane = 150 + Math.random() * 300;
          const isOil = Math.random() < 0.25;
          s.obstacles.push({
            x: lane,
            y: -60,
            w: 36,
            h: isOil ? 30 : 54,
            speed: isOil ? 0 : Math.random() * 2 + 3,
            type: isOil ? 'oil' : 'car',
            emoji: isOil ? '🛢️' : ['🚚', '🚕', '🚓'][Math.floor(Math.random() * 3)]
          });
        }

        // Spawn Gold Coins & Boost pads
        if (Math.random() < 0.04) {
          s.coins.push({
            x: 160 + Math.random() * 280,
            y: -40,
            type: Math.random() < 0.2 ? 'boost' : 'coin',
            emoji: Math.random() < 0.2 ? '⚡' : '🪙'
          });
        }

        // Update Obstacles
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.y += s.speed - obs.speed;

          // Collision
          if (Math.abs(obs.x - s.carX) < 30 && Math.abs(obs.y - s.carY) < 42) {
            sounds.explosion();
            setIsGameOver(true);
            setIsPlaying(false);
            break;
          }

          if (obs.y > 520) s.obstacles.splice(i, 1);
        }

        // Update Coins & Boost pads
        for (let i = s.coins.length - 1; i >= 0; i--) {
          const c = s.coins[i];
          c.y += s.speed;

          if (Math.hypot(c.x - s.carX, c.y - s.carY) < 32) {
            if (c.type === 'coin') {
              sounds.powerup();
              setScore((sc) => sc + 200);
            } else {
              sounds.laser();
              s.speed = Math.min(18, s.speed + 3);
            }
            s.coins.splice(i, 1);
            continue;
          }

          if (c.y > 520) s.coins.splice(i, 1);
        }

        // Road scroll
        s.roadOffset = (s.roadOffset + s.speed) % 40;

        // Exhaust flame particles
        if (Math.random() < 0.7) {
          s.particles.push({
            x: s.carX + (Math.random() - 0.5) * 12,
            y: s.carY + 28,
            vx: (Math.random() - 0.5) * 2,
            vy: s.speed * 0.5,
            life: 14,
            color: boostActive ? '#06b6d4' : '#f97316'
          });
        }

        // Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) s.particles.splice(i, 1);
        }
      }

      // ---------------- RENDER ----------------
      // Dark road horizon
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 600, 500);

      // Neon Road Surface (120 to 480)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(120, 0, 360, 500);

      // Neon Guardrails
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(120, 0);
      ctx.lineTo(120, 500);
      ctx.moveTo(480, 0);
      ctx.lineTo(480, 500);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dashed lane dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -s.roadOffset;
      ctx.beginPath();
      ctx.moveTo(240, 0);
      ctx.lineTo(240, 500);
      ctx.moveTo(360, 0);
      ctx.lineTo(360, 500);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Coins & Boosts
      for (const c of s.coins) {
        ctx.font = '24px sans-serif';
        ctx.fillText(c.emoji, c.x - 12, c.y + 10);
      }

      // Draw Obstacles (Rival traffic)
      for (const obs of s.obstacles) {
        ctx.font = '36px sans-serif';
        ctx.fillText(obs.emoji, obs.x - 16, obs.y + 16);
      }

      // Draw Player Car
      ctx.save();
      ctx.translate(s.carX, s.carY);

      // Nitro exhaust glow
      if (boostActive) {
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 20;
      }

      ctx.font = '48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedCar.emoji, 0, 0);
      ctx.restore();

      // Draw Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, boostActive, selectedCar, highScore, onScoreUpdate]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-rose-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-rose-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-rose-400 font-black text-sm">
            <Gauge className="w-5 h-5" />
            <span>{speedKmh} KM/H</span>
          </div>
          {boostActive && (
            <span className="text-xs bg-cyan-500 text-slate-900 font-black px-2 py-0.5 rounded-full animate-pulse">
              NITRO ACTIVE!
            </span>
          )}
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Score</div>
            <div className="text-xl font-black font-code text-white tracking-widest">{score.toString().padStart(5, '0')}</div>
          </div>
          <div className="text-right border-l border-slate-700 pl-4">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Record</div>
            <div className="text-xl font-black font-code text-amber-300 tracking-widest">{highScore.toString().padStart(5, '0')}</div>
          </div>
          <button
            onClick={() => {
              setMuted(!muted);
              sounds.muted = !muted;
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Car Selector Pills */}
      {!isPlaying && (
        <div className="flex items-center gap-2 mb-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-bold px-2">Choose Machine:</span>
          {CAR_OPTIONS.map((car) => (
            <button
              key={car.id}
              onClick={() => setSelectedCar(car)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                selectedCar.id === car.id ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{car.emoji}</span>
              <span>{car.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas ref={canvasRef} width={600} height={500} className="block w-full h-auto bg-slate-950" />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(244,63,94,0.5)]">
              🏎️
            </div>
            <h2 className="text-3xl font-black font-bubble text-rose-300 tracking-wide">NEON SPEEDWAY RACER</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Weave through heavy highway traffic! Dodge oil drums, collect coins, and hold <strong className="text-cyan-400">SPACEBAR</strong> for nitro burn!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-rose-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Start Engines
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">💥</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">CRASH & BURN!</h2>
            <p className="text-sm font-bold text-slate-200">
              Score: <span className="text-rose-300 text-lg">{score}</span>
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Race Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <div>⌨️ [◀/▶ or A/D] Steer • [SPACE] Nitro Boost</div>
        <div>⚡ Grab lightning bolts for instantaneous super acceleration!</div>
      </div>
    </div>
  );
};

export default NeonRacing;

