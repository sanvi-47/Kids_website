import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Shield, Rocket, Users, Award, Code2 } from 'lucide-react';

const AboutUsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-purple-600" /> Building the Future of Creative Coding
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-bubble text-slate-800">
          Empowering Kids to Think, Code, and Create with <span className="text-purple-600">Ethical AI</span>
        </h1>
        <p className="text-base text-slate-600 font-medium leading-relaxed">
          Inspired by the timeless creative spirit of Scratch, SparkCode AI was built to give every child the superpowers of visual programming and artificial intelligence literacy in a safe, colourful, and nurturing environment.
        </p>
      </div>

      {/* Core Values 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
            🧩
          </div>
          <h3 className="font-bubble font-black text-xl text-slate-800">Visual Drag & Drop</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            No syntax headaches or missing semicolons. Kids assemble logic blocks like colorful digital LEGO bricks and see characters respond on stage right away!
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
            🛡️
          </div>
          <h3 className="font-bubble font-black text-xl text-slate-800">Ethical AI from Day One</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            AI is transforming the planet. We teach children not just how to prompt AI, but how to question bias, protect privacy, and build algorithms that spread kindness.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
            🚀
          </div>
          <h3 className="font-bubble font-black text-xl text-slate-800">Creativity Over Consumption</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Instead of spending hours passively watching cartoons, kids become active game directors, world animators, and digital storytellers.
          </p>
        </div>
      </div>

      {/* Team / Mission Quote Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-6xl shadow-inner shrink-0 animate-bounce-soft">
          🦊
        </div>
        <div className="space-y-3 text-center md:text-left">
          <h3 className="font-bubble font-black text-2xl sm:text-3xl text-yellow-300">
            "Coding is not just a career skill—it is a language for imagination."
          </h3>
          <p className="text-sm text-purple-200 font-medium leading-relaxed">
            Whether a child dreams of building space exploration games, telling animated bedtime fairy tales, or designing robots that clean up our oceans, SparkCode AI provides the friendly runway for their ideas to take flight.
          </p>
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-md transition-all"
            >
              Join Our Coding Community
            </Link>
            <Link
              to="/editor"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-xl border border-white/20 transition-all"
            >
              Try Visual Coding
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUsPage;

