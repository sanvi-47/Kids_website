import React, { useRef, useEffect, useState } from 'react';
import { sounds } from './SoundManager';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Music, Trophy, Sparkles } from 'lucide-react';

const TRACKS = [
  { id: 'electro', name: 'Cyber Beats (120 BPM)', bpm: 120, speed: 4.5, color: '#38bdf8' },
  { id: 'arcade', name: 'Pixel Groove (140 BPM)', bpm: 140, speed: 5.5, color: '#ec4899' },
  { id: 'hyper', name: 'Neon Rush (160 BPM)', bpm: 160, speed: 6.5, color: '#fbbf24' }
];

const LANES = [
  { key: 'd', label: 'D', note: 'C4', freq: 261.63, color: '#ec4899', x: 180 },
  { key: 'f', label: 'F', note: 'E4', freq: 329.63, color: '#38bdf8', x: 260 },
  { key: 'j', label: 'J', note: 'G4', freq: 392.0, color: '#fbbf24', x: 340 },
  { key: 'k', label: 'K', note: 'B4', freq: 493.88, color: '#a855f7', x: 420 }
];

const RhythmChallenge = ({ onScoreUpdate }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [rating, setRating] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('rhythm_hi') || 0));
  const [muted, setMuted] = useState(false);

  const HIT_Y = 430;

  const stateRef = useRef({
    notes: [],
    lastSpawn: 0,
    particles: [],
    activeKeys: { d: false, f: false, j: false, k: false },
    health: 100
  });

  const handleStart = () => {
    const s = stateRef.current;
    s.notes = [];
    s.particles = [];
    s.health = 100;
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setRating('READY!');
    setIsGameOver(false);
    setIsPlaying(true);
    sounds.powerup();
  };

  // Keyboard notes trigger
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const laneIndex = LANES.findIndex((l) => l.key === key);
      if (laneIndex === -1) return;

      const s = stateRef.current;
      s.activeKeys[key] = true;

      // Play musical tone
      sounds.note(LANES[laneIndex].freq, 0.15);

      if (!isPlaying || isGameOver) return;

      // Check for note in hit window (HIT_Y +- 45px)
      let hit = false;
      for (let i = 0; i < s.notes.length; i++) {
        const n = s.notes[i];
        if (n.lane === laneIndex && !n.hit) {
          const diff = Math.abs(n.y - HIT_Y);
          if (diff < 45) {
            n.hit = true;
            hit = true;

            let pts = 100;
            let ratingTxt = 'GOOD';
            if (diff < 15) {
              pts = 300;
              ratingTxt = 'PERFECT!';
            } else if (diff < 28) {
              pts = 200;
              ratingTxt = 'GREAT!';
            }

            setRating(ratingTxt);
            setCombo((c) => {
              const nxt = c + 1;
              if (nxt > maxCombo) setMaxCombo(nxt);
              if (nxt % 10 === 0) confetti({ particleCount: 25, spread: 50 });
              return nxt;
            });

            setScore((sc) => {
              const nxt = sc + pts + combo * 10;
              if (nxt > highScore) {
                setHighScore(nxt);
                localStorage.setItem('rhythm_hi', nxt);
              }
              if (onScoreUpdate) onScoreUpdate(nxt);
              return nxt;
            });

            // Burst particles
            for (let p = 0; p < 8; p++) {
              s.particles.push({
                x: LANES[laneIndex].x,
                y: HIT_Y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 15,
                color: LANES[laneIndex].color
              });
            }
            break;
          }
        }
      }

      if (!hit) {
        // Miss tap
        setCombo(0);
        setRating('MISS');
      }
    };

    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (stateRef.current.activeKeys[key] !== undefined) {
        stateRef.current.activeKeys[key] = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isPlaying, isGameOver, combo, maxCombo, highScore, onScoreUpdate]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = (timestamp) => {
      const s = stateRef.current;

      if (isPlaying && !isGameOver) {
        // Spawn rhythmic falling notes
        const spawnInterval = (60 / selectedTrack.bpm) * 1000 * 0.75;
        if (timestamp - s.lastSpawn > spawnInterval) {
          s.lastSpawn = timestamp;
          const lane = Math.floor(Math.random() * 4);
          s.notes.push({
            lane,
            y: -20,
            hit: false
          });
        }

        // Move notes down
        for (let i = s.notes.length - 1; i >= 0; i--) {
          const n = s.notes[i];
          n.y += selectedTrack.speed;

          // Missed note past bottom line
          if (n.y > HIT_Y + 50 && !n.hit) {
            setCombo(0);
            setRating('MISS');
            s.health = Math.max(0, s.health - 6);
            if (s.health <= 0) {
              sounds.explosion();
              setIsGameOver(true);
              setIsPlaying(false);
            }
            s.notes.splice(i, 1);
            continue;
          }

          if (n.y > 520) s.notes.splice(i, 1);
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
      // Dark cyber stage
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 600, 500);

      // Draw 4 Track Highway Lanes
      LANES.forEach((l) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(l.x - 35, 0);
        ctx.lineTo(l.x - 35, 500);
        ctx.moveTo(l.x + 35, 0);
        ctx.lineTo(l.x + 35, 500);
        ctx.stroke();

        // Key indicator zone at bottom
        const isActive = s.activeKeys[l.key];
        ctx.save();
        ctx.shadowColor = l.color;
        ctx.shadowBlur = isActive ? 20 : 6;
        ctx.fillStyle = isActive ? l.color : 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.arc(l.x, HIT_Y, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = l.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Key letter
        ctx.font = 'bold 16px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isActive ? '#000000' : '#ffffff';
        ctx.fillText(l.label, l.x, HIT_Y);
        ctx.restore();
      });

      // Hit Target Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(140, HIT_Y);
      ctx.lineTo(460, HIT_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Falling Notes
      s.notes.forEach((n) => {
        if (!n.hit) {
          const laneObj = LANES[n.lane];
          ctx.save();
          ctx.shadowColor = laneObj.color;
          ctx.shadowBlur = 12;
          ctx.fillStyle = laneObj.color;
          ctx.beginPath();
          ctx.roundRect(laneObj.x - 28, n.y - 12, 56, 24, 12);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🎵', laneObj.x, n.y);
          ctx.restore();
        }
      });

      // Draw Rating Text
      if (rating) {
        ctx.save();
        ctx.font = 'bold 24px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle =
          rating === 'PERFECT!'
            ? '#fbbf24'
            : rating === 'GREAT!'
            ? '#38bdf8'
            : rating === 'GOOD'
            ? '#22c55e'
            : '#f43f5e';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fillText(rating, 300, 340);
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
  }, [isPlaying, isGameOver, rating, selectedTrack]);

  return (
    <div className="bg-slate-950 rounded-3xl p-5 border-4 border-indigo-500/40 shadow-2xl relative overflow-hidden text-white">
      {/* Top Arcade HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-indigo-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-indigo-400 font-black text-sm">
            <Music className="w-5 h-5" />
            <span>Combo: {combo}x</span>
          </div>
          <div className="text-xs text-amber-300 font-bold bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-700">
            Max Combo: {maxCombo}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Score</div>
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

      {/* Track Selector */}
      {!isPlaying && (
        <div className="flex items-center gap-2 mb-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-bold px-2">Choose Beat:</span>
          {TRACKS.map((trk) => (
            <button
              key={trk.id}
              onClick={() => setSelectedTrack(trk)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                selectedTrack.id === trk.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{trk.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div className="relative mx-auto rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.25)]" style={{ maxWidth: '600px' }}>
        <canvas ref={canvasRef} width={600} height={500} className="block w-full h-auto bg-slate-950" />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              🎹
            </div>
            <h2 className="text-3xl font-black font-bubble text-indigo-300 tracking-wide">RHYTHM BEAT HERO</h2>
            <p className="text-xs text-slate-300 max-w-sm">
              Press the matching keys <strong className="text-cyan-300 font-mono">[ D ] [ F ] [ J ] [ K ]</strong> right when the falling musical notes hit the glowing targets!
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" /> Drop the Beat
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="text-5xl">⚡</div>
            <h2 className="text-3xl font-black font-bubble text-rose-400">SONG FAILED!</h2>
            <p className="text-sm font-bold text-slate-200">
              Score: <span className="text-indigo-300 text-lg">{score}</span> • Max Combo: <span className="text-amber-300">{maxCombo}</span>
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
        <div>⌨️ [D] • [F] • [J] • [K] correspond to 4 musical lanes</div>
        <div>🌟 Chain combos for exponential point bonuses!</div>
      </div>
    </div>
  );
};

export default RhythmChallenge;

