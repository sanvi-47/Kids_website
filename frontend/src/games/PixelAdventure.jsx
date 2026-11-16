import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Heart, Trophy, Sparkles } from 'lucide-react';

const PixelAdventure = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('pixeladv_hi') || 0));
  const [lives, setLives] = useState(3);
  const [world, setWorld] = useState(1);
  const [muted, setMuted] = useState(false);

  // Platform world state
  const stateRef = useRef({
    player: {
      x: 50,
      y: 360,
      w: 36,
      h: 44,
      vx: 0,
      vy: 0,
      speed: 4.8,
      isGrounded: false,
      facing: 1
    },
    platforms: [],
    enemies: [],
    coins: [],
    flag: null,
    particles: [],
    keys: {}
  });

  const loadWorld = (wNum) => {
    const s = stateRef.current;
    s.player.x = 40;
    s.player.y = 350;
    s.player.vx = 0;
    s.player.vy = 0;

    // Platform layouts based on world
    if (wNum === 1) {
      s.platforms = [
        { x: 0, y: 440, w: 600, h: 60, color: '#16a34a' }, // Main ground
        { x: 120, y: 350, w: 100, h: 20, color: '#059669' },
        { x: 270, y: 280, w: 110, h: 20, color: '#059669' },
        { x: 420, y: 210, w: 110, h: 20, color: '#059669' },
        { x: 230, y: 150, w: 90, h: 20, color: '#059669' }
      ];
      s.enemies = [
        { x: 140, y: 320, w: 30, h: 30, vx: 1.5, minX: 120, maxX: 210, emoji: '👾' },
        { x: 290, y: 250, w: 30, h: 30, vx: -1.5, minX: 270, maxX: 370, emoji: '🐌' }
      ];
      s.coins = [
        { x: 160, y: 315 },
        { x: 320, y: 245 },
        { x: 470, y: 175 },
        { x: 270, y: 115 },
        { x: 520, y: 405 }
      ];
      s.flag = { x: 260, y: 100, w: 32, h: 48 };
    } else {
      // World 2: Castle / Sky
      s.platforms = [
        { x: 0, y: 440, w: 180, h: 60, color: '#475569' },
        { x: 220, y: 440, w: 380, h: 60, color: '#475569' }, // Pit between 180-220
        { x: 80, y: 340, w: 90, h: 20, color: '#64748b' },
        { x: 210, y: 270, w: 90, h: 20, color: '#64748b' },
        { x: 340, y: 220, w: 100, h: 20, color: '#64748b' },
        { x: 480, y: 160, w: 100, h: 20, color: '#64748b' }
      ];
      s.enemies = [
        { x: 260, y: 410, w: 30, h: 30, vx: 2, minX: 230, maxX: 400, emoji: '🔥' },
        { x: 360, y: 190, w: 30, h: 30, vx: -1.8, minX: 340, maxX: 430, emoji: '🦇' }
      ];
      s.coins = [
        { x: 120, y: 300 },
        { x: 250, y: 230 },
        { x: 380, y: 180 },
        { x: 520, y: 120 },
        { x: 450, y: 405 }
      ];
      s.flag = { x: 520, y: 110, w: 32, h: 48 };
    }
  };

  const handleStart = () => {
    loadWorld(1);
    setScore(0);
    setLives(3);
    setWorld(1);
    setIsGameOver(false);
    setIsWon(false);
    setIsPlaying(true);
    sounds.powerup();
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const s = stateRef.current;
      const key = e.key.toLowerCase();
      s.keys[key] = true;

      // Jump
      if ((key === 'arrowup' || key === 'w' || key === ' ') && s.player.isGrounded) {
        s.player.vy = -13;
        s.player.isGrounded = false;
        sounds.laser();
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

      if (isPlaying && !isGameOver && !isWon) {
        // Horizontal Movement
        let moveX = 0;
        if (s.keys['arrowleft'] || s.keys['a']) {
          moveX -= s.player.speed;
          s.player.facing = -1;
        }
        if (s.keys['arrowright'] || s.keys['d']) {
          moveX += s.player.speed;
          s.player.facing = 1;
        }

        s.player.x += moveX;
        s.player.x = Math.max(0, Math.min(564, s.player.x));

        // Gravity & Vertical Movement
        s.player.vy += 0.75;
        s.player.y += s.player.vy;

        // Platform Collisions
        s.player.isGrounded = false;
        for (const plat of s.platforms) {
          // Check landing on top
          if (
            s.player.x + s.player.w > plat.x &&
            s.player.x < plat.x + plat.w &&
            s.player.y + s.player.h >= plat.y &&
            s.player.y + s.player.h <= plat.y + 16 &&
            s.player.vy >= 0
          ) {
            s.player.y = plat.y - s.player.h;
            s.player.vy = 0;
            s.player.isGrounded = true;
          }
        }

        // Fell into bottom abyss?
        if (s.player.y > 520) {
          sounds.explosion();
          setLives((l) => {
            const nxt = l - 1;
            if (nxt <= 0) {
              setIsGameOver(true);
            } else {
              s.player.x = 40;
              s.player.y = 350;
              s.player.vy = 0;
            }
            return nxt;
          });
        }

        // Update Enemies
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i];
          e.x += e.vx;
          if (e.x < e.minX || e.x > e.maxX) e.vx *= -1;

          // Check player collision
          if (
            s.player.x + s.player.w > e.x &&
            s.player.x < e.x + e.w &&
            s.player.y + s.player.h > e.y &&
            s.player.y < e.y + e.h
          ) {
            // Jump on enemy head?
            if (s.player.vy > 0 && s.player.y + s.player.h < e.y + 16) {
              sounds.hit();
              s.player.vy = -10; // bounce
              s.enemies.splice(i, 1);
              setScore((sc) => sc + 200);

              for (let p = 0; p < 8; p++) {
                s.particles.push({
                  x: e.x + 15,
                  y: e.y + 15,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 15,
                  color: '#fbbf24'
                });
              }
            } else {
              // Hurt player
              sounds.explosion();
              setLives((l) => {
                const nxt = l - 1;
                if (nxt <= 0) setIsGameOver(true);
                return nxt;
              });
              s.player.x = 40;
              s.player.y = 350;
              s.player.vy = 0;
            }
          }
        }

        // Collect Coins
        for (let i = s.coins.length - 1; i >= 0; i--) {
          const c = s.coins[i];
          if (Math.hypot(s.player.x + 18 - c.x, s.player.y + 22 - c.y) < 28) {
            sounds.powerup();
            s.coins.splice(i, 1);
            setScore((sc) => {
              const nxt = sc + 100;
              if (nxt > highScore) {
                setHighScore(nxt);
                localStorage.setItem('pixeladv_hi', nxt);
              }
              if (onScoreUpdate) onScoreUpdate(nxt);
              return nxt;
            });
          }
        }

        // Reach Goal Flag!
        if (s.flag) {
          if (
            s.player.x + s.player.w > s.flag.x &&
            s.player.x < s.flag.x + s.flag.w &&
            s.player.y + s.player.h > s.flag.y &&
            s.player.y < s.flag.y + s.flag.h
          ) {
            sounds.powerup();
            confetti({ particleCount: 70, spread: 80 });
            if (world === 1) {
              setWorld(2);
              loadWorld(2);
            } else {
              setIsWon(true);
            }
          }
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
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, 500);
      if (world === 1) {
        sky.addColorStop(0, '#38bdf8');
        sky.addColorStop(1, '#bae6fd');
      } else {
        sky.addColorStop(0, '#312e81');
        sky.addColorStop(1, '#6366f1');
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, 600, 500);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(100, 80, 30, 0, Math.PI * 2);
      ctx.arc(140, 80, 40, 0, Math.PI * 2);
      ctx.arc(180, 80, 30, 0, Math.PI * 2);
      ctx.fill();

      // Platforms
      for (const plat of s.platforms) {
        ctx.fillStyle = plat.color;
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

        // Grass/Stone top accent
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(plat.x, plat.y, plat.w, 4);
      }

      // Coins
      for (const c of s.coins) {
        ctx.save();
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.font = '22px sans-serif';
        ctx.fillText('🪙', c.x - 11, c.y + 8);
        ctx.restore();
      }

      // Flag
      if (s.flag) {
        ctx.font = '36px sans-serif';
        ctx.fillText('🚩', s.flag.x - 5, s.flag.y + 36);
      }

      // Enemies
      for (const e of s.enemies) {
        ctx.font = '28px sans-serif';
        ctx.fillText(e.emoji, e.x, e.y + 24);
      }

      // Player
      ctx.save();
      ctx.translate(s.player.x + 18, s.player.y + 22);
      if (s.player.facing === -1) ctx.scale(-1, 1);
      ctx.font = '36px sans-serif';
      ctx.fillText('🦊', -18, 14);
      ctx.restore();

      // Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, isWon, world, highScore, onScoreUpdate]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-amber-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-rose-400 font-black text-sm">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <span>x {lives}</span>
          </div>
          <div className="text-xs text-amber-300 font-bold bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-700">
            World {world}: {world === 1 ? 'Emerald Hills' : 'Sky Bastion'}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Score</div>
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

      {/* Canvas */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas ref={canvasRef} width={600} height={500} className="block w-full h-auto bg-slate-950" />

        {!isPlaying && !isGameOver && !isWon && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              🏰
            </div>
            <h2 className="text-3xl font-black font-bubble text-amber-300 tracking-wide">PIXEL ADVENTURE 2D</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Classic platforming quest! Jump between floating islands, stomp cartoon monsters, collect golden coins and reach the red flag to unlock the castle!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-amber-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Start Adventure
            </button>
          </div>
        )}

        {isWon && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">🏆</div>
            <h2 className="text-3xl font-black font-bubble text-emerald-300">VICTORY ACHIEVED!</h2>
            <p className="text-sm font-bold text-slate-200">
              You cleared all worlds! Final Score: <span className="text-amber-300 text-lg">{score}</span>
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Replay Adventure
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">💀</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">OUT OF LIVES!</h2>
            <p className="text-sm font-bold text-slate-200">
              Score: <span className="text-amber-300 text-lg">{score}</span>
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <div>⌨️ [◀/▶ or A/D] Run • [▲ or Space] Jump</div>
        <div>💡 Jump onto enemy heads to stomp them out!</div>
      </div>
    </div>
  );
};

export default PixelAdventure;

