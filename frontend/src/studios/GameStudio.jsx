import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { GAME_CREATION_TEMPLATES } from '../templates/starterTemplates';
import ScratchGameStudio from './ScratchGameStudio';

import {
  Code2,
  Sparkles,
  Play,
  Plus,
  Compass,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Gamepad2,
  Search,
  Share2,
  Copy,
  FolderOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GameStudio = () => {
  const { projects, saveProject } = useProjects();
  const { user, addXP } = useAuth();
  const navigate = useNavigate();

  // Mode: 'hub' (main discovery & templates) vs 'editor' (full scratch creation studio)
  const [viewMode, setViewMode] = useState('hub');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('templates'); // templates, community, my_games

  // Filter Templates
  const filteredTemplates = GAME_CREATION_TEMPLATES.filter((tmpl) => {
    return (
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Filter User Creations
  const myGames = projects.filter(
    (p) => p.type === 'game' && (p.authorId === user?.id || p.authorName === user?.username)
  );

  // Filter Community Showcase (Remixable creations)
  const communityGames = projects.filter((p) => p.type === 'game');

  const handleLaunchEditor = (tmpl = null) => {
    setActiveTemplate(tmpl || GAME_CREATION_TEMPLATES[0]);
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemixProject = async (project) => {
    const remixed = {
      title: `${project.title} (Remix)`,
      type: 'game',
      thumbnail: project.thumbnail || '🚀',
      description: `Remixed from ${project.authorName || 'Community Creator'}`,
      data: project.data || {}
    };

    const saved = await saveProject(remixed);
    addXP(30, 'Remix Explorer');
    confetti({ particleCount: 40, spread: 60 });

    // Open in editor
    setActiveTemplate({
      title: saved.title,
      background: saved.data?.background || 'galaxy_stars',
      sprites: saved.data?.sprites || GAME_CREATION_TEMPLATES[0].sprites
    });
    setViewMode('editor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* If Editor Mode is Active, Render the Full Scratch Visual Creation Studio */}
      {viewMode === 'editor' ? (
        <ScratchGameStudio
          initialTemplate={activeTemplate}
          onBackToHub={() => setViewMode('hub')}
        />
      ) : (
        /* ----------------- MAIN CREATION PLATFORM HUB ----------------- */
        <div className="space-y-12">
          
          {/* 1. HERO SECTION: "Don't Just Play Games. CREATE THEM!" */}
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border-4 border-purple-500/40 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl z-10">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-purple-300">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> SparkCode.AI Game Creation Studio
              </div>
              <h1 className="text-4xl sm:text-6xl font-black font-bubble tracking-tight text-white leading-tight">
                Don’t Just Play Games. <br />
                <span className="bg-gradient-to-r from-pink-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">
                  CREATE THEM!
                </span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
                Turn your imagination into playable games with visual coding blocks, custom character designers, and friendly AI assistance.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleLaunchEditor(null)}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-base rounded-2xl shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center gap-2.5"
                >
                  <Code2 className="w-5 h-5" /> Start Creating (Blank Studio) 🚀
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('starter_templates_section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-base rounded-2xl border border-slate-700 shadow-md flex items-center gap-2"
                >
                  <Compass className="w-5 h-5 text-purple-400" /> Start With a Template
                </button>
              </div>
            </div>

            {/* Visual Decorative Hero Preview */}
            <div className="z-10 flex flex-col items-center justify-center p-6 bg-slate-800/80 backdrop-blur-md rounded-3xl border-2 border-purple-500/40 shadow-2xl text-center min-w-[260px]">
              <div className="text-6xl mb-2 animate-bounce-soft">🦊</div>
              <div className="font-bubble font-black text-lg text-white">Visual Block Studio</div>
              <div className="text-xs text-purple-300 font-code mt-1 bg-purple-950 px-2.5 py-1 rounded-lg">
                When 🟢 clicked ➔ Move 10 Steps!
              </div>
              <div className="mt-4 flex gap-1">
                {['🚀', '👾', '🏎️', '🪙'].map((e) => (
                  <span key={e} className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-700">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {/* Glowing background circles */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* 2. CONTINUE CREATING / MY CREATIONS STRIP (If user has saved games) */}
          {myGames.length > 0 && (
            <div className="card-3d rounded-3xl p-6 border-2 border-purple-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💾</span>
                  <h3 className="font-bubble font-black text-xl text-white">
                    Continue Creating Your Projects ({myGames.length})
                  </h3>
                </div>
                <Link
                  to="/my-projects"
                  className="text-xs font-black text-[#FFD43B] hover:text-[#38BDF8] flex items-center gap-1"
                >
                  View All in Portfolio ➔
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {myGames.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-[#1F174D] hover:bg-[#281E60] border border-purple-400/30 hover:border-[#FF4FA3] rounded-2xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-3xl mb-1">{p.thumbnail || '🎮'}</div>
                      <h4 className="font-bold text-sm text-white truncate">{p.title}</h4>
                      <p className="text-[11px] text-purple-200 line-clamp-1">{p.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-purple-400/20 flex justify-between items-center text-xs">
                      <button
                        onClick={() => {
                          setActiveTemplate({
                            title: p.title,
                            background: p.data?.background || 'galaxy_stars',
                            sprites: p.data?.sprites || GAME_CREATION_TEMPLATES[0].sprites
                          });
                          setViewMode('editor');
                        }}
                        className="font-black text-[#FF4FA3] hover:text-[#FFD43B]"
                      >
                        Edit Code ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. STARTER CREATION TEMPLATES GRID */}
          <div id="starter_templates_section" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[#FFD43B] font-bold text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-[#FF8A3D]" /> Jumpstart Your Imagination
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-bubble text-white mt-1">
                  Start With a Game Creator Template
                </h2>
              </div>

              {/* Search templates */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-purple-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search templates (shooting, snake...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-bold bg-[#1F174D] text-white placeholder-purple-300 border-2 border-purple-500/40 rounded-xl focus:outline-none focus:border-[#FF4FA3]"
                />
              </div>
            </div>

            {/* Templates Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="card-hover bg-[#1F174D] rounded-3xl border-2 border-purple-500/40 hover:border-[#FF4FA3] shadow-xl overflow-hidden flex flex-col justify-between group transition-all"
                >
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {tmpl.icon}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-yellow-400 text-slate-900 rounded-full font-bubble">
                        {tmpl.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bubble font-black text-xl text-white group-hover:text-[#FFD43B] transition-colors">
                        {tmpl.title}
                      </h3>
                      <p className="text-xs text-purple-200 font-medium mt-1 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="flex gap-2 font-mono text-[10px] text-purple-300 pt-1">
                      <span className="bg-[#150E34] px-2 py-0.5 rounded border border-purple-700/60">
                        {tmpl.sprites.length} Sprites
                      </span>
                      <span className="bg-[#150E34] px-2 py-0.5 rounded border border-purple-700/60">
                        Visual Blocks Loaded
                      </span>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleLaunchEditor(tmpl)}
                      className="btn-3d-pink w-full py-3 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2"
                    >
                      <Code2 className="w-4 h-4" /> Customize & Build This Game
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. EXPLORE COMMUNITY CREATIONS & REMIX */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                  Community Showcase
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-bubble text-white mt-1">
                  Explore & Remix Community Games
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityGames.slice(0, 3).map((cg) => (
                <div
                  key={cg.id}
                  className="bg-[#1F174D] rounded-3xl border-2 border-purple-500/40 shadow-xl p-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl">{cg.thumbnail || '🚀'}</span>
                      <span className="text-[10px] font-black uppercase text-[#FF4FA3] bg-[#2D174D] px-2.5 py-1 rounded-full border border-pink-500/30">
                        Public Project
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bubble font-black text-lg text-white">{cg.title}</h3>
                      <p className="text-xs text-purple-200 leading-relaxed mt-1">
                        {cg.description || 'Interactive game built by a young cadet.'}
                      </p>
                      <div className="text-[11px] text-purple-300 font-bold mt-2">
                        Created by: {cg.authorName || 'SparkyCoder'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-purple-400/20 flex gap-2">
                    <button
                      onClick={() => handleRemixProject(cg)}
                      className="btn-3d-purple flex-1 py-2.5 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" /> Remix Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. STEP-BY-STEP GAME DEVELOPMENT ACADEMY STRIP */}
          <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase">
                🎓 Game Dev Academy
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-bubble">
                Learn Game Development Step-by-Step!
              </h3>
              <p className="text-teal-100 text-sm font-medium">
                Master how to code arrow keys, jump velocities, shooting timers, collision detection, and win/lose screens.
              </p>
            </div>

            <Link
              to="/learn"
              className="px-6 py-3 bg-white text-teal-800 font-black text-sm rounded-xl shadow-md hover:bg-teal-50 transition-all flex items-center gap-2 shrink-0"
            >
              <BookOpen className="w-4 h-4" /> Start Lessons ➔
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};

export default GameStudio;
