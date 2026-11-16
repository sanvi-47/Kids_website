import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Plus, Sparkles, Check, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SPRITE_PRESETS = [
  { id: 'sp_cat', name: 'Cosmo Cat', emoji: '🐱', category: 'animals' },
  { id: 'sp_dino', name: 'Rex Dino', emoji: '🦖', category: 'animals' },
  { id: 'sp_fox', name: 'Sparky Fox', emoji: '🦊', category: 'animals' },
  { id: 'sp_robot', name: 'Robbie Bot', emoji: '🤖', category: 'fantasy' },
  { id: 'sp_alien', name: 'Zog Alien', emoji: '👾', category: 'fantasy' },
  { id: 'sp_rocket', name: 'Hyper Rocket', emoji: '🚀', category: 'vehicles' },
  { id: 'sp_car', name: 'Turbo Car', emoji: '🏎️', category: 'vehicles' },
  { id: 'sp_star', name: 'Magic Star', emoji: '⭐', category: 'items' },
  { id: 'sp_coin', name: 'Gold Coin', emoji: '🪙', category: 'items' },
  { id: 'sp_pizza', name: 'Power Pizza', emoji: '🍕', category: 'items' },
  { id: 'sp_gem', name: 'Ruby Gem', emoji: '💎', category: 'items' },
  { id: 'sp_heart', name: 'Extra Life', emoji: '❤️', category: 'items' }
];

export const BACKGROUND_PRESETS = [
  { id: 'galaxy', name: 'Galaxy Stars', bgClass: 'bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900' },
  { id: 'forest', name: 'Sunny Woods', bgClass: 'bg-gradient-to-b from-sky-300 via-emerald-200 to-green-600' },
  { id: 'desert', name: 'Golden Sands', bgClass: 'bg-gradient-to-b from-amber-200 via-orange-300 to-amber-600' },
  { id: 'underwater', name: 'Ocean Deep', bgClass: 'bg-gradient-to-b from-cyan-400 via-blue-600 to-indigo-900' },
  { id: 'party', name: 'Neon Arcade', bgClass: 'bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700' },
  { id: 'grid', name: 'Cyber Grid', bgClass: 'bg-slate-900 border-4 border-dashed border-teal-500/40' }
];

export const soundEffects = {
  jump: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  },
  score: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  },
  click: () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }
};

