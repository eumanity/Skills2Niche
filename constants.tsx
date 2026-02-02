
import { Niche, Template } from './types';

export const POPULAR_TOOLS = [
  'n8n', 'Zapier', 'Make', 'Airtable', 'Notion', 'WordPress', 'Shopify', 'HubSpot', 'Slack', 'OpenAI'
];

export const PRESET_NICHES: Niche[] = [
  { id: '1', name: 'Coaches', description: 'Business, health, or life coaches scaling their practice.' },
  { id: '2', name: 'Local Services', description: 'Plumbers, HVAC, clinics, and law firms.' },
  { id: '3', name: 'Ecommerce', description: 'Shopify/WooCommerce brand owners.' },
  { id: '4', name: 'Agencies', description: 'Marketing, creative, or recruiting agencies.' },
  { id: '5', name: 'Course Creators', description: 'Online educators with high volume leads.' },
  { id: '6', name: 'Real Estate', description: 'Agents and brokers managing property leads.' },
  { id: '7', name: 'SaaS', description: 'Software companies automating ops.' },
  { id: '8', name: 'Content Creators', description: 'YouTubers and podcasters scaling workflows.' },
];

export const CLIENT_TYPES = [
  'SMB', 'Enterprise', 'Agencies', 'SaaS', 'Solo-creators'
];

export const PRESET_TEMPLATES: Template[] = [
  {
    id: 't1',
    title: 'Abandoned Cart Recovery (WhatsApp)',
    niche: 'Ecommerce',
    description: 'Triggered by Shopify abandoned carts, sends a personalized WhatsApp message via Twilio.',
    tools: ['n8n', 'Shopify', 'Twilio'],
    workflowJson: '{"nodes":[{"parameters":{},"name":"Shopify Trigger","type":"n8n-nodes-base.shopifyTrigger","typeVersion":1,"position":[250,300]},{"parameters":{"message":"Hey {{ $json.customer.first_name }}, we noticed you left something behind!"},"name":"Twilio","type":"n8n-nodes-base.twilio","typeVersion":1,"position":[450,300]}],"connections":{"Shopify Trigger":{"main":[[{"node":"Twilio","type":"main","index":0}]]}}}'
  },
  {
    id: 't2',
    title: 'Lead Magnet to CRM Sync',
    niche: 'Coaches',
    description: 'Connects Typeform submissions to HubSpot CRM and sends a Slack notification.',
    tools: ['n8n', 'Typeform', 'HubSpot', 'Slack'],
    workflowJson: '{"nodes":[{"parameters":{},"name":"Typeform","type":"n8n-nodes-base.typeformTrigger","typeVersion":1,"position":[100,200]},{"parameters":{"resource":"contact"},"name":"HubSpot","type":"n8n-nodes-base.hubspot","typeVersion":1,"position":[300,200]},{"parameters":{"channel":"leads"},"name":"Slack","type":"n8n-nodes-base.slack","typeVersion":1,"position":[500,200]}],"connections":{"Typeform":{"main":[[{"node":"HubSpot","type":"main","index":0}]]},"HubSpot":{"main":[[{"node":"Slack","type":"main","index":0}]]}}}'
  },
  {
    id: 't3',
    title: 'AI Content Repurposing',
    niche: 'Content Creators',
    description: 'Transcribes YouTube videos via Whisper, summarizes with GPT-4, and posts to LinkedIn.',
    tools: ['n8n', 'OpenAI', 'LinkedIn', 'YouTube'],
    workflowJson: '{"nodes":[{"parameters":{},"name":"YouTube Trigger","type":"n8n-nodes-base.googleYouTubeTrigger","typeVersion":1,"position":[100,100]},{"parameters":{"model":"whisper-1"},"name":"Whisper","type":"n8n-nodes-base.openAi","typeVersion":1,"position":[300,100]},{"parameters":{"model":"gpt-4"},"name":"GPT-4","type":"n8n-nodes-base.openAi","typeVersion":1,"position":[500,100]},{"parameters":{},"name":"LinkedIn","type":"n8n-nodes-base.linkedIn","typeVersion":1,"position":[700,100]}],"connections":{"YouTube Trigger":{"main":[[{"node":"Whisper","type":"main","index":0}]]},"Whisper":{"main":[[{"node":"GPT-4","type":"main","index":0}]]},"GPT-4":{"main":[[{"node":"LinkedIn","type":"main","index":0}]]}}}'
  }
];
