import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Gamepad2,
  Film,
  BookOpen,
  Code2,
  Bot,
  Shield,
  ArrowRight,
  Play,
  Star,
  Heart,
  Rocket,
  Zap,
  Flame,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Sparky3DMascot, Floating3DObjects } from '../components/Sparky3DMascot';

const HomePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('game');

  return (
    <div className="space-y-28 pb-24 overflow-hidden space-universe-bg cosmic-stars">
      
      {/* 1. HERO SECTION WITH HIGH-CONTRAST 3D VISUALS */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Floating 3D Background Decorative Planets, Stars and Controllers */}
        <Floating3DObjects />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle & 3D Interactive Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            
            <div className="inline-flex items-center gap-2 bg-[#24104F] border-2 border-[#FF4FA3] text-[#FFAEDB] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-glow-pink">
              <Sparkles className="w-4 h-4 text-[#FFD43B] animate-spin" />
              Next-Gen 3D Creative Universe for Kids
            </div>

            {/* Main Heading: "Dream It. Build It. Play It!" in High-Contrast White + Radiant Gradient */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-bubble tracking-tight text-white leading-[1.1] filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Dream It.{' '}
              <span className="bg-gradient-to-r from-[#FF4FA3] via-[#FFD43B] to-[#20C5D9] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(255,79,163,0.7)]">
                Build It.
              </span>{' '}
              Play It!
            </h1>

            {/* Subtitle - High-Contrast Soft Lavender Text */}
            <p className="text-lg sm:text-xl text-[#E9E4FF] font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Your imagination is the only limit! Create amazing games, animations and stories with the power of coding and AI.
            </p>

            {/* Two Large 3D-Style Interactive Extruded Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link
                to="/studio/game"
                className="btn-3d-pink w-full sm:w-auto px-9 py-4 text-white font-black font-bubble text-lg rounded-2xl flex items-center justify-center gap-3 tracking-wide"
              >
                <Rocket className="w-6 h-6 text-[#FFD43B]" /> Start Creating
              </Link>

              <Link
                to="/studio/game"
                className="btn-3d-purple w-full sm:w-auto px-9 py-4 text-white font-black font-bubble text-lg rounded-2xl flex items-center justify-center gap-3 tracking-wide"
              >
                <Gamepad2 className="w-6 h-6 text-[#20C5D9]" /> Explore Games
              </Link>
            </div>

            {/* Trust Badges with Strong Contrast */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-black">
              <span className="flex items-center gap-1.5 text-[#34D399] bg-[#112F2E] px-4 py-2 rounded-full border border-[#34D399] shadow-glow-blue">
                <Shield className="w-4 h-4 text-[#34D399]" /> 100% Kid Safe & COPPA Certified
              </span>
              <span className="flex items-center gap-1.5 text-[#FFD43B] bg-[#3B280A] px-4 py-2 rounded-full border border-[#FFD43B] shadow-glow-yellow">
                <Star className="w-4 h-4 text-[#FFD43B] fill-[#FFD43B]" /> Ages 6–16
              </span>
              <span className="flex items-center gap-1.5 text-[#FFAEDB] bg-[#3C0F2B] px-4 py-2 rounded-full border border-[#FF4FA3] shadow-glow-pink">
                <Heart className="w-4 h-4 text-[#FF4FA3] fill-[#FF4FA3]" /> Scratch-Style 3D Logic
              </span>
            </div>

          </div>

          {/* Right Column: 3D Scene Featuring Sparky Mascot, Floating Laptop & Game Elements */}
          <div className="lg:col-span-5 relative flex justify-center items-center z-10">
            
            {/* Ambient Background Aura Glow */}
            <div className="absolute w-80 h-80 bg-gradient-to-tr from-[#7C3AED] via-[#FF4FA3] to-[#20C5D9] rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none"></div>

            <div className="relative w-full max-w-md card-3d p-6 rounded-3xl border-2 border-purple-400/50 text-center flex flex-col items-center">
              
              {/* Cute 3D Sparky Robot Mascot */}
              <div className="relative -mt-10 mb-2">
                <Sparky3DMascot className="w-44 h-44 mx-auto" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFD43B] text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider font-bubble border-2 border-amber-600">
                  Hi! I'm Sparky 🤖
                </div>
              </div>

              {/* 3D Floating Laptop Showing Visual Coding Studio */}
              <div className="w-full bg-[#1A1140] rounded-2xl p-3 border-2 border-[#20C5D9] shadow-2xl space-y-2 mt-2">
                
                {/* Laptop Top Camera & Bezel */}
                <div className="flex items-center justify-between pb-1 border-b border-purple-500/30">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] text-[#20C5D9] font-code font-bold">SparkCode Studio v2.0</span>
                </div>

                {/* Simulated Visual Screen */}
                <div className="bg-[#0D0826] rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="text-left space-y-1.5">
                    <div className="bg-[#FFD43B] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
                      When 🟢 clicked
                    </div>
                    <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded ml-2">
                      Move 10 steps ➔
                    </div>
                    <div className="bg-[#FF4FA3] text-white text-[10px] font-bold px-2 py-0.5 rounded ml-4">
                      Shoot Laser 🔫
                    </div>
                  </div>
                  <div className="text-4xl animate-bounce">🚀</div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#E9E4FF] font-bold pt-1 px-1">
                  <span>Score: <strong className="text-[#FFD43B]">1,250</strong></span>
                  <span className="text-[#34D399]">● 60 FPS 3D Runtime</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* 2. CHOOSE YOUR ADVENTURE STUDIO - HIGH CONTRAST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 bg-[#24104F] border-2 border-purple-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#FFD43B] shadow-md">
            <Sparkles className="w-4 h-4 text-[#FF4FA3]" /> 3D Creative Horizons
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-bubble text-white tracking-tight filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Choose Your Adventure Studio
          </h2>
          <p className="text-[#E9E4FF] text-base max-w-xl mx-auto font-medium drop-shadow">
            Every studio gives young creators full creative control to code, animate, and publish!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Game Studio */}
          <div className="card-3d rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl btn-3d-amber flex items-center justify-center text-4xl shadow-glow-orange group-hover:scale-110 transition-transform">
                  🎮
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-amber-400/20 text-[#FFD43B] border border-amber-400/50 rounded-full">
                  Scratch 3D Engine
                </span>
              </div>
              <h3 className="font-bubble font-black text-2xl text-white group-hover:text-[#FFD43B] transition-colors">
                Game Studio
              </h3>
              <p className="text-xs text-[#E9E4FF] font-medium leading-relaxed">
                Build space shooters, labyrinth mazes, cyber racers, and platformers with real collision detection and physics.
              </p>
            </div>
            <Link
              to="/studio/game"
              className="btn-3d-amber mt-7 py-3 text-center text-xs font-black font-bubble rounded-xl flex items-center justify-center gap-2"
            >
              Launch Game Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Animation Studio */}
          <div className="card-3d rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl btn-3d-pink flex items-center justify-center text-4xl shadow-glow-pink group-hover:scale-110 transition-transform">
                  🎬
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-pink-400/20 text-[#FFAEDB] border border-pink-400/50 rounded-full">
                  Cartoon Keyframes
                </span>
              </div>
              <h3 className="font-bubble font-black text-2xl text-white group-hover:text-[#FFAEDB] transition-colors">
                Animation Studio
              </h3>
              <p className="text-xs text-[#E9E4FF] font-medium leading-relaxed">
                Make dancing dinosaurs, talking avatars, custom speech bubbles, and funny cartoon choreography with sound effects.
              </p>
            </div>
            <Link
              to="/studio/animation"
              className="btn-3d-pink mt-7 py-3 text-center text-xs font-black font-bubble rounded-xl flex items-center justify-center gap-2"
            >
              Launch Animation Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Story Studio */}
          <div className="card-3d rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl btn-3d-cyan flex items-center justify-center text-4xl shadow-glow-blue group-hover:scale-110 transition-transform">
                  📖
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-cyan-400/20 text-[#A5F3FC] border border-cyan-400/50 rounded-full">
                  Interactive Tales
                </span>
              </div>
              <h3 className="font-bubble font-black text-2xl text-white group-hover:text-[#A5F3FC] transition-colors">
                Story Studio
              </h3>
              <p className="text-xs text-[#E9E4FF] font-medium leading-relaxed">
                Author multi-chapter interactive books with branching 'Choose Your Path' decisions and AI story idea sparks!
              </p>
            </div>
            <Link
              to="/studio/story"
              className="btn-3d-cyan mt-7 py-3 text-center text-xs font-black font-bubble rounded-xl flex items-center justify-center gap-2"
            >
              Launch Story Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: Code Editor */}
          <div className="card-3d rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl btn-3d-purple flex items-center justify-center text-4xl shadow-glow-purple group-hover:scale-110 transition-transform">
                  🧱
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-purple-400/20 text-[#C4A7FF] border border-purple-400/50 rounded-full">
                  Visual Block Logic
                </span>
              </div>
              <h3 className="font-bubble font-black text-2xl text-white group-hover:text-[#C4A7FF] transition-colors">
                Visual Code Editor
              </h3>
              <p className="text-xs text-[#E9E4FF] font-medium leading-relaxed">
                Snap blocks for Motion, Looks, Sound, Events, Loops, Sensing, and Variables with real code runtime execution.
              </p>
            </div>
            <Link
              to="/editor"
              className="btn-3d-purple mt-7 py-3 text-center text-xs font-black font-bubble rounded-xl flex items-center justify-center gap-2"
            >
              Open Code Editor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 5: Sparky AI */}
          <div className="card-3d rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl btn-3d-cyan flex items-center justify-center text-4xl shadow-glow-blue group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-emerald-400/20 text-[#6EE7B7] border border-emerald-400/50 rounded-full">
                  Kid-Safe Buddy
                </span>
              </div>
              <h3 className="font-bubble font-black text-2xl text-white group-hover:text-[#6EE7B7] transition-colors">
                Sparky AI Assistant
              </h3>
              <p className="text-xs text-[#E9E4FF] font-medium leading-relaxed">
                A cheerful robot buddy that breaks down coding bugs, loops, and game ideas into friendly recipes and answers.
              </p>
            </div>
            <Link
              to="/ai-assistant"
              className="btn-3d-cyan mt-7 py-3 text-center text-xs font-black font-bubble rounded-xl flex items-center justify-center gap-2"
            >
              Chat With Sparky <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 6: Learn Coding Quests */}
          <div className="card-3d rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl btn-3d-amber flex items-center justify-center text-4xl shadow-glow-yellow group-hover:scale-110 transition-transform">
                  🌟
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-yellow-400/20 text-[#FFD43B] border border-yellow-400/50 rounded-full">
                  Quests & XP
                </span>
              </div>
              <h3 className="font-bubble font-black text-2xl text-white group-hover:text-[#FFD43B] transition-colors">
                Learn Coding Quests
              </h3>
              <p className="text-xs text-[#E9E4FF] font-medium leading-relaxed">
                Bite-sized missions covering Sequencing, Repeat Loops, Secret Variables, and Ethical AI principles with XP rewards!
              </p>
            </div>
            <Link
              to="/learn"
              className="btn-3d-amber mt-7 py-3 text-center text-xs font-black font-bubble rounded-xl flex items-center justify-center gap-2"
            >
              Start Quests <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </section>

      {/* 3. COLOURFUL GAMING UNIVERSE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="card-3d rounded-3xl p-8 sm:p-12 border-2 border-purple-500/40 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-[#FFAEDB] bg-[#3B0C2B] px-4 py-1.5 rounded-full border border-[#FF4FA3]">
                🚀 Complete Creative Freedom
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-bubble text-white leading-tight filter drop-shadow">
                Step Inside the SparkCode 3D Gaming Universe
              </h2>
              <p className="text-[#E9E4FF] text-sm sm:text-base font-medium leading-relaxed">
                Whether you want to build space shooters, animate dancing dinos, or write interactive fantasy adventures, SparkCode provides all the tools you need.
              </p>

              <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  to="/studio/game"
                  className="btn-3d-pink px-7 py-3 text-white font-black text-xs font-bubble rounded-xl"
                >
                  Create a Game 🎮
                </Link>
                <Link
                  to="/studio/animation"
                  className="btn-3d-purple px-7 py-3 text-white font-black text-xs font-bubble rounded-xl"
                >
                  Animate a Story 🎬
                </Link>
              </div>
            </div>

            {/* Visual 3D Planet Cluster */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#FF4FA3] to-[#FFD43B] p-2 shadow-glow-pink animate-float">
                <div className="w-full h-full rounded-full bg-[#1A1140] flex flex-col items-center justify-center text-center p-4">
                  <span className="text-6xl animate-bounce-soft">🪐</span>
                  <span className="font-bubble font-black text-sm text-[#FFD43B] mt-2">Unlimited Worlds</span>
                  <span className="text-[10px] text-[#E9E4FF] font-bold">100% Kid Safe</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 4. ETHICAL AI & SAFETY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="card-3d rounded-3xl p-8 sm:p-12 border-2 border-[#34D399]/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-[#0E352C] border border-[#34D399] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#34D399]">
              <Shield className="w-4 h-4 text-[#34D399]" /> Kid-Safe Environment
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-bubble text-white">
              Safe, Private, and 100% Focused on Learning
            </h2>
            <p className="text-[#E9E4FF] text-sm font-medium leading-relaxed">
              We know safety is every parent's number one priority. SparkCode AI collects zero tracking cookies, filters all AI chats through child-friendly moderation, and provides complete parental control over screen time.
            </p>
            <div className="pt-2">
              <Link
                to="/parent-dashboard"
                className="btn-3d-cyan px-7 py-3 text-[#082F49] font-black text-xs font-bubble rounded-xl inline-flex items-center gap-2"
              >
                Visit Parent Safety Center <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center z-10">
            <div className="w-52 h-52 rounded-3xl bg-[#1A1140]/95 border-2 border-[#34D399]/60 flex flex-col items-center justify-center text-center p-4 shadow-glow-blue">
              <span className="text-7xl animate-bounce-soft">🛡️</span>
              <span className="font-bubble font-black text-base text-white mt-3">COPPA Certified</span>
              <span className="text-[11px] font-black text-[#34D399]">Ad-Free Learning</span>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
};

export default HomePage;
