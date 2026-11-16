import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Zap, Trophy } from 'lucide-react';

const NeonSnake = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('neonsnake_hi') || 0));
  const [speedLevel, setSpeedLevel] = useState(1);
  const [muted, setMuted] = useState(false);

  // Snake grid parameters (25 cols x 20 rows, 24px each = 600 x 480)
  const COLS = 25;
  const ROWS = 20;
  const CELL = 24;

  const stateRef = useRef({
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 18, y: 10, type: 'orb' },
    particles: [],
    lastTick: 0
  });

  const spawnFood = () => {
    const s = stateRef.current;
    let newX, newY;
    while (true) {
      newX = Math.floor(Math.random() * COLS);
      newY = Math.floor(Math.random() * ROWS);
      // Ensure not on snake
      const onSnake = s.snake.some((seg) => seg.x === newX && seg.y === newY);
      if (!onSnake) break;
    }
    const isSpecial = Math.random() < 0.25;
    s.food = { x: newX, y: newY, type: isSpecial ? 'special' : 'orb' };
  };

  const handleStart = () => {
    const s = stateRef.current;
    s.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.particles = [];
    spawnFood();
    setScore(0);
    setSpeedLevel(1);
    setIsGameOver(false);
    setIsPlaying(true);
    sounds.powerup();
  };

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e) => {
      const s = stateRef.current;
      const key = e.key.toLowerCase();
      if ((key === 'arrowup' || key === 'w') && s.dir.y === 0) {
        s.nextDir = { x: 0, y: -1 };
        e.preventDefault();
      } else if ((key === 'arrowdown' || key === 's') && s.dir.y === 0) {
        s.nextDir = { x: 0, y: 1 };
        e.preventDefault();
      } else if ((key === 'arrowleft' || key === 'a') && s.dir.x === 0) {
        s.nextDir = { x: -1, y: 0 };
        e.preventDefault();
      } else if ((key === 'arrowright' || key === 'd') && s.dir.x === 0) {
        s.nextDir = { x: 1, y: 0 };
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = (timestamp) => {
      const s = stateRef.current;
      // Tick delay based on speed level (100ms down to 50ms)
      const tickDelay = Math.max(50, 110 - speedLevel * 7);

      if (isPlaying && !isGameOver && timestamp - s.lastTick > tickDelay) {
        s.lastTick = timestamp;
        s.dir = s.nextDir;

        const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

        // Wall collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
          sounds.explosion();
          setIsGameOver(true);
          setIsPlaying(false);
        } else if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          // Self collision
          sounds.explosion();
          setIsGameOver(true);
          setIsPlaying(false);
        } else {
          // Move forward
          s.snake.unshift(head);

          // Eat food?
          if (head.x === s.food.x && head.y === s.food.y) {
            sounds.laser();
            const pts = s.food.type === 'special' ? 250 : 100;
            setScore((sc) => {
              const nxt = sc + pts;
              if (nxt > highScore) {
                setHighScore(nxt);
                localStorage.setItem('neonsnake_hi', nxt);
              }
              if (onScoreUpdate) onScoreUpdate(nxt);
              setSpeedLevel(Math.min(10, Math.floor(nxt / 500) + 1));
              return nxt;
            });

            // Burst particles
            for (let i = 0; i < 12; i++) {
              s.particles.push({
                x: head.x * CELL + CELL / 2,
                y: head.y * CELL + CELL / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 20,
                color: s.food.type === 'special' ? '#f43f5e' : '#10b981'
              });
            }

            spawnFood();
          } else {
            s.snake.pop();
          }
        }
      }

      // ---------------- RENDER ----------------
      // Dark cyber grid
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, 600, 480);

      // Neon grid lines
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x < 600; x += CELL) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }
      for (let y = 0; y < 480; y += CELL) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }

      // Draw Glowing Food Orb
      ctx.save();
      const foodX = s.food.x * CELL + CELL / 2;
      const foodY = s.food.y * CELL + CELL / 2;
      ctx.shadowColor = s.food.type === 'special' ? '#f43f5e' : '#10b981';
      ctx.shadowBlur = 18;
      ctx.fillStyle = s.food.type === 'special' ? '#fb7185' : '#34d399';
      ctx.beginPath();
      ctx.arc(foodX, foodY, s.food.type === 'special' ? 9 : 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Neon Snake Body
      ctx.save();
      s.snake.forEach((seg, i) => {
        const isHead = i === 0;
        ctx.shadowColor = isHead ? '#a855f7' : '#06b6d4';
        ctx.shadowBlur = isHead ? 15 : 8;
        ctx.fillStyle = isHead ? '#c084fc' : `hsl(${180 + i * 2}, 90%, 55%)`;

        const pad = 2;
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 6);
        ctx.fill();

        if (isHead) {
          // Eyes
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(seg.x * CELL + 7, seg.y * CELL + 8, 2.5, 0, Math.PI * 2);
          ctx.arc(seg.x * CELL + 17, seg.y * CELL + 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      // Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isGameOver, speedLevel, highScore, onScoreUpdate]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-emerald-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-black text-sm">
            <Zap className="w-5 h-5 fill-emerald-400" />
            <span>Speed Lvl {speedLevel}</span>
          </div>
          <div className="text-xs text-slate-400 font-code">
            Length: <span className="text-emerald-300 font-bold">{stateRef.current.snake.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Score</div>
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

      {/* Canvas */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas ref={canvasRef} width={600} height={480} className="block w-full h-auto bg-slate-950" />

        {/* Start / Game Over Modals */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              🐍
            </div>
            <h2 className="text-3xl font-black font-bubble text-emerald-300 tracking-wide">NEON CYBER SNAKE</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Slither across the cyber-grid! Collect glowing green orbs and special pink stars. Do not smash into neon perimeter walls or yourself!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Start Slithering
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">⚡</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">CIRCUIT BROKEN</h2>
            <p className="text-sm font-bold text-slate-200">
              Final Score: <span className="text-emerald-300 text-lg">{score}</span>
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
        <div>⌨️ [Arrow Keys / WASD] Steer Snake</div>
        <div>✨ Bonus Pink Orbs give +250 points!</div>
      </div>
    </div>
  );
};

export default NeonSnake;

