import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Wind,
  BatteryCharging,
  Flame,
  Zap,
  Download,
  Wrench,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { exportEnergyPlanToPdf } from '../utils/pdfExport';
import { DetectedZone, TechnologyOption } from '../types/energy';
import sampleTerraceImg from '../assets/images/sample_terrace_rooftop_1791529316071.jpg';

export const DashboardPage: React.FC = () => {
  const { user, questionnaire, uploadMetadata, analysisResult } = useApp();
  const [showOverlay, setShowOverlay] = useState(true);
  const [selectedZone, setSelectedZone] = useState<DetectedZone | null>(
    analysisResult.detectedZones[0] || null
  );
  const [selectedTech, setSelectedTech] = useState<TechnologyOption>(
    analysisResult.recommendedPrimaryTechnology
  );
  const [chartView, setChartView] = useState<'monthly' | 'cumulative'>('monthly');

  const navigate = useNavigate();

  const handleExportPdf = () => {
    exportEnergyPlanToPdf(user, questionnaire, uploadMetadata, analysisResult);
  };

  const getTechIcon = (id: string) => {
    switch (id) {
      case 'solar_pv':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'small_wind':
        return <Wind className="w-5 h-5 text-sky-500" />;
      case 'hybrid':
        return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'battery_storage':
        return <BatteryCharging className="w-5 h-5 text-emerald-600" />;
      case 'solar_water_heating':
        return <Flame className="w-5 h-5 text-orange-500" />;
      default:
        return <Sun className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getZoneBadgeStyle = (level: 'GREEN' | 'YELLOW' | 'RED') => {
    if (level === 'GREEN') {
      return {
        border: 'border-emerald-400 bg-emerald-500/25 hover:bg-emerald-500/35',
        labelBg: 'bg-emerald-900/90 text-emerald-100',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      };
    }
    if (level === 'YELLOW') {
      return {
        border: 'border-amber-400 bg-amber-500/25 hover:bg-amber-500/35',
        labelBg: 'bg-amber-900/90 text-amber-100',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      };
    }
    return {
      border: 'border-red-400 bg-red-500/25 hover:bg-red-500/35',
      labelBg: 'bg-red-900/90 text-red-100',
      icon: <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />,
    };
  };

  const previewImg = uploadMetadata.imagePreviewUrl || sampleTerraceImg;

  return (
    <div className="min-h-screen py-10 lg:py-12 px-6 lg:px-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Header & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="text-xs font-mono text-emerald-800 font-semibold mb-2">
              PRELIMINARY AI ASSESSMENT · {questionnaire.propertyType.toUpperCase()} · {questionnaire.city.toUpperCase()}, {questionnaire.state.toUpperCase()}
            </div>
            <h1 className="text-2xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Your Personalized Renewable Energy Plan
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 max-w-3xl">
              {analysisResult.summaryHeadline} — Preliminary AI estimate; professional site assessment recommended before installation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/maintenance')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-emerald-700" />
              <span>View Maintenance Plan</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>

        {/* SECTION 5: AI SPACE ANALYSIS & OVERLAYS */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-emerald-700 font-semibold">
                01. AI SPACE ANALYSIS (VISUAL ESTIMATES)
              </div>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-slate-900">
                Detected Installation Zones & Obstacles
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowOverlay(!showOverlay)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors self-start cursor-pointer"
            >
              {showOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showOverlay ? 'Hide Zone Overlays' : 'Show Zone Overlays'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image + Highlighted Bounding Box Overlays */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4">
              <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-900">
                <img
                  src={previewImg}
                  alt="Analyzed property space with AI zone detection"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {showOverlay &&
                  analysisResult.detectedZones.map((zone) => {
                    const style = getZoneBadgeStyle(zone.suitabilityLevel);
                    const isSelected = selectedZone?.id === zone.id;
                    return (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        style={{
                          left: `${zone.box.x}%`,
                          top: `${zone.box.y}%`,
                          width: `${zone.box.width}%`,
                          height: `${zone.box.height}%`,
                        }}
                        className={`absolute border-2 rounded-lg transition-all cursor-pointer flex flex-col justify-between p-2 ${
                          style.border
                        } ${isSelected ? 'ring-2 ring-white shadow-lg' : ''}`}
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold self-start max-w-full truncate ${style.labelBg}`}
                        >
                          {style.icon}
                          <span className="truncate">{zone.label}</span>
                        </div>
                        <div className="self-end bg-slate-950/85 text-white font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums">
                          {zone.estimatedAreaSqFt}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Legend Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                    <span className="font-semibold text-slate-800">GREEN:</span>
                    <span className="text-slate-600">Highly suitable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                    <span className="font-semibold text-slate-800">YELLOW:</span>
                    <span className="text-slate-600">Potentially suitable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs bg-red-500 inline-block" />
                    <span className="font-semibold text-slate-800">RED:</span>
                    <span className="text-slate-600">Obstacle / unsuitable area</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Visual Estimates Only
                </span>
              </div>
            </div>

            {/* Detected Zones Interactive List + Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="text-xs font-mono text-slate-500 mb-1">
                  ESTIMATED USABLE SPACE
                </div>
                <div className="text-xl font-display font-bold text-slate-900 font-mono tabular-nums mb-2">
                  {analysisResult.estimatedTotalUsableArea}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {analysisResult.estimatedSuitabilitySummary}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="text-xs font-semibold text-slate-900 mb-2">
                  Detected Zones (Click a zone to inspect):
                </div>
                {analysisResult.detectedZones.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/40'
                          : 'border-slate-200 bg-[#FAF9F6] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{zone.label}</span>
                        <span className="text-[11px] font-mono font-semibold text-slate-700 tabular-nums">
                          {zone.suitabilityLevel} · {zone.suitabilityLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                        {zone.description}
                      </p>
                      <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                        Category: {zone.category} · Area: {zone.estimatedAreaSqFt}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: PRIMARY RENEWABLE ENERGY RECOMMENDATION & ALTERNATIVE OPTIONS */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-mono text-emerald-700 font-semibold">
              02. RECOMMENDED SYSTEM & SUITABILITY SCORES
            </div>
            <h2 className="text-xl lg:text-2xl font-display font-bold text-slate-900">
              Primary Recommendation & Technology Alternatives
            </h2>
          </div>

          {/* Primary Recommended System Highlight Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono font-semibold text-emerald-700 mb-1">
                  RECOMMENDED SYSTEM · ★★★★★ HIGHLY RECOMMENDED ({selectedTech.suitabilityScore}% SUITABILITY)
                </div>
                <div className="flex items-center gap-3">
                  {getTechIcon(selectedTech.id)}
                  <h3 className="text-2xl font-display font-bold text-slate-900">
                    {selectedTech.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mt-1">{selectedTech.tagline}</p>
              </div>

              <div className="text-left lg:text-right">
                <div className="text-xs text-slate-500">Confidence Level</div>
                <div className="text-xs font-mono font-semibold text-slate-900 mt-0.5">
                  {analysisResult.confidenceLevel}
                </div>
              </div>
            </div>

            {/* Key Configuration & Financial Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-6 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Estimated system size</div>
                <div className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                  {selectedTech.estimatedSystemSize}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Estimated annual generation</div>
                <div className="text-lg font-mono font-bold text-emerald-800 tabular-nums">
                  {selectedTech.estimatedAnnualGeneration}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Estimated monthly savings</div>
                <div className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                  {selectedTech.estimatedMonthlySavings}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Estimated installation cost</div>
                <div className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                  {selectedTech.estimatedCostRange}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Estimated payback</div>
                <div className="text-lg font-mono font-bold text-slate-900 tabular-nums">
                  {selectedTech.estimatedPaybackYears}
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                <strong>Why it fits:</strong> {selectedTech.whySuitable}
              </span>
              <span className="font-mono whitespace-nowrap shrink-0">
                Required Space: {selectedTech.requiredSpaceSqFt}
              </span>
            </div>
          </div>

          {/* 5 Alternative Technology Option Cards */}
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-3">
              Compare All Evaluated Renewable Technologies (Click any card to inspect its parameters above):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {analysisResult.alternativeOptions.map((option) => {
                const isSelected = selectedTech.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedTech(option)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-white ring-2 ring-emerald-700/15'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {getTechIcon(option.id)}
                        <span className="font-mono text-xs font-bold text-emerald-800 tabular-nums">
                          Suitability: {option.suitabilityScore}%
                        </span>
                      </div>
                      <h4 className="text-sm font-display font-bold text-slate-900 mb-1">
                        {option.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                        {option.tagline}
                      </p>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${option.suitabilityScore}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Preliminary AI estimate — professional site assessment recommended before installation.
            </p>
          </div>
        </section>

        {/* SECTION 7: WHY THIS RECOMMENDATION? */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 space-y-6">
          <div>
            <div className="text-xs font-mono text-emerald-700 font-semibold">
              03. DECISION RATIONALE
            </div>
            <h2 className="text-xl lg:text-2xl font-display font-bold text-slate-900">
              Why GreenSpace AI Recommended This
            </h2>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF9F6] border border-slate-200 text-sm text-slate-700 leading-relaxed">
            {analysisResult.whyRecommendedFactors.narrativeExplanation}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div>
              <div className="text-xs font-bold text-slate-900 mb-1">Solar Potential</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.whyRecommendedFactors.solarPotential}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 mb-1">Energy Demand</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.whyRecommendedFactors.energyDemand}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 mb-1">Budget Alignment</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.whyRecommendedFactors.budgetFit}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 mb-1">Property Type</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.whyRecommendedFactors.propertyTypeFit}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 mb-1">Available Space</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.whyRecommendedFactors.availableSpaceFit}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 mb-1">Detected Obstructions</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.whyRecommendedFactors.obstructionsImpact}
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs font-bold text-slate-900 mb-1">Location & Climate</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {analysisResult.whyRecommendedFactors.locationClimate}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 8: ENERGY MIX COMPARISON */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-mono text-emerald-700 font-semibold">
              04. SYSTEM ARCHITECTURE COMPARISON
            </div>
            <h2 className="text-xl lg:text-2xl font-display font-bold text-slate-900">
              Energy Mix Comparison (Preliminary Estimates)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Comparison Table */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#FAF9F6] text-[11px] font-mono text-slate-500">
                      <th className="py-3.5 px-4">Configuration</th>
                      <th className="py-3.5 px-4 text-right">Est. Generation</th>
                      <th className="py-3.5 px-4 text-right">Approx. Cost</th>
                      <th className="py-3.5 px-4">Space Req.</th>
                      <th className="py-3.5 px-4">Maintenance</th>
                      <th className="py-3.5 px-4 text-right">Suitability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {analysisResult.energyMixComparison.map((row) => (
                      <tr key={row.mixName} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {row.mixName}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                          {row.annualGenerationKwh.toLocaleString()} kWh/yr
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                          {row.costRangeLabel}
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                          {row.spaceRequiredSqFt}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.maintenanceComplexity}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-800 tabular-nums">
                          {row.suitabilityScore}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suitability & Reliability Comparison Bar Chart */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-display font-bold text-slate-900 mb-1">
                  Suitability vs. Reliability Score by Energy Mix
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Comparing overall property suitability and power availability (0–100 scale).
                </p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analysisResult.energyMixComparison}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="mixName" tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E2E8F0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="suitabilityScore" name="Suitability (%)" fill="#047857" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reliabilityScore" name="Reliability (%)" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9 & 10: SIMULATED ENERGY GENERATION & FINANCIAL OUTLOOK */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Simulated Energy Generation Dashboard */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-xs font-mono text-emerald-700 font-semibold">
                    05. SIMULATED ENERGY GENERATION (ESTIMATES)
                  </div>
                  <h2 className="text-xl font-display font-bold text-slate-900">
                    Estimated Clean Energy Production
                  </h2>
                </div>

                {/* Interactive Chart Mode Switch */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
                  <button
                    type="button"
                    onClick={() => setChartView('monthly')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      chartView === 'monthly'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly kWh
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartView('cumulative')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      chartView === 'cumulative'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    10-Yr Payback
                  </button>
                </div>
              </div>

              {/* Daily / Monthly / Annual KPI Strip */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 mb-6">
                <div>
                  <div className="text-[11px] text-slate-500">Daily Generation (Est.)</div>
                  <div className="text-base lg:text-lg font-mono font-bold text-slate-900 tabular-nums">
                    ~{analysisResult.simulatedGeneration.dailyAvgKwh} kWh/day
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Monthly Generation (Est.)</div>
                  <div className="text-base lg:text-lg font-mono font-bold text-slate-900 tabular-nums">
                    ~{analysisResult.simulatedGeneration.monthlyAvgKwh} kWh/mo
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Annual Generation (Est.)</div>
                  <div className="text-base lg:text-lg font-mono font-bold text-emerald-800 tabular-nums">
                    ~{analysisResult.simulatedGeneration.annualTotalKwh.toLocaleString()} kWh/yr
                  </div>
                </div>
              </div>

              {/* Interactive AreaChart */}
              <div className="h-64 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === 'monthly' ? (
                    <AreaChart
                      data={analysisResult.simulatedGeneration.monthlyCurve}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area
                        type="monotone"
                        dataKey="solarKwh"
                        name="Est. Solar PV (kWh)"
                        stroke="#047857"
                        fill="#10B981"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="windKwh"
                        name="Est. Supplemental Wind (kWh)"
                        stroke="#0284C7"
                        fill="#38BDF8"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  ) : (
                    <AreaChart
                      data={analysisResult.financialOutlook.yearlyCumulativeSavings}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#475569' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                      <Tooltip
                        formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E2E8F0',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area
                        type="monotone"
                        dataKey="cumulativeSavingsInr"
                        name="Cumulative Bill Savings (₹ Est.)"
                        stroke="#047857"
                        fill="#10B981"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="netSystemCostInr"
                        name="Net Installation Cost (₹ Est.)"
                        stroke="#64748B"
                        fill="#94A3B8"
                        fillOpacity={0.1}
                        strokeDasharray="4 4"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Environmental Impact Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div>
                <div className="text-slate-500">Estimated clean energy generated</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                  {(analysisResult.simulatedGeneration.annualTotalKwh * 10).toLocaleString()} kWh / 10 yrs
                </div>
              </div>
              <div>
                <div className="text-slate-500">Estimated CO₂ emissions avoided</div>
                <div className="font-mono font-bold text-emerald-800 mt-0.5 tabular-nums">
                  ~{analysisResult.simulatedGeneration.co2AvoidedTonnesPerYear} Tonnes CO₂ / year
                </div>
              </div>
              <div>
                <div className="text-slate-500">Estimated electricity bill reduction</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5 tabular-nums">
                  ~{analysisResult.simulatedGeneration.billReductionPercent}% Monthly Offset
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 10: COST & SAVINGS (FINANCIAL OUTLOOK) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-emerald-700 font-semibold">
                06. COST & SAVINGS (PRELIMINARY ESTIMATES)
              </div>
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">
                Financial Outlook
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Estimated installation cost
                    </div>
                    <div className="text-[11px] text-slate-500">Gross turnkey hardware & balance of system</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                    {analysisResult.financialOutlook.estimatedInstallationCostRange}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-950">
                      Potential incentives / subsidies
                    </div>
                    <div className="text-[11px] text-emerald-800">Subject to MNRE / DISCOM residential eligibility</div>
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-800 tabular-nums text-right max-w-[160px]">
                    {analysisResult.financialOutlook.estimatedSubsidyOrIncentive}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Estimated annual savings
                    </div>
                    <div className="text-[11px] text-slate-500">Based on net-metered solar tariff offset</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                    {analysisResult.financialOutlook.estimatedAnnualSavingsRange}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Estimated payback period
                    </div>
                    <div className="text-[11px] text-slate-500">Break-even point on net capital outlay</div>
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                    {analysisResult.financialOutlook.estimatedPaybackPeriod}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-300">
                      Estimated 10-year savings
                    </div>
                    <div className="text-[11px] text-slate-300">Cumulative projected savings (est. 3%/yr tariff rise)</div>
                  </div>
                  <div className="text-base font-mono font-bold text-white tabular-nums">
                    {analysisResult.financialOutlook.estimated10YearSavings}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
              <strong>Important Pricing Notice:</strong> Actual costs vary by equipment, installer, location, structural requirements, permits, taxes, and available incentives.
            </div>
          </div>
        </section>

        {/* ASSUMPTIONS & LIMITATIONS TRANSPARENCY SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-slate-900 mb-3">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Model Assumptions Used in This Estimate</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              {analysisResult.assumptions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-emerald-700 font-bold">0{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-slate-900 mb-3">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Visual Assessment Limitations & Next Steps</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              {analysisResult.limitations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-amber-700 font-bold">0{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
