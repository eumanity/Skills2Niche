
import { GoogleGenAI, Type } from "@google/genai";
import { SkillProfile, Niche, Idea } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ideaSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'Catchy service/offer title' },
      problemStatement: { type: Type.STRING, description: 'Detailed pain point description' },
      outcome: { type: Type.STRING, description: 'Quantifiable benefit to the client' },
      monetizationModel: { type: Type.STRING, description: 'Retainer, one-time, or usage-based' },
      targetClient: { type: Type.STRING, description: 'Specific ICP definition' },
      icpDescriptions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: '3-5 Ideal Client Profile descriptions'
      },
      outreachAngles: {
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: '3-5 Hook sentences for cold outreach'
      },
    },
    required: ['title', 'problemStatement', 'outcome', 'monetizationModel', 'targetClient', 'icpDescriptions', 'outreachAngles'],
  }
};

const blueprintSchema = {
  type: Type.OBJECT,
  properties: {
    goal: { type: Type.STRING },
    inputs: { type: Type.ARRAY, items: { type: Type.STRING } },
    outputs: { type: Type.ARRAY, items: { type: Type.STRING } },
    trigger: { type: Type.STRING, description: 'The n8n trigger node and event' },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    errorHandling: { type: Type.STRING }
  },
  required: ['goal', 'inputs', 'outputs', 'trigger', 'steps', 'errorHandling']
};

export async function generateIdeasForNiches(profile: SkillProfile, niches: Niche[]): Promise<Idea[]> {
  const prompt = `
    Act as a World-Class Business Automation Consultant.
    User Skills: ${profile.skills.join(', ')}
    Tools: ${profile.tools.join(', ')}
    Level: ${profile.experience}
    Target Niches: ${niches.map(n => `${n.name} (${n.description})`).join('; ')}

    For each niche, generate 3-5 concrete business problems that can be solved with automation. 
    Focus on repeatable workflows that add massive value.
    Ensure ideas are high-value and monetizable.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ideaSchema,
    }
  });

  const rawIdeas = JSON.parse(response.text || '[]');
  let results: Idea[] = [];
  let nicheIdx = 0;
  rawIdeas.forEach((idea: any, idx: number) => {
    const nicheId = niches[nicheIdx % niches.length].id;
    results.push({
      ...idea,
      id: Math.random().toString(36).substr(2, 9),
      nicheId
    });
    if ((idx + 1) % 4 === 0) nicheIdx++;
  });

  return results;
}

export async function generateBlueprint(idea: Idea, profile: SkillProfile): Promise<any> {
  const prompt = `
    Generate a detailed n8n-focused automation blueprint for the following idea:
    Idea Title: ${idea.title}
    Problem: ${idea.problemStatement}
    Tools available: ${profile.tools.join(', ')}
    
    Provide:
    1. A clear goal.
    2. Input/Output requirements.
    3. The trigger node.
    4. A step-by-step sequence of nodes including Logic (IF, Set, Code), App nodes (Gmail, Google Sheets, etc.), and Data transformation.
    5. Error handling recommendations.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: blueprintSchema,
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateN8NJson(idea: Idea): Promise<string> {
  const prompt = `
    Generate a valid-looking n8n workflow JSON structure for this automation idea:
    Title: ${idea.title}
    Goal: ${idea.outcome}
    
    The JSON should follow the n8n version 1 format:
    {
      "nodes": [...],
      "connections": {...}
    }
    Ensure it includes a trigger node and at least 3 processing/app nodes. Return ONLY the raw JSON string.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text.trim();
}
