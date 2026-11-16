import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ExternalLink, Play, Plus, Search, Filter } from 'lucide-react';

const MyProjectsPage = () => {
  const { projects, deleteProject } = useProjects();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // all, game, animation, story, coding
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesTab = activeTab === 'all' || p.type === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStudioLink = (type) => {
    switch (type) {
      case 'game': return '/studio/game';
      case 'animation': return '/studio/animation';
      case 'story': return '/studio/story';
      case 'coding': return '/editor';
      default: return '/studio/game';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <span>📁 Project Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-bubble">
            My Creations & Projects 🎨
          </h1>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl font-medium mt-1">
            Revisit your games, edit animation keyframes, continue interactive stories, and showcase your block programs!
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/studio/game"
            className="px-5 py-3 bg-white text-purple-700 font-black text-sm rounded-2xl shadow hover:bg-purple-50 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Creation
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'game', label: '🎮 Games' },
            { id: 'animation', label: '🎬 Animations' },
            { id: 'story', label: '📖 Stories' },
            { id: 'coding', label: '🧱 Visual Blocks' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
        </div>

      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="text-5xl">📦</div>
          <h3 className="font-bubble font-black text-slate-700 text-lg">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try choosing another category, or jump right into our Game, Animation, or Visual Coding studios to build one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card-hover bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl filter drop-shadow">{project.thumbnail || '🚀'}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    {project.type}
                  </span>
                </div>

                <h3 className="font-bubble font-black text-lg text-slate-800 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                  {project.description || 'Creative project ready for editing and coding.'}
                </p>

                <div className="mt-3 text-[11px] text-slate-400 font-bold flex items-center justify-between">
                  <span>Author: {project.authorName || 'Cadet'}</span>
                  {project.createdAt && (
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={getStudioLink(project.type)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Open Studio
                </Link>

                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;

