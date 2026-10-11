import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Structured JSON Schema for Gemini 2.5 Flash Space Analysis & Energy Plan
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summaryHeadline: { type: Type.STRING },
    confidenceLevel: { type: Type.STRING },
    detectedUsableAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    possibleObstructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    estimatedTotalUsableArea: { type: Type.STRING },
    estimatedSuitabilitySummary: { type: Type.STRING },
    recommendedPrimaryTechnology: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        suitabilityScore: { type: Type.NUMBER },
        tagline: { type: Type.STRING },
        estimatedSystemSize: { type: Type.STRING },
        estimatedAnnualGeneration: { type: Type.STRING },
        estimatedMonthlySavings: { type: Type.STRING },
        estimatedCostRange: { type: Type.STRING },
        estimatedPaybackYears: { type: Type.STRING },
        requiredSpaceSqFt: { type: Type.STRING },
        whySuitable: { type: Type.STRING },
      },
      required: [
        'id',
        'name',
        'suitabilityScore',
        'tagline',
        'estimatedSystemSize',
        'estimatedAnnualGeneration',
        'estimatedMonthlySavings',
        'estimatedCostRange',
        'estimatedPaybackYears',
        'requiredSpaceSqFt',
        'whySuitable',
      ],
    },
    alternativeOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          suitabilityScore: { type: Type.NUMBER },
          tagline: { type: Type.STRING },
          estimatedSystemSize: { type: Type.STRING },
          estimatedAnnualGeneration: { type: Type.STRING },
          estimatedMonthlySavings: { type: Type.STRING },
          estimatedCostRange: { type: Type.STRING },
          estimatedPaybackYears: { type: Type.STRING },
          requiredSpaceSqFt: { type: Type.STRING },
          whySuitable: { type: Type.STRING },
        },
        required: [
          'id',
          'name',
          'suitabilityScore',
          'tagline',
          'estimatedSystemSize',
          'estimatedAnnualGeneration',
          'estimatedMonthlySavings',
          'estimatedCostRange',
          'estimatedPaybackYears',
          'requiredSpaceSqFt',
          'whySuitable',
        ],
      },
    },
    detectedZones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          category: { type: Type.STRING },
          suitabilityLevel: { type: Type.STRING },
          suitabilityLabel: { type: Type.STRING },
          description: { type: Type.STRING },
          estimatedAreaSqFt: { type: Type.STRING },
          box: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
            },
            required: ['x', 'y', 'width', 'height'],
          },
        },
        required: [
          'id',
          'label',
          'category',
          'suitabilityLevel',
          'suitabilityLabel',
          'description',
          'estimatedAreaSqFt',
          'box',
        ],
      },
    },
    whyRecommendedFactors: {
      type: Type.OBJECT,
      properties: {
        solarPotential: { type: Type.STRING },
        energyDemand: { type: Type.STRING },
        budgetFit: { type: Type.STRING },
        propertyTypeFit: { type: Type.STRING },
        availableSpaceFit: { type: Type.STRING },
        obstructionsImpact: { type: Type.STRING },
        locationClimate: { type: Type.STRING },
        narrativeExplanation: { type: Type.STRING },
      },
      required: [
        'solarPotential',
        'energyDemand',
        'budgetFit',
        'propertyTypeFit',
        'availableSpaceFit',
        'obstructionsImpact',
        'locationClimate',
        'narrativeExplanation',
      ],
    },
    assumptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    limitations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'summaryHeadline',
    'confidenceLevel',
    'detectedUsableAreas',
    'possibleObstructions',
    'estimatedTotalUsableArea',
    'estimatedSuitabilitySummary',
    'recommendedPrimaryTechnology',
    'alternativeOptions',
    'detectedZones',
    'whyRecommendedFactors',
    'assumptions',
    'limitations',
  ],
};

