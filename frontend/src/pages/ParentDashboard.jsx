import React, { useState } from 'react';
import { Shield, Clock, Eye, Lock, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [screenTimeLimit, setScreenTimeLimit] = useState(60);
  const [aiSafetyFilter, setAiSafetyFilter] = useState('strict');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-purple-500">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-500/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-purple-400/30 text-purple-200">
            <Shield className="w-4 h-4 text-emerald-400" /> Parent & Guardian Safety Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-bubble">
            Parental Controls & Privacy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl font-medium mt-1">
            SparkCode AI is designed ground-up for COPPA compliance. Manage screen time boundaries, monitor AI conversation moderation, and review creative projects safely.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-center min-w-[170px]">
          <span className="text-3xl">🦉</span>
          <div className="text-xs font-bold text-white mt-1">Guardian Mode</div>
          <div className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5">Active & Monitored</div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce">
          <Check className="w-4 h-4" /> Parental safety settings updated successfully!
        </div>
      )}

      {/* Safety Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Screen Time Allowance */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble font-black text-slate-800 text-base">Daily Screen Time Limit</h3>
              <p className="text-xs text-slate-500 font-medium">Prevent excessive eye strain and encourage balance.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black text-slate-700">
              <span>Time Allowance:</span>
              <span className="text-purple-600 font-mono text-sm">{screenTimeLimit} minutes / day</span>
            </div>
            <input
              type="range"
              min="20"
              max="180"
              step="10"
              value={screenTimeLimit}
              onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>20 min (Short)</span>
              <span>60 min (Recommended)</span>
              <span>180 min (Weekend)</span>
            </div>
          </div>
        </div>

        {/* AI Prompt Moderation Shield */}
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bubble font-black text-slate-800 text-base">Ethical AI Moderation Filter</h3>
              <p className="text-xs text-slate-500 font-medium">Controls the sensitivity of Sparky AI responses.</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 'strict', title: 'Kid-Safe Strict (Recommended)', desc: 'Only coding hints, fun stories, and encouraging educational logic.' },
              { id: 'guided', title: 'Guided Explorer', desc: 'Allows broader questions about science, math, and general world curiosities.' }
            ].map(f => (
              <label
                key={f.id}
                className={`p-3 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                  aiSafetyFilter === f.id ? 'border-purple-600 bg-purple-50/60' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="safety"
                  checked={aiSafetyFilter === f.id}
                  onChange={() => setAiSafetyFilter(f.id)}
                  className="mt-1 accent-purple-600"
                />
                <div>
                  <div className="font-black text-xs text-slate-800">{f.title}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{f.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* Child Privacy Commitments Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <h3 className="font-bubble font-black text-xl text-emerald-400 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Our 4 Pillars of Children's Digital Privacy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-300">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="font-black text-white text-sm">1. 🚫 No Tracking Advertisements</div>
            <p className="text-slate-400">SparkCode has zero behavioral trackers, third-party marketing pixels, or commercial ads.</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="font-black text-white text-sm">2. 🛡️ Safe AI Sandbox</div>
            <p className="text-slate-400">Prompts are pre-screened to reject inappropriate themes, foul language, and personal address requests.</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="font-black text-white text-sm">3. 🔒 Minimal Data Collection</div>
            <p className="text-slate-400">We do not ask children for real phone numbers, real-time GPS locations, or home addresses.</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
            <div className="font-black text-white text-sm">4. ⚖️ Ethical Algorithmic Literacy</div>
            <p className="text-slate-400">We teach young learners how algorithms make decisions so they grow into discerning digital citizens.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow transition-all"
          >
            Save Parental Preferences
          </button>
        </div>
      </div>

    </div>
  );
};

export default ParentDashboard;

