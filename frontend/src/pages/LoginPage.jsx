import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Sparkles, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('kid@sparkcode.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check credentials.');
      }
    } catch (err) {
      setError(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'kid') {
      setEmail('kid@sparkcode.ai');
      setPassword('password123');
    } else {
      setEmail('parent@sparkcode.ai');
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 mx-auto flex items-center justify-center text-3xl shadow-inner animate-bounce-soft">
            🦊
          </div>
          <h1 className="font-bubble font-black text-2xl text-slate-800">
            Welcome Back Cadet!
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Log in to continue building your games and coding quests.
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 space-y-1.5">
          <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
            ⚡ Quick Demo Accounts:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('kid')}
              className="flex-1 py-1.5 bg-white text-purple-800 font-bold text-xs rounded-xl border border-purple-300 hover:bg-purple-100 transition-colors"
            >
              🧒 Kid Coder
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('parent')}
              className="flex-1 py-1.5 bg-white text-purple-800 font-bold text-xs rounded-xl border border-purple-300 hover:bg-purple-100 transition-colors"
            >
              🦉 Parent Account
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Logging in...' : 'Enter Coding World 🚀'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New to SparkCode?{' '}
          <Link to="/signup" className="text-purple-600 font-bold hover:underline">
            Create an Account for Free
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;

