import React, { useState } from 'react';
import { Volume2, Music, Mic, Play, Pause, Sparkles, Check } from 'lucide-react';
import { sounds } from '../games/SoundManager';

const SoundAnimationStudio = ({ isOpen, onClose, activeSprite, onUpdateSprite }) => {
  const [activeTab, setActiveTab] = useState('sounds'); // sounds or costumes
  const [animSpeed, setAnimSpeed] = useState(1);
  const [isPlayingCostumeLoop, setIsPlayingCostumeLoop] = useState(false);

  if (!isOpen) return null;

  const soundList = [
    { name: 'Laser Beam 🔫', play: () => sounds.laser() },
    { name: 'Impact Hit 💥', play: () => sounds.hit() },
    { name: 'Power-up Chime ✨', play: () => sounds.powerup() },
    { name: 'Explosion 💣', play: () => sounds.explosion() },
    { name: 'Musical C4 Note 🎵', play: () => sounds.note(261.63, 0.2) },
    { name: 'Musical G4 Note 🎶', play: () => sounds.note(392.0, 0.2) }
  ];

  const handleAddCostume = (emoji) => {
    if (!activeSprite) return;
    const currentCostumes = activeSprite.costumes || [activeSprite.emoji];
    onUpdateSprite({
      ...activeSprite,
      costumes: [...currentCostumes, emoji]
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-pink-500/40 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <h3 className="font-bubble font-black text-xl text-pink-300">
              Sound & Character Animation Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('sounds')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'sounds' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sound Effects & Audio
          </button>
          <button
            onClick={() => setActiveTab('costumes')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'costumes' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Costumes & Animations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'sounds' && (
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-pink-300">
              Built-in Arcade Synthesizer Sounds:
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {soundList.map((s, idx) => (
                <button
                  key={idx}
                  onClick={s.play}
                  className="p-3 bg-slate-800/80 hover:bg-pink-950/80 border border-slate-700 hover:border-pink-500 rounded-2xl text-left text-xs font-bold text-slate-200 hover:text-pink-300 flex items-center justify-between transition-all"
                >
                  <span>{s.name}</span>
                  <Volume2 className="w-4 h-4 text-pink-400" />
                </button>
              ))}
            </div>

            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Mic className="w-4 h-4 text-pink-400" /> Custom Voice & Audio Note
              </div>
              <p className="text-[11px] text-slate-400">
                Children can preview any synthesized Web Audio note in real-time or hook it into their visual code blocks via the pink <strong>Sound</strong> category!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'costumes' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-purple-300 mb-2">
                Active Costumes for {activeSprite?.name}:
              </div>
              <div className="flex gap-2 flex-wrap">
                {(activeSprite?.costumes || [activeSprite?.emoji || '🦊']).map((c, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-purple-500 flex items-center justify-center text-2xl shadow"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Add Alternative Pose / Attack Costume:
              </div>
              <div className="flex gap-2 flex-wrap">
                {['⚡', '💥', '🔥', '🛡️', '💨', '✨', '🐾', '🗡️'].map((e) => (
                  <button
                    key={e}
                    onClick={() => handleAddCostume(e)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-xl flex items-center justify-center border border-slate-700"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default SoundAnimationStudio;

