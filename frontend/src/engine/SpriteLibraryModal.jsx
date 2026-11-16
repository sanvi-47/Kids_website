import React, { useState } from 'react';
import { BUILTIN_SPRITES, SPRITE_CATEGORIES } from '../engine/spriteLibrary';
import { X, Plus, Search, Sparkles, Upload, Palette } from 'lucide-react';

const SpriteLibraryModal = ({ isOpen, onClose, onSelectSprite, onDrawCustom }) => {
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');

  if (!isOpen) return null;

  const filtered = BUILTIN_SPRITES.filter((sp) => {
    const matchCat = selectedCat === 'All' || sp.category === selectedCat;
    const matchSearch =
      sp.name.toLowerCase().includes(search.toLowerCase()) ||
      sp.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddEmoji = () => {
    if (!customEmoji.trim()) return;
    onSelectSprite({
      id: `sp_custom_${Date.now()}`,
      name: 'Custom Sprite',
      emoji: customEmoji.trim(),
      costumes: [customEmoji.trim()],
      category: 'Custom',
      defaultSpeed: 6
    });
    setCustomEmoji('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            <h3 className="font-bubble font-black text-xl text-purple-300">
              Sprite & Character Library
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories & search */}
        <div className="py-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {SPRITE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  selectedCat === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search characters by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Custom Emoji / Character Input */}
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Type any emoji 🦄"
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                className="w-36 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-center"
              />
              <button
                onClick={handleAddEmoji}
                className="px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-xs font-black text-white hover:scale-105 transition-transform"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* Sprites Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-3 pr-1">
          {filtered.map((sp) => (
            <div
              key={sp.id}
              onClick={() => {
                onSelectSprite(sp);
                onClose();
              }}
              className="p-3 bg-slate-800/70 hover:bg-purple-950/70 border border-slate-700 hover:border-purple-500 rounded-2xl cursor-pointer text-center group transition-all transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-200">
                {sp.emoji}
              </div>
              <div className="font-bubble font-black text-xs text-slate-200 group-hover:text-purple-300 truncate">
                {sp.name}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                {sp.category}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SpriteLibraryModal;

