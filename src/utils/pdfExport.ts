import { jsPDF } from 'jspdf';
import { AIAnalysisResult, QuestionnaireAnswers, SpaceUploadMetadata, User } from '../types/energy';

export function exportEnergyPlanToPdf(
  user: User | null,
  questionnaire: QuestionnaireAnswers,
  uploadMetadata: SpaceUploadMetadata,
  analysis: AIAnalysisResult
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  const addLine = (text: string, fontSize = 10, isBold = false, color: [number, number, number] = [15, 23, 42]) => {
    if (y > 272) {
      doc.addPage();
      y = 18;
    }
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, pageWidth - 32);
    doc.text(lines, 16, y);
    y += lines.length * (fontSize * 0.45) + 3;
  };

  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 8, 'F');

  addLine('GreenSpace AI — Preliminary Renewable Energy Assessment', 16, true, [6, 95, 70]);
  addLine(
    `Prepared for: ${user?.name || 'Property Owner'} | Location: ${questionnaire.city}, ${questionnaire.state}, ${questionnaire.country}`,
    10,
    false,
    [71, 85, 105]
  );
  y += 2;

  // Disclaimer Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y - 2, pageWidth - 28, 16, 'FD');
  y += 3;
  addLine(
    'IMPORTANT DISCLAIMER: GreenSpace AI provides preliminary AI-based planning estimates. Final installation decisions require an on-site assessment by qualified renewable-energy, electrical, and structural professionals.',
    8.5,
    true,
    [100, 116, 139]
  );
  y += 4;

  // Section 1: Property & Energy Profile
  addLine('1. Property & Energy Usage Profile', 12, true, [15, 23, 42]);
  addLine(
    `• Property Type: ${questionnaire.propertyType}   |   Target Area: ${questionnaire.installLocation}`,
    9.5
  );
  addLine(
    `• Monthly Consumption: ${questionnaire.monthlyUsage}   |   Monthly Bill: ${questionnaire.monthlyBill}`,
    9.5
  );
  addLine(
    `• Available Space: ${uploadMetadata.approximateArea || questionnaire.availableSpace}   |   Orientation: ${uploadMetadata.orientation || 'Not specified'}`,
    9.5
  );
  addLine(`• Primary Goal: ${questionnaire.mainGoal}   |   Budget Range: ${questionnaire.budget}`, 9.5);
  y += 3;

  // Section 2: Primary Recommendation
  const rec = analysis.recommendedPrimaryTechnology;
  addLine('2. Primary Recommended System (Preliminary Estimate)', 12, true, [6, 95, 70]);
  addLine(`${rec.name} — Suitability Score: ${rec.suitabilityScore}%`, 11, true);
  addLine(`• Estimated System Size: ${rec.estimatedSystemSize}`, 9.5);
  addLine(`• Estimated Annual Generation: ${rec.estimatedAnnualGeneration}`, 9.5);
  addLine(`• Estimated Monthly Savings: ${rec.estimatedMonthlySavings}`, 9.5);
  addLine(`• Estimated Installation Cost: ${rec.estimatedCostRange}`, 9.5);
  addLine(`• Estimated Payback Period: ${rec.estimatedPaybackYears}`, 9.5);
  addLine(`• Estimated Space Required: ${rec.requiredSpaceSqFt}`, 9.5);
  addLine(`Why Recommended: ${analysis.whyRecommendedFactors.narrativeExplanation}`, 9.5);
  y += 3;

  // Section 3: AI Space Analysis & Zones
  addLine('3. AI Space Analysis & Detected Zones (Visual Estimates)', 12, true, [15, 23, 42]);
  addLine(`Estimated Usable Area: ${analysis.estimatedTotalUsableArea}`, 9.5, true);
  analysis.detectedZones.forEach((zone) => {
    addLine(
      `• [${zone.suitabilityLevel} - ${zone.suitabilityLabel}] ${zone.label} (${zone.estimatedAreaSqFt}): ${zone.description}`,
      9
    );
  });
  y += 3;

  // Section 4: Financial Outlook
  addLine('4. Financial & Environmental Outlook (Estimates)', 12, true, [15, 23, 42]);
  addLine(`• Gross Installation Cost (Est.): ${analysis.financialOutlook.estimatedInstallationCostRange}`, 9.5);
  addLine(`• Potential Subsidy / Incentive: ${analysis.financialOutlook.estimatedSubsidyOrIncentive}`, 9.5);
  addLine(`• Net Cost After Subsidy (Est.): ${analysis.financialOutlook.estimatedNetCostRange}`, 9.5);
  addLine(`• Estimated 10-Year Cumulative Savings: ${analysis.financialOutlook.estimated10YearSavings}`, 9.5);
  addLine(
    `• Estimated Carbon Offset: ${analysis.simulatedGeneration.co2AvoidedTonnesPerYear} Tonnes CO2 avoided/year`,
    9.5
  );
  addLine(
    'Note: Actual costs vary by equipment, installer, location, structural requirements, permits, taxes, and available incentives.',
    8.5,
    false,
    [100, 116, 139]
  );
  y += 3;

  // Section 5: Assumptions & Limitations
  addLine('5. Key Engineering Assumptions & Limitations', 12, true, [15, 23, 42]);
  analysis.assumptions.slice(0, 3).forEach((item) => addLine(`• Assumption: ${item}`, 8.5));
  analysis.limitations.slice(0, 3).forEach((item) => addLine(`• Limitation: ${item}`, 8.5));
  y += 3;

  // Section 6: Maintenance Summary
  addLine('6. Recommended Maintenance Schedule Summary', 12, true, [15, 23, 42]);
  analysis.maintenancePlans.slice(0, 2).forEach((plan) => {
    addLine(`${plan.technology}:`, 9.5, true);
    plan.cadences.forEach((c) => {
      addLine(`  - ${c.period}: ${c.tasks.join('; ')}`, 8.5);
    });
  });

  doc.save(`GreenSpace_AI_Energy_Plan_${(questionnaire.city || 'Property').replace(/\s+/g, '_')}.pdf`);
}
