import React, { useState, useEffect, useRef } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { GameRuntime } from '../engine/GameRuntime';
import { BUILTIN_BACKGROUNDS } from '../engine/spriteLibrary';
import SpriteLibraryModal from '../engine/SpriteLibraryModal';
import BackgroundLibraryModal from '../engine/BackgroundLibraryModal';
import VisualBlockWorkspace from '../engine/VisualBlockWorkspace';
import SparkyAiGameCreator from '../engine/SparkyAiGameCreator';
import SoundAnimationStudio from '../engine/SoundAnimationStudio';
import { GAME_CREATION_TEMPLATES } from '../templates/starterTemplates';
import { sounds } from '../games/SoundManager';
import confetti from 'canvas-confetti';

import {
  Play,
  Square,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  Copy,
  Maximize2,
  Sparkles,
  Bot,
  Layers,
  Image,
  Music,
  Code2,
  Award,
  ChevronDown,
  Volume2
} from 'lucide-react';

const ScratchGameStudio = ({ initialTemplate, onBackToHub }) => {
  const { saveProject } = useProjects();
  const { addXP } = useAuth();

  // Template to start with
  const template = initialTemplate || GAME_CREATION_TEMPLATES[0];

  const [projectTitle, setProjectTitle] = useState(template.title);
  const [backgroundId, setBackgroundId] = useState(template.background || 'galaxy_stars');
  const [sprites, setSprites] = useState(template.sprites || []);
  const [activeSpriteIndex, setActiveSpriteIndex] = useState(0);

  // Runtime Stats
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Modals
  const [isSpriteModalOpen, setIsSpriteModalOpen] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  const canvasRef = useRef(null);
  const runtimeRef = useRef(null);
  const stageWrapperRef = useRef(null);

  const activeSprite = sprites[activeSpriteIndex] || sprites[0];

  // Initialize and update GameRuntime whenever stage state changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const runtimeState = {
      sprites: sprites.map((sp) => ({ ...sp })),
      score,
      lives,
      background: backgroundId
    };

    const runtime = new GameRuntime(canvasRef.current, runtimeState, (key, val) => {
      if (key === 'score') setScore(val);
      if (key === 'lives') setLives(val);
    });

    runtimeRef.current = runtime;

    if (isPlaying) {
      runtime.start();
    } else {
      runtime.render();
    }

    return () => {
      runtime.stop();
    };
  }, [sprites, backgroundId, isPlaying]);

  // Green Flag Start
  const handleStartGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(3);
    sounds.laser();
    if (runtimeRef.current) {
      runtimeRef.current.start();
    }
  };

  // Red Stop Button
  const handleStopGame = () => {
    setIsPlaying(false);
    sounds.hit();
    if (runtimeRef.current) {
      runtimeRef.current.stop();
    }
  };

  // Reset Stage
  const handleResetStage = () => {
    handleStopGame();
    setScore(0);
    setLives(3);
    // Reset positions to defaults
    setSprites((prev) =>
      prev.map((sp, idx) => ({
        ...sp,
        x: idx === 0 ? 250 : 250,
        y: idx === 0 ? 350 : 80,
        direction: 0
      }))
    );
  };

  // Save Project to Profile & Backend
  const handleSaveProject = async () => {
    await saveProject({
      title: projectTitle,
      type: 'game',
      thumbnail: activeSprite?.emoji || '🚀',
      description: `Scratch game with ${sprites.length} characters created in SparkCode Studio.`,
      data: {
        background: backgroundId,
        sprites
      }
    });

    addXP(60, 'Studio Game Creator');
    setSaveToast(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Sprite Management Handlers
  const handleAddSpriteFromLibrary = (libSprite) => {
    const newSprite = {
      id: `sp_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: libSprite.name,
      emoji: libSprite.emoji,
      costumes: libSprite.costumes || [libSprite.emoji],
      currentCostume: 0,
      x: Math.floor(Math.random() * 300) + 100,
      y: Math.floor(Math.random() * 200) + 100,
      size: 50,
      direction: 0,
      speed: libSprite.defaultSpeed || 6,
      visible: true,
      blocks: [
        { id: `b_${Date.now()}`, type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
        { id: `m_${Date.now()}`, type: 'move_steps', label: 'Move [10] steps', category: 'motion', val: 10 }
      ]
    };

    setSprites([...sprites, newSprite]);
    setActiveSpriteIndex(sprites.length);
    sounds.powerup();
  };

  const handleDuplicateSprite = (idx) => {
    const source = sprites[idx];
    if (!source) return;
    const clone = {
      ...source,
      id: `sp_clone_${Date.now()}`,
      name: `${source.name} Copy`,
      x: source.x + 20,
      y: source.y + 20,
      blocks: JSON.parse(JSON.stringify(source.blocks || []))
    };
    setSprites([...sprites, clone]);
    setActiveSpriteIndex(sprites.length);
  };

  const handleDeleteSprite = (idx) => {
    if (sprites.length <= 1) return; // Keep at least one
    const updated = sprites.filter((_, i) => i !== idx);
    setSprites(updated);
    setActiveSpriteIndex(Math.max(0, idx - 1));
  };

  const handleUpdateActiveSpriteBlocks = (newBlocks) => {
    setSprites((prev) => {
      const copy = [...prev];
      copy[activeSpriteIndex] = { ...copy[activeSpriteIndex], blocks: newBlocks };
      return copy;
    });
  };

  const handleUpdateActiveSpriteProps = (field, val) => {
    setSprites((prev) => {
      const copy = [...prev];
      copy[activeSpriteIndex] = { ...copy[activeSpriteIndex], [field]: val };
      return copy;
    });
  };

  // Background lookup
  const currentBgObj =
    BUILTIN_BACKGROUNDS.find((b) => b.id === backgroundId) || BUILTIN_BACKGROUNDS[0];

  return (
    <div className="space-y-6">
      {saveToast && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
          <Award className="w-5 h-5" /> Game project saved to My Creations! +60 XP
        </div>
      )}

      {/* Studio Top Control Navbar */}
      <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-4 sm:p-5 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
            >
              ← Templates Hub
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeSprite?.emoji || '🚀'}</span>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="text-lg sm:text-2xl font-black font-bubble bg-transparent border-b-2 border-slate-700 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Bot className="w-4 h-4 text-amber-300" /> Sparky AI Creator
          </button>

          <button
            onClick={() => setIsSoundModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-pink-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
          >
            <Music className="w-4 h-4" /> Sounds & Costumes
          </button>

          <button
            onClick={handleSaveProject}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-pink-500/40 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" /> Save Game
          </button>
        </div>
      </div>

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Block Workspace (The Scratch Engine) */}
        <div className="lg:col-span-7 h-[680px]">
          <VisualBlockWorkspace
            activeSprite={activeSprite}
            onUpdateBlocks={handleUpdateActiveSpriteBlocks}
          />
        </div>

        {/* Right Column: Game Stage + Sprites Manager */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* A. GAME STAGE CANVAS */}
          <div
            ref={stageWrapperRef}
            className="bg-slate-900 rounded-3xl p-4 border-2 border-purple-500/30 shadow-xl space-y-3"
          >
            {/* Top Toolbar: Green Flag, Red Stop, Score HUD */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <button
                    onClick={handleStartGame}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Start (Green Flag)
                  </button>
                ) : (
                  <button
                    onClick={handleStopGame}
                    className="px-4 py-1.5 bg-red-500 hover:bg-red-400 active:scale-95 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 animate-pulse"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" /> Stop
                  </button>
                )}

                <button
                  onClick={handleResetStage}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                  title="Reset positions"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* HUD */}
              <div className="flex items-center gap-3 font-code font-black text-xs">
                <span className="text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800">
                  Score: {score}
                </span>
                <span className="text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800">
                  Lives: {lives}
                </span>
              </div>
            </div>

            {/* Stage Screen (540x380) */}
            <div
              className={`relative mx-auto rounded-2xl overflow-hidden shadow-inner select-none transition-all ${currentBgObj.bgClass}`}
              style={{ width: '100%', maxWidth: '540px', height: '380px' }}
            >
              <canvas
                ref={canvasRef}
                width={540}
                height={380}
                className="block w-full h-full cursor-pointer"
                onClick={() => {
                  if (activeSprite && runtimeRef.current) {
                    runtimeRef.current.handleSpriteClick(activeSprite);
                  }
                }}
              />

              {/* World Tag */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                🌍 {currentBgObj.name}
              </div>
            </div>

            {/* Quick Background Switcher Trigger */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 font-bold">Arena Background:</span>
              <button
                onClick={() => setIsBgModalOpen(true)}
                className="text-purple-400 hover:text-purple-300 font-black flex items-center gap-1"
              >
                <Image className="w-3.5 h-3.5" /> Choose World ({currentBgObj.name})
              </button>
            </div>
          </div>

          {/* B. SPRITES / CHARACTER MANAGER */}
          <div className="bg-slate-900 rounded-3xl p-4 border-2 border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Characters in Game ({sprites.length})
              </span>
              <button
                onClick={() => setIsSpriteModalOpen(true)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl flex items-center gap-1 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" /> Add Sprite
              </button>
            </div>

            {/* Horizontal Sprites Row */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {sprites.map((sp, idx) => (
                <div
                  key={sp.id}
                  onClick={() => setActiveSpriteIndex(idx)}
                  className={`p-2.5 rounded-2xl border-2 text-center cursor-pointer min-w-[76px] transition-all relative ${
                    activeSpriteIndex === idx
                      ? 'border-purple-500 bg-purple-950/70 shadow-lg scale-105'
                      : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-3xl mb-1">{sp.emoji}</div>
                  <div className="text-[11px] font-bold text-white truncate max-w-[65px]">
                    {sp.name}
                  </div>

                  {/* Duplicate / Delete mini buttons */}
                  {activeSpriteIndex === idx && (
                    <div className="flex justify-center gap-1 mt-1.5 pt-1.5 border-t border-purple-500/30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateSprite(idx);
                        }}
                        title="Duplicate character"
                        className="p-1 rounded text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {sprites.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSprite(idx);
                          }}
                          title="Delete character"
                          className="p-1 rounded text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Sprite Coordinate / Size Editor */}
            {activeSprite && (
              <div className="pt-2 border-t border-slate-800 grid grid-cols-4 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400">X:</span>
                  <input
                    type="number"
                    value={Math.round(activeSprite.x)}
                    onChange={(e) => handleUpdateActiveSpriteProps('x', Number(e.target.value))}
                    className="w-full mt-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white text-center"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Y:</span>
                  <input
                    type="number"
                    value={Math.round(activeSprite.y)}
                    onChange={(e) => handleUpdateActiveSpriteProps('y', Number(e.target.value))}
                    className="w-full mt-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white text-center"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Size:</span>
                  <input
                    type="number"
                    value={activeSprite.size || 50}
                    onChange={(e) => handleUpdateActiveSpriteProps('size', Number(e.target.value))}
                    className="w-full mt-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white text-center"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Dir:</span>
                  <input
                    type="number"
                    value={activeSprite.direction || 0}
                    onChange={(e) => handleUpdateActiveSpriteProps('direction', Number(e.target.value))}
                    className="w-full mt-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white text-center"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODALS */}
      <SpriteLibraryModal
        isOpen={isSpriteModalOpen}
        onClose={() => setIsSpriteModalOpen(false)}
        onSelectSprite={handleAddSpriteFromLibrary}
      />

      <BackgroundLibraryModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        onSelectBackground={(bgId) => setBackgroundId(bgId)}
      />

      <SparkyAiGameCreator
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyProject={(draft) => {
          setProjectTitle(draft.title);
          setBackgroundId(draft.background);
          setSprites(draft.sprites);
          setActiveSpriteIndex(0);
        }}
      />

      <SoundAnimationStudio
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        activeSprite={activeSprite}
        onUpdateSprite={(updated) => {
          setSprites((prev) => {
            const copy = [...prev];
            copy[activeSpriteIndex] = updated;
            return copy;
          });
        }}
      />
    </div>
  );
};

export default ScratchGameStudio;

