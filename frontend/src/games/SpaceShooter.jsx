import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Heart, Zap, Trophy } from 'lucide-react';

const SpaceShooter = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('spaceshooter_hi') || 0));
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [hasShield, setHasShield] = useState(false);
  const [muted, setMuted] = useState(false);

  // Mutable Game State
  const stateRef = useRef({
    player: { x: 300, y: 440, w: 44, h: 44, speed: 6, vx: 0, shield: false },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    boss: null,
    powerups: [],
    stars: [],
    particles: [],
    keys: {},
    lastShot: 0,
    bossSpawned: false,
    waveTimer: 0
  });

  // Init starry background
  useEffect(() => {
    const s = stateRef.current;
    s.stars = [];
    for (let i = 0; i < 75; i++) {
      s.stars.push({
        x: Math.random() * 600,
        y: Math.random() * 500,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 1.5 + 0.5,
        color: ['#ffffff', '#a855f7', '#38bdf8', '#ec4899'][Math.floor(Math.random() * 4)]
      });
    }
  }, []);

  const spawnWave = (lvl) => {
    const s = stateRef.current;
    s.enemies = [];
    if (lvl % 3 === 0) {
      // Boss battle!
      s.boss = {
        x: 250,
        y: 60,
        w: 90,
        h: 70,
        hp: 30 + lvl * 10,
        maxHp: 30 + lvl * 10,
        vx: 2.5,
        lastAttack: 0,
        name: `Cyber Dreadnought Mk-${lvl}`
      };
      s.bossSpawned = true;
    } else {
      s.boss = null;
      s.bossSpawned = false;
      const rows = Math.min(4, 2 + Math.floor(lvl / 2));
      const cols = 6;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          s.enemies.push({
            x: 60 + c * 80,
            y: 50 + r * 50,
            w: 38,
            h: 34,
            hp: 1 + Math.floor(lvl / 3),
            maxHp: 1 + Math.floor(lvl / 3),
            type: r === 0 ? 'alien' : r === 1 ? 'saucer' : 'bug',
            emoji: r === 0 ? '👾' : r === 1 ? '🛸' : '🚀',
            vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + lvl * 0.2),
            shootCooldown: Math.random() * 200 + 100
          });
        }
      }
    }
  };

  const handleStart = () => {
    const s = stateRef.current;
    s.player.x = 300;
    s.player.y = 440;
    s.bullets = [];
    s.enemyBullets = [];
    s.powerups = [];
    s.particles = [];
    setScore(0);
    setLives(3);
    setLevel(1);
    setHasShield(false);
    setIsGameOver(false);
    setIsPlaying(true);
    spawnWave(1);
    sounds.powerup();
  };

  // Keyboard handlers
  useEffect(() => {
    const onKeyDown = (e) => {
      const s = stateRef.current;
      s.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') e.preventDefault();
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

  // Main Canvas Render & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = (timestamp) => {
      const s = stateRef.current;

      // Update logic if playing
      if (isPlaying && !isGameOver) {
        // Player Movement
        let vx = 0;
        let vy = 0;
        if (s.keys['arrowleft'] || s.keys['a']) vx -= s.player.speed;
        if (s.keys['arrowright'] || s.keys['d']) vx += s.player.speed;
        if (s.keys['arrowup'] || s.keys['w']) vy -= s.player.speed;
        if (s.keys['arrowdown'] || s.keys['s']) vy += s.player.speed;

        s.player.x = Math.max(25, Math.min(575, s.player.x + vx));
        s.player.y = Math.max(100, Math.min(460, s.player.y + vy));

        // Player Shooting
        if ((s.keys[' '] || s.keys['k'] || s.keys['enter']) && timestamp - s.lastShot > 180) {
          s.lastShot = timestamp;
          sounds.laser();
          if (hasShield) {
            // Triple Shot Powerup
            s.bullets.push({ x: s.player.x - 12, y: s.player.y - 15, vy: -10, color: '#38bdf8' });
            s.bullets.push({ x: s.player.x + 12, y: s.player.y - 15, vy: -10, color: '#38bdf8' });
            s.bullets.push({ x: s.player.x, y: s.player.y - 20, vy: -11, color: '#ec4899' });
          } else {
            s.bullets.push({ x: s.player.x, y: s.player.y - 20, vy: -10, color: '#38bdf8' });
          }
        }

        // Update Bullets
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          s.bullets[i].y += s.bullets[i].vy;
          if (s.bullets[i].y < -20) s.bullets.splice(i, 1);
        }

        // Update Enemy Bullets
        for (let i = s.enemyBullets.length - 1; i >= 0; i--) {
          const eb = s.enemyBullets[i];
          eb.y += eb.vy;
          // Hit player?
          const dist = Math.hypot(eb.x - s.player.x, eb.y - s.player.y);
          if (dist < 26) {
            s.enemyBullets.splice(i, 1);
            if (hasShield) {
              setHasShield(false);
              s.player.shield = false;
              sounds.hit();
            } else {
              sounds.explosion();
              setLives((l) => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  setIsGameOver(true);
                  setIsPlaying(false);
                }
                return nextLives;
              });
            }
            continue;
          }
          if (eb.y > 520) s.enemyBullets.splice(i, 1);
        }

        // Update Enemies
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i];
          e.x += e.vx;
          if (e.x < 30 || e.x > 570) e.vx *= -1;

          // Enemy shooting
          e.shootCooldown--;
          if (e.shootCooldown <= 0) {
            e.shootCooldown = Math.random() * 250 + 150;
            s.enemyBullets.push({ x: e.x, y: e.y + 15, vy: 3 + level * 0.3, color: '#ef4444' });
          }

          // Bullet collision
          for (let j = s.bullets.length - 1; j >= 0; j--) {
            const b = s.bullets[j];
            if (Math.abs(b.x - e.x) < 24 && Math.abs(b.y - e.y) < 22) {
              s.bullets.splice(j, 1);
              e.hp--;
              sounds.hit();
              // Spawn impact particles
              for (let p = 0; p < 4; p++) {
                s.particles.push({
                  x: e.x,
                  y: e.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  life: 18,
                  color: '#38bdf8'
                });
              }

              if (e.hp <= 0) {
                sounds.explosion();
                s.enemies.splice(i, 1);
                setScore((sc) => {
                  const newSc = sc + 100 * level;
                  if (newSc > highScore) {
                    setHighScore(newSc);
                    localStorage.setItem('spaceshooter_hi', newSc);
                  }
                  if (onScoreUpdate) onScoreUpdate(newSc);
                  return newSc;
                });

                // Drop powerup chance (15%)
                if (Math.random() < 0.18) {
                  const pType = Math.random() > 0.5 ? 'shield' : 'life';
                  s.powerups.push({ x: e.x, y: e.y, vy: 2, type: pType, emoji: pType === 'shield' ? '🛡️' : '❤️' });
                }
                break;
              }
            }
          }
        }

        // Update Boss
        if (s.boss) {
          s.boss.x += s.boss.vx;
          if (s.boss.x < 80 || s.boss.x > 520) s.boss.vx *= -1;

          // Boss Attacks
          if (timestamp - s.boss.lastAttack > 1200) {
            s.boss.lastAttack = timestamp;
            sounds.laser();
            s.enemyBullets.push({ x: s.boss.x - 25, y: s.boss.y + 30, vy: 4, color: '#f43f5e' });
            s.enemyBullets.push({ x: s.boss.x, y: s.boss.y + 35, vy: 5, color: '#f59e0b' });
            s.enemyBullets.push({ x: s.boss.x + 25, y: s.boss.y + 30, vy: 4, color: '#f43f5e' });
          }

          // Bullet hits Boss
          for (let j = s.bullets.length - 1; j >= 0; j--) {
            const b = s.bullets[j];
            if (Math.abs(b.x - s.boss.x) < 45 && Math.abs(b.y - s.boss.y) < 35) {
              s.bullets.splice(j, 1);
              s.boss.hp--;
              sounds.hit();
              for (let p = 0; p < 5; p++) {
                s.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 20,
                  color: '#f43f5e'
                });
              }

              if (s.boss.hp <= 0) {
                sounds.explosion();
                confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
                s.boss = null;
                setScore((sc) => sc + 2000 * level);
                break;
              }
            }
          }
        }

        // Check Wave Clear
        if (s.enemies.length === 0 && !s.boss) {
          setLevel((lvl) => {
            const nxt = lvl + 1;
            spawnWave(nxt);
            confetti({ particleCount: 30, spread: 60 });
            return nxt;
          });
        }

        // Update Powerups
        for (let i = s.powerups.length - 1; i >= 0; i--) {
          const pu = s.powerups[i];
          pu.y += pu.vy;
          const dist = Math.hypot(pu.x - s.player.x, pu.y - s.player.y);
          if (dist < 32) {
            sounds.powerup();
            if (pu.type === 'shield') {
              setHasShield(true);
              s.player.shield = true;
            } else if (pu.type === 'life') {
              setLives((l) => Math.min(5, l + 1));
            }
            s.powerups.splice(i, 1);
            continue;
          }
          if (pu.y > 520) s.powerups.splice(i, 1);
        }

        // Update Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) s.particles.splice(i, 1);
        }
      }

      // ---------------- RENDER ----------------
      // Dark space background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 600, 500);

      // Starfield parallax
      for (const st of s.stars) {
        st.y += st.speed;
        if (st.y > 500) st.y = 0;
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Player Ship
      ctx.save();
      ctx.translate(s.player.x, s.player.y);

      // Engine Thruster glow
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-8, 18);
      ctx.lineTo(8, 18);
      ctx.lineTo(0, 26 + Math.random() * 8);
      ctx.closePath();
      ctx.fill();

      // Ship body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(18, 16);
      ctx.lineTo(0, 10);
      ctx.lineTo(-18, 16);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -2, 6, 0, Math.PI * 2);
      ctx.fill();

      // Shield Aura
      if (hasShield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Draw Bullets
      for (const b of s.bullets) {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(b.x - 3, b.y - 12, 6, 16);
      }
      ctx.shadowBlur = 0;

      // Draw Enemy Bullets
      for (const eb of s.enemyBullets) {
        ctx.fillStyle = eb.color;
        ctx.shadowColor = eb.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Draw Regular Enemies
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const e of s.enemies) {
        ctx.fillText(e.emoji, e.x, e.y);
        // Mini HP bar if > 1
        if (e.maxHp > 1) {
          ctx.fillStyle = '#334155';
          ctx.fillRect(e.x - 14, e.y - 20, 28, 4);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(e.x - 14, e.y - 20, (e.hp / e.maxHp) * 28, 4);
        }
      }

      // Draw Boss
      if (s.boss) {
        ctx.save();
        ctx.translate(s.boss.x, s.boss.y);
        // Boss ship body
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(0, 35);
        ctx.lineTo(45, -25);
        ctx.lineTo(-45, -25);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '28px sans-serif';
        ctx.fillText('👹', 0, 0);

        // Boss Health Bar at top
        ctx.restore();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(150, 16, 300, 14);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(150, 16, (s.boss.hp / s.boss.maxHp) * 300, 14);
        ctx.strokeStyle = '#f87171';
        ctx.strokeRect(150, 16, 300, 14);
        ctx.font = '10px Nunito, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${s.boss.name}: ${s.boss.hp} HP`, 300, 23);
      }

      // Draw Powerups
      for (const pu of s.powerups) {
        ctx.font = '24px sans-serif';
        ctx.fillText(pu.emoji, pu.x, pu.y);
      }

      // Draw Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, level, hasShield, highScore, onScoreUpdate]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-cyan-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-cyan-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-rose-400 font-black text-sm">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <span>x {lives}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Sector {level}</span>
          </div>

          {hasShield && (
            <div className="flex items-center gap-1 text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full text-xs font-bold border border-cyan-500">
              <Shield className="w-3.5 h-3.5" /> Overcharge active!
            </div>
          )}
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Score</div>
            <div className="text-xl font-black font-code text-white tracking-widest">{score.toString().padStart(5, '0')}</div>
          </div>
          <div className="text-right border-l border-slate-700 pl-4">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Hi-Score</div>
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

      {/* Game Canvas Container */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas ref={canvasRef} width={600} height={500} className="block w-full h-auto bg-slate-950 cursor-crosshair" />

        {/* Start / Game Over Modal Overlays */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              🚀
            </div>
            <h2 className="text-3xl font-black font-bubble text-cyan-300 tracking-wide">SPACE SHOOTER ARCADE</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Pilot your interceptor! Arrow Keys / WASD to dodge, <strong className="text-cyan-400">SPACEBAR</strong> to blast incoming alien waves and mega dreadnought bosses!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Launch Mission
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
            <div className="text-5xl">💥</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">MISSION TERMINATED</h2>
            <p className="text-sm font-bold text-slate-200">
              Final Score: <span className="text-amber-300 text-lg">{score}</span>
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

      {/* Control hints footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <div>⌨️ [A/D or ◀/▶] Move • [SPACE] Fire Laser</div>
        <div>🛡️ Grab shields to unlock triple-beam barrage!</div>
      </div>
    </div>
  );
};

export default SpaceShooter;

