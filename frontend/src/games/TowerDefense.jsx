import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Heart, Trophy, Sparkles, Coins } from 'lucide-react';

const TOWER_TYPES = [
  { id: 'archer', name: 'Laser Cannon', cost: 100, range: 110, rate: 25, damage: 1, color: '#38bdf8', emoji: '🔫' },
  { id: 'wizard', name: 'Plasma Blast', cost: 175, range: 140, rate: 45, damage: 3, color: '#a855f7', emoji: '⚡' },
  { id: 'frost', name: 'Frost Sentry', cost: 140, range: 95, rate: 35, damage: 1, slow: true, color: '#06b6d4', emoji: '❄️' }
];

// Waypoint coordinates for the winding defense path (600x500)
const WAYPOINTS = [
  { x: 0, y: 120 },
  { x: 440, y: 120 },
  { x: 440, y: 260 },
  { x: 140, y: 260 },
  { x: 140, y: 400 },
  { x: 600, y: 400 }
];

const TowerDefense = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [gold, setGold] = useState(350);
  const [baseHealth, setBaseHealth] = useState(15);
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('towerdef_hi') || 0));
  const [selectedTowerType, setSelectedTowerType] = useState(TOWER_TYPES[0]);
  const [muted, setMuted] = useState(false);

  const stateRef = useRef({
    towers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    waveSpawning: false,
    enemiesSpawned: 0,
    maxEnemiesThisWave: 10,
    lastSpawn: 0
  });

  const handleStart = () => {
    const s = stateRef.current;
    s.towers = [];
    s.enemies = [];
    s.projectiles = [];
    s.particles = [];
    s.enemiesSpawned = 0;
    s.maxEnemiesThisWave = 10;
    s.waveSpawning = true;
    setGold(350);
    setBaseHealth(15);
    setWave(1);
    setScore(0);
    setIsGameOver(false);
    setIsWon(false);
    setIsPlaying(true);
    sounds.powerup();
  };

  // Canvas Click to Build Tower
  const handleCanvasClick = (e) => {
    if (!isPlaying || isGameOver || isWon) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if player has enough gold
    if (gold < selectedTowerType.cost) {
      sounds.hit();
      return;
    }

    // Check if not too close to the path waypoints
    const isTooCloseToPath = WAYPOINTS.some((wp, idx) => {
      if (idx === 0) return false;
      const prev = WAYPOINTS[idx - 1];
      // Distance from point (x,y) to line segment
      const minX = Math.min(prev.x, wp.x) - 25;
      const maxX = Math.max(prev.x, wp.x) + 25;
      const minY = Math.min(prev.y, wp.y) - 25;
      const maxY = Math.max(prev.y, wp.y) + 25;
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    });

    if (isTooCloseToPath) {
      sounds.hit();
      return;
    }

    // Check if not overlapping existing tower
    const s = stateRef.current;
    const overlaps = s.towers.some((t) => Math.hypot(t.x - x, t.y - y) < 40);
    if (overlaps) return;

    // Build tower!
    sounds.laser();
    s.towers.push({
      x,
      y,
      type: selectedTowerType,
      lastShot: 0
    });
    setGold((g) => g - selectedTowerType.cost);
  };

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = (timestamp) => {
      const s = stateRef.current;

      if (isPlaying && !isGameOver && !isWon) {
        // Wave Spawner
        if (s.waveSpawning && s.enemiesSpawned < s.maxEnemiesThisWave) {
          if (timestamp - s.lastSpawn > 1200 - Math.min(600, wave * 60)) {
            s.lastSpawn = timestamp;
            s.enemiesSpawned++;
            const isBoss = s.enemiesSpawned === s.maxEnemiesThisWave && wave % 2 === 0;

            s.enemies.push({
              x: WAYPOINTS[0].x,
              y: WAYPOINTS[0].y,
              waypointIdx: 1,
              hp: isBoss ? 20 + wave * 8 : 4 + wave * 2,
              maxHp: isBoss ? 20 + wave * 8 : 4 + wave * 2,
              speed: isBoss ? 1.0 : 1.5 + wave * 0.1,
              emoji: isBoss ? '👹' : ['👾', '🤖', '🦇'][Math.floor(Math.random() * 3)],
              bounty: isBoss ? 150 : 35
            });
          }
        }

        // Check if wave cleared
        if (s.enemiesSpawned >= s.maxEnemiesThisWave && s.enemies.length === 0) {
          if (wave >= 5) {
            setIsWon(true);
            confetti({ particleCount: 100, spread: 90 });
          } else {
            setWave((w) => {
              const nxt = w + 1;
              s.enemiesSpawned = 0;
              s.maxEnemiesThisWave = 10 + nxt * 3;
              setGold((g) => g + 150); // Wave bonus
              confetti({ particleCount: 30, spread: 50 });
              return nxt;
            });
          }
        }

        // Move Enemies along waypoints
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const e = s.enemies[i];
          const targetWp = WAYPOINTS[e.waypointIdx];

          const dx = targetWp.x - e.x;
          const dy = targetWp.y - e.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 5) {
            e.waypointIdx++;
            if (e.waypointIdx >= WAYPOINTS.length) {
              // Enemy reached base!
              sounds.explosion();
              setBaseHealth((h) => {
                const nxt = h - 1;
                if (nxt <= 0) {
                  setIsGameOver(true);
                  setIsPlaying(false);
                }
                return nxt;
              });
              s.enemies.splice(i, 1);
              continue;
            }
          } else {
            e.x += (dx / dist) * e.speed;
            e.y += (dy / dist) * e.speed;
          }
        }

        // Tower Targeting & Shooting
        s.towers.forEach((t) => {
          t.lastShot++;
          if (t.lastShot >= t.type.rate) {
            // Find closest enemy in range
            let targetEnemy = null;
            let minDist = t.type.range;

            for (const e of s.enemies) {
              const d = Math.hypot(e.x - t.x, e.y - t.y);
              if (d < minDist) {
                minDist = d;
                targetEnemy = e;
              }
            }

            if (targetEnemy) {
              t.lastShot = 0;
              sounds.laser();
              s.projectiles.push({
                x: t.x,
                y: t.y,
                target: targetEnemy,
                damage: t.type.damage,
                color: t.type.color
              });
            }
          }
        });

        // Update Projectiles
        for (let i = s.projectiles.length - 1; i >= 0; i--) {
          const pr = s.projectiles[i];
          const dx = pr.target.x - pr.x;
          const dy = pr.target.y - pr.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 12) {
            // Hit enemy
            sounds.hit();
            pr.target.hp -= pr.damage;

            // Spawn sparks
            for (let p = 0; p < 4; p++) {
              s.particles.push({
                x: pr.x,
                y: pr.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 14,
                color: pr.color
              });
            }

            if (pr.target.hp <= 0) {
              const idx = s.enemies.indexOf(pr.target);
              if (idx !== -1) {
                sounds.explosion();
                setGold((g) => g + pr.target.bounty);
                setScore((sc) => {
                  const nxt = sc + pr.target.bounty * 5;
                  if (nxt > highScore) {
                    setHighScore(nxt);
                    localStorage.setItem('towerdef_hi', nxt);
                  }
                  if (onScoreUpdate) onScoreUpdate(nxt);
                  return nxt;
                });
                s.enemies.splice(idx, 1);
              }
            }

            s.projectiles.splice(i, 1);
            continue;
          }

          pr.x += (dx / dist) * 10;
          pr.y += (dy / dist) * 10;
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
      // Dark terrain
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 500);

      // Draw Path Waypoint Tracks
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
      for (let i = 1; i < WAYPOINTS.length; i++) {
        ctx.lineTo(WAYPOINTS[i].x, WAYPOINTS[i].y);
      }
      ctx.stroke();

      // Road accent line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Base Castle at exit
      ctx.font = '36px sans-serif';
      ctx.fillText('🏰', 560, 410);

      // Draw Towers
      s.towers.forEach((t) => {
        ctx.save();
        ctx.shadowColor = t.type.color;
        ctx.shadowBlur = 12;

        // Base circle
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = t.type.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.type.emoji, t.x, t.y);
        ctx.restore();
      });

      // Draw Enemies
      s.enemies.forEach((e) => {
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.emoji, e.x, e.y);

        // HP bar
        ctx.fillStyle = '#334155';
        ctx.fillRect(e.x - 14, e.y - 20, 28, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(e.x - 14, e.y - 20, (e.hp / e.maxHp) * 28, 4);
      });

      // Draw Projectiles
      s.projectiles.forEach((pr) => {
        ctx.fillStyle = pr.color;
        ctx.shadowColor = pr.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Particles
      for (const p of s.particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, isWon, wave, highScore, onScoreUpdate]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-emerald-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>{gold} Gold</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400 font-black text-sm">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <span>Base HP: {baseHealth}</span>
          </div>
          <div className="text-xs text-emerald-300 font-bold bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-700">
            Wave {wave} / 5
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Score</div>
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

      {/* Tower Store Bar */}
      <div className="flex items-center gap-2 mb-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <span className="text-xs text-slate-400 font-bold px-2">Build Defenses:</span>
        {TOWER_TYPES.map((tw) => (
          <button
            key={tw.id}
            onClick={() => setSelectedTowerType(tw)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              selectedTowerType.id === tw.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{tw.emoji}</span>
            <span>{tw.name}</span>
            <span className="text-amber-300">({tw.cost}g)</span>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          onClick={handleCanvasClick}
          className="block w-full h-auto bg-slate-950 cursor-crosshair"
        />

        {!isPlaying && !isGameOver && !isWon && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              🛡️
            </div>
            <h2 className="text-3xl font-black font-bubble text-emerald-300 tracking-wide">CYBER TOWER DEFENSE</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Place defensive laser sentries around the path! Stop cartoon alien invasions before they breach the base castle!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Defend Realm
            </button>
          </div>
        )}

        {isWon && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">🏆</div>
            <h2 className="text-3xl font-black font-bubble text-emerald-300">KINGDOM DEFENDED!</h2>
            <p className="text-sm font-bold text-slate-200">
              Score: <span className="text-amber-300 text-lg">{score}</span>
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">💥</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">BASE DESTROYED!</h2>
            <p className="text-sm font-bold text-slate-200">
              Survived up to Wave {wave} • Score: <span className="text-emerald-300">{score}</span>
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
        <div>🖱️ Click on terrain to build selected tower</div>
        <div>💰 Earn gold by blasting enemies to upgrade defense grid!</div>
      </div>
    </div>
  );
};

export default TowerDefense;

