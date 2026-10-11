import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MapPin, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PROPERTY_TYPES = [
  'Independent House',
  'Apartment',
  'Villa',
  'Commercial Building',
  'Farm',
  'Industrial Property',
  'Other',
];

const INSTALL_LOCATIONS = [
  'Terrace / Rooftop',
  'Backyard',
  'Open Land',
  'Parking Area',
  'Multiple Areas',
  'Other',
];

const ELECTRICITY_USAGE = [
  'Less than 100 kWh/month',
  '100–250 kWh/month',
  '250–500 kWh/month',
  '500–1000 kWh/month',
  'More than 1000 kWh/month',
  "I don't know",
];

const MONTHLY_BILLS = [
  'Less than ₹1,000 / month',
  '₹1,000–₹2,500 / month',
  '₹2,500–₹5,000 / month',
  '₹5,000–₹10,000 / month',
  '₹10,000+ / month',
  "I'm not sure",
];

const AVAILABLE_SPACES = [
  'Small (Under 300 sq. ft.)',
  'Medium (300–800 sq. ft.)',
  'Large (800+ sq. ft.)',
  "I'm not sure",
];

const MAIN_GOALS = [
  'Reduce electricity bill',
  'Become energy independent',
  'Reduce carbon footprint',
  'Backup power',
  'Maximize long-term savings',
  'Combination of these',
];

const BUDGET_RANGES = [
  '₹50,000–₹1 lakh',
  '₹1–₹3 lakh',
  '₹3–₹5 lakh',
  '₹5–₹10 lakh',
  '₹10 lakh+',
  "I'm not sure",
];

const POPULAR_CITIES = [
  { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { city: 'Pune', state: 'Maharashtra', country: 'India' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { city: 'Delhi NCR', state: 'Delhi', country: 'India' },
];

export const QuestionnairePage: React.FC = () => {
  const { questionnaire, setQuestionnaire } = useApp();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;
  const navigate = useNavigate();

  const updateField = (field: keyof typeof questionnaire, value: string) => {
    setQuestionnaire((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/upload');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-[calc(100vh-120px)] py-10 lg:py-14 px-6 lg:px-12 bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto">
        {/* Header & Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
            <span>STEP 0{step} OF 0{totalSteps} · PROPERTY & ENERGY PROFILE</span>
            <span className="tabular-nums font-semibold text-emerald-800">{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-emerald-700 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tight">
                Let&apos;s Understand Your Energy Needs
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Answer 8 quick questions so GreenSpace AI can calibrate solar, wind, hybrid, and battery recommendations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skip with Pre-Filled Demo Answers</span>
            </button>
          </div>
        </div>

        {/* Questionnaire Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-10">
          {step === 1 && (
            <div className="space-y-8">
              {/* Question 1 */}
              <div>
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 01 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
                  What type of property do you have?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROPERTY_TYPES.map((option) => {
                    const selected = questionnaire.propertyType === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('propertyType', option)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold'
                            : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{option}</span>
                        {selected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2 */}
              <div className="pt-6 border-t border-slate-200">
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 02 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
                  Where do you want to install renewable-energy equipment?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INSTALL_LOCATIONS.map((option) => {
                    const selected = questionnaire.installLocation === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('installLocation', option)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold'
                            : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{option}</span>
                        {selected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              {/* Question 3 */}
              <div>
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 03 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
                  Approximately how much electricity do you use?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ELECTRICITY_USAGE.map((option) => {
                    const selected = questionnaire.monthlyUsage === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('monthlyUsage', option)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold'
                            : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="tabular-nums">{option}</span>
                        {selected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4 */}
              <div className="pt-6 border-t border-slate-200">
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 04 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
                  What is your approximate monthly electricity bill?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MONTHLY_BILLS.map((option) => {
                    const selected = questionnaire.monthlyBill === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('monthlyBill', option)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold'
                            : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="tabular-nums">{option}</span>
                        {selected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              {/* Question 5 */}
              <div>
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 05 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
                  How much installation space is available?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_SPACES.map((option) => {
                    const selected = questionnaire.availableSpace === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('availableSpace', option)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold'
                            : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{option}</span>
                        {selected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 6 */}
              <div className="pt-6 border-t border-slate-200">
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 06 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
                  What is your main goal?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MAIN_GOALS.map((option) => {
                    const selected = questionnaire.mainGoal === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('mainGoal', option)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold'
                            : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{option}</span>
                        {selected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              {/* Question 7 */}
              <div>
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 07 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-4">
                  What is your approximate budget?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUDGET_RANGES.map((option) => {
                    const selected = questionnaire.budget === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => updateField('budget', option)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-emerald-700 bg-emerald-50/70 text-slate-900 font-semibold'
                            : 'border-slate-200 bg-[#FAF9F6] text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="tabular-nums">{option}</span>
                        {selected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 8 */}
              <div className="pt-6 border-t border-slate-200">
                <div className="text-xs font-mono text-emerald-700 font-semibold mb-1">QUESTION 08 OF 08</div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-1">
                  What is your location?
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Your location helps estimate regional solar irradiance (peak sun hours), monsoon cloud cover, and climate conditions.
                </p>

                {/* Quick Presets */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-slate-500 mb-2">Quick Select City:</div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CITIES.map((preset) => (
                      <button
                        key={preset.city}
                        type="button"
                        onClick={() => {
                          setQuestionnaire((prev) => ({
                            ...prev,
                            city: preset.city,
                            state: preset.state,
                            country: preset.country,
                          }));
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          questionnaire.city === preset.city
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-[#FAF9F6] text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {preset.city}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={questionnaire.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="City"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
                    <input
                      type="text"
                      value={questionnaire.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="State"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      value={questionnaire.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      placeholder="Country"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap shrink-0 ${
                step === 1
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{step === totalSteps ? 'Continue to Space Analysis' : 'Next Questions'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
