import React from 'react';
import { BUILTIN_BACKGROUNDS } from '../engine/spriteLibrary';
import { X, Image, Sparkles } from 'lucide-react';

const BackgroundLibraryModal = ({ isOpen, onClose, onSelectBackground }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌄</span>
            <h3 className="font-bubble font-black text-xl text-purple-300">
              Stage World & Backgrounds
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 grid grid-cols-2 gap-4 overflow-y-auto">
          {BUILTIN_BACKGROUNDS.map((bg) => (
            <div
              key={bg.id}
              onClick={() => {
                onSelectBackground(bg.id);
                onClose();
              }}
              className="group p-2 rounded-2xl border-2 border-slate-700 hover:border-purple-500 bg-slate-800/80 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className={`h-24 rounded-xl ${bg.bgClass} flex items-center justify-center shadow-inner`}>
                <span className="text-xs font-black uppercase text-white/80 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {bg.name}
                </span>
              </div>
              <div className="font-bubble font-black text-xs text-slate-200 group-hover:text-purple-300 mt-2 text-center">
                {bg.name}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BackgroundLibraryModal;

