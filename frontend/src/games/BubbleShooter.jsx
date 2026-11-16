import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';

const BUBBLE_COLORS = ['#ec4899', '#38bdf8', '#fbbf24', '#a855f7', '#22c55e'];

const BubbleShooter = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('bubbleshooter_hi') || 0));
  const [level, setLevel] = useState(1);
  const [muted, setMuted] = useState(false);

  const RADIUS = 18;
  const COLS = 14;
  const ROWS = 9;

  const stateRef = useRef({
    grid: [], // 2D array of bubbles
    currentBubble: null,
    nextColor: '#ec4899',
    shooterAngle: -Math.PI / 2,
    activeBullet: null,
    particles: []
  });

  const initGrid = (lvl) => {
    const s = stateRef.current;
    s.grid = [];
    const filledRows = Math.min(6, 3 + lvl);
    for (let r = 0; r < ROWS; r++) {
      s.grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        if (r < filledRows) {
          const color = BUBBLE_COLORS[Math.floor(Math.random() * Math.min(BUBBLE_COLORS.length, 3 + Math.floor(lvl / 2)))];
          s.grid[r][c] = { color, popped: false };
        } else {
          s.grid[r][c] = null;
        }
      }
    }
    s.currentBubble = { color: BUBBLE_COLORS[Math.floor(Math.random() * 4)] };
    s.nextColor = BUBBLE_COLORS[Math.floor(Math.random() * 4)];
    s.activeBullet = null;
  };

  const handleStart = () => {
    initGrid(1);
    setScore(0);
    setLevel(1);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPlaying(true);
    sounds.powerup();
  };

  // Mouse aim & shoot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const shooterX = 300;
      const shooterY = 460;
      let angle = Math.atan2(mouseY - shooterY, mouseX - shooterX);
      // Clamp between -170 deg and -10 deg
      angle = Math.max(-Math.PI + 0.15, Math.min(-0.15, angle));
      stateRef.current.shooterAngle = angle;
    };

    const onClick = () => {
      const s = stateRef.current;
      if (!isPlaying || isGameOver || isVictory || s.activeBullet) return;

      sounds.laser();
      s.activeBullet = {
        x: 300,
        y: 460,
        vx: Math.cos(s.shooterAngle) * 12,
        vy: Math.sin(s.shooterAngle) * 12,
        color: s.currentBubble.color
      };

      s.currentBubble = { color: s.nextColor };
      s.nextColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [isPlaying, isGameOver, isVictory]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = () => {
      const s = stateRef.current;

      if (isPlaying && !isGameOver && !isVictory) {
        // Bullet Physics
        if (s.activeBullet) {
          const b = s.activeBullet;
          b.x += b.vx;
          b.y += b.vy;

          // Wall bounce
          if (b.x < RADIUS + 15) {
            b.x = RADIUS + 15;
            b.vx *= -1;
            sounds.note(400, 0.05);
          } else if (b.x > 600 - RADIUS - 15) {
            b.x = 600 - RADIUS - 15;
            b.vx *= -1;
            sounds.note(400, 0.05);
          }

          // Top bounce or attach
          let shouldAttach = b.y <= RADIUS + 20;

          // Check collision with existing bubbles
          let attachRow = -1;
          let attachCol = -1;

          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              if (s.grid[r][c]) {
                const bubbleX = 35 + c * (RADIUS * 2 + 3);
                const bubbleY = 35 + r * (RADIUS * 2 + 2);
                const dist = Math.hypot(b.x - bubbleX, b.y - bubbleY);
                if (dist < RADIUS * 2 - 2) {
                  shouldAttach = true;
                  break;
                }
              }
            }
            if (shouldAttach) break;
          }

          if (shouldAttach) {
            // Find closest slot
            let minDist = 9999;
            for (let r = 0; r < ROWS; r++) {
              for (let c = 0; c < COLS; c++) {
                if (!s.grid[r][c]) {
                  const bubbleX = 35 + c * (RADIUS * 2 + 3);
                  const bubbleY = 35 + r * (RADIUS * 2 + 2);
                  const dist = Math.hypot(b.x - bubbleX, b.y - bubbleY);
                  if (dist < minDist) {
                    minDist = dist;
                    attachRow = r;
                    attachCol = c;
                  }
                }
              }
            }

            if (attachRow !== -1 && attachCol !== -1) {
              s.grid[attachRow][attachCol] = { color: b.color, popped: false };
              sounds.hit();

              // BFS Match 3 or more of same color
              const matches = [];
              const visited = Array(ROWS)
                .fill(false)
                .map(() => Array(COLS).fill(false));
              const queue = [{ r: attachRow, c: attachCol }];
              visited[attachRow][attachCol] = true;

              while (queue.length > 0) {
                const curr = queue.shift();
                matches.push(curr);

                // Check 4 neighbors
                const nbrs = [
                  { r: curr.r - 1, c: curr.c },
                  { r: curr.r + 1, c: curr.c },
                  { r: curr.r, c: curr.c - 1 },
                  { r: curr.r, c: curr.c + 1 }
                ];

                for (const nb of nbrs) {
                  if (nb.r >= 0 && nb.r < ROWS && nb.c >= 0 && nb.c < COLS) {
                    if (!visited[nb.r][nb.c] && s.grid[nb.r][nb.c]?.color === b.color) {
                      visited[nb.r][nb.c] = true;
                      queue.push(nb);
                    }
                  }
                }
              }

              if (matches.length >= 3) {
                sounds.explosion();
                for (const m of matches) {
                  const bX = 35 + m.c * (RADIUS * 2 + 3);
                  const bY = 35 + m.r * (RADIUS * 2 + 2);
                  s.grid[m.r][m.c] = null;

                  for (let p = 0; p < 6; p++) {
                    s.particles.push({
                      x: bX,
                      y: bY,
                      vx: (Math.random() - 0.5) * 8,
                      vy: (Math.random() - 0.5) * 8,
                      life: 20,
                      color: b.color
                    });
                  }
                }

                setScore((sc) => {
                  const nxt = sc + matches.length * 150;
                  if (nxt > highScore) {
                    setHighScore(nxt);
                    localStorage.setItem('bubbleshooter_hi', nxt);
                  }
                  if (onScoreUpdate) onScoreUpdate(nxt);
                  return nxt;
                });
              }

              // Check if ceiling reached bottom line (Game Over)
              let reachedBottom = false;
              for (let c = 0; c < COLS; c++) {
                if (s.grid[ROWS - 2][c]) reachedBottom = true;
              }
              if (reachedBottom) {
                sounds.explosion();
                setIsGameOver(true);
              }

              // Check if all cleared (Level Complete)
              let anyLeft = false;
              for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                  if (s.grid[r][c]) anyLeft = true;
                }
              }
              if (!anyLeft) {
                sounds.powerup();
                confetti({ particleCount: 80, spread: 80 });
                setLevel((lvl) => {
                  const nxt = lvl + 1;
                  initGrid(nxt);
                  return nxt;
                });
              }
            }

            s.activeBullet = null;
          }
        }

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) s.particles.splice(i, 1);
        }
      }

      // ---------------- RENDER ----------------
      // Gradient background
      const bg = ctx.createLinearGradient(0, 0, 0, 500);
      bg.addColorStop(0, '#1e1b4b');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 600, 500);

      // Draw Grid Bubbles
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const bubble = s.grid[r][c];
          if (bubble) {
            const bx = 35 + c * (RADIUS * 2 + 3);
            const by = 35 + r * (RADIUS * 2 + 2);

            ctx.save();
            ctx.shadowColor = bubble.color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = bubble.color;
            ctx.beginPath();
            ctx.arc(bx, by, RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Bubble shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(bx - 5, by - 5, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // Draw Danger Warning Line
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(15, 35 + (ROWS - 2) * (RADIUS * 2 + 2));
      ctx.lineTo(585, 35 + (ROWS - 2) * (RADIUS * 2 + 2));
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Aim Cannon & Arrow
      ctx.save();
      ctx.translate(300, 460);
      ctx.rotate(s.shooterAngle);

      // Cannon Barrel
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, -8, 48, 16);

      // Aim dotted laser line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(48, 0);
      ctx.lineTo(250, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // Draw Loaded Bubble at Cannon
      if (s.currentBubble) {
        ctx.save();
        ctx.shadowColor = s.currentBubble.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = s.currentBubble.color;
        ctx.beginPath();
        ctx.arc(300, 460, RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Next Bubble Indicator
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Nunito, sans-serif';
      ctx.fillText('NEXT', 360, 465);
      ctx.fillStyle = s.nextColor;
      ctx.beginPath();
      ctx.arc(400, 460, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw Active Bullet
      if (s.activeBullet) {
        ctx.save();
        ctx.shadowColor = s.activeBullet.color;
        ctx.shadowBlur = 12;
        ctx.fillStyle = s.activeBullet.color;
        ctx.beginPath();
        ctx.arc(s.activeBullet.x, s.activeBullet.y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
  }, [isPlaying, isGameOver, isVictory, level, highScore, onScoreUpdate]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-pink-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-pink-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-pink-400 font-black text-sm">
            <Sparkles className="w-5 h-5 fill-pink-400" />
            <span>Puzzle Level {level}</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Score</div>
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
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas ref={canvasRef} width={600} height={500} className="block w-full h-auto bg-slate-950 cursor-crosshair" />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border-2 border-pink-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(236,72,153,0.5)]">
              🔮
            </div>
            <h2 className="text-3xl font-black font-bubble text-pink-300 tracking-wide">BUBBLE SHOOTER ARCADE</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Aim your cannon with mouse cursor and click to fire! Match 3 or more same-coloured bubbles to pop clusters before they touch the danger line!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-pink-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Start Popping
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">💥</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">CEILING COLLAPSED!</h2>
            <p className="text-sm font-bold text-slate-200">
              Final Score: <span className="text-pink-300 text-lg">{score}</span>
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
        <div>🎯 Aim with Mouse • Click Left Mouse to Launch Bubble</div>
        <div>💥 Bounce off side walls to reach tricky clusters!</div>
      </div>
    </div>
  );
};

export default BubbleShooter;

