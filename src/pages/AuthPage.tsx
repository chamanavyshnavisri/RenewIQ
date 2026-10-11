import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setError('Please enter a password (at least 4 characters).');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    const displayName =
      mode === 'signup'
        ? fullName.trim()
        : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    login({
      id: `user-${Date.now()}`,
      name: displayName,
      email: email.trim(),
      isDemo: false,
    });

    navigate('/questionnaire');
  };

  const handleDemoUser = () => {
    login({
      id: 'demo-user-01',
      name: 'Aarav Sharma (Demo User)',
      email: 'demo@greenspace.ai',
      isDemo: true,
    });
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 py-12 bg-[#FAF9F6]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Left Informational Panel */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-3">
              GREENSPACE AI · PROPERTY PORTAL
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-white mb-4">
              Plan Your Property&apos;s Clean Energy Future
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-8">
              Save your property profile, upload rooftop or land photos for Gemini 2.5 Flash vision analysis, and compare Solar, Wind, Hybrid, and Battery systems.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-800 text-xs text-slate-300">
            <div>
              <div className="font-semibold text-white">01. Tailored System Sizing</div>
              <div className="text-slate-400 mt-0.5">Calibrated to your monthly kWh consumption and roof area.</div>
            </div>
            <div>
              <div className="font-semibold text-white">02. AI Visual Zone Detection</div>
              <div className="text-slate-400 mt-0.5">Identifies high-suitability zones and shading obstacles.</div>
            </div>
            <div>
              <div className="font-semibold text-white">03. Complete Maintenance Plan</div>
              <div className="text-slate-400 mt-0.5">Actionable daily, monthly, and yearly care schedules.</div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center">
          {/* Interactive Segmented Control: Login vs Create Account */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6 self-start">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="text-xl font-display font-bold text-slate-900 mb-1">
            {mode === 'login' ? 'Welcome back to GreenSpace AI' : 'Create your GreenSpace AI account'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {mode === 'login'
              ? 'Sign in to access your renewable energy questionnaire and AI space assessment.'
              : 'Enter your details below to begin your personalized property assessment.'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Aarav Sharma"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700 text-slate-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700 text-slate-900"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700 text-slate-900"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{mode === 'login' ? 'Login & Continue' : 'Create Account & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-medium">Instant Hackathon Demo Access</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoUser}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Continue as Demo User</span>
          </button>
        </div>
      </div>
    </div>
  );
};
