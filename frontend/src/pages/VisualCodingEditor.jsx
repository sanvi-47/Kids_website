import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { BACKGROUND_PRESETS, soundEffects } from '../components/CommonStudioAssets';
import { Play, Square, RotateCcw, Save, Trash2, Sparkles, Layers, Award, Terminal, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BLOCK_PALETTE = {
  Motion: [
    { type: 'move_forward', label: 'Move 10 steps', category: 'Motion', color: 'bg-blue-600 border-blue-700', val: 10 },
    { type: 'turn_right', label: 'Turn ↻ 15 degrees', category: 'Motion', color: 'bg-blue-600 border-blue-700', val: 15 },
    { type: 'turn_left', label: 'Turn ↺ 15 degrees', category: 'Motion', color: 'bg-blue-600 border-blue-700', val: 15 },
    { type: 'goto_random', label: 'Go to random position', category: 'Motion', color: 'bg-blue-600 border-blue-700' },
    { type: 'bounce_edge', label: 'If on edge, bounce', category: 'Motion', color: 'bg-blue-600 border-blue-700' }
  ],
  Looks: [
    { type: 'say_hello', label: 'Say "Hello, Coder!"', category: 'Looks', color: 'bg-purple-600 border-purple-700', text: 'Hello, Coder!' },
    { type: 'change_size', label: 'Change size by +10', category: 'Looks', color: 'bg-purple-600 border-purple-700', val: 10 },
    { type: 'reset_size', label: 'Set size to 100%', category: 'Looks', color: 'bg-purple-600 border-purple-700' }
  ],
  Sound: [
    { type: 'play_jump_sound', label: 'Play Sound Jump 🎶', category: 'Sound', color: 'bg-pink-600 border-pink-700' },
    { type: 'play_bell_sound', label: 'Play Magic Bell 🔔', category: 'Sound', color: 'bg-pink-600 border-pink-700' }
  ],
  Events: [
    { type: 'event_flag', label: 'When 🟢 clicked', category: 'Events', color: 'bg-amber-500 border-amber-600 is-starter' },
    { type: 'event_space', label: 'When [Space] key pressed', category: 'Events', color: 'bg-amber-500 border-amber-600 is-starter' }
  ],
  Control: [
    { type: 'repeat_times', label: 'Repeat 4 times', category: 'Control', color: 'bg-orange-500 border-orange-600', count: 4 },
    { type: 'forever_loop', label: 'Forever Loop ♾️', category: 'Control', color: 'bg-orange-500 border-orange-600' },
    { type: 'wait_1_sec', label: 'Wait 0.5 seconds ⏱️', category: 'Control', color: 'bg-orange-500 border-orange-600', seconds: 0.5 }
  ],
  Sensing: [
    { type: 'ask_name', label: 'Ask "What is your dream robot?"', category: 'Sensing', color: 'bg-cyan-600 border-cyan-700' }
  ],
  Operators: [
    { type: 'pick_random', label: 'Pick random 1 to 10 🎲', category: 'Operators', color: 'bg-emerald-600 border-emerald-700' }
  ],
  Variables: [
    { type: 'change_score', label: 'Change Score by 1 🪙', category: 'Variables', color: 'bg-rose-600 border-rose-700' },
    { type: 'reset_score', label: 'Set Score to 0', category: 'Variables', color: 'bg-rose-600 border-rose-700' }
  ]
};

const CATEGORIES = [
  { name: 'Motion', color: 'bg-blue-600 text-white' },
  { name: 'Looks', color: 'bg-purple-600 text-white' },
  { name: 'Sound', color: 'bg-pink-600 text-white' },
  { name: 'Events', color: 'bg-amber-500 text-white' },
  { name: 'Control', color: 'bg-orange-500 text-white' },
  { name: 'Sensing', color: 'bg-cyan-600 text-white' },
  { name: 'Operators', color: 'bg-emerald-600 text-white' },
  { name: 'Variables', color: 'bg-rose-600 text-white' }
];

const VisualCodingEditor = () => {
  const { saveProject } = useProjects();
  const { addXP } = useAuth();

  const [projectTitle, setProjectTitle] = useState('My Scratch Algorithm');
  const [activeCategory, setActiveCategory] = useState('Motion');
  const [selectedBg, setSelectedBg] = useState('galaxy');
  const [saveToast, setSaveToast] = useState(false);

  // Active Workspace Blocks Pipeline
  const [workspaceBlocks, setWorkspaceBlocks] = useState([
    { id: 'b_flag', type: 'event_flag', label: 'When 🟢 clicked', color: 'bg-amber-500 border-amber-600' },
    { id: 'b_move', type: 'move_forward', label: 'Move 10 steps', color: 'bg-blue-600 border-blue-700', val: 15 },
    { id: 'b_turn', type: 'turn_right', label: 'Turn ↻ 15 degrees', color: 'bg-blue-600 border-blue-700', val: 25 },
    { id: 'b_say', type: 'say_hello', label: 'Say "Hello, Coder!"', color: 'bg-purple-600 border-purple-700', text: 'Hello, World!' },
    { id: 'b_sound', type: 'play_bell_sound', label: 'Play Magic Bell 🔔', color: 'bg-pink-600 border-pink-700' }
  ]);

  // Stage Character State
  const [sprite, setSprite] = useState('🐱');
  const [spriteX, setSpriteX] = useState(240);
  const [spriteY, setSpriteY] = useState(190);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [speech, setSpeech] = useState('');
  const [score, setScore] = useState(0);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [activeExecutingBlockId, setActiveExecutingBlockId] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState(['SparkCode Scratch VM initialized.', 'Ready to run blocks.']);

  const addLog = (msg) => {
    setConsoleLogs((prev) => [msg, ...prev.slice(0, 10)]);
  };

  const addBlockToWorkspace = (block) => {
    const newBlock = {
      ...block,
      id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`
    };
    setWorkspaceBlocks((prev) => [...prev, newBlock]);
    soundEffects.click();
    addLog(`Added block [${block.label}]`);
  };

  const removeBlock = (id) => {
    setWorkspaceBlocks((prev) => prev.filter((b) => b.id !== id));
    soundEffects.click();
  };

  const clearWorkspace = () => {
    setWorkspaceBlocks([]);
    soundEffects.click();
    addLog('Workspace cleared');
  };

  // Block Execution Engine
  const executeCode = async () => {
    if (workspaceBlocks.length === 0) {
      addLog('⚠️ Workspace is empty! Drag blocks over to run.');
      return;
    }

    setIsRunning(true);
    addLog('🚀 Running program sequence...');
    soundEffects.jump();
    setSpeech('');

    for (let i = 0; i < workspaceBlocks.length; i++) {
      const blk = workspaceBlocks[i];
      setActiveExecutingBlockId(blk.id);

      switch (blk.type) {
        case 'move_forward': {
          const step = blk.val || 15;
          const rad = (rotation * Math.PI) / 180;
          setSpriteX((x) => Math.min(460, Math.max(40, x + Math.cos(rad) * step)));
          setSpriteY((y) => Math.min(350, Math.max(40, y + Math.sin(rad) * step)));
          addLog(`Motion: Moved ${step} steps`);
          break;
        }
        case 'turn_right': {
          setRotation((r) => (r + (blk.val || 15)) % 360);
          addLog(`Motion: Turned right 15°`);
          break;
        }
        case 'turn_left': {
          setRotation((r) => (r - (blk.val || 15)) % 360);
          addLog(`Motion: Turned left 15°`);
          break;
        }
        case 'goto_random': {
          setSpriteX(Math.floor(Math.random() * 380) + 50);
          setSpriteY(Math.floor(Math.random() * 280) + 50);
          addLog(`Motion: Jumped to random position`);
          break;
        }
        case 'bounce_edge': {
          setRotation((r) => (r + 180) % 360);
          addLog(`Motion: Bounced on edge`);
          break;
        }
        case 'say_hello': {
          setSpeech(blk.text || 'Beep Boop!');
          addLog(`Looks: Said "${blk.text || 'Beep Boop!'}"`);
          break;
        }
        case 'change_size': {
          setScale((s) => Math.min(2, s + 0.2));
          addLog(`Looks: Scaled size`);
          break;
        }
        case 'reset_size': {
          setScale(1);
          addLog(`Looks: Reset size to 100%`);
          break;
        }
        case 'play_jump_sound': {
          soundEffects.jump();
          addLog(`Sound: Played Jump sound`);
          break;
        }
        case 'play_bell_sound': {
          soundEffects.score();
          addLog(`Sound: Played Magic Bell`);
          break;
        }
        case 'change_score': {
          setScore((s) => s + 1);
          addLog(`Variables: Score + 1`);
          break;
        }
        case 'reset_score': {
          setScore(0);
          addLog(`Variables: Reset score`);
          break;
        }
        case 'wait_1_sec': {
          addLog(`Control: Waiting...`);
          await new Promise((r) => setTimeout(r, 500));
          break;
        }
        case 'forever_loop':
        case 'repeat_times': {
          soundEffects.click();
          addLog(`Control: Loop tick`);
          break;
        }
        default:
          break;
      }

      await new Promise((r) => setTimeout(r, 400));
    }

    setActiveExecutingBlockId(null);
    setIsRunning(false);
    addLog('✅ Finished program execution successfully!');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const stopCode = () => {
    setIsRunning(false);
    setActiveExecutingBlockId(null);
    addLog('⏹️ Stopped program execution.');
  };

  const resetStage = () => {
    stopCode();
    setSpriteX(240);
    setSpriteY(190);
    setRotation(0);
    setScale(1);
    setSpeech('');
    setScore(0);
    soundEffects.click();
    addLog('Reset stage character to starting coordinates.');
  };

  const handleSave = async () => {
    await saveProject({
      title: projectTitle,
      type: 'coding',
      thumbnail: sprite,
      description: `Scratch visual program with ${workspaceBlocks.length} blocks connected.`,
      data: {
        blocks: workspaceBlocks,
        sprite,
        background: selectedBg
      }
    });
    addXP(60, 'Visual Coder Ace');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const currentBgObj =
    BACKGROUND_PRESETS.find((b) => b.id === selectedBg) || BACKGROUND_PRESETS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Studio Banner with Electric Purple Gradient */}
      <div className="bg-gradient-to-r from-[#7C3AED] via-[#38BDF8] to-[#FF4FA3] rounded-3xl p-6 sm:p-8 text-white shadow-glow-purple flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 bg-white/25 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-yellow-300">
              🧱 Scratch Visual Block Coding Engine
            </span>
            <span className="text-xs bg-black/25 px-3 py-1 rounded-full font-black text-white">
              Live Runtime Execution
            </span>
          </div>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="text-2xl sm:text-4xl font-black font-bubble bg-transparent border-b-2 border-white/40 focus:border-white focus:outline-none placeholder-white/70 max-w-md"
          />
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#7C3AED] hover:scale-105 active:scale-95 font-bubble font-black text-sm rounded-2xl shadow-xl transition-all"
        >
          <Save className="w-5 h-5 text-[#FF4FA3]" />
          Save Project
        </button>
      </div>

      {saveToast && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
          <Award className="w-5 h-5" /> Saved to My Projects! +60 XP
        </div>
      )}

      {/* Editor Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Color-Coded Block Palette */}
        <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-purple-200 shadow-xl overflow-hidden flex flex-col h-[700px]">
          
          {/* Category Tabs */}
          <div className="p-3 bg-purple-50/80 border-b border-purple-100 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1 text-xs font-black rounded-xl transition-all ${
                  activeCategory === cat.name
                    ? `${cat.color} shadow-md scale-105`
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Palette Blocks */}
          <div className="p-4 flex-1 overflow-y-auto space-y-2.5 bg-slate-50/70">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
              Click a block to add to script:
            </div>
            {BLOCK_PALETTE[activeCategory]?.map((b, idx) => (
              <div
                key={idx}
                onClick={() => addBlockToWorkspace(b)}
                className={`scratch-block ${b.color} text-white font-code text-xs px-3.5 py-2.5 font-bold cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-between shadow-md border-b-4`}
              >
                <span>{b.label}</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">+ add</span>
              </div>
            ))}
          </div>

          {/* Character and Scene quick controls */}
          <div className="p-3.5 bg-white border-t border-purple-100 space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-500">Pick Active Sprite:</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['🐱', '🦖', '🤖', '🦊', '🚀', '⭐', '👾', '🐭', '🏎️'].map((e) => (
                <button
                  key={e}
                  onClick={() => setSprite(e)}
                  className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center ${
                    sprite === e
                      ? 'bg-purple-100 border-2 border-purple-600 scale-110 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Script Stack Workspace */}
        <div className="lg:col-span-4 bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-200 p-4 shadow-xl flex flex-col h-[700px]">
          
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-200">
            <div className="font-bubble font-black text-slate-800 text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-600" /> Script Stack ({workspaceBlocks.length} blocks)
            </div>
            <button
              onClick={clearWorkspace}
              className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          {/* The Visual Block Chain */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white/70 rounded-2xl border-2 border-dashed border-purple-300">
            {workspaceBlocks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs font-bold text-center px-4">
                <span className="text-4xl mb-2">🧩</span>
                Your workspace is empty! Click any block on the left palette to build your code stack!
              </div>
            ) : (
              workspaceBlocks.map((blk, idx) => (
                <div
                  key={blk.id}
                  className={`scratch-block ${blk.color} text-white font-code text-xs px-3.5 py-2.5 font-bold flex items-center justify-between shadow-md border-b-4 transition-all ${
                    activeExecutingBlockId === blk.id ? 'ring-4 ring-yellow-400 scale-105 z-10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-75 font-mono">#{idx + 1}</span>
                    <span>{blk.label}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlock(blk.id);
                    }}
                    className="text-white/60 hover:text-white hover:bg-black/20 p-1 rounded"
                    title="Remove block"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Quick Runner Toolbar */}
          <div className="pt-3 flex gap-2">
            {!isRunning ? (
              <button
                onClick={executeCode}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bubble font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Run Script (Green Flag)
              </button>
            ) : (
              <button
                onClick={stopCode}
                className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bubble font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 animate-pulse"
              >
                <Square className="w-4 h-4 fill-white" /> Stop
              </button>
            )}
            <button
              onClick={resetStage}
              className="p-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-purple-200 shadow-sm"
              title="Reset Stage"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Stage Preview & Live Output Terminal */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Stage Screen (Scratch Stage) */}
          <div className="bg-white p-4 rounded-3xl border-2 border-purple-200 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bubble font-black text-xs text-purple-900 uppercase tracking-wider">
                Stage Preview
              </span>
              <div className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Score: {score}
              </div>
            </div>

            <div
              className={`relative mx-auto rounded-2xl overflow-hidden shadow-inner select-none transition-all ${currentBgObj.bgClass}`}
              style={{ width: '100%', height: '320px' }}
            >
              <div
                className="absolute transition-all duration-300 flex flex-col items-center"
                style={{
                  left: `${spriteX}px`,
                  top: `${spriteY}px`,
                  transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`
                }}
              >
                {speech && (
                  <div className="bg-white text-slate-900 px-3 py-1.5 rounded-2xl shadow-lg text-xs font-black max-w-[150px] text-center mb-1 border-2 border-purple-300 relative animate-bounce">
                    {speech}
                    <div className="w-2 h-2 bg-white border-b-2 border-r-2 border-purple-300 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                  </div>
                )}
                <div className="text-6xl filter drop-shadow-xl">{sprite}</div>
              </div>

              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                x: {Math.round(spriteX - 240)}, y: {Math.round(190 - spriteY)}, dir: {rotation}°
              </div>
            </div>
          </div>

          {/* Live Execution Console with Deep Indigo Night Theme */}
          <div className="bg-[#28245C] text-slate-200 p-4 rounded-3xl shadow-xl font-mono text-xs h-[300px] flex flex-col border-2 border-purple-500/30">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-500/30 text-purple-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-[11px] uppercase tracking-wider">Scratch VM Console Output</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 text-[11px]">
              {consoleLogs.map((log, i) => (
                <div key={i} className="text-slate-300">
                  <span className="text-pink-400 mr-1.5">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VisualCodingEditor;
