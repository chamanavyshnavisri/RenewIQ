import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    if (location.pathname === '/dashboard') {
      navigate('/upload');
    } else if (user) {
      navigate('/questionnaire');
    } else {
      navigate('/auth');
    }
  };

  const primaryLabel =
    location.pathname === '/dashboard'
      ? 'Analyze Another Space'
      : user
        ? 'Plan My Energy'
        : 'Plan My Energy';

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <Link
        to="/"
        className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
      >
        GreenSpace AI
      </Link>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
        <Link
          to="/questionnaire"
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            location.pathname === '/questionnaire' ? 'text-slate-900 underline underline-offset-8 decoration-emerald-600 decoration-2' : ''
          }`}
        >
          Property Profile
        </Link>
        <Link
          to="/upload"
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            location.pathname === '/upload' ? 'text-slate-900 underline underline-offset-8 decoration-emerald-600 decoration-2' : ''
          }`}
        >
          Space Upload
        </Link>
        <Link
          to="/dashboard"
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            location.pathname === '/dashboard' ? 'text-slate-900 underline underline-offset-8 decoration-emerald-600 decoration-2' : ''
          }`}
        >
          Energy Plan
        </Link>
        <Link
          to="/maintenance"
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            location.pathname === '/maintenance' ? 'text-slate-900 underline underline-offset-8 decoration-emerald-600 decoration-2' : ''
          }`}
        >
          Maintenance Plan
        </Link>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handlePrimaryAction}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {primaryLabel}
        </button>
      </div>
    </header>
  );
};
