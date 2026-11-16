import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Gamepad2,
  Film,
  BookOpen,
  Code2,
  Bot,
  Trophy,
  ArrowRight,
  Star,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Sparky3DMascot } from '../components/Sparky3DMascot';

const KidsDashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();

  const userProjects = projects.filter(
    (p) => p.authorId === user?.id || p.authorName === user?.username
  );

  const mainStudios = [
    {
      title: 'Game Studio',
      desc: 'Build shooters, platformers, snake & racers with drag-and-drop logic blocks!',
      emoji: '🎮',
      btnClass: 'btn-3d-amber',
      badge: 'Build & Play',
      link: '/studio/game'
    },
    {
      title: 'Animation Studio',
      desc: 'Make dancing dinosaurs, speech bubbles, and funny cartoon scenes!',
      emoji: '🎬',
      btnClass: 'btn-3d-pink',
      badge: 'Choreography',
      link: '/studio/animation'
    },
    {
      title: 'Story Studio',
      desc: 'Craft interactive branching tales with talking characters & quests!',
      emoji: '📖',
      btnClass: 'btn-3d-cyan',
      badge: 'Choose Path',
      link: '/studio/story'
    },
    {
      title: 'Code Editor',
      desc: 'Visual Scratch block environment: Motion, Looks, Sounds, Loops, & Variables!',
      emoji: '🧱',
      btnClass: 'btn-3d-purple',
      badge: 'Visual Engine',
      link: '/editor'
    },
    {
      title: 'Learn Coding',
      desc: 'Step-by-step missions: Loops, Variables, Arrow keys & Ethical AI!',
      emoji: '🌟',
      btnClass: 'btn-3d-amber',
      badge: 'Quests',
      link: '/learn'
    },
    {
      title: 'Sparky AI',
      desc: 'Your friendly coding robot helper ready to give hints, ideas, and advice!',
      emoji: '🤖',
      btnClass: 'btn-3d-cyan',
      badge: 'Kid Safe AI',
      link: '/ai-assistant'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* 1. 3D Creative Command Center Banner */}
      <div className="card-3d rounded-3xl p-8 sm:p-10 border-2 border-purple-500/50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        
        <div className="space-y-4 z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-purple-900/60 border border-purple-400/40 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-yellow-300">
            <span>✨ 3D Cadet Command Deck</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-bubble text-white tracking-tight leading-tight">
            Welcome back, {user?.username || 'Super Coder'}! {user?.avatar || '🦊'}
          </h1>
          <p className="text-sm sm:text-base text-purple-200 font-medium leading-relaxed">
            Ready to bring your imagination to life? Choose an adventure studio below or continue building your saved creations!
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="bg-[#1C1642] border border-purple-400/30 px-3.5 py-1.5 rounded-xl font-black text-xs text-yellow-300 flex items-center gap-1.5 shadow">
              ⭐ Level {user?.level || 1}
            </span>
            <span className="bg-[#1C1642] border border-purple-400/30 px-3.5 py-1.5 rounded-xl font-black text-xs text-pink-300 flex items-center gap-1.5 shadow">
              🏆 {user?.xp || 0} XP
            </span>
            <span className="bg-[#1C1642] border border-purple-400/30 px-3.5 py-1.5 rounded-xl font-black text-xs text-cyan-300 flex items-center gap-1.5 shadow">
              🎖️ {(user?.badges || []).length} Badges
            </span>
          </div>
        </div>

        {/* 3D Mascot Interactive Card */}
        <div className="z-10 flex flex-col items-center justify-center p-6 bg-[#181339]/90 rounded-3xl border-2 border-purple-400/50 text-center min-w-[210px] shadow-glow-purple">
          <Sparky3DMascot className="w-28 h-28" />
          <span className="text-sm font-black mt-3 text-yellow-300 font-bubble">{user?.username}</span>
          <span className="text-[10px] text-purple-200 uppercase font-black tracking-wider">Ethical Cadet</span>
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-[#7C3AED] to-[#FF4FA3] rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      </div>

      {/* 2. 6 3D STUDIO FEATURE CARDS */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-black uppercase text-pink-400 tracking-wider">
              Playgrounds
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-bubble text-white mt-1">
              What Do You Want to Create Today?
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainStudios.map((card, idx) => (
            <div
              key={idx}
              className="card-3d rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">
                    {card.emoji}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-white/10 text-white rounded-full border border-white/20">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bubble font-black text-2xl text-white group-hover:text-yellow-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-purple-200 font-medium mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              <Link
                to={card.link}
                className={`${card.btnClass} mt-7 py-3 text-center text-xs font-black font-bubble rounded-xl flex items-center justify-center gap-2`}
              >
                Launch Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 3. My Creations 3D Vault */}
      <div className="card-3d rounded-3xl p-8 border-2 border-purple-500/40 text-white space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            <div>
              <h3 className="font-bubble font-black text-2xl text-white">My Creations & Saved Projects</h3>
              <p className="text-xs text-purple-200">Revisit, edit, or remix your custom games and animations.</p>
            </div>
          </div>
          <Link
            to="/my-projects"
            className="text-xs font-black text-yellow-300 hover:underline flex items-center gap-1 font-bubble"
          >
            View All ({userProjects.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {userProjects.length === 0 ? (
          <div className="text-center py-12 bg-[#191438]/80 rounded-2xl border-2 border-dashed border-purple-500/30 text-purple-300 text-xs font-bold">
            You haven't saved any creations yet. Click one of the 3D studios above to make your very first project!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {userProjects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="bg-[#1E1845] hover:bg-[#28205C] border-2 border-purple-500/40 hover:border-pink-500 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{p.thumbnail || '🎮'}</div>
                  <h4 className="font-bubble font-black text-base text-white truncate">{p.title}</h4>
                  <p className="text-[11px] text-purple-300 capitalize">{p.type} Creation</p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-500/30 flex items-center justify-between text-xs font-black text-[#FF4FA3]">
                  <Link
                    to={
                      p.type === 'animation'
                        ? '/studio/animation'
                        : p.type === 'story'
                        ? '/studio/story'
                        : p.type === 'coding'
                        ? '/editor'
                        : '/studio/game'
                    }
                    className="hover:underline flex items-center gap-1"
                  >
                    Open Studio ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default KidsDashboard;
