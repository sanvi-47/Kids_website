import React, { useState } from 'react';
import { Bot, Sparkles, Send, Lightbulb, Zap, Check } from 'lucide-react';
import { sounds } from '../games/SoundManager';
import confetti from 'canvas-confetti';

const SparkyAiGameCreator = ({ isOpen, onClose, onApplyProject }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);

  if (!isOpen) return null;

  const sampleIdeas = [
    'Create a space shooting game where a rocket shoots alien invaders and earns 10 points!',
    'Create a platformer with a fox jumping over spikes and collecting golden coins.',
    'Create a fast car racing game dodging trucks with nitro speed boosts!',
    'Create a zombie survival game with a ninja hero blasting spooky monsters.'
  ];

  const handleGenerate = async (customText = prompt) => {
    const text = customText.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    sounds.laser();

    try {
      // Analyze text to create tailor-made starter project configuration
      const lower = text.toLowerCase();
      let heroEmoji = '🚀';
      let enemyEmoji = '👾';
      let bg = 'galaxy_stars';
      let title = 'Sparky AI Generated Game';

      if (lower.includes('fox') || lower.includes('platformer') || lower.includes('jump')) {
        heroEmoji = '🦊';
        enemyEmoji = '🐌';
        bg = 'emerald_hills';
        title = 'Adventure of the Brave Fox';
      } else if (lower.includes('car') || lower.includes('race') || lower.includes('speed')) {
        heroEmoji = '🏎️';
        enemyEmoji = '🚚';
        bg = 'racing_circuit';
        title = 'Turbo Neon Highway';
      } else if (lower.includes('zombie') || lower.includes('ninja') || lower.includes('survival')) {
        heroEmoji = '🥷';
        enemyEmoji = '🧟';
        bg = 'haunted_dungeon';
        title = 'Shadow Ninja Zombie Quest';
      } else if (lower.includes('snake')) {
        heroEmoji = '🐍';
        enemyEmoji = '🍏';
        bg = 'cyber_grid';
        title = 'Neon Cyber Snake';
      }

      // Simulated AI generation response with ready-to-run blocks
      const draft = {
        title,
        background: bg,
        sprites: [
          {
            id: 'sp_player',
            name: 'Hero Player',
            emoji: heroEmoji,
            costumes: [heroEmoji, '⚡'],
            currentCostume: 0,
            x: 250,
            y: 350,
            size: 55,
            direction: 0,
            speed: 8,
            visible: true,
            blocks: [
              { id: 'b1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
              { id: 'b2', type: 'when_key_pressed', label: 'When key [ArrowLeft] pressed', category: 'events', keyChoice: 'ArrowLeft' },
              { id: 'b3', type: 'change_x', label: 'Change X by [-15]', category: 'motion', val: -15 },
              { id: 'b4', type: 'when_key_pressed', label: 'When key [ArrowRight] pressed', category: 'events', keyChoice: 'ArrowRight' },
              { id: 'b5', type: 'change_x', label: 'Change X by [15]', category: 'motion', val: 15 },
              { id: 'b6', type: 'when_key_pressed', label: 'When key [Space] pressed', category: 'events', keyChoice: 'Space' },
              { id: 'b7', type: 'play_laser', label: 'Play Laser Sound 🔫', category: 'sound' },
              { id: 'b8', type: 'change_score', label: 'Change Score by [+10] 🪙', category: 'variables', val: 10 }
            ]
          },
          {
            id: 'sp_target',
            name: 'Rival Monster',
            emoji: enemyEmoji,
            costumes: [enemyEmoji, '💥'],
            currentCostume: 0,
            x: 250,
            y: 60,
            size: 48,
            direction: 0,
            speed: 4,
            visible: true,
            blocks: [
              { id: 'e1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
              { id: 'e2', type: 'forever', label: 'Forever ♾️', category: 'control' },
              { id: 'e3', type: 'move_steps', label: 'Move [10] steps', category: 'motion', val: 8 },
              { id: 'e4', type: 'bounce_edge', label: 'If on edge, bounce', category: 'motion' }
            ]
          }
        ]
      };

      setGeneratedDraft(draft);
      confetti({ particleCount: 50, spread: 70 });
      sounds.powerup();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedDraft) return;
    onApplyProject(generatedDraft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h3 className="font-bubble font-black text-xl text-purple-300">
                Sparky AI Game Creator
              </h3>
              <p className="text-[11px] text-slate-400">
                Describe your dream game and Sparky AI will assemble all characters, rules, and blocks!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-purple-400">
            Tell Sparky What You Want to Create:
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a shooting game where a player shoots monsters and earns 10 points..."
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>

        {/* Quick Idea Sparks */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" /> Or try one of these prompts:
          </span>
          <div className="space-y-1">
            {sampleIdeas.slice(0, 2).map((idea, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(idea);
                  handleGenerate(idea);
                }}
                className="w-full text-left p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-purple-300 transition-colors"
              >
                👉 {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Preview Card */}
        {generatedDraft && (
          <div className="bg-purple-950/50 border border-purple-500/40 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Game Architecture Generated!
              </span>
              <span className="text-2xl">{generatedDraft.sprites[0]?.emoji}</span>
            </div>
            <div className="text-xs font-bold text-white font-bubble">
              {generatedDraft.title}
            </div>
            <div className="text-[11px] text-slate-300">
              Includes {generatedDraft.sprites.length} characters with ready-to-run visual coding stacks and live collision triggers!
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> {isLoading ? 'Sparky is coding...' : 'Generate Game Project'}
          </button>

          {generatedDraft && (
            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Open in Studio
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SparkyAiGameCreator;

