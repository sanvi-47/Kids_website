import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Zap, Trophy, Shield } from 'lucide-react';

const EndlessRunner = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('endlessrunner_hi') || 0));
  const [coins, setCoins] = useState(0);
  const [environment, setEnvironment] = useState('cyberpunk'); // cyberpunk, jungle, sunset
  const [muted, setMuted] = useState(false);

  const stateRef = useRef({
    hero: {
      x: 100,
      y: 330,
      w: 42,
      h: 54,
      vy: 0,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
      hasShield: false
    },
    obstacles: [],
    coinsList: [],
    particles: [],
    bgOffset: 0,
    speed: 6.5,
    lastObstacle: 0,
    lastCoin: 0,
    keys: {}
  });

  const GROUND_Y = 380;

  const handleStart = () => {
    const s = stateRef.current;
    s.hero.y = GROUND_Y - 54;
    s.hero.vy = 0;
    s.hero.isGrounded = true;
    s.hero.isSliding = false;
    s.hero.hasShield = false;
    s.obstacles = [];
    s.coinsList = [];
    s.particles = [];
    s.speed = 6.5;
    setScore(0);
    setCoins(0);
    setIsGameOver(false);
    setIsPlaying(true);
    sounds.powerup();
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const s = stateRef.current;
      const key = e.key.toLowerCase();
      s.keys[key] = true;

      // Jump (Up / W / Space)
      if ((key === 'arrowup' || key === 'w' || key === ' ') && s.hero.isGrounded && !s.hero.isSliding) {
        s.hero.vy = -14;
        s.hero.isGrounded = false;
        sounds.laser();
        e.preventDefault();
      }

      // Slide (Down / S)
      if ((key === 'arrowdown' || key === 's') && s.hero.isGrounded) {
        s.hero.isSliding = true;
        s.hero.slideTimer = 25; // frames
        sounds.note(250, 0.1);
        e.preventDefault();
      }
    };

    const onKeyUp = (e) => {
      const s = stateRef.current;
      s.keys[e.key.toLowerCase()] = false;
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
        // Increase speed slightly over time
        s.speed = Math.min(14, s.speed + 0.0015);

        // Distance score
        setScore((sc) => {
          const nxt = sc + 1;
          if (nxt > highScore) {
            setHighScore(nxt);
            localStorage.setItem('endlessrunner_hi', nxt);
          }
          if (nxt % 1000 === 0) {
            // Shift environment
            const envs = ['cyberpunk', 'jungle', 'sunset'];
            setEnvironment((prev) => envs[(envs.indexOf(prev) + 1) % envs.length]);
          }
          if (onScoreUpdate) onScoreUpdate(nxt);
          return nxt;
        });

        // Hero Physics
        if (!s.hero.isGrounded) {
          s.hero.y += s.hero.vy;
          s.hero.vy += 0.8; // Gravity
          if (s.hero.y >= GROUND_Y - 54) {
            s.hero.y = GROUND_Y - 54;
            s.hero.vy = 0;
            s.hero.isGrounded = true;
          }
        }

        // Slide timer
        if (s.hero.isSliding) {
          s.hero.slideTimer--;
          if (s.hero.slideTimer <= 0) {
            s.hero.isSliding = false;
          }
        }

        // Spawn Obstacles (Barriers, drones, spikes)
        s.lastObstacle--;
        if (s.lastObstacle <= 0) {
          s.lastObstacle = Math.floor(Math.random() * 50 + 65 - s.speed * 2);
          const type = Math.random() > 0.5 ? 'ground' : 'flying';
          s.obstacles.push({
            x: 650,
            y: type === 'ground' ? GROUND_Y - 44 : GROUND_Y - 95,
            w: type === 'ground' ? 36 : 40,
            h: type === 'ground' ? 44 : 34,
            type,
            emoji: type === 'ground' ? '🚧' : '🛸'
          });
        }

        // Spawn Coins & Shields
        s.lastCoin--;
        if (s.lastCoin <= 0) {
          s.lastCoin = Math.floor(Math.random() * 40 + 40);
          const isShield = Math.random() < 0.1;
          s.coinsList.push({
            x: 650,
            y: GROUND_Y - (Math.random() > 0.4 ? 40 : 90),
            w: 24,
            h: 24,
            type: isShield ? 'shield' : 'coin',
            emoji: isShield ? '🛡️' : '🪙'
          });
        }

        // Update Obstacles & Collision
        const heroEffectiveH = s.hero.isSliding ? 28 : 54;
        const heroEffectiveY = s.hero.isSliding ? GROUND_Y - 28 : s.hero.y;

        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= s.speed;

          // AABB Box collision
          if (
            s.hero.x < obs.x + obs.w &&
            s.hero.x + s.hero.w > obs.x &&
            heroEffectiveY < obs.y + obs.h &&
            heroEffectiveY + heroEffectiveH > obs.y
          ) {
            if (s.hero.hasShield) {
              s.hero.hasShield = false;
              s.obstacles.splice(i, 1);
              sounds.hit();
              continue;
            } else {
              sounds.explosion();
              setIsGameOver(true);
              setIsPlaying(false);
              break;
            }
          }

          if (obs.x < -50) s.obstacles.splice(i, 1);
        }

        // Update Coins & Powerups
        for (let i = s.coinsList.length - 1; i >= 0; i--) {
          const c = s.coinsList[i];
          c.x -= s.speed;

          if (
            s.hero.x < c.x + c.w &&
            s.hero.x + s.hero.w > c.x &&
            heroEffectiveY < c.y + c.h &&
            heroEffectiveY + heroEffectiveH > c.y
          ) {
            if (c.type === 'coin') {
              sounds.powerup();
              setCoins((cn) => cn + 1);
              setScore((sc) => sc + 50);
            } else {
              sounds.laser();
              s.hero.hasShield = true;
            }
            s.coinsList.splice(i, 1);
            continue;
          }

          if (c.x < -40) s.coinsList.splice(i, 1);
        }

        // Runner dust particles
        if (s.hero.isGrounded && Math.random() < 0.6) {
          s.particles.push({
            x: s.hero.x + 8,
            y: GROUND_Y - 4,
            vx: -s.speed * 0.4 + (Math.random() - 0.5),
            vy: -Math.random() * 2,
            life: 15,
            color: '#a855f7'
          });
        }

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) s.particles.splice(i, 1);
        }

        s.bgOffset = (s.bgOffset + s.speed * 0.5) % 600;
      }

      // ---------------- RENDER ----------------
      // Environment gradient background
      let bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
      if (environment === 'cyberpunk') {
        bgGrad.addColorStop(0, '#0f172a');
        bgGrad.addColorStop(0.7, '#3b0764');
        bgGrad.addColorStop(1, '#020617');
      } else if (environment === 'sunset') {
        bgGrad.addColorStop(0, '#701a75');
        bgGrad.addColorStop(0.6, '#ea580c');
        bgGrad.addColorStop(1, '#1e1b4b');
      } else {
        bgGrad.addColorStop(0, '#064e3b');
        bgGrad.addColorStop(0.7, '#047857');
        bgGrad.addColorStop(1, '#022c22');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 600, 480);

      // Distant city silhouette
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      for (let i = -600; i < 1200; i += 70) {
        const xPos = i - (s.bgOffset * 0.3) % 70;
        ctx.fillRect(xPos, 220, 50, 160);
      }

      // Ground Line
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, GROUND_Y, 600, 100);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(600, GROUND_Y);
      ctx.stroke();

      // Draw Hero
      ctx.save();
      const heroX = s.hero.x;
      const heroY = s.hero.isSliding ? GROUND_Y - 30 : s.hero.y;

      if (s.hero.hasShield) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(heroX + 20, heroY + 25, 34, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.font = s.hero.isSliding ? '32px sans-serif' : '44px sans-serif';
      ctx.fillText(s.hero.isSliding ? '🛹' : '🏃‍♂️', heroX, heroY + (s.hero.isSliding ? 25 : 44));
      ctx.restore();

      // Draw Obstacles
      for (const obs of s.obstacles) {
        ctx.font = '34px sans-serif';
        ctx.fillText(obs.emoji, obs.x, obs.y + 32);
      }

      // Draw Coins & Shields
      for (const c of s.coinsList) {
        ctx.font = '24px sans-serif';
        ctx.fillText(c.emoji, c.x, c.y + 20);
      }

      // Draw Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, environment, highScore, onScoreUpdate]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-purple-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-purple-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
            <span>🪙 {coins} Coins</span>
          </div>
          <div className="text-xs text-purple-300 font-bold capitalize bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-700">
            Zone: {environment}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Distance</div>
            <div className="text-xl font-black font-code text-white tracking-widest">{score}m</div>
          </div>
          <div className="text-right border-l border-slate-700 pl-4">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Record</div>
            <div className="text-xl font-black font-code text-amber-300 tracking-widest">{highScore}m</div>
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

      {/* Canvas */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas ref={canvasRef} width={600} height={480} className="block w-full h-auto bg-slate-950" />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              🏃‍♂️
            </div>
            <h2 className="text-3xl font-black font-bubble text-purple-300 tracking-wide">CYBER DASH RUNNER</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Sprint through futuristic highways! Tap <strong className="text-purple-300">UP / SPACE</strong> to jump barriers, and <strong className="text-pink-300">DOWN / S</strong> to slide under flying drones!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Start Sprint
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">💥</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">TRIPPED OVER!</h2>
            <p className="text-sm font-bold text-slate-200">
              Traveled: <span className="text-purple-300 text-lg">{score}m</span> • Coins: <span className="text-amber-300">{coins}</span>
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Run Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <div>⌨️ [▲ / W / Space] Jump • [▼ / S] Slide Under Drones</div>
        <div>🛡️ Energy Shields absorb 1 crash!</div>
      </div>
    </div>
  );
};

export default EndlessRunner;

