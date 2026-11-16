import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import KidsDashboard from './pages/KidsDashboard';
import VisualCodingEditor from './pages/VisualCodingEditor';
import LearnCodingPage from './pages/LearnCodingPage';
import AiAssistant from './pages/AiAssistant';
import MyProjectsPage from './pages/MyProjectsPage';
import ParentDashboard from './pages/ParentDashboard';
import AboutUsPage from './pages/AboutUsPage';

// Studios
import GameStudio from './studios/GameStudio';
import AnimationStudio from './studios/AnimationStudio';
import StoryStudio from './studios/StoryStudio';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#18113C] text-slate-100 space-universe-bg">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<KidsDashboard />} />
          <Route path="/studio/game" element={<GameStudio />} />
          <Route path="/studio/animation" element={<AnimationStudio />} />
          <Route path="/studio/story" element={<StoryStudio />} />
          <Route path="/editor" element={<VisualCodingEditor />} />
          <Route path="/learn" element={<LearnCodingPage />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/my-projects" element={<MyProjectsPage />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
