import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { BACKGROUND_PRESETS, soundEffects } from '../components/CommonStudioAssets';
import {
  Play,
  Square,
  RotateCcw,
  Save,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Bot,
  Award,
  BookOpen
} from 'lucide-react';

const StoryStudio = () => {
  const { saveProject } = useProjects();
  const { addXP } = useAuth();

  const [title, setTitle] = useState('The Quest for the Magic Algorithm');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const [scenes, setScenes] = useState([
    {
      id: 'sc_1',
      title: 'Chapter 1: Robot Robbie Wakes Up',
      background: 'forest',
      character: '🤖',
      dialogue: 'Hello brave coder! I woke up in this mystery forest. Can you help me find the glowing Crystal of Wisdom?',
      choiceA: 'Follow the river of stars',
      choiceB: 'Ask the ancient owl for directions'
    },
    {
      id: 'sc_2',
      title: 'Chapter 2: Meeting the Wise Owl',
      background: 'party',
      character: '🦉',
      dialogue: 'Hoo hoo! To get past the enchanted gate, you must build a clean repeat-loop in code!',
      choiceA: 'Loop 4 times forward',
      choiceB: 'Cast a jump spell'
    },
    {
      id: 'sc_3',
      title: 'Chapter 3: The Crystal Discovery',
      background: 'galaxy',
      character: '💎',
      dialogue: 'You solved the coding riddle! Robbie learned that computers and AI work best when humans code with kindness!',
      choiceA: 'Start a new adventure',
      choiceB: 'Celebrate with friends'
    }
  ]);

  const activeScene = scenes[currentSceneIdx] || scenes[0];

  const updateActiveScene = (field, value) => {
    setScenes((prev) => {
      const copy = [...prev];
      copy[currentSceneIdx] = { ...copy[currentSceneIdx], [field]: value };
      return copy;
    });
  };

  const addScene = () => {
    const newScene = {
      id: `sc_${Date.now()}`,
      title: `Chapter ${scenes.length + 1}: Next Adventure`,
      background: 'galaxy',
      character: '🦊',
      dialogue: 'What magical quest happens next? Type here!',
      choiceA: 'Go Explore',
      choiceB: 'Solve Puzzle'
    };
    setScenes([...scenes, newScene]);
    setCurrentSceneIdx(scenes.length);
  };

  const removeScene = (idx) => {
    if (scenes.length <= 1) return;
    const filtered = scenes.filter((_, i) => i !== idx);
    setScenes(filtered);
    setCurrentSceneIdx(Math.max(0, idx - 1));
  };

  const handleAiSuggestIdea = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Give me a fun interactive story scene idea for kids coding game',
          mode: 'story_idea'
        })
      });
      const data = await res.json();
      if (data.reply) {
        updateActiveScene('dialogue', data.reply.substring(0, 180));
      }
    } catch (e) {
      updateActiveScene(
        'dialogue',
        'Sparky AI: Robbie discovered a friendly dragon who loved coding music loops!'
      );
    } finally {
      setIsAiLoading(false);
      soundEffects.score();
    }
  };

  const handleSave = async () => {
    await saveProject({
      title,
      type: 'story',
      thumbnail: activeScene.character,
      description: `Interactive children's tale with ${scenes.length} chapters.`,
      data: { scenes }
    });
    addXP(40, 'Master Storyteller');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const currentBgObj =
    BACKGROUND_PRESETS.find((b) => b.id === activeScene.background) || BACKGROUND_PRESETS[1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Studio Header with Warm Mint & Turquoise Gradient */}
      <div className="bg-gradient-to-r from-[#34D399] via-[#38BDF8] to-[#7C3AED] rounded-3xl p-6 sm:p-8 text-slate-900 shadow-glow-blue flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white/30">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 bg-white/40 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-purple-950">
              📖 Interactive Storybook Studio
            </span>
            <span className="text-xs bg-black/20 px-3 py-1 rounded-full font-black text-white">
              Branching Decisions
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl sm:text-4xl font-black font-bubble bg-transparent border-b-2 border-slate-900/40 focus:border-slate-900 focus:outline-none placeholder-slate-900/60 max-w-md"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAiSuggestIdea}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-5 py-3 bg-white/30 hover:bg-white/40 text-slate-900 font-bubble font-black text-xs rounded-2xl border border-white/50 backdrop-blur transition-all"
          >
            <Bot className="w-4 h-4 text-purple-900" />
            {isAiLoading ? 'Sparky Thinking...' : 'Sparky Story Spark'}
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#28245C] text-white hover:scale-105 active:scale-95 font-bubble font-black text-sm rounded-2xl shadow-xl transition-all"
          >
            <Save className="w-5 h-5 text-yellow-300" />
            Save Story
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
          <Award className="w-5 h-5" /> Story saved to My Creations! +40 XP
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Story Book Canvas Frame */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border-4 border-emerald-200 shadow-xl space-y-4">
            
            {/* Scene navigator & controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentSceneIdx === 0}
                  onClick={() => {
                    setCurrentSceneIdx((c) => c - 1);
                    soundEffects.click();
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl text-xs font-black flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev Chapter
                </button>
                <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                  Chapter {currentSceneIdx + 1} of {scenes.length}
                </span>
                <button
                  disabled={currentSceneIdx === scenes.length - 1}
                  onClick={() => {
                    setCurrentSceneIdx((c) => c + 1);
                    soundEffects.click();
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl text-xs font-black flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={addScene}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs rounded-xl flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Chapter
                </button>
                {scenes.length > 1 && (
                  <button
                    onClick={() => removeScene(currentSceneIdx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Story Visual Book Stage */}
            <div
              className={`relative mx-auto rounded-3xl overflow-hidden shadow-2xl select-none transition-all ${currentBgObj.bgClass} flex flex-col justify-between p-6`}
              style={{ width: '100%', maxWidth: '540px', minHeight: '400px' }}
            >
              {/* Scene Title Header */}
              <div className="bg-black/40 backdrop-blur-md text-white text-xs px-3.5 py-1 rounded-full font-bold self-start border border-white/20">
                {activeScene.title}
              </div>

              {/* Character in scene */}
              <div className="flex justify-center items-center my-6">
                <div className="text-8xl filter drop-shadow-2xl animate-float">
                  {activeScene.character}
                </div>
              </div>

              {/* Narrative Story Bubble */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border-4 border-emerald-300 space-y-3">
                <p className="text-sm font-bubble font-black text-slate-800 leading-relaxed">
                  "{activeScene.dialogue}"
                </p>

                {/* Interactive Decisions */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    👉 Choose your action:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        soundEffects.score();
                        if (currentSceneIdx < scenes.length - 1) setCurrentSceneIdx((c) => c + 1);
                      }}
                      className="p-3 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold text-left hover:scale-[1.02] transition-transform"
                    >
                      A) {activeScene.choiceA || 'Explore'}
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.score();
                        if (currentSceneIdx < scenes.length - 1) setCurrentSceneIdx((c) => c + 1);
                      }}
                      className="p-3 bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 text-teal-950 rounded-xl text-xs font-bold text-left hover:scale-[1.02] transition-transform"
                    >
                      B) {activeScene.choiceB || 'Talk'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Storyboard Controls */}
        <div className="lg:col-span-5 space-y-6">

          {/* Edit Current Scene Form */}
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-md space-y-4">
            <h3 className="font-bubble font-black text-slate-800 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Storyboard Settings
            </h3>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Chapter Title:
              </label>
              <input
                type="text"
                value={activeScene.title}
                onChange={(e) => updateActiveScene('title', e.target.value)}
                className="w-full px-3 py-2 text-xs border-2 border-emerald-200 rounded-xl font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Story Dialogue & Narration:
              </label>
              <textarea
                rows={3}
                value={activeScene.dialogue}
                onChange={(e) => updateActiveScene('dialogue', e.target.value)}
                className="w-full px-3 py-2 text-xs border-2 border-emerald-200 rounded-xl font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Choice Option A:
                </label>
                <input
                  type="text"
                  value={activeScene.choiceA || ''}
                  onChange={(e) => updateActiveScene('choiceA', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Choice Option B:
                </label>
                <input
                  type="text"
                  value={activeScene.choiceB || ''}
                  onChange={(e) => updateActiveScene('choiceB', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-teal-300 rounded-xl"
                />
              </div>
            </div>

            {/* Character & Background selection */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Actor Character:
              </label>
              <div className="flex flex-wrap gap-2">
                {['🤖', '🦉', '💎', '🦊', '🦄', '🧙‍♂️', '🦖', '🌟', '🐬', '🐲'].map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      updateActiveScene('character', e);
                      soundEffects.click();
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      activeScene.character === e
                        ? 'bg-emerald-100 border-2 border-emerald-500 scale-110 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Landscape Background:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => updateActiveScene('background', bg.id)}
                    className={`py-2 px-1 text-[11px] font-black rounded-xl border-2 text-center truncate ${
                      activeScene.background === bg.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-100 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {bg.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Chapters Index Strip */}
          <div className="bg-[#28245C] text-white p-5 rounded-3xl shadow-xl space-y-2 border-2 border-purple-500/30">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
              Chapters Index ({scenes.length})
            </span>
            <div className="space-y-1.5">
              {scenes.map((sc, i) => (
                <button
                  key={sc.id}
                  onClick={() => setCurrentSceneIdx(i)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center justify-between transition-colors ${
                    currentSceneIdx === i
                      ? 'bg-emerald-500 text-slate-900'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <span>{sc.character}</span>
                    <span>{sc.title}</span>
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">#{i + 1}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StoryStudio;
