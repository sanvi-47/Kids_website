import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Send, Sparkles, Shield, Lightbulb, Code2, HelpCircle } from 'lucide-react';
import { Sparky3DMascot } from '../components/Sparky3DMascot';

const AiAssistant = () => {
  const { user } = useAuth();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `👋 Beep Boop! Hi ${user?.username || 'little coder'}! I am Sparky AI, your 3D creative robot buddy! Ask me for game ideas, help with bugs, loops, variables, or how to make ethical technology! What would you like to invent today? 🚀`,
      time: 'Just now'
    }
  ]);

  const quickPrompts = [
    "Give me an exciting game idea! 🎮",
    "What is a loop in simple words? 🔁",
    "How do variables work like magic boxes? 📦",
    "Why is Ethical AI important for kids? 🤖",
    "How do I fix a bug where my character won't move? 🐞"
  ];

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          mode: 'coding_help',
          age: user?.age || 10
        })
      });

      const data = await res.json();
      const aiReply = data.reply || "Beep boop! Let's check our visual blocks in the game studio!";

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSafe: data.isSafe,
          demoMode: data.demoMode
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "🤖 Sparky Local Engine: In programming, you can always test your code by breaking big problems into smaller steps! Try checking if your 'When Green Flag Clicked' block is plugged in at the top!",
          time: 'Just now',
          demoMode: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* 3D Sparky Header Banner */}
      <div className="card-3d rounded-3xl p-7 sm:p-8 border-2 border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5 z-10">
          <Sparky3DMascot className="w-24 h-24 shrink-0" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-black font-bubble text-white">Sparky AI Assistant</span>
              <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Kid Safe
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 font-medium">
              Your 3D coding buddy who explains logic, suggests game mechanics, and cheers you on!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1A143D] px-4 py-2 rounded-full text-xs font-black text-emerald-300 shrink-0 border border-emerald-500/40 z-10 shadow-glow-blue">
          <Shield className="w-4 h-4 text-emerald-400" /> Safe Responses Only
        </div>

        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-gradient-to-tr from-[#38BDF8] to-[#FF4FA3] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-black text-purple-300 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-4 h-4 text-amber-400" /> Quick Ask:
        </span>
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="shrink-0 px-4 py-2.5 bg-[#201A4C] border border-purple-500/40 text-purple-200 text-xs font-bubble font-black rounded-2xl hover:bg-[#2C2468] hover:border-pink-500 hover:scale-105 transition-all shadow-md"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 3D Chat Messages Container */}
      <div className="card-3d rounded-3xl border-2 border-purple-500/40 p-6 h-[540px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
                  msg.sender === 'user'
                    ? 'btn-3d-pink text-white'
                    : 'btn-3d-cyan text-white'
                }`}
              >
                {msg.sender === 'user' ? user?.avatar || '🦊' : '🤖'}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'btn-3d-pink text-white font-medium rounded-tr-none'
                    : 'bg-[#1C1645] border border-purple-400/40 text-slate-100 rounded-tl-none font-bubble shadow-lg'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    msg.sender === 'user' ? 'text-pink-100' : 'text-purple-300'
                  }`}
                >
                  {msg.time} {msg.demoMode && '• Demo Safe Mode'}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl btn-3d-cyan text-white flex items-center justify-center text-2xl">
                🤖
              </div>
              <div className="bg-[#1C1645] border border-purple-400/40 rounded-2xl px-5 py-3 text-xs font-black text-cyan-300 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                Sparky is thinking up your answer with friendly code logic...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-purple-500/30 flex gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Sparky anything about coding, games, or AI..."
            className="flex-1 px-4 py-3 bg-[#171239] rounded-2xl border-2 border-purple-500/50 focus:outline-none focus:border-pink-500 font-medium text-sm text-white placeholder-purple-300/60"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="btn-3d-pink px-7 py-3 text-white font-bubble font-black rounded-2xl flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
