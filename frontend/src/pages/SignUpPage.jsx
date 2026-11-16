import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles, AlertCircle } from 'lucide-react';

const SignUpPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(10);
  const [avatar, setAvatar] = useState('🦊');
  const [role, setRole] = useState('kid');
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const avatars = ['🦊', '🐱', '🦖', '🤖', '🚀', '🦄', '🐬', '🦉'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register({
        username,
        email,
        password,
        age,
        avatar,
        role,
        parentEmail
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('Failed to create account.');
      }
    } catch (err) {
      setError(err.message || 'Error signing up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 mx-auto flex items-center justify-center text-3xl text-white shadow-md">
            🚀
          </div>
          <h1 className="font-bubble font-black text-2xl text-slate-800">
            Join the SparkCode Adventure!
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Start creating your own games, coding cartoon animations, and learning ethical AI!
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Choose Your Coder Avatar:
            </label>
            <div className="flex gap-2 justify-center flex-wrap">
              {avatars.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                    avatar === a
                      ? 'bg-purple-100 border-2 border-purple-600 scale-110 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Coder Nickname / Username:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PixelHero"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age:
              </label>
              <input
                type="number"
                min="6"
                max="17"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none font-medium"
              >
                <option value="kid">Kid / Student</option>
                <option value="parent">Parent / Teacher</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address:
            </label>
            <input
              type="email"
              required
              placeholder="kid@example.com"
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
              placeholder="At least 6 fun characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-700 hover:to-pink-600 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Your Studio...' : 'Start Creating! 🚀'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-bold hover:underline">
            Log In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;

