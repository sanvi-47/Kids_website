import React, { useState } from 'react';
import { BLOCK_CATEGORIES, BLOCK_TEMPLATES } from './blockDefinitions';
import { Trash2, Plus, Code2, Sparkles, ChevronRight } from 'lucide-react';
import { sounds } from '../games/SoundManager';

const VisualBlockWorkspace = ({ activeSprite, onUpdateBlocks }) => {
  const [selectedCategory, setSelectedCategory] = useState('motion');

  if (!activeSprite) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-slate-400 text-xs font-bold text-center">
        Select a character from the Sprite Library below to attach visual coding blocks!
      </div>
    );
  }

  const spriteBlocks = activeSprite.blocks || [];

  const handleAddBlock = (template) => {
    const newBlock = {
      ...template,
      id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    sounds.laser();
    onUpdateBlocks([...spriteBlocks, newBlock]);
  };

  const handleRemoveBlock = (blockId) => {
    sounds.hit();
    onUpdateBlocks(spriteBlocks.filter((b) => b.id !== blockId));
  };

  const handleClearBlocks = () => {
    sounds.explosion();
    onUpdateBlocks([]);
  };

  const handleUpdateBlockValue = (blockId, field, val) => {
    const updated = spriteBlocks.map((b) => {
      if (b.id === blockId) {
        return { ...b, [field]: val };
      }
      return b;
    });
    onUpdateBlocks(updated);
  };

  const currentCatObj = BLOCK_CATEGORIES.find((c) => c.id === selectedCategory) || BLOCK_CATEGORIES[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full bg-slate-900 rounded-3xl border-2 border-purple-500/30 overflow-hidden shadow-2xl">
      
      {/* Column 1: Block Categories Selector */}
      <div className="lg:col-span-3 bg-slate-950 p-3 border-r border-slate-800 flex flex-col space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
          Block Categories
        </div>
        {BLOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`w-full px-3 py-2 rounded-xl text-xs font-black flex items-center justify-between transition-all ${
              selectedCategory === cat.id
                ? `${cat.color} shadow-lg scale-105`
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>{cat.name}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${cat.color.split(' ')[0]}`}></div>
          </button>
        ))}
      </div>

      {/* Column 2: Block Palette (Available blocks to click & add) */}
      <div className="lg:col-span-4 bg-slate-900/80 p-4 border-r border-slate-800 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {currentCatObj.name} Blocks
          </span>
          <span className="text-[10px] text-slate-400">Click to snap</span>
        </div>

        <div className="space-y-2">
          {BLOCK_TEMPLATES[selectedCategory]?.map((b, idx) => (
            <div
              key={idx}
              onClick={() => handleAddBlock(b)}
              className={`p-2.5 rounded-xl font-code font-bold text-xs cursor-pointer shadow-md border-b-4 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-between select-none ${currentCatObj.color}`}
            >
              <span>{b.label}</span>
              <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">+ add</span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: The Script Workspace for Active Sprite */}
      <div className="lg:col-span-5 bg-slate-950/70 p-4 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeSprite.emoji}</span>
            <div>
              <div className="text-xs font-black text-white font-bubble">
                {activeSprite.name}'s Script Stack
              </div>
              <div className="text-[10px] text-purple-400 font-mono">
                {spriteBlocks.length} Blocks connected
              </div>
            </div>
          </div>

          {spriteBlocks.length > 0 && (
            <button
              onClick={handleClearBlocks}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Snap Stack View */}
        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {spriteBlocks.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs font-bold text-center border-2 border-dashed border-slate-800 rounded-2xl p-4">
              <Code2 className="w-8 h-8 text-purple-500/50 mb-2" />
              This character has no script yet! Click blocks on the palette to add motion, sound, and controls!
            </div>
          ) : (
            spriteBlocks.map((blk, idx) => {
              const catObj = BLOCK_CATEGORIES.find((c) => c.id === blk.category) || BLOCK_CATEGORIES[0];
              return (
                <div
                  key={blk.id}
                  className={`p-2.5 rounded-xl font-code font-bold text-xs shadow-md border-b-4 flex items-center justify-between transition-all select-none ${catObj.color}`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] opacity-75 font-mono">#{idx + 1}</span>
                    <span>{blk.label}</span>

                    {/* Inline Editable Inputs */}
                    {blk.inputType === 'number' && (
                      <input
                        type="number"
                        value={blk.val}
                        onChange={(e) => handleUpdateBlockValue(blk.id, 'val', Number(e.target.value))}
                        className="w-14 px-1.5 py-0.5 rounded bg-black/30 text-white font-mono text-center text-xs focus:outline-none focus:ring-1 focus:ring-yellow-300"
                      />
                    )}

                    {blk.inputType === 'key' && (
                      <select
                        value={blk.keyChoice || 'ArrowRight'}
                        onChange={(e) => handleUpdateBlockValue(blk.id, 'keyChoice', e.target.value)}
                        className="px-1.5 py-0.5 rounded bg-black/40 text-white text-xs font-mono focus:outline-none"
                      >
                        <option value="ArrowRight">ArrowRight</option>
                        <option value="ArrowLeft">ArrowLeft</option>
                        <option value="ArrowUp">ArrowUp</option>
                        <option value="ArrowDown">ArrowDown</option>
                        <option value="Space">Space</option>
                        <option value="w">W</option>
                        <option value="a">A</option>
                        <option value="s">S</option>
                        <option value="d">D</option>
                      </select>
                    )}

                    {blk.inputType === 'text' && (
                      <input
                        type="text"
                        value={blk.text || ''}
                        onChange={(e) => handleUpdateBlockValue(blk.id, 'text', e.target.value)}
                        className="w-28 px-1.5 py-0.5 rounded bg-black/30 text-white text-xs focus:outline-none"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveBlock(blk.id)}
                    className="p-1 rounded text-white/60 hover:text-white hover:bg-black/30 transition-colors ml-2"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};

export default VisualBlockWorkspace;

