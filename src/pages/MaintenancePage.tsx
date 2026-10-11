import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  CheckSquare,
  Square,
  Send,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  CalendarCheck,
  Loader2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const QUICK_MAINTENANCE_QUESTIONS = [
  'How should I safely clean rooftop solar panels during dry dusty months?',
  'What should I check before heavy monsoon rain and high wind gusts?',
  'Why did my solar generation drop by 20% this week despite sunny skies?',
  'How do I maximize the lifespan of a 5 kWh Lithium Iron Phosphate (LFP) battery?',
];

export const MaintenancePage: React.FC = () => {
  const { questionnaire, analysisResult } = useApp();
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string>(
    'Ask any question about cleaning schedules, monsoon wind safety, inverter fault lights, or battery health—or click one of the common homeowner questions below.'
  );
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const navigate = useNavigate();

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const askMaintenanceAssistant = async (promptText: string) => {
    const query = promptText.trim();
    if (!query) return;

    setIsLoadingAi(true);
    setQuestion(query);

    try {
      const res = await fetch('/api/maintenance-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          propertyContext: questionnaire,
          recommendedSystem: analysisResult.recommendedPrimaryTechnology.name,
        }),
      });
      const data = await res.json();
      setAiResponse(
        data.answer ||
          'Ensure DC/AC isolators are switched off before physical inspection, and clean solar glass only during cool morning hours.'
      );
    } catch {
      setAiResponse(
        'Preliminary Maintenance Tip: Rinse solar modules with soft water during early morning hours every 3–4 weeks, inspect wind turbine fasteners for vibration looseness monthly, and schedule a certified electrical earthing & torque audit annually.'
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  const plans = analysisResult.maintenancePlans;
  const currentPlan = plans[activeTechIndex] || plans[0];

  return (
    <div className="min-h-screen py-10 lg:py-12 px-6 lg:px-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono text-emerald-800 font-semibold mb-1.5">
              LONG-TERM PERFORMANCE & EQUIPMENT CARE
            </div>
            <h1 className="text-2xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Your Renewable Energy Maintenance Plan
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Structured daily, monthly, 3–6 month, and yearly maintenance schedules to keep your system generating peak clean energy safely.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Energy Plan</span>
          </button>
        </div>

        {/* Technology Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl w-fit">
          {plans.map((plan, idx) => (
            <button
              key={plan.technology}
              type="button"
              onClick={() => setActiveTechIndex(idx)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTechIndex === idx
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {plan.technology}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Structured Cadence Checklists */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-slate-900">
                      {currentPlan.technology}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Click any task below to mark it completed during your routine inspection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {currentPlan.cadences.map((cadence) => (
                  <div key={cadence.period} className="space-y-2.5">
                    <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                      {cadence.period}:
                    </div>
                    <div className="space-y-2">
                      {cadence.tasks.map((task, tIdx) => {
                        const taskKey = `${currentPlan.technology}-${cadence.period}-${tIdx}`;
                        const isChecked = Boolean(completedTasks[taskKey]);
                        return (
                          <button
                            key={taskKey}
                            type="button"
                            onClick={() => toggleTask(taskKey)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-colors flex items-start gap-3 cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-50/50 border-emerald-300 text-slate-500 line-through'
                                : 'bg-[#FAF9F6] border-slate-200 text-slate-800 hover:border-slate-300'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            )}
                            <span className="text-xs leading-relaxed font-medium">{task}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pro Engineering Care Note */}
              <div className="mt-8 p-4 rounded-xl bg-slate-900 text-slate-200 text-xs leading-relaxed flex items-start gap-3">
                <Wrench className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-semibold">Field Engineering Pro-Tip: </strong>
                  {currentPlan.proTip}
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Gemini 2.5 Flash Interactive Maintenance Assistant */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>GEMINI 2.5 FLASH · MAINTENANCE ADVISOR</span>
              </div>
              <h2 className="text-lg font-display font-bold text-slate-900 mb-2">
                Ask the AI Maintenance Assistant
              </h2>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Get instant troubleshooting and seasonal upkeep guidance tailored to your {questionnaire.propertyType.toLowerCase()} in {questionnaire.city || 'your area'}.
              </p>

              {/* Quick Question Buttons */}
              <div className="space-y-2 mb-5">
                <div className="text-[11px] font-semibold text-slate-500">
                  Common Homeowner Questions:
                </div>
                {QUICK_MAINTENANCE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => askMaintenanceAssistant(q)}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 bg-[#FAF9F6] hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Custom Question Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  askMaintenanceAssistant(question);
                }}
                className="flex items-center gap-2 mb-5"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about cleaning, shading, inverter alerts..."
                  className="flex-1 px-3.5 py-2.5 text-xs bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700"
                />
                <button
                  type="submit"
                  disabled={isLoadingAi}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {isLoadingAi ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Ask</span>
                </button>
              </form>

              {/* AI Answer Output Box */}
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 mb-1.5">
                  MAINTENANCE ASSISTANT RESPONSE:
                </div>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {isLoadingAi ? 'Analyzing maintenance protocol for your climate and system...' : aiResponse}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Always switch off AC/DC isolator breakers before rinsing panels, and never attempt high-voltage wiring repairs without a licensed technician.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
