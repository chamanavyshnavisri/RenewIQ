import {
  AIAnalysisResult,
  MixComparisonItem,
  MonthlyGenerationPoint,
  MaintenanceSchedule,
  QuestionnaireAnswers,
  SpaceUploadMetadata,
} from '../types/energy';

export const DEFAULT_QUESTIONNAIRE: QuestionnaireAnswers = {
  propertyType: 'Independent House',
  installLocation: 'Terrace / Rooftop',
  monthlyUsage: '250–500 kWh/month',
  monthlyBill: '₹2,500–₹5,000 / month',
  availableSpace: 'Medium (400–800 sq. ft.)',
  mainGoal: 'Reduce electricity bill',
  budget: '₹1–₹3 lakh',
  city: 'Bengaluru',
  state: 'Karnataka',
  country: 'India',
};

export const DEFAULT_UPLOAD_METADATA: SpaceUploadMetadata = {
  approximateArea: '550 sq. ft.',
  orientation: 'South / South-West facing',
  obstacles: 'Corner overhead water tank (2000L) and partial afternoon tree shadow on East edge',
  notes: 'Flat reinforced concrete (RCC) terrace with 3.5 ft parapet wall and clear southern sky exposure.',
  imagePreviewUrl: '',
  sampleName: 'Residential RCC Terrace (Sample)',
};

export const DEFAULT_MAINTENANCE_PLANS: MaintenanceSchedule[] = [
  {
    technology: 'SOLAR PANELS (PV ARRAY)',
    cadences: [
      {
        period: 'Daily',
        tasks: [
          'System monitoring via inverter mobile app for normal generation curve',
          'Check for any inverter fault alerts or grid-tie trip notifications',
        ],
      },
      {
        period: 'Monthly',
        tasks: [
          'Check generation performance against expected seasonal kWh targets',
          'Check for visible dirt, bird droppings, fallen leaves, or new shade obstructions',
          'Rinse modules with low-pressure clean water during early morning or evening hours',
        ],
      },
      {
        period: 'Every 3–6 Months',
        tasks: [
          'Inspect panels for stubborn dust buildup, micro-cracks, or frame discoloration',
          'Check visible DC/AC conduits, MC4 connectors, and junction boxes for weather wear',
          'Verify rooftop water drainage paths beneath mounting rails are unobstructed',
        ],
      },
      {
        period: 'Yearly',
        tasks: [
          'Professional electrical & structural inspection recommended',
          'Check mounting structure bolt torque, earthing pit resistance, and surge arrestors',
          'Thermal hotspot scan and inverter firmware verification by a certified technician',
        ],
      },
    ],
    proTip:
      'Never clean hot solar glass under midday sun with cold water, as thermal shock can cause micro-cracks. Always clean before 8:00 AM or after 6:00 PM.',
  },
  {
    technology: 'SMALL WIND TURBINE',
    cadences: [
      {
        period: 'Regular / Weekly',
        tasks: [
          'Monitor vibration or unusual acoustic noise during moderate wind gusts',
          'Inspect visible rotor blades and tail vane for smooth rotation',
        ],
      },
      {
        period: 'Monthly',
        tasks: [
          'Visual check of guy wires, mast plumbness, and parapet anchor brackets',
          'Review wind charge controller voltage and braking switch status',
        ],
      },
      {
        period: 'Every 3–6 Months',
        tasks: [
          'Inspect rotor blades for leading-edge surface erosion, nicks, or imbalance',
          'Check mast base fasteners, vibration isolation pads, and slip-ring wiring',
        ],
      },
      {
        period: 'Yearly',
        tasks: [
          'Professional mechanical & bearing lubrication inspection recommended',
          'Full structural load check of roof mounting pier and emergency furl/brake test',
        ],
      },
    ],
    proTip:
      'Engage the manual turbine brake before forecasted severe cyclonic storms or when performing rooftop maintenance near the rotor sweep zone.',
  },
  {
    technology: 'BATTERY ENERGY STORAGE (LFP)',
    cadences: [
      {
        period: 'Daily',
        tasks: [
          'Verify State of Charge (SoC) cycling between 20% and 95% via BMS dashboard',
        ],
      },
      {
        period: 'Monthly',
        tasks: [
          'Ensure battery enclosure ventilation louvers are free of dust and moisture',
          'Check ambient room temperature stays within recommended 15°C–32°C range',
        ],
      },
      {
        period: 'Every 3–6 Months',
        tasks: [
          'Inspect battery terminals, DC breaker enclosure, and cable glands for corrosion',
          'Run a brief backup switchover test to confirm seamless islanding on grid outage',
        ],
      },
      {
        period: 'Yearly',
        tasks: [
          'Professional State of Health (SoH) capacity audit and BMS log diagnostic',
        ],
      },
    ],
    proTip:
      'Install Lithium Iron Phosphate (LFP) batteries in a shaded, well-ventilated utility alcove—never in direct afternoon sunlight on an exposed terrace.',
  },
  {
    technology: 'SOLAR WATER HEATING (ETC / FPC)',
    cadences: [
      {
        period: 'Monthly',
        tasks: [
          'Wipe evacuated glass tubes or flat collector glazing to maintain thermal absorption',
          'Inspect cold-water inlet float valve and air-vent pipe for drips',
        ],
      },
      {
        period: 'Every 3–6 Months',
        tasks: [
          'Flush storage tank sediment drain valve for 2 minutes to remove mineral scale',
          'Check insulated hot-water piping cladding for UV cracking or bird damage',
        ],
      },
      {
        period: 'Yearly',
        tasks: [
          'Inspect sacrificial magnesium anode rod and replace if depleted (especially in hard-water areas)',
          'Verify silicone sealing rings around collector manifold for watertightness',
        ],
      },
    ],
    proTip:
      'In hard-water regions (>250 ppm TDS), adding an inline scale-inhibitor cartridge before the solar tank inlet extends manifold life by 2x.',
  },
];

