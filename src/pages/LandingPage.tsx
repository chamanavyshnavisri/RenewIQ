import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Wind,
  BatteryCharging,
  ArrowRight,
  ScanLine,
  Compass,
  Wrench,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import heroSolarHouse from '../assets/images/hero_modern_solar_house_1791529300677.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useApp();

  const handleStartPlanning = () => {
    if (user) {
      navigate('/questionnaire');
    } else {
      navigate('/auth');
    }
  };

  const handleInstantDemo = () => {
    if (!user) {
      login({
        id: 'demo-homeowner-01',
        name: 'Aarav Sharma (Demo Homeowner)',
        email: 'demo@greenspace.ai',
        isDemo: true,
      });
    }
    navigate('/dashboard');
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Hero Section — 1440px container presence with 2-column split */}
      <section className="max-w-7xl mx-auto w-full px-6 lg:px-12 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Editorial Headline & Primary CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <div className="text-xs font-medium text-emerald-800 tracking-wide mb-4">
                AI-Powered Property Energy Assessment · Solar · Wind · Hybrid · Storage
              </div>

              <h1
                className="font-display font-bold text-slate-900 tracking-tight leading-[1.08] mb-6"
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.75rem)', textWrap: 'balance' }}
              >
                Turn Your Space Into Clean Energy
              </h1>

              <p className="text-slate-600 text-base lg:text-lg leading-relaxed max-w-xl mb-8">
                AI-powered renewable energy planning for your home, terrace, and property. Upload a photo of your available space and receive a tailored suitability assessment, financial outlook, and maintenance schedule in seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={handleStartPlanning}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Plan My Energy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>How It Works</span>
                </button>

                <button
                  onClick={handleInstantDemo}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 px-2 py-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  View Sample AI Plan →
                </button>
              </div>
            </div>

            {/* Quiet unboxed metadata proof bar */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6">
              <div>
                <div className="font-mono text-xl font-semibold text-slate-900 tabular-nums">5 Options</div>
                <div className="text-xs text-slate-500 mt-0.5">Solar, Wind, Hybrid, Battery & Thermal</div>
              </div>
              <div>
                <div className="font-mono text-xl font-semibold text-slate-900 tabular-nums">&lt; 30 Sec</div>
                <div className="text-xs text-slate-500 mt-0.5">Multimodal Vision & Energy Mix Plan</div>
              </div>
              <div>
                <div className="font-mono text-xl font-semibold text-slate-900 tabular-nums">10-Yr ROI</div>
                <div className="text-xs text-slate-500 mt-0.5">Preliminary Cost, Subsidy & Payback</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual representation of modern house/terrace with solar, wind, greenery, and energy-flow overlay */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 min-h-[380px] lg:min-h-[480px] flex flex-col justify-end">
            <img
              src={heroSolarHouse}
              alt="Modern sustainable house and terrace with rooftop solar PV panels, compact vertical wind turbine, and terrace greenery"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Measured Scrim for high-contrast legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

            {/* Interactive Energy-Flow Diagram Overlay */}
            <div className="relative z-10 p-6 lg:p-8 text-white">
              <div className="text-xs font-mono text-emerald-300 mb-2">
                LIVE ARCHITECTURE SIMULATION · SOLAR + MICRO-WIND + LFP STORAGE
              </div>
              <h2 className="text-lg lg:text-xl font-display font-semibold text-white mb-4">
                Integrated Residential Clean Energy Flow
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white">Terrace Solar PV</div>
                    <div className="text-[11px] text-slate-300 font-mono tabular-nums mt-0.5">
                      4.0 kWp · 92% Suitability
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wind className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white">Parapet Micro-Wind</div>
                    <div className="text-[11px] text-slate-300 font-mono tabular-nums mt-0.5">
                      1.0 kW VAWT · Monsoon Boost
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BatteryCharging className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-white">Smart LFP Storage</div>
                    <div className="text-[11px] text-slate-300 font-mono tabular-nums mt-0.5">
                      5.0 kWh · Evening Backup
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Feature Cards Section */}
      <section className="bg-white border-y border-slate-200 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-semibold text-emerald-800 mb-2">Core Capabilities</div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Intelligent Planning From Rooftop Photo to Long-Term Care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-[#FAF9F6] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-6">
                  <ScanLine className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2.5">
                  AI Space Analysis
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Upload a photo and let AI identify suitable renewable-energy installation areas, shading zones, water tanks, and structural obstacles with color-coded visual overlays.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
                Detects High-Suitability, Secondary & Obstacle Zones
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-[#FAF9F6] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-6">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2.5">
                  Smart Energy Recommendation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Get a personalized renewable-energy mix based on your property and energy needs—comparing Solar PV, Small Wind, Hybrid systems, Battery Storage, and Solar Water Heating.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
                Includes Preliminary Cost, Savings & 10-Year Financial Outlook
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-[#FAF9F6] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-6">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2.5">
                  Maintenance Assistant
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Know how to maintain your renewable-energy equipment and keep it performing efficiently with structured daily, monthly, seasonal, and annual checklists plus an interactive Q&A guide.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
                Tailored Care Schedules for Solar, Wind, Storage & Thermal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Section */}
      <section id="how-it-works" className="py-16 lg:py-24 max-w-7xl mx-auto w-full px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-semibold text-emerald-800 mb-2">How GreenSpace AI Works</div>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Three Steps to Your Personalized Clean Energy Plan
            </h2>
          </div>
          <button
            onClick={handleStartPlanning}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
          >
            <span>Start Step 01 Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-7 rounded-2xl bg-white border border-slate-200">
            <div className="font-mono text-xs font-semibold text-emerald-700 mb-3">
              01 — Tell Us About Your Property
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
              Property & Usage Questionnaire
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Share your property type, monthly electricity consumption, approximate bill, installation area preference, budget range, and city location.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Takes under 60 seconds</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-white border border-slate-200">
            <div className="font-mono text-xs font-semibold text-emerald-700 mb-3">
              02 — Upload Your Space
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
              Multimodal Vision Inspection
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Upload a photo of your rooftop terrace, backyard, parking area, or open land—or select a pre-loaded sample terrace to test immediately.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Highlights usable & obstructed zones</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-white border border-slate-200">
            <div className="font-mono text-xs font-semibold text-emerald-700 mb-3">
              03 — Get Your Renewable Energy Plan
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
              Dashboard, ROI & Maintenance Guide
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Explore your recommended system size, energy-mix comparison charts, simulated monthly kWh generation, financial payback, and downloadable PDF report.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Exportable PDF summary for installers</span>
            </div>
          </div>
        </div>

        {/* Transparent Engineering Standard Callout */}
        <div className="mt-14 p-6 lg:p-8 rounded-2xl bg-white border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-slate-900">
                Built on Transparent Preliminary Engineering Standards
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                GreenSpace AI never presents single-photo visual detections as certified structural or electrical measurements. Every recommendation clearly separates AI visual observations, regional solar/wind assumptions, and mandatory professional site inspection items.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstantDemo}
            className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Explore Sample Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};