app.post('/api/analyze-space', async (req, res) => {
  try {
    const { questionnaire, uploadMetadata, imageBase64, mimeType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ fallback: true, reason: 'API key not configured' });
    }

    const prompt = `You are GreenSpace AI, an expert renewable energy planning assistant for homeowners and property owners.
Analyze the user's property questionnaire, spatial metadata, and uploaded property image to produce a preliminary AI-based renewable energy plan.

CRITICAL GUIDELINES:
1. Never present visual estimates as certified engineering measurements.
2. Explicitly label all area, generation, cost, and savings figures as preliminary estimates.
3. Return 4 to 5 visual detectedZones with normalized percentage bounding boxes (x, y, width, height from 0 to 100) representing key regions visible in the photo:
   - GREEN ("Highly suitable") for unshaded roof/terrace/ground zones suitable for Solar PV or Solar Water Heating
   - YELLOW ("Potentially suitable") for perimeter/corner zones or partially shaded areas (e.g. micro-wind turbine zone or secondary array)
   - RED ("Obstacle / unsuitable area") for water tanks, trees, shadows, parapet walls, or HVAC units.
4. Provide 5 technology options in alternativeOptions covering:
   - Solar PV ("solar_pv")
   - Small Wind ("small_wind")
   - Solar + Wind Hybrid ("hybrid")
   - Battery Storage ("battery_storage")
   - Solar Water Heating ("solar_water_heating")
5. Use Indian Rupees (₹) formatted clearly (e.g., "₹3,500–₹5,200/mo", "₹1.8L–₹2.6L") matching the user's questionnaire currency.

User Questionnaire Answers:
${JSON.stringify(questionnaire, null, 2)}

Uploaded Space Metadata:
${JSON.stringify(
  {
    approximateArea: uploadMetadata?.approximateArea,
    orientation: uploadMetadata?.orientation,
    obstacles: uploadMetadata?.obstacles,
    notes: uploadMetadata?.notes,
  },
  null,
  2
)}`;

    const parts: any[] = [{ text: prompt }];
    if (imageBase64 && mimeType && imageBase64.length > 50) {
      parts.unshift({
        inlineData: {
          data: imageBase64,
          mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(200).json({ fallback: true, reason: 'Empty model response' });
    }

    const parsed = JSON.parse(text);
    return res.json({ fallback: false, data: parsed });
  } catch (error: any) {
    console.error('Gemini /api/analyze-space error:', error?.message || error);
    return res.status(200).json({
      fallback: true,
      reason: error?.message || 'Model call failed, using calibrated engineering fallback',
    });
  }
});

app.post('/api/maintenance-advice', async (req, res) => {
  try {
    const { question, propertyContext, recommendedSystem } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        answer:
          'Preliminary Maintenance Guidance: For optimal solar and hybrid energy performance in your climate zone, inspect panels every 3–4 weeks during dry, dusty months and clean with soft de-ionized or low-mineral water early in the morning when glass is cool. Always keep tree branches trimmed to prevent hot-spot shading, and schedule an annual certified electrical inspection for inverters, earthing pits, and mounting torque.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the GreenSpace AI Maintenance Assistant for residential renewable energy systems.
Property Context: ${JSON.stringify(propertyContext || {})}
Recommended System: ${recommendedSystem || 'Solar PV + Battery Storage'}
User Question: ${question}

Provide a clear, practical, safety-first answer in 3-5 concise bullet points or 2 short paragraphs. Remind the user to turn off DC/AC isolators or consult a certified technician before touching electrical wiring or working at rooftop heights.`,
    });

    return res.json({
      answer: response.text || 'Inspect mounting structures and clean panel surfaces periodically while observing rooftop safety protocols.',
    });
  } catch (error: any) {
    console.error('Gemini /api/maintenance-advice error:', error?.message || error);
    return res.json({
      answer:
        'Preliminary Maintenance Guidance: Clean solar modules gently with water during cool morning hours, verify inverter status indicators weekly, check drainage around rooftop mounts before monsoon season, and have a licensed technician inspect wiring and surge protection annually.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GreenSpace AI server running on http://localhost:${PORT}`);
  });
}

startServer();
