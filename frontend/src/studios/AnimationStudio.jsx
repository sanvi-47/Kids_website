import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { SPRITE_PRESETS, BACKGROUND_PRESETS, soundEffects } from '../components/CommonStudioAssets';
import { Play, Square, RotateCcw, Save, MessageCircle, Music, Sparkles, Award, Film, Sliders } from 'lucide-react';

const AnimationStudio = () => {
  const { saveProject } = useProjects();
  const { addXP } = useAuth();

  const [title, setTitle] = useState('Dancing Dino Birthday Party');
  const [selectedBg, setSelectedBg] = useState('party');
  const [activeSprite, setActiveSprite] = useState('🦖');
  const [partnerSprite, setPartnerSprite] = useState('🎂');

  // Animation parameters
  const [danceType, setDanceType] = useState('wiggle'); // wiggle, spin, bounce, float
  const [speechBubble, setSpeechBubble] = useState("Let's dance and code together!");
  const [partnerSpeech, setPartnerSpeech] = useState("Yay, party time!");
  const [showSpeech, setShowSpeech] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Position
  const [spriteX, setSpriteX] = useState(200);
  const [spriteY, setSpriteY] = useState(210);

  React.useEffect(() => {
    let timer;
    if (isAnimating) {
      soundEffects.jump();
      timer = setInterval(() => {
        setSpriteX((x) => 200 + Math.sin(Date.now() / 400) * 45);
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isAnimating]);

  const handleSave = async () => {
    await saveProject({
      title,
      type: 'animation',
      thumbnail: activeSprite,
      description: `Animated cartoon with ${activeSprite} doing the ${danceType} dance!`,
      data: {
        bg: selectedBg,
        sprite: activeSprite,
        partner: partnerSprite,
        danceType,
        speechBubble,
        partnerSpeech
      }
    });
    addXP(45, 'Cartoon Animator');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const currentBgObj =
    BACKGROUND_PRESETS.find((b) => b.id === selectedBg) || BACKGROUND_PRESETS[4];

  const getDanceClass = () => {
    if (!isAnimating) return '';
    switch (danceType) {
      case 'wiggle':
        return 'animate-wiggle';
      case 'bounce':
        return 'animate-bounce';
      case 'float':
        return 'animate-float';
      case 'spin':
        return 'animate-spin';
      default:
        return 'animate-bounce';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Studio Header Banner with Vibrant Pink Gradient */}
      <div className="bg-gradient-to-r from-[#FF4FA3] via-[#7C3AED] to-[#FF8A3D] rounded-3xl p-6 sm:p-8 text-white shadow-glow-pink flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 bg-white/25 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-yellow-300">
              🎬 Cartoon Animation Studio
            </span>
            <span className="text-xs bg-black/30 px-3 py-1 rounded-full font-black">
              Choreography & Speech Bubbles
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl sm:text-4xl font-black font-bubble bg-transparent border-b-2 border-white/40 focus:border-white focus:outline-none placeholder-white/70 max-w-md"
          />
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3.5 bg-white text-[#FF4FA3] hover:scale-105 active:scale-95 font-bubble font-black text-sm rounded-2xl shadow-xl transition-all"
        >
          <Save className="w-5 h-5" />
          Save Animation
        </button>
      </div>

      {saveToast && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2 animate-bounce">
          <Award className="w-5 h-5" /> Animation saved! +45 XP
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Animation Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card-3d p-6 rounded-3xl border-4 border-pink-500/50 shadow-2xl space-y-4">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isAnimating ? (
                  <button
                    onClick={() => {
                      setIsAnimating(true);
                      soundEffects.score();
                    }}
                    className="btn-3d-cyan flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition-all font-bubble font-black text-xs"
                  >
                    <Play className="w-4 h-4 fill-current" /> Play Animation
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAnimating(false)}
                    className="btn-3d-pink flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition-all animate-pulse font-bubble font-black text-xs"
                  >
                    <Square className="w-4 h-4 fill-white" /> Pause Animation
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsAnimating(false);
                    setSpriteX(200);
                    soundEffects.click();
                  }}
                  className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl"
                  title="Reset positions"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speech toggle */}
              <button
                onClick={() => setShowSpeech(!showSpeech)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black font-bubble flex items-center gap-1.5 transition-all ${
                  showSpeech
                    ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" /> Speech Bubbles
              </button>
            </div>

            {/* Animation Stage Screen */}
            <div
              className={`relative mx-auto rounded-3xl overflow-hidden shadow-2xl select-none transition-all ${currentBgObj.bgClass}`}
              style={{ width: '100%', maxWidth: '540px', height: '420px' }}
            >
              {/* Main Actor */}
              <div
                className={`absolute transition-all duration-100 flex flex-col items-center cursor-pointer ${getDanceClass()}`}
                style={{
                  left: `${spriteX}px`,
                  top: `${spriteY}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {showSpeech && speechBubble && (
                  <div className="bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-xl text-xs font-black max-w-[180px] text-center mb-2 border-2 border-pink-400 relative animate-bounce-soft">
                    {speechBubble}
                    <div className="w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-pink-400 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                  </div>
                )}
                <div className="text-7xl filter drop-shadow-2xl select-none">{activeSprite}</div>
              </div>

              {/* Co-Star Partner */}
              <div
                className={`absolute transition-all duration-300 flex flex-col items-center ${
                  isAnimating ? 'animate-bounce-soft' : ''
                }`}
                style={{
                  left: '370px',
                  top: '260px',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {showSpeech && partnerSpeech && (
                  <div className="bg-amber-100 text-amber-950 px-3.5 py-2 rounded-2xl shadow-xl text-xs font-black max-w-[150px] text-center mb-2 border-2 border-amber-400 relative">
                    {partnerSpeech}
                    <div className="w-2.5 h-2.5 bg-amber-100 border-b-2 border-r-2 border-amber-400 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                  </div>
                )}
                <div className="text-6xl filter drop-shadow-xl">{partnerSprite}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Controls & Choreography */}
        <div className="lg:col-span-5 space-y-6">

          {/* Dance & Movement Moves */}
          <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-md space-y-3">
            <h3 className="font-bubble font-black text-slate-800 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF4FA3]" /> Dance Choreography Moves
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'wiggle', name: 'Wiggle Dance', icon: '💃', color: 'border-pink-400 bg-pink-50 text-pink-900' },
                { id: 'bounce', name: 'Super Hop', icon: '🦘', color: 'border-amber-400 bg-amber-50 text-amber-900' },
                { id: 'float', name: 'Magic Float', icon: '✨', color: 'border-purple-400 bg-purple-50 text-purple-900' },
                { id: 'spin', name: 'Turbo Spin', icon: '🌀', color: 'border-sky-400 bg-sky-50 text-sky-900' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setDanceType(m.id);
                    soundEffects.click();
                  }}
                  className={`p-3.5 rounded-2xl text-left border-2 font-bubble font-black text-xs flex items-center gap-2.5 transition-all ${
                    danceType === m.id
                      ? `${m.color} shadow-md scale-105`
                      : 'border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue Editor */}
          <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-md space-y-3">
            <h3 className="font-bubble font-black text-slate-800 text-base flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#7C3AED]" /> Character Dialogue
            </h3>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {activeSprite} Hero Says:
              </label>
              <input
                type="text"
                value={speechBubble}
                onChange={(e) => setSpeechBubble(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border-2 border-pink-300 rounded-xl focus:outline-none focus:border-pink-500 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                {partnerSprite} Friend Replies:
              </label>
              <input
                type="text"
                value={partnerSpeech}
                onChange={(e) => setPartnerSpeech(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
          </div>

          {/* Character & Arena Background Picker */}
          <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-md space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Pick Animated Star ({activeSprite}):
              </label>
              <div className="flex flex-wrap gap-2">
                {['🦖', '🐱', '🤖', '🦊', '👾', '🦄', '🐧', '🐼', '🎂', '⭐'].map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setActiveSprite(e);
                      soundEffects.click();
                    }}
                    className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                      activeSprite === e
                        ? 'bg-pink-100 border-2 border-pink-500 scale-110 shadow-sm'
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
                Pick Arena World:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg.id)}
                    className={`py-2 px-1 text-[11px] font-black rounded-xl border-2 text-center truncate ${
                      selectedBg === bg.id
                        ? 'border-pink-500 bg-pink-50 text-pink-900'
                        : 'border-slate-100 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {bg.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AnimationStudio;
