import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Gamepad2,
  Film,
  BookOpen,
  Code2,
  Bot,
  Shield,
  Sparkles,
  LogOut,
  Menu,
  X,
  Award,
  Flame,
  Zap,
  FolderOpen
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Games', path: '/studio/game', icon: Gamepad2, color: 'text-[#FF4FA3]' },
    { name: 'Animation', path: '/studio/animation', icon: Film, color: 'text-[#FF8A3D]' },
    { name: 'Stories', path: '/studio/story', icon: BookOpen, color: 'text-[#34D399]' },
    { name: 'Code Editor', path: '/editor', icon: Code2, color: 'text-[#38BDF8]' },
    { name: 'Sparky AI', path: '/ai-assistant', icon: Bot, color: 'text-[#FFD43B]' },
    { name: 'Learn', path: '/learn', icon: Sparkles, color: 'text-[#A78BFA]' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#161233]/90 backdrop-blur-xl border-b-2 border-purple-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 3D Extruded Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-13 h-13 p-2.5 rounded-2xl btn-3d-purple flex items-center justify-center text-3xl group-hover:rotate-6 group-hover:scale-105 transition-all">
              🚀
            </div>
            <div>
              <div className="font-bubble font-black text-2xl tracking-tight flex items-center gap-1">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Spark</span>
                <span className="bg-gradient-to-r from-[#FF4FA3] via-[#FFD43B] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,79,163,0.5)]">Code</span>
                <span className="text-[#38BDF8] drop-shadow-[0_2px_4px_rgba(56,189,248,0.5)]">.AI</span>
              </div>
              <div className="text-[10px] font-black tracking-widest text-[#FF4FA3] uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                3D Creative Universe
              </div>
            </div>
          </Link>

          {/* Glowing 3D Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#201A4C]/80 p-1.5 rounded-2xl border border-purple-500/30 shadow-inner">
            {navLinks.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl font-bubble font-black text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    isActive
                      ? 'btn-3d-purple text-white shadow-glow-purple scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-300' : item.color}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Status / 3D Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-4 py-1.5 bg-gradient-to-r from-purple-900/90 to-pink-900/90 hover:from-purple-800 hover:to-pink-800 border-2 border-purple-400/60 rounded-full transition-all shadow-glow-purple"
                >
                  <span className="text-2xl animate-bounce-soft">{user.avatar || '🦊'}</span>
                  <div className="text-left">
                    <div className="text-xs font-black text-white leading-tight">
                      {user.username}
                    </div>
                    <div className="text-[10px] font-black text-[#FFD43B] flex items-center gap-1">
                      <span>⭐ Lvl {user.level || 1}</span>
                      <span>•</span>
                      <span>{user.xp || 0} XP</span>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/my-projects"
                  title="My Creations Vault"
                  className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  <FolderOpen className="w-5 h-5" />
                </Link>

                <Link
                  to="/parent-dashboard"
                  title="Parent Safety Center"
                  className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <Shield className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 font-black text-xs font-bubble text-purple-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="btn-3d-pink px-5 py-2.5 text-white font-black text-xs font-bubble rounded-xl transition-all flex items-center gap-1.5"
                >
                  Join Free 🚀
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-purple-300 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1E1845] border-t border-purple-500/30 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bubble font-black text-slate-200 hover:bg-white/10"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-purple-500/30 flex gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-rose-500/20 text-rose-300 font-black rounded-xl text-center"
              >
                Log Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center font-black text-purple-300 border border-purple-400 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-3d-pink flex-1 py-2 text-center font-black text-white rounded-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