export function buildCompleteAnalysis(
  questionnaire: QuestionnaireAnswers,
  uploadMetadata: SpaceUploadMetadata,
  aiPartial?: any
): AIAnalysisResult {
  // Determine scale multiplier from monthly usage & budget
  let baseKw = 4;
  if (questionnaire.monthlyUsage.includes('Less than 100')) baseKw = 2;
  else if (questionnaire.monthlyUsage.includes('100–250')) baseKw = 3;
  else if (questionnaire.monthlyUsage.includes('250–500')) baseKw = 4;
  else if (questionnaire.monthlyUsage.includes('500–1000')) baseKw = 7;
  else if (questionnaire.monthlyUsage.includes('More than 1000')) baseKw = 10;

  const annualKwh = baseKw * 1450; // ~1,450 kWh per kWp in Indian sunbelt
  const monthlyAvgKwh = Math.round(annualKwh / 12);
  const dailyAvgKwh = Number((annualKwh / 365).toFixed(1));

  const monthlyCurve: MonthlyGenerationPoint[] = [
    { month: 'Jan', solarKwh: Math.round(baseKw * 125), windKwh: Math.round(baseKw * 15), totalKwh: Math.round(baseKw * 140) },
    { month: 'Feb', solarKwh: Math.round(baseKw * 132), windKwh: Math.round(baseKw * 16), totalKwh: Math.round(baseKw * 148) },
    { month: 'Mar', solarKwh: Math.round(baseKw * 152), windKwh: Math.round(baseKw * 18), totalKwh: Math.round(baseKw * 170) },
    { month: 'Apr', solarKwh: Math.round(baseKw * 155), windKwh: Math.round(baseKw * 20), totalKwh: Math.round(baseKw * 175) },
    { month: 'May', solarKwh: Math.round(baseKw * 148), windKwh: Math.round(baseKw * 28), totalKwh: Math.round(baseKw * 176) },
    { month: 'Jun', solarKwh: Math.round(baseKw * 105), windKwh: Math.round(baseKw * 36), totalKwh: Math.round(baseKw * 141) },
    { month: 'Jul', solarKwh: Math.round(baseKw * 92), windKwh: Math.round(baseKw * 38), totalKwh: Math.round(baseKw * 130) },
    { month: 'Aug', solarKwh: Math.round(baseKw * 98), windKwh: Math.round(baseKw * 34), totalKwh: Math.round(baseKw * 132) },
    { month: 'Sep', solarKwh: Math.round(baseKw * 115), windKwh: Math.round(baseKw * 24), totalKwh: Math.round(baseKw * 139) },
    { month: 'Oct', solarKwh: Math.round(baseKw * 124), windKwh: Math.round(baseKw * 16), totalKwh: Math.round(baseKw * 140) },
    { month: 'Nov', solarKwh: Math.round(baseKw * 118), windKwh: Math.round(baseKw * 14), totalKwh: Math.round(baseKw * 132) },
    { month: 'Dec', solarKwh: Math.round(baseKw * 120), windKwh: Math.round(baseKw * 14), totalKwh: Math.round(baseKw * 134) },
  ];

  const baseCostInr = baseKw * 58000;
  const subsidyInr = Math.min(78000, baseKw >= 3 ? 78000 : baseKw * 30000);
  const netCostInr = Math.max(60000, baseCostInr - subsidyInr);
  const annualSavingsInr = Math.round(annualKwh * 7.8);

  const energyMixComparison: MixComparisonItem[] = [
    {
      mixName: 'Solar Only',
      annualGenerationKwh: annualKwh,
      estimatedCostInr: baseCostInr,
      costRangeLabel: `₹${(baseCostInr / 100000).toFixed(2)}L – ₹${((baseCostInr * 1.18) / 100000).toFixed(2)}L`,
      annualSavingsInr: annualSavingsInr,
      spaceRequiredSqFt: `${baseKw * 85}–${baseKw * 100} sq. ft.`,
      maintenanceComplexity: 'Low',
      reliabilityScore: 88,
      co2AvoidedKgPerYear: Math.round(annualKwh * 0.82),
      suitabilityScore: 92,
    },
    {
      mixName: 'Solar + Battery',
      annualGenerationKwh: annualKwh,
      estimatedCostInr: Math.round(baseCostInr * 1.48),
      costRangeLabel: `₹${((baseCostInr * 1.4) / 100000).toFixed(2)}L – ₹${((baseCostInr * 1.65) / 100000).toFixed(2)}L`,
      annualSavingsInr: Math.round(annualSavingsInr * 1.08),
      spaceRequiredSqFt: `${baseKw * 85 + 20} sq. ft.`,
      maintenanceComplexity: 'Low',
      reliabilityScore: 96,
      co2AvoidedKgPerYear: Math.round(annualKwh * 0.85),
      suitabilityScore: 84,
    },
    {
      mixName: 'Solar + Wind',
      annualGenerationKwh: Math.round(annualKwh * 1.16),
      estimatedCostInr: Math.round(baseCostInr * 1.38),
      costRangeLabel: `₹${((baseCostInr * 1.3) / 100000).toFixed(2)}L – ₹${((baseCostInr * 1.55) / 100000).toFixed(2)}L`,
      annualSavingsInr: Math.round(annualSavingsInr * 1.14),
      spaceRequiredSqFt: `${baseKw * 90 + 45} sq. ft.`,
      maintenanceComplexity: 'Moderate',
      reliabilityScore: 91,
      co2AvoidedKgPerYear: Math.round(annualKwh * 0.94),
      suitabilityScore: 76,
    },
    {
      mixName: 'Solar + Wind + Battery',
      annualGenerationKwh: Math.round(annualKwh * 1.16),
      estimatedCostInr: Math.round(baseCostInr * 1.85),
      costRangeLabel: `₹${((baseCostInr * 1.75) / 100000).toFixed(2)}L – ₹${((baseCostInr * 2.05) / 100000).toFixed(2)}L`,
      annualSavingsInr: Math.round(annualSavingsInr * 1.18),
      spaceRequiredSqFt: `${baseKw * 90 + 65} sq. ft.`,
      maintenanceComplexity: 'Moderate-High',
      reliabilityScore: 98,
      co2AvoidedKgPerYear: Math.round(annualKwh * 0.96),
      suitabilityScore: 71,
    },
    {
      mixName: 'Wind Only',
      annualGenerationKwh: Math.round(annualKwh * 0.45),
      estimatedCostInr: Math.round(baseCostInr * 1.25),
      costRangeLabel: `₹${((baseCostInr * 1.15) / 100000).toFixed(2)}L – ₹${((baseCostInr * 1.4) / 100000).toFixed(2)}L`,
      annualSavingsInr: Math.round(annualSavingsInr * 0.45),
      spaceRequiredSqFt: '120–180 sq. ft. (clear wind corridor)',
      maintenanceComplexity: 'Moderate-High',
      reliabilityScore: 54,
      co2AvoidedKgPerYear: Math.round(annualKwh * 0.37),
      suitabilityScore: 48,
    },
  ];

  const yearlyCumulativeSavings = Array.from({ length: 10 }, (_, idx) => {
    const yr = idx + 1;
    // Assume 3% annual tariff escalation
    const cumulative = Math.round(
      Array.from({ length: yr }, (__, j) => annualSavingsInr * Math.pow(1.03, j)).reduce((a, b) => a + b, 0)
    );
    return {
      year: `Yr ${yr}`,
      cumulativeSavingsInr: cumulative,
      netSystemCostInr: netCostInr,
    };
  });

  const fallbackPrimary = {
    id: 'solar_pv' as const,
    name: 'Rooftop Solar PV System',
    suitabilityScore: 92,
    tagline: 'Highest ROI & direct solar irradiance match for your space',
    estimatedSystemSize: `${baseKw}–${baseKw + 1} kW`,
    estimatedAnnualGeneration: `${(annualKwh - 400).toLocaleString()}–${(annualKwh + 800).toLocaleString()} kWh/year`,
    estimatedMonthlySavings: `₹${Math.round((annualSavingsInr / 12) * 0.9).toLocaleString()}–₹${Math.round((annualSavingsInr / 12) * 1.15).toLocaleString()}/month`,
    estimatedCostRange: `₹${(baseCostInr / 100000).toFixed(2)}L–₹${((baseCostInr * 1.2) / 100000).toFixed(2)}L (Before Subsidy)`,
    estimatedPaybackYears: '3.5–4.5 years',
    requiredSpaceSqFt: `${baseKw * 85}–${baseKw * 100} sq. ft.`,
    whySuitable: `Your ${questionnaire.propertyType.toLowerCase()} in ${questionnaire.city || 'your region'} offers an unshaded central ${questionnaire.installLocation.toLowerCase()} zone with strong year-round solar irradiance (~5.2 peak sun hours/day).`,
  };

  const fallbackAlternatives = [
    fallbackPrimary,
    {
      id: 'battery_storage' as const,
      name: 'Battery Energy Storage (LFP)',
      suitabilityScore: 81,
      tagline: 'Evening peak load shifting & seamless outage backup',
      estimatedSystemSize: '5–10 kWh LFP Bank',
      estimatedAnnualGeneration: 'Stores 1,800–3,200 kWh/year shifted load',
      estimatedMonthlySavings: '₹900–₹1,800/month (Time-of-Day + backup value)',
      estimatedCostRange: '₹85,000–₹1.6L',
      estimatedPaybackYears: '5.5–7.0 years',
      requiredSpaceSqFt: '15–25 sq. ft. (shaded wall/utility mount)',
      whySuitable: 'Highly recommended alongside Solar PV if grid outage resilience or evening peak self-consumption is a priority.',
    },
    {
      id: 'hybrid' as const,
      name: 'Solar + Micro-Wind Hybrid',
      suitabilityScore: 76,
      tagline: 'Complementary monsoon & evening breeze generation',
      estimatedSystemSize: `${baseKw - 1} kW Solar + 1 kW Vertical Wind`,
      estimatedAnnualGeneration: `${Math.round(annualKwh * 1.1).toLocaleString()}–${Math.round(annualKwh * 1.22).toLocaleString()} kWh/year`,
      estimatedMonthlySavings: `₹${Math.round((annualSavingsInr / 12) * 1.05).toLocaleString()}–₹${Math.round((annualSavingsInr / 12) * 1.22).toLocaleString()}/month`,
      estimatedCostRange: `₹${((baseCostInr * 1.3) / 100000).toFixed(2)}L–₹${((baseCostInr * 1.55) / 100000).toFixed(2)}L`,
      estimatedPaybackYears: '4.8–6.2 years',
      requiredSpaceSqFt: `${baseKw * 80 + 45} sq. ft.`,
      whySuitable: 'Balances dip in solar production during cloudy monsoon months with elevated parapet wind harvesting.',
    },
    {
      id: 'solar_water_heating' as const,
      name: 'Solar Water Heating (ETC)',
      suitabilityScore: 72,
      tagline: 'High thermal efficiency for domestic hot water demand',
      estimatedSystemSize: '200–300 LPD Evacuated Tube Collector',
      estimatedAnnualGeneration: 'Saves ~1,400–2,100 kWh thermal equivalent/year',
      estimatedMonthlySavings: '₹850–₹1,400/month',
      estimatedCostRange: '₹32,000–₹54,000',
      estimatedPaybackYears: '2.5–3.5 years',
      requiredSpaceSqFt: '35–50 sq. ft. near overhead water tank',
      whySuitable: 'Compact footprint near existing plumbing risers rapidly eliminates electric geyser consumption.',
    },
    {
      id: 'small_wind' as const,
      name: 'Small-Scale Wind Turbine',
      suitabilityScore: 48,
      tagline: 'Supplemental generation for high-exposure perimeter corners',
      estimatedSystemSize: '1–2 kW Low-Noise VAWT',
      estimatedAnnualGeneration: '1,600–2,800 kWh/year',
      estimatedMonthlySavings: '₹1,100–₹1,900/month',
      estimatedCostRange: '₹1.1L–₹1.9L',
      estimatedPaybackYears: '6.5–8.5 years',
      requiredSpaceSqFt: '60–100 sq. ft. + turbulence clearance',
      whySuitable: 'Urban rooftop turbulence and surrounding structures limit standalone wind output compared to Solar PV.',
    },
  ];

  const fallbackZones = [
    {
      id: 'zone-1',
      label: 'Primary Solar Array Zone A',
      category: 'Panel placement zone' as const,
      suitabilityLevel: 'GREEN' as const,
      suitabilityLabel: 'Highly suitable' as const,
      description: 'Unobstructed central concrete terrace area with full southern solar exposure between 8:30 AM and 4:30 PM.',
      estimatedAreaSqFt: '~320 sq. ft. (Estimate)',
      box: { x: 18, y: 46, width: 52, height: 42 },
    },
    {
      id: 'zone-2',
      label: 'Overhead Water Tank & Riser',
      category: 'Water tank' as const,
      suitabilityLevel: 'RED' as const,
      suitabilityLabel: 'Obstacle / unsuitable area' as const,
      description: 'Existing 2000L water storage tank and elevated concrete pedestal. Maintain 1.2m northern shadow buffer.',
      estimatedAreaSqFt: '~55 sq. ft. (Obstacle)',
      box: { x: 12, y: 27, width: 20, height: 31 },
    },
    {
      id: 'zone-3',
      label: 'Eastern Tree Canopy Shadow Zone',
      category: 'Tree / shading' as const,
      suitabilityLevel: 'RED' as const,
      suitabilityLabel: 'Obstacle / unsuitable area' as const,
      description: 'Adjacent tree foliage casting dappled shading along the eastern edge. Avoid string-inverter PV placement here.',
      estimatedAreaSqFt: '~95 sq. ft. (Shaded)',
      box: { x: 60, y: 58, width: 32, height: 35 },
    },
    {
      id: 'zone-4',
      label: 'Northwest Parapet Wind / SWH Zone',
      category: 'Turbine placement zone' as const,
      suitabilityLevel: 'YELLOW' as const,
      suitabilityLabel: 'Potentially suitable' as const,
      description: 'Secondary perimeter zone suitable for Solar Water Heater manifold or vertical-axis micro-wind mast after structural check.',
      estimatedAreaSqFt: '~85 sq. ft. (Estimate)',
      box: { x: 35, y: 36, width: 28, height: 14 },
    },
  ];

  return {
    summaryHeadline:
      aiPartial?.summaryHeadline ||
      `High Solar PV Suitability (92%) Detected for Your ${questionnaire.propertyType} in ${questionnaire.city || 'Your Area'}`,
    confidenceLevel: aiPartial?.confidenceLevel || 'High (Preliminary Visual & Contextual)',
    detectedUsableAreas:
      aiPartial?.detectedUsableAreas?.length > 0
        ? aiPartial.detectedUsableAreas
        : [
            'Central unshaded flat concrete terrace deck (~320 sq. ft. estimated)',
            'Northwest perimeter zone adjacent to parapet wall (~85 sq. ft. estimated)',
            'Utility wall alcove near staircase bulkhead for inverter & battery mounting',
          ],
    possibleObstructions:
      aiPartial?.possibleObstructions?.length > 0
        ? aiPartial.possibleObstructions
        : [
            'Overhead 2000L polymer water tank on NW pedestal casting localized morning shadow',
            'Adjacent deciduous tree canopy on Eastern edge causing partial afternoon shading',
            '3.5 ft perimeter parapet wall requiring elevated module mounting frames (>0.6m base height)',
          ],
    estimatedTotalUsableArea: aiPartial?.estimatedTotalUsableArea || `${baseKw * 95}–${baseKw * 115} sq. ft. (Preliminary Visual Estimate)`,
    estimatedSuitabilitySummary:
      aiPartial?.estimatedSuitabilitySummary ||
      'Strong candidate for a rooftop grid-tied Solar PV system with optional LFP battery backup. Central terrace area shows minimal structural clutter and favorable solar orientation.',
    recommendedPrimaryTechnology: aiPartial?.recommendedPrimaryTechnology || fallbackPrimary,
    alternativeOptions:
      aiPartial?.alternativeOptions?.length >= 4 ? aiPartial.alternativeOptions : fallbackAlternatives,
    detectedZones:
      aiPartial?.detectedZones?.length >= 3 ? aiPartial.detectedZones : fallbackZones,
    whyRecommendedFactors: aiPartial?.whyRecommendedFactors || {
      solarPotential: `High regional solar insolation (~5.1–5.5 kWh/m²/day in ${questionnaire.city || 'your region'}) with clear central sky dome.`,
      energyDemand: `Matches your reported usage (${questionnaire.monthlyUsage}) and monthly bill (${questionnaire.monthlyBill}) with ~85–95% bill offset.`,
      budgetFit: `Aligned with your selected budget range (${questionnaire.budget}) while qualifying for residential rooftop solar subsidies.`,
      propertyTypeFit: `${questionnaire.propertyType} ownership provides direct rooftop access rights and dedicated net-metering eligibility.`,
      availableSpaceFit: `${uploadMetadata.approximateArea || questionnaire.availableSpace} easily accommodates ${baseKw}–${baseKw + 1} kW high-efficiency mono-PERC / TOPCon modules.`,
      obstructionsImpact: `Identified water tank and eastern foliage shadows can be bypassed by concentrating PV strings in Zone A and using micro-inverters or half-cut cells.`,
      locationClimate: `${questionnaire.city}, ${questionnaire.state} experiences 280+ sunny days annually; moderate urban wind speeds favor Solar PV over standalone wind.`,
      narrativeExplanation: `Your property appears to have a generous, unobstructed central ${questionnaire.installLocation.toLowerCase()} area and moderate-to-high daytime/evening electricity consumption (${questionnaire.monthlyUsage}). Rooftop Solar PV is therefore the strongest primary investment—delivering the fastest payback (3.5–4.5 years) and lowest maintenance complexity. Adding a 5 kWh LFP battery or a 200 LPD Solar Water Heater is an effective secondary upgrade if outage backup or hot-water savings are important.`,
    },
    energyMixComparison,
    simulatedGeneration: {
      dailyAvgKwh,
      monthlyAvgKwh,
      annualTotalKwh: annualKwh,
      co2AvoidedTonnesPerYear: Number(((annualKwh * 0.82) / 1000).toFixed(1)),
      billReductionPercent: 88,
      monthlyCurve,
    },
    financialOutlook: {
      estimatedInstallationCostRange: `₹${(baseCostInr / 100000).toFixed(2)} Lakh – ₹${((baseCostInr * 1.18) / 100000).toFixed(2)} Lakh`,
      estimatedSubsidyOrIncentive: `Up to ₹${subsidyInr.toLocaleString()} (Estimated PM Surya Ghar / State Rooftop Incentive)`,
      estimatedNetCostRange: `₹${(netCostInr / 100000).toFixed(2)} Lakh – ₹${((netCostInr + 35000) / 100000).toFixed(2)} Lakh`,
      estimatedAnnualSavingsRange: `₹${Math.round(annualSavingsInr * 0.92).toLocaleString()} – ₹${Math.round(annualSavingsInr * 1.12).toLocaleString()} / year`,
      estimatedPaybackPeriod: '3.5 – 4.5 Years (Estimated)',
      estimated10YearSavings: `₹${yearlyCumulativeSavings[9].cumulativeSavingsInr.toLocaleString()}+ (Estimated over 10 yrs)`,
      yearlyCumulativeSavings,
    },
    assumptions:
      aiPartial?.assumptions?.length > 0
        ? aiPartial.assumptions
        : [
            'Assumes 550Wp bi-facial / TOPCon monocrystalline solar modules at ~21.5% conversion efficiency.',
            `Assumes average solar irradiance of 4.8–5.3 kWh/m²/day for ${questionnaire.city || 'the selected location'} with 14% system derating (temperature, wiring, inverter losses).`,
            'Assumes average residential grid electricity tariff of ₹7.50–₹8.20/kWh with 3% annual tariff escalation.',
            'Assumes standard reinforced concrete (RCC) load-bearing capacity of at least 18 kg/m² for non-penetrating ballasted or anchored mounting.',
          ],
    limitations:
      aiPartial?.limitations?.length > 0
        ? aiPartial.limitations
        : [
            'Single 2D image analysis cannot certify structural slab load capacity, concealed waterproofing condition, or exact compass azimuth.',
            'Local micro-climate wind turbulence around urban buildings cannot be measured from photography; wind suitability requires a 30-day anemometer study.',
            'Electrical distribution board capacity, earthing integrity, and local DISCOM transformer hosting limits require physical verification.',
          ],
    maintenancePlans: DEFAULT_MAINTENANCE_PLANS,
  };
}
