export interface User {
  id: string;
  name: string;
  email: string;
  isDemo?: boolean;
}

export interface QuestionnaireAnswers {
  propertyType: string;
  installLocation: string;
  monthlyUsage: string;
  monthlyBill: string;
  availableSpace: string;
  mainGoal: string;
  budget: string;
  city: string;
  state: string;
  country: string;
}

export interface SpaceUploadMetadata {
  approximateArea: string;
  orientation: string;
  obstacles: string;
  notes: string;
  imagePreviewUrl: string;
  sampleName?: string;
}

export interface DetectedZone {
  id: string;
  label: string;
  category: 'Roof/terrace area' | 'Open area' | 'Panel placement zone' | 'Turbine placement zone' | 'Tree / shading' | 'Water tank' | 'Existing structure / obstacle';
  suitabilityLevel: 'GREEN' | 'YELLOW' | 'RED';
  suitabilityLabel: 'Highly suitable' | 'Potentially suitable' | 'Obstacle / unsuitable area';
  description: string;
  estimatedAreaSqFt: string;
  // Normalized percentage coordinates (0-100) for rendering overlays on the uploaded photo
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface TechnologyOption {
  id: 'solar_pv' | 'small_wind' | 'hybrid' | 'battery_storage' | 'solar_water_heating';
  name: string;
  suitabilityScore: number; // 0 - 100
  tagline: string;
  estimatedSystemSize: string;
  estimatedAnnualGeneration: string;
  estimatedMonthlySavings: string;
  estimatedCostRange: string;
  estimatedPaybackYears: string;
  requiredSpaceSqFt: string;
  whySuitable: string;
}

export interface MixComparisonItem {
  mixName: 'Solar Only' | 'Wind Only' | 'Solar + Wind' | 'Solar + Battery' | 'Solar + Wind + Battery';
  annualGenerationKwh: number;
  estimatedCostInr: number;
  costRangeLabel: string;
  annualSavingsInr: number;
  spaceRequiredSqFt: string;
  maintenanceComplexity: 'Low' | 'Moderate' | 'Moderate-High';
  reliabilityScore: number; // 0-100
  co2AvoidedKgPerYear: number;
  suitabilityScore: number; // 0-100
}

export interface MonthlyGenerationPoint {
  month: string;
  solarKwh: number;
  windKwh: number;
  totalKwh: number;
}

export interface MaintenanceSchedule {
  technology: string;
  cadences: {
    period: string;
    tasks: string[];
  }[];
  proTip: string;
}

export interface AIAnalysisResult {
  summaryHeadline: string;
  confidenceLevel: 'High (Preliminary Visual & Contextual)' | 'Moderate (Visual Estimate)' | 'Preliminary';
  detectedUsableAreas: string[];
  possibleObstructions: string[];
  estimatedTotalUsableArea: string;
  estimatedSuitabilitySummary: string;
  recommendedPrimaryTechnology: TechnologyOption;
  alternativeOptions: TechnologyOption[];
  detectedZones: DetectedZone[];
  whyRecommendedFactors: {
    solarPotential: string;
    energyDemand: string;
    budgetFit: string;
    propertyTypeFit: string;
    availableSpaceFit: string;
    obstructionsImpact: string;
    locationClimate: string;
    narrativeExplanation: string;
  };
  energyMixComparison: MixComparisonItem[];
  simulatedGeneration: {
    dailyAvgKwh: number;
    monthlyAvgKwh: number;
    annualTotalKwh: number;
    co2AvoidedTonnesPerYear: number;
    billReductionPercent: number;
    monthlyCurve: MonthlyGenerationPoint[];
  };
  financialOutlook: {
    estimatedInstallationCostRange: string;
    estimatedSubsidyOrIncentive: string;
    estimatedNetCostRange: string;
    estimatedAnnualSavingsRange: string;
    estimatedPaybackPeriod: string;
    estimated10YearSavings: string;
    yearlyCumulativeSavings: { year: string; cumulativeSavingsInr: number; netSystemCostInr: number }[];
  };
  assumptions: string[];
  limitations: string[];
  maintenancePlans: MaintenanceSchedule[];
}
