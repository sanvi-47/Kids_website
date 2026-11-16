import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, CheckCircle2, Play, Lock, Sparkles, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const LESSONS = [
  {
    id: 1,
    title: 'Mission 1: The Magic of Steps (Sequencing)',
    difficulty: 'Beginner',
    rewardXP: 30,
    badge: 'Step Master',
    story: 'Robbie the Robot wants to pick up an enchanted battery. Computers follow instructions line by line!',
    task: 'Connect 3 "Move 10 Steps" blocks in order.',
    answerKey: 'move_forward',
    blocksNeeded: ['Move 10 steps', 'Move 10 steps', 'Move 10 steps']
  },
  {
    id: 2,
    title: 'Mission 2: Dancing in Circles (Loops)',
    difficulty: 'Beginner',
    rewardXP: 40,
    badge: 'Loop Wizard',
    story: 'Rex the Dino wants to dance all night! Instead of 100 blocks, we use a Repeat Loop!',
    task: 'Wrap a Turn block inside a Repeat 4 Times block.',
    answerKey: 'repeat_times',
    blocksNeeded: ['Repeat 4 times', 'Turn 15 degrees']
  },
  {
    id: 3,
    title: 'Mission 3: Magic Secret Boxes (Variables)',
    difficulty: 'Intermediate',
    rewardXP: 50,
    badge: 'Variable Explorer',
    story: 'Every time your space rocket catches a shining star, add +1 to the Score variable box!',
    task: 'Use "Change Score by 1" whenever touching star.',
    answerKey: 'change_score',
    blocksNeeded: ['When touching star', 'Change Score by 1']
  },
  {
    id: 4,
    title: 'Mission 4: What is Ethical AI?',
    difficulty: 'Cadet',
    rewardXP: 60,
    badge: 'AI Guardian',
    story: 'Learn how to teach AI models to be fair, kind, truthful, and helpful to every human!',
    task: 'Answer the quiz question about safe and kind prompts.',
    answerKey: 'ethical_ai',
    quizQuestion: 'What should an ethical AI robot do when someone asks for help?',
    quizOptions: [
      { text: 'A) Give kind, safe, and helpful advice', correct: true },
      { text: 'B) Copy without asking permission', correct: false },
      { text: 'C) Say rude words', correct: false }
    ]
  }
];

const LearnCodingPage = () => {
  const { user, addXP } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(LESSONS[0]);
  const [completedLessons, setCompletedLessons] = useState([1]);
  const [quizSelected, setQuizSelected] = useState(null);
  const [successModal, setSuccessModal] = useState(false);

  const handleCompleteLesson = (lesson) => {
    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons([...completedLessons, lesson.id]);
    }
    addXP(lesson.rewardXP, lesson.badge);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setSuccessModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <span>🎓 Kids Coding Academy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-bubble">
            Coding Quests & AI Missions 🚀
          </h1>
          <p className="text-teal-100 text-sm sm:text-base max-w-xl font-medium mt-1">
            Learn core concepts like loops, variables, collision sensing, and ethical AI step-by-step through bite-sized interactive quests!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-black">{completedLessons.length} / {LESSONS.length}</div>
            <div className="text-[10px] text-teal-200 font-bold uppercase">Quests Cleared</div>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-black">{user?.xp || 0}</div>
            <div className="text-[10px] text-teal-200 font-bold uppercase">Total XP</div>
          </div>
        </div>
      </div>

      {/* Main Quests Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Lesson Tree */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-black font-bubble text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Quest Roadmap
          </h2>

          <div className="space-y-3">
            {LESSONS.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isCurrent = selectedLesson.id === lesson.id;

              return (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isCurrent
                      ? 'border-teal-500 bg-teal-50/70 shadow-md scale-[1.01]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-700 uppercase tracking-wider">
                      {lesson.difficulty}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {isCompleted ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-black">
                          <CheckCircle2 className="w-4 h-4 fill-emerald-100" /> Solved
                        </span>
                      ) : (
                        <span className="text-amber-600">+{lesson.rewardXP} XP</span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bubble font-black text-slate-800 text-base mt-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {lesson.story}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Lesson Practice Arena */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-black uppercase tracking-wider">
                Active Mission #{selectedLesson.id}
              </span>
              <h2 className="text-2xl font-black font-bubble text-slate-800 mt-2">
                {selectedLesson.title}
              </h2>
              <p className="text-slate-600 text-sm mt-1 font-medium">
                {selectedLesson.story}
              </p>
            </div>

            {/* Mission Objective Box */}
            <div className="bg-teal-50/80 border-2 border-teal-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bubble font-black text-teal-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" /> Mission Objective:
              </h4>
              <p className="text-xs font-bold text-teal-800">
                {selectedLesson.task}
              </p>
            </div>

            {/* Interactive Solving Area */}
            {selectedLesson.quizQuestion ? (
              <div className="space-y-4">
                <div className="font-bubble font-black text-slate-800 text-sm">
                  {selectedLesson.quizQuestion}
                </div>
                <div className="space-y-2">
                  {selectedLesson.quizOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setQuizSelected(i)}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 font-bold text-xs transition-all ${
                        quizSelected === i
                          ? opt.correct
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-red-400 bg-red-50 text-red-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Required Visual Blocks:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedLesson.blocksNeeded?.map((b, i) => (
                    <div
                      key={i}
                      className="scratch-block bg-blue-600 text-white font-code text-xs px-3 py-2 font-bold shadow-sm"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/editor"
                className="text-xs font-black text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Open Visual Editor to Experiment ➔
              </Link>

              <button
                onClick={() => handleCompleteLesson(selectedLesson)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4" /> Claim Mission Reward (+{selectedLesson.rewardXP} XP)
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-bounce-soft">
            <div className="text-5xl">🏆</div>
            <h3 className="text-2xl font-black font-bubble text-slate-800">
              Quest Complete!
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              You earned <strong className="text-teal-600">+{selectedLesson.rewardXP} XP</strong> and unlocked the <strong className="text-purple-600">{selectedLesson.badge}</strong> badge!
            </p>
            <button
              onClick={() => setSuccessModal(false)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-sm"
            >
              Keep Coding! 🚀
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearnCodingPage;

