import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Sparkles, Rocket } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#181438] text-purple-200 pt-16 pb-12 border-t-8 border-[#7C3AED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#FF4FA3] shadow-glow-pink">🚀</span>
              <span className="font-bubble font-black text-2xl text-white">
                SparkCode<span className="text-[#FF4FA3]">.AI</span>
              </span>
            </div>
            <p className="text-sm text-purple-300 leading-relaxed font-medium">
              Empowering children ages 6–16 to create games, code stories, and explore ethical AI with safe visual building blocks.
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-300 bg-emerald-950/80 border-2 border-emerald-600 px-3.5 py-1.5 rounded-full w-fit">
              <Shield className="w-4 h-4 text-emerald-400" /> COPPA Compliant & Ad-Free
            </div>
          </div>

          {/* Studios */}
          <div>
            <h4 className="font-bubble font-black text-white mb-4 text-base tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD43B]" /> Creation Studios
            </h4>
            <ul className="space-y-2.5 text-sm font-bold">
              <li><Link to="/studio/game" className="hover:text-[#FFD43B] transition-colors">🎮 Game Studio</Link></li>
              <li><Link to="/studio/animation" className="hover:text-[#FF4FA3] transition-colors">🎬 Animation Studio</Link></li>
              <li><Link to="/studio/story" className="hover:text-[#34D399] transition-colors">📖 Interactive Story Studio</Link></li>
              <li><Link to="/editor" className="hover:text-[#38BDF8] transition-colors">🧱 Visual Block Coding</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-[#FF8A3D] transition-colors">🤖 Sparky AI Assistant</Link></li>
            </ul>
          </div>

          {/* Learning & Safety */}
          <div>
            <h4 className="font-bubble font-black text-white mb-4 text-base tracking-wide">Learning & Safety</h4>
            <ul className="space-y-2.5 text-sm font-bold">
              <li><Link to="/learn" className="hover:text-[#FFD43B] transition-colors">Coding Quests</Link></li>
              <li><Link to="/parent-dashboard" className="hover:text-[#34D399] transition-colors">Parent Guardian Center</Link></li>
              <li><Link to="/about" className="hover:text-[#38BDF8] transition-colors">Ethical AI Principles</Link></li>
              <li><Link to="/my-projects" className="hover:text-[#FF4FA3] transition-colors">Public Project Showcase</Link></li>
            </ul>
          </div>

          {/* Ethical AI Pledge */}
          <div className="bg-[#28245C] p-5 rounded-3xl border-2 border-purple-500/40 space-y-3 shadow-xl">
            <h4 className="font-bubble font-black text-white text-sm flex items-center gap-2">
              🛡️ Ethical AI Safety Shield
            </h4>
            <p className="text-xs text-purple-200 leading-normal font-medium">
              SparkCode enforces kid-safe prompt filtering, collects zero tracking advertisements, and protects student identities at all times.
            </p>
            <div className="text-xs text-pink-300 font-black flex items-center gap-1 pt-1">
              Made with <Heart className="w-3.5 h-3.5 text-[#FF4FA3] fill-[#FF4FA3]" /> for future innovators
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-purple-900/60 flex flex-col sm:flex-row justify-between items-center text-xs text-purple-400 font-bold gap-4">
          <p>© {new Date().getFullYear()} SparkCode AI. All rights reserved. Dream It. Build It. Play It!</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-white">About Us</Link>
            <Link to="/parent-dashboard" className="hover:text-white">Privacy & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
