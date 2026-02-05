/* ============================================
   SATYA - AI LLM Council
   Application JavaScript
   ============================================ */

// ============================================
// FIREBASE INTEGRATION
// ============================================
import * as fb from "./firebase.js";

// ============================================
// CONFIGURATION
// ============================================

// TOYOW INSTITUTIONAL CONFIGURATION (v2.1 EPISTEMIC GATE)
// Change 'MODE' to switch logic manually: 'EXPLORATORY' | 'STRATEGIC' | 'COMPLIANCE'
const TOYOW_GOVERNANCE = {
    MODE: 'STRATEGIC',
    STRICT_VERIFICATION: true,
    REQUIRE_REFERENCES: true,
    EPISTEMIC_GATE: 'OFFLINE_DELIBERATION' // Non-negotiable: Council deliberates OFFLINE
};

// TOYOW INSTITUTIONAL DxO ROLES (STAGE 2: THE JUDGE)
// ALL ROLES ARE OFFLINE - Web gathering is handled BEFORE this stage
const TOYOW_DXO_ROLES = [
    {
        name: "Adversarial Critic",
        perspective: "Logic & Reasoning",
        instructions: "Your job is to be disagreeable. Find the top 3 logical flaws in the premise. Quote problematic sections and explain why they fail. Do not offer solutions, only problems.",
        model: "deepseek/deepseek-r1"
    },
    {
        name: "Regulatory Reviewer",
        perspective: "Compliance & Law",
        instructions: "Review for liability. Flag any language that sounds like a financial promise. Mark unverifiable regulatory claims as [VERIFY]. Ensure distinction between 'utility' and 'security'.",
        model: "anthropic/claude-3.5-sonnet"
    },
    {
        name: "Data Auditor",
        perspective: "Quantitative & Math",
        instructions: "Audit all TVL figures, APYs, and percentages. If on-chain data is not provided, mark as [DATA MISSING]. Do not hallucinate numbers.",
        model: "google/gemini-2.0-flash-exp:free"
    },
    {
        name: "Real-Time Verifier",
        perspective: "Web Witness",
        instructions: "Fetch live data only. You are a Web Witness. Cite sources. Do not guess. Report ACTUAL current date from search results.",
        model: "perplexity/llama-3.1-sonar-small-128k-online"
    }
];

const OPENROUTER_API_KEY = ''; // REMOVED FOR SECURITY - User must provide key

const FREE_MODELS = [
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', provider: 'Meta Free' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1', provider: 'DeepSeek Free' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', provider: 'Google Free' },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', provider: 'Google Free' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', provider: 'Alibaba Free' },
    { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo-V2-Flash', provider: 'Xiaomi Free' },
    { id: 'mistralai/devstral-2512:free', name: 'Devstral', provider: 'Mistral Free' },
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', provider: 'Z.AI Free' },
    { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B', provider: 'Nous Free' },
    { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', provider: 'Moonshot Free' }
];

// ULTRA FREE - OpenRouter verified free models ranked by benchmark performance (Jan 2026)
const ULTRA_FREE_MODELS = [
    { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B', provider: '#1 • 405B Params • Reasoning King' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1', provider: '#2 • 671B MoE • Math & Code' },
    { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B', provider: '#3 • 120B Params • General' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', provider: '#4 • 480B MoE • Agentic Coding' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', provider: '#5 • 70B Params • GPT-4 Level' },
    { id: 'mistralai/devstral-2512:free', name: 'Devstral', provider: '#6 • 123B Params • Code Master' },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', provider: '#7 • 1M Context • Multimodal' },
    { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1T2 Chimera', provider: '#8 • Hybrid Reasoning' },
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', provider: '#9 • Fast & Strong' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', provider: '#10 • 27B Params • Multilingual' },
    { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano 30B', provider: '#11 • 30B Params • Fast' },
    { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo-V2-Flash', provider: '#12 • High-Speed Analyst' },
    { id: 'openai/gpt-oss-20b:free', name: 'GPT-OSS 20B', provider: '#13 • 20B Params • Lightweight' },
    { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B VL', provider: '#14 • 12B Vision-Language' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', provider: '#15 • 7B Params • Compact' },
    // Online/Web-Enabled Models for Chairman
    { id: 'x-ai/grok-4.1', name: 'Grok 4.1 Online', provider: '🌐 xAI • Web Search' },
    { id: 'google/gemini-2.0-flash-001:online', name: 'Gemini 2.0 Online', provider: '🌐 Google • Web Search' },
    { id: 'perplexity/sonar-deep-research', name: 'Perplexity Sonar Deep', provider: '🌐 Perplexity • Research' }
];

// ============================================
// UNIFIED MODELS LIST - All available models
// ============================================

const MODELS = [
    // Top Free Models (Recommended)
    { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B', provider: 'Nous • 405B Reasoning King' },
    { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1', provider: 'DeepSeek • 671B MoE Math/Code' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', provider: 'Meta • GPT-4 Level' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', provider: 'Alibaba • Agentic Coding' },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', provider: 'Google • 1M Context' },
    { id: 'mistralai/devstral-2512:free', name: 'Devstral', provider: 'Mistral • Code Master' },
    { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', provider: 'Google • Multilingual' },
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', provider: 'Z.AI • Fast & Strong' },
    { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo-V2-Flash', provider: 'Xiaomi • High-Speed' },
    { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', provider: 'Moonshot • General' },
    { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek Chimera', provider: 'TNG • Hybrid Reasoning' },

    // OpenAI Premium (GPT-5 Series)
    { id: 'openai/gpt-5.2-pro', name: 'GPT-5.2 Pro', provider: 'OpenAI Premium' },
    { id: 'openai/gpt-5.2-chat', name: 'GPT-5.2 Chat', provider: 'OpenAI Latest' },
    { id: 'openai/gpt-5.1-codex-max', name: 'GPT-5.1 Codex Max', provider: 'OpenAI Code' },
    { id: 'openai/gpt-5', name: 'GPT-5', provider: 'OpenAI' },

    // OpenAI Reasoning (o-Series)
    { id: 'openai/o4-mini', name: 'O4 Mini', provider: 'OpenAI Reasoning' },
    { id: 'openai/o3', name: 'O3', provider: 'OpenAI Reasoning' },
    { id: 'openai/o3-deep-research', name: 'O3 Deep Research', provider: 'OpenAI Deep' },
    { id: 'openai/o1', name: 'O1', provider: 'OpenAI Reasoning' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI Flagship' },

    // xAI Grok
    { id: 'x-ai/grok-4', name: 'Grok 4', provider: 'xAI Premium' },
    { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast', provider: 'xAI Latest' },
    { id: 'x-ai/grok-4-fast', name: 'Grok 4 Fast', provider: 'xAI Fast' },
    { id: 'x-ai/grok-code-fast-1', name: 'Grok Code Fast 1', provider: 'xAI Code' },

    // Anthropic Claude
    { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'Anthropic Premium' },
    { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic Latest' },
    { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },

    // Google Gemini
    { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: 'Google Latest' },
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google Fast' },

    // DeepSeek Premium
    { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2', provider: 'DeepSeek Latest' },
    { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek Reasoning' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek' },

    // Meta Llama Premium
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B (Paid)', provider: 'Meta Premium' },
    { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', provider: 'Meta Premium' },

    // Others
    { id: 'mistralai/mistral-large-2411', name: 'Mistral Large', provider: 'Mistral AI' },
    { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', provider: 'Alibaba' },

    // Online / Web Search Models
    { id: 'google/gemini-2.0-flash-001:online', name: 'Gemini 2.0 Flash Online', provider: 'Google Web' },
    { id: 'openai/gpt-4o:online', name: 'GPT-4o Online', provider: 'OpenAI Web' },
    { id: 'anthropic/claude-3.5-sonnet:online', name: 'Claude 3.5 Sonnet Online', provider: 'Anthropic Web' },
    { id: 'deepseek/deepseek-r1:online', name: 'DeepSeek R1 Online', provider: 'DeepSeek Web' },
    { id: 'perplexity/sonar-reasoning', name: 'Sonar Reasoning', provider: 'Perplexity Online' },
    { id: 'perplexity/sonar', name: 'Sonar', provider: 'Perplexity Online' },
    { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google Future' },
    { id: 'x-ai/grok-4.1', name: 'Grok 4.1', provider: 'xAI' },
    { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'Anthropic' },
    { id: 'openai/gpt-5.2:online', name: 'GPT-5.2 Online', provider: 'OpenAI Web' },
    // Perplexity Online (Institutional Web Witness)
    { id: 'perplexity/llama-3.1-sonar-small-128k-online', name: 'Perplexity Sonar Small', provider: 'Perplexity Online' }
];

const ANONYMOUS_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];

// Model metadata for filtering and tooltips
const MODEL_METADATA = {
    'meta-llama/llama-3.3-70b-instruct:free': { tags: ['Reasoning', 'Fast'], developer: 'Meta', description: 'GPT-4 level performance', tooltip: 'Top for complex reasoning chains, excellent instruction following' },
    'deepseek/deepseek-r1-0528:free': { tags: ['Reasoning', 'Coding'], developer: 'DeepSeek', description: '671B MoE reasoning model', tooltip: 'Best for math and code, step-by-step reasoning chains' },
    'google/gemma-3-27b-it:free': { tags: ['Fast', 'Multimodal'], developer: 'Google', description: 'Multilingual expert', tooltip: 'Excellent multilingual support, fast inference speed' },
    'google/gemini-2.0-flash-exp:free': { tags: ['Fast', 'Multimodal'], developer: 'Google', description: '1M context multimodal', tooltip: 'Massive context window, vision capabilities, very fast' },
    'qwen/qwen3-coder:free': { tags: ['Coding', 'Reasoning'], developer: 'Alibaba', description: 'Agentic coding specialist', tooltip: 'Top for agentic coding tasks, excellent tool use' },
    'xiaomi/mimo-v2-flash:free': { tags: ['Fast'], developer: 'Xiaomi', description: 'High-speed analyst', tooltip: 'Ultra-fast inference, good for quick analysis' },
    'mistralai/devstral-2512:free': { tags: ['Coding'], developer: 'Mistral', description: 'Code master 123B', tooltip: 'Specialized for code generation and review' },
    'z-ai/glm-4.5-air:free': { tags: ['Fast', 'Reasoning'], developer: 'Z.AI', description: 'Fast context specialist', tooltip: 'Fast and strong general reasoning' },
    'nousresearch/hermes-3-llama-3.1-405b:free': { tags: ['Reasoning'], developer: 'Nous', description: '405B reasoning king', tooltip: 'Largest free model, best for complex reasoning' },
    'moonshotai/kimi-k2:free': { tags: ['Reasoning', 'Fast'], developer: 'Moonshot', description: 'General purpose', tooltip: 'Balanced performance across tasks' },
    'openai/gpt-oss-120b:free': { tags: ['Reasoning'], developer: 'OpenAI', description: '120B params general', tooltip: 'Strong general capability model' },
    'tngtech/deepseek-r1t2-chimera:free': { tags: ['Reasoning'], developer: 'TNG', description: 'Hybrid reasoning', tooltip: 'Enhanced reasoning capabilities' },
    'nvidia/nemotron-3-nano-30b-a3b:free': { tags: ['Fast'], developer: 'NVIDIA', description: '30B fast inference', tooltip: 'Optimized for speed' },
    'openai/gpt-oss-20b:free': { tags: ['Fast'], developer: 'OpenAI', description: '20B lightweight', tooltip: 'Fast and efficient' },
    'nvidia/nemotron-nano-12b-v2-vl:free': { tags: ['Multimodal', 'Fast'], developer: 'NVIDIA', description: 'Vision-Language', tooltip: 'Multimodal vision capabilities' },
    'mistralai/mistral-7b-instruct:free': { tags: ['Fast'], developer: 'Mistral', description: '7B compact', tooltip: 'Very fast, good for simple tasks' },
    // Paid models
    'openai/gpt-5.2-pro': { tags: ['Reasoning', 'Coding', 'Multimodal'], developer: 'OpenAI', description: 'Premium flagship', tooltip: 'Best-in-class across all benchmarks' },
    'openai/gpt-5.2-chat': { tags: ['Reasoning', 'Multimodal'], developer: 'OpenAI', description: 'Chat optimized', tooltip: 'Optimized for conversational AI' },
    'openai/gpt-5.1-codex-max': { tags: ['Coding'], developer: 'OpenAI', description: 'Code specialist', tooltip: 'Best for code generation' },
    'openai/gpt-5.1-chat': { tags: ['Reasoning'], developer: 'OpenAI', description: 'Previous gen chat', tooltip: 'Strong general performance' },
    'openai/gpt-5': { tags: ['Reasoning'], developer: 'OpenAI', description: 'GPT-5 base', tooltip: 'Foundation GPT-5 model' },
    'openai/o4-mini': { tags: ['Reasoning', 'Fast'], developer: 'OpenAI', description: 'Fast reasoning', tooltip: 'Quick reasoning model' },
    'openai/o3': { tags: ['Reasoning'], developer: 'OpenAI', description: 'Deep reasoning', tooltip: 'Advanced reasoning chains' },
    'openai/o3-deep-research': { tags: ['Reasoning'], developer: 'OpenAI', description: 'Research specialist', tooltip: 'Optimized for research tasks' },
    'openai/o1': { tags: ['Reasoning'], developer: 'OpenAI', description: 'Original o1', tooltip: 'First reasoning model' },
    'openai/gpt-4o': { tags: ['Reasoning', 'Multimodal'], developer: 'OpenAI', description: 'Multimodal flagship', tooltip: 'Vision and audio capable' },
    'x-ai/grok-4': { tags: ['Reasoning'], developer: 'xAI', description: 'Premium Grok', tooltip: 'xAI flagship model' },
    'x-ai/grok-4.1-fast': { tags: ['Reasoning', 'Fast'], developer: 'xAI', description: 'Fast Grok', tooltip: 'Speed optimized Grok' },
    'x-ai/grok-4-fast': { tags: ['Fast'], developer: 'xAI', description: 'Quick inference', tooltip: 'Very fast responses' },
    'x-ai/grok-code-fast-1': { tags: ['Coding', 'Fast'], developer: 'xAI', description: 'Code specialist', tooltip: 'Fast code generation' },
    'x-ai/grok-3-beta': { tags: ['Reasoning'], developer: 'xAI', description: 'Beta Grok', tooltip: 'Grok 3 capabilities' },
    'anthropic/claude-opus-4.5': { tags: ['Reasoning', 'Coding'], developer: 'Anthropic', description: 'Premium Claude', tooltip: 'Best-in-class reasoning and coding' },
    'anthropic/claude-sonnet-4.5': { tags: ['Reasoning', 'Coding'], developer: 'Anthropic', description: 'Latest Sonnet', tooltip: 'Excellent balance of speed and capability' },
    'anthropic/claude-sonnet-4': { tags: ['Reasoning'], developer: 'Anthropic', description: 'Previous Sonnet', tooltip: 'Strong general performance' },
    'anthropic/claude-3.5-sonnet': { tags: ['Reasoning', 'Coding'], developer: 'Anthropic', description: 'Claude 3.5', tooltip: 'Proven reliable performance' },
    'google/gemini-3-flash-preview': { tags: ['Fast', 'Multimodal'], developer: 'Google', description: 'Preview flash', tooltip: 'Latest Gemini preview' },
    'google/gemini-2.5-flash': { tags: ['Fast', 'Multimodal'], developer: 'Google', description: 'Fast Gemini', tooltip: 'Speed optimized multimodal' },
    'google/gemini-2.0-flash-001': { tags: ['Fast', 'Multimodal'], developer: 'Google', description: 'Gemini 2 flash', tooltip: 'Fast and capable' },
    'deepseek/deepseek-v3.2': { tags: ['Reasoning', 'Coding'], developer: 'DeepSeek', description: 'Latest DeepSeek', tooltip: 'Strong reasoning and code' },
    'deepseek/deepseek-r1': { tags: ['Reasoning'], developer: 'DeepSeek', description: 'R1 reasoning', tooltip: 'Specialized reasoning model' },
    'deepseek/deepseek-chat': { tags: ['Reasoning'], developer: 'DeepSeek', description: 'DeepSeek V3', tooltip: 'General chat model' },
    'meta-llama/llama-3.3-70b-instruct': { tags: ['Reasoning', 'Fast'], developer: 'Meta', description: 'Llama 3.3 paid', tooltip: 'Premium Llama access' },
    'meta-llama/llama-3.1-405b-instruct': { tags: ['Reasoning'], developer: 'Meta', description: '405B flagship', tooltip: 'Largest Llama model' },
    'mistralai/mistral-large-2411': { tags: ['Reasoning', 'Coding'], developer: 'Mistral', description: 'Mistral Large', tooltip: 'Flagship Mistral model' },
    'qwen/qwen-2.5-72b-instruct': { tags: ['Reasoning', 'Coding'], developer: 'Alibaba', description: 'Qwen 2.5 72B', tooltip: 'Strong multilingual model' }
};

const PRESET_DEFINITIONS = {
    'Online': ['google/gemini-2.0-flash-001:online', 'openai/gpt-4o:online', 'perplexity/sonar-reasoning', 'deepseek/deepseek-r1:online'],
    'Premium': ['openai/gpt-5.2:online', 'anthropic/claude-opus-4.5', 'google/gemini-2.0-flash-001:online'],
    'Balanced': ['anthropic/claude-3.5-sonnet:online', 'openai/gpt-4o:online', 'google/gemini-2.0-flash-001:online'],
    'Fast': ['google/gemini-2.0-flash-001:online', 'x-ai/grok-4.1']
};

window.applyPreset = function (presetName) {
    let models = [];
    const customPresets = JSON.parse(localStorage.getItem('satya_custom_presets') || '{}');

    if (PRESET_DEFINITIONS[presetName]) {
        models = PRESET_DEFINITIONS[presetName];
    } else if (customPresets[presetName]) {
        models = customPresets[presetName];
    } else {
        console.warn(`Preset ${presetName} not found`);
        return;
    }

    state.selectedCouncilModels = [...models];

    // Visual feedback
    const chips = document.querySelectorAll('.preset-chip');
    chips.forEach(chip => {
        if (chip.textContent === presetName) {
            chip.style.borderColor = 'var(--teal-accent)';
            chip.style.background = 'rgba(0, 221, 179, 0.1)';
        } else {
            chip.style.borderColor = 'var(--border-color)';
            chip.style.background = 'var(--bg-tertiary)';
        }
    });

    renderCouncilModels();
    updateSelectionCounter('council');
};

// Filter state for each mode
let filterState = {
    council: { search: '', tags: [] },
    ensemble: { search: '', tags: [] }
};

// Notion Integration State
let notionState = {
    apiKey: '',
    databaseId: ''
};

// Helper function to find model across ALL model arrays
function findModelById(modelId) {
    return MODELS.find(m => m.id === modelId) ||
        FREE_MODELS.find(m => m.id === modelId) ||
        ULTRA_FREE_MODELS.find(m => m.id === modelId) ||
        { name: 'Unknown AI', provider: 'OpenRouter' };
}

const DEFAULT_ROLES = [
    {
        name: 'Lead Researcher',
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        perspective: 'Primary analysis and synthesis',
        instructions: 'Conduct thorough research analysis, identify key findings and patterns.'
    },
    {
        name: 'Critical Reviewer',
        model: 'deepseek/deepseek-r1-0528:free',
        perspective: 'Identify gaps and weaknesses',
        instructions: 'Critically evaluate the research, identify methodological issues and limitations.'
    },
    {
        name: 'Domain Expert',
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        perspective: 'Deep domain knowledge',
        instructions: 'Provide specialized expertise and context from the relevant field.'
    },
    {
        name: 'Data Analyst',
        model: 'qwen/qwen-2.5-72b-instruct:free',
        perspective: 'Quantitative reasoning',
        instructions: 'Focus on data, statistics, and quantitative aspects of the problem.'
    }
];

const TEMPLATES = {
    research: DEFAULT_ROLES,
    business: [
        { name: 'Strategy Lead', model: 'openai/gpt-5.2-pro', perspective: 'Strategic vision', instructions: 'Analyze strategic implications and long-term opportunities.' },
        { name: 'Financial Analyst', model: 'x-ai/grok-4.1-fast', perspective: 'Financial impact', instructions: 'Evaluate financial implications, ROI, and resource requirements.' },
        { name: 'Market Expert', model: 'anthropic/claude-sonnet-4.5', perspective: 'Market dynamics', instructions: 'Assess market conditions, competition, and positioning.' },
        { name: 'Risk Assessor', model: 'google/gemini-2.5-flash', perspective: 'Risk identification', instructions: 'Identify potential risks, challenges, and mitigation strategies.' }
    ],
    technical: [
        { name: 'Architect', model: 'openai/gpt-5.1-codex-max', perspective: 'System design', instructions: 'Design overall architecture and technical approach.' },
        { name: 'Security Expert', model: 'x-ai/grok-code-fast-1', perspective: 'Security analysis', instructions: 'Evaluate security implications and best practices.' },
        { name: 'Performance Engineer', model: 'openai/o3', perspective: 'Performance optimization', instructions: 'Analyze performance considerations and scalability.' },
        { name: 'Code Reviewer', model: 'deepseek/deepseek-r1', perspective: 'Code quality', instructions: 'Review implementation details and code quality.' }
    ],
    strategic: [
        { name: 'Visionary', model: 'openai/gpt-5.2-pro', perspective: 'Long-term vision', instructions: 'Think about long-term implications and future trends.' },
        { name: 'Pragmatist', model: 'x-ai/grok-4', perspective: 'Practical implementation', instructions: 'Focus on what can be realistically achieved.' },
        { name: 'Devil\'s Advocate', model: 'anthropic/claude-opus-4.5', perspective: 'Challenge assumptions', instructions: 'Question assumptions and present counter-arguments.' },
        { name: 'Synthesizer', model: 'openai/o3', perspective: 'Integration', instructions: 'Combine diverse viewpoints into coherent recommendations.' }
    ],
    creative: [
        { name: 'Innovator', model: 'openai/gpt-5.2-pro', perspective: 'Novel ideas', instructions: 'Generate creative and innovative solutions.' },
        { name: 'Critic', model: 'x-ai/grok-4.1-fast', perspective: 'Quality assessment', instructions: 'Evaluate ideas for feasibility and impact.' },
        { name: 'User Advocate', model: 'anthropic/claude-sonnet-4.5', perspective: 'User experience', instructions: 'Consider user needs and experience.' },
        { name: 'Trend Spotter', model: 'google/gemini-3-flash-preview', perspective: 'Emerging trends', instructions: 'Identify relevant trends and opportunities.' }
    ],
    crypto_analysis: [
        { name: 'Macro Strategist', model: 'openai/gpt-5.2-pro', perspective: 'Market cycle & Global events', instructions: 'Analyze crypto assets in the context of global macroeconomics and market cycles.' },
        { name: 'On-chain Sleuth', model: 'x-ai/grok-4', perspective: 'Wallet movements & Liquidity', instructions: 'Analyze on-chain data, exchange flows, and whale activity.' },
        { name: 'Tokenomics Expert', model: 'deepseek/deepseek-r1', perspective: 'Supply/Demand & Incentives', instructions: 'Audit token distribution, inflation models, and utility.' },
        { name: 'DeFi Yield Farmer', model: 'meta-llama/llama-3.3-70b-instruct:free', perspective: 'Yield optimization', instructions: 'Focus on yield mechanisms, composability, and liquidity depth.' }
    ],
    defi_audit: [
        { name: 'Security Auditor', model: 'openai/gpt-5.1-codex-max', perspective: 'Logic & Vulnerabilities', instructions: 'Identify reentrancy, overflow, and flash loan vulnerabilities.' },
        { name: 'Protocol Architect', model: 'anthropic/claude-sonnet-4.5', perspective: 'Solvency & Liquidation risk', instructions: 'Analyze protocol safety in high volatility and liquidations.' },
        { name: 'Governance Critic', model: 'mistralai/mistral-large-2411', perspective: 'Whale capture & Upgradability', instructions: 'Evaluate multisig controls and centralization risks.' }
    ],
    // TOYOW INSTITUTIONAL RWA PRESET
    toyow_rwa: [
        { name: 'Adversarial Critic', model: 'deepseek/deepseek-r1', perspective: 'Logical Flaws', instructions: 'Find logical flaws. Be disagreeable. Quote problematic sections and explain why they fail.' },
        { name: 'Regulatory Reviewer', model: 'anthropic/claude-3.5-sonnet', perspective: 'SEC/RWA Compliance', instructions: 'Flag liability and financial promises. Mark unverifiable claims as [VERIFY].' },
        { name: 'Data Auditor', model: 'google/gemini-2.0-flash-exp:free', perspective: 'Quantitative Verification', instructions: 'Audit TVL and APY. Mark [DATA MISSING] if unverified. Do not hallucinate numbers.' },
        { name: 'Real-Time Verifier', model: 'perplexity/llama-3.1-sonar-small-128k-online', perspective: 'Web Witness', instructions: 'Fetch live data. Cite sources. Report ACTUAL current date from search results.' }
    ]
};

// ============================================
// STATE
// ============================================

let state = {
    currentTab: 'council',
    freeMode: localStorage.getItem('satya_free_mode') === 'true',
    ultraFreeMode: localStorage.getItem('satya_ultra_mode') === 'true',
    selectedCouncilModels: [MODELS[0].id, MODELS[1].id, MODELS[2].id],
    selectedEnsembleModels: [MODELS[0].id, MODELS[1].id, MODELS[2].id],
    roles: [...TOYOW_DXO_ROLES],
    history: JSON.parse(localStorage.getItem('satya_history') || '[]'),
    attachments: {
        superchat: [],
        council: [],
        dxo: [],
        ensemble: []
    },
    // New crypto research state
    leaderboardData: JSON.parse(localStorage.getItem('satya_leaderboard') || '{}'),
    leaderboardSessions: JSON.parse(localStorage.getItem('satya_leaderboard_sessions') || '[]'),
    sessionTags: [],
    roundsCount: 1,
    peerRankingEnabled: true,
    currentSessionId: null,
    showAllModels: false,
    showAllModelsEnsemble: false,
    // Firebase auth
    currentUser: null,
    // Minimalist Mode for Android Apps (Satya Lite / Satya Pro)
    minimalistMode: null, // 'lite' | 'pro' | null
    chatHistory: [] // For minimalist chat UI
};

// ============================================
// PREMIUM COUNCIL CONFIGURATION (Satya Pro)
// ============================================
const PREMIUM_COUNCIL_MODELS = [
    'openai/gpt-5.2-pro',
    'google/gemini-3-pro',
    'x-ai/grok-4.1-fast'
];
const PREMIUM_CHAIR = 'anthropic/claude-sonnet-4.5';

// ============================================
// MINIMALIST MODE DETECTION
// ============================================
function detectMinimalistMode() {
    const urlParams = new URLSearchParams(window.location.search);
    let mode = urlParams.get('mode');

    // Default to 'lite' if any mode-like param is present or if explicitly asked for default
    if (!mode && urlParams.has('minimalist')) {
        mode = 'lite';
    }

    if (mode === 'lite' || mode === 'pro') {
        state.minimalistMode = mode;
        console.log(`🎯 Minimalist Mode: ${mode}`);
        return mode;
    }

    // If we're on a mobile/tablet screen or no mode specified, default to 'lite'
    // Unless the user explicitly asks for standard 'web' view
    if (window.innerWidth < 768 && !urlParams.has('web')) {
        state.minimalistMode = 'lite';
        return 'lite';
    }

    return null;
}

// Initialize minimalist mode on page load
detectMinimalistMode();




// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // MINIMALIST MODE: Initialize minimalist UI and exit early
    if (state.minimalistMode) {
        initMinimalistUI();
        return; // Skip all normal initialization
    }

    initNavigation();
    renderCouncilModels();
    renderEnsembleModels();
    renderRoles();
    hydrateModelSelects();
    updateHistoryStats();
    setupKeyboardShortcuts();
    setupPasteListeners();
    loadPresetDropdowns();
    loadLeaderboardData();
    window.initProfile();

    loadApiKey();
});

// ============================================
// MOBILE MENU
// ============================================

function toggleMobileMenu() {
    const dropdown = document.getElementById('mobile-menu-dropdown');
    dropdown.classList.toggle('active');
}

function closeMobileMenu() {
    const dropdown = document.getElementById('mobile-menu-dropdown');
    dropdown.classList.remove('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const dropdown = document.getElementById('mobile-menu-dropdown');
    if (menuBtn && dropdown && !menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ============================================
// FULLSCREEN READER MODE
// ============================================

let lastTapTime = 0;

function setupFullscreenReader() {
    // Add double-tap listeners to response cards and synthesis
    document.addEventListener('click', (e) => {
        const now = Date.now();
        const timeDiff = now - lastTapTime;

        // Check if double-tap (less than 300ms between taps)
        if (timeDiff < 300 && timeDiff > 0) {
            // Find closest readable content
            const responseCard = e.target.closest('.response-card');
            const synthesisContent = e.target.closest('#synthesis-content');
            const synthesisPanel = e.target.closest('#synthesis-panel');

            if (responseCard) {
                const content = responseCard.querySelector('.response-body, .response-content');
                const header = responseCard.querySelector('.response-header h3, .response-header h4');
                if (content) {
                    openFullscreenReader(header?.textContent || 'Response', content.innerHTML);
                }
            } else if (synthesisContent || synthesisPanel) {
                const content = document.getElementById('synthesis-content');
                if (content) {
                    openFullscreenReader('✨ Final Synthesis', content.innerHTML);
                }
            }
        }
        lastTapTime = now;
    });
}

function openFullscreenReader(title, htmlContent) {
    const reader = document.getElementById('fullscreen-reader');
    const contentEl = document.getElementById('fullscreen-content');

    if (reader && contentEl) {
        contentEl.innerHTML = `<h3>${title}</h3>${htmlContent}`;
        reader.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeFullscreenReader() {
    const reader = document.getElementById('fullscreen-reader');
    if (reader) {
        reader.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Close fullscreen on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFullscreenReader();
    }
});

// Initialize fullscreen reader
document.addEventListener('DOMContentLoaded', () => {
    setupFullscreenReader();
});

// ============================================
// FIREBASE AUTHENTICATION
// ============================================

async function showLoginModal() {
    const email = prompt('📧 Email:');
    const password = prompt('🔐 Password:');
    if (email && password) {
        try {
            const cred = await fb.login(email, password);
            alert(`✅ Logged in as ${cred.user.email}`);
            await initUserSession(cred.user.uid);
        } catch (err) {
            alert('❌ Login failed: ' + err.message);
        }
    }
}

// Attach event listener when DOM is ready (more robust than onclick)
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('overlay-google-login-btn');
    if (btn) {
        btn.addEventListener('click', loginWithGoogle);
        console.log('✅ Google Login listener attached');
    } else {
        console.warn('⚠️ Google Login button not found');
    }
});

async function loginWithGoogle() {
    try {
        const cred = await fb.loginWithGoogle();
        alert(`✅ Logged in as ${cred.user.email}`);
        await initUserSession(cred.user.uid);
    } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
            alert('❌ Google Login failed: ' + err.message);
        }
    }
}

async function showRegisterModal() {
    const email = prompt('📧 New Email:');
    const password = prompt('🔐 New Password (min 6 characters):');
    if (email && password) {
        try {
            const cred = await fb.register(email, password);
            alert(`✅ Account created! You are now logged in as ${cred.user.email}`);
            await initUserSession(cred.user.uid);
        } catch (err) {
            alert('❌ Registration failed: ' + err.message);
        }
    }
}

async function firebaseLogout() {
    try {
        await fb.logout();
        alert('👋 Logged out successfully');
        state.currentUser = null;

        // Clear active session keys to prevent leakage to next user
        localStorage.removeItem('satya_api_key');
        localStorage.removeItem('satya_notion_api_key');
        localStorage.removeItem('satya_notion_db_id');
        localStorage.removeItem('satya_auth'); // Just in case

        // Reset defaults
        localStorage.removeItem('satya_ultra_mode');

        location.reload();
    } catch (err) {
        alert('❌ Logout failed: ' + err.message);
    }
}

// Load user-specific data after auth
async function initUserSession(uid) {
    state.currentUser = uid;

    // Load saved history
    try {
        const savedHistory = await fb.loadUserData(uid, "history");
        if (Array.isArray(savedHistory)) {
            state.history = savedHistory;
            renderHistory();
            updateHistoryStats();
        }
    } catch (e) {
        console.warn('⚠️ Could not load history (permission issues?)', e);
    }

    // Load saved settings
    try {
        const savedSettings = await fb.loadUserData(uid, "settings");
        if (savedSettings) {
            if (savedSettings.ultraFreeMode !== undefined) {
                state.ultraFreeMode = savedSettings.ultraFreeMode;
                updateFreeModeToggleUI();
            }
        }
    } catch (e) {
        console.warn('⚠️ Could not load settings (permission issues?)', e);
    }

    // Load config (API Keys) from Firestore
    try {
        const savedConfig = await fb.loadUserData(uid, "config");
        if (savedConfig) {
            if (savedConfig.apiKey) localStorage.setItem('satya_api_key', savedConfig.apiKey);
            if (savedConfig.notionKey) localStorage.setItem('satya_notion_api_key', savedConfig.notionKey);
            if (savedConfig.notionDb) localStorage.setItem('satya_notion_db_id', savedConfig.notionDb);
            console.log('✅ Loaded API keys from Firestore');
        }
    } catch (e) {
        console.error('Failed to load config from Firestore', e);
    }

    // Refresh settings UI if open
    loadApiKey();

    console.log('✅ User session initialized for:', uid);
}

// Persist history to Firestore
async function persistHistory() {
    if (!state.currentUser) return;
    try {
        await fb.saveUserData(state.currentUser, "history", state.history);
        console.log('💾 History saved to Firestore');
    } catch (err) {
        console.error('❌ Failed to save history:', err);
    }
}

// Persist settings to Firestore
async function persistSettings() {
    if (!state.currentUser) return;
    try {
        const settings = {
            ultraFreeMode: state.ultraFreeMode,
            freeMode: state.freeMode
        };
        await fb.saveUserData(state.currentUser, "settings", settings);
        console.log('💾 Settings saved to Firestore');
    } catch (err) {
        console.error('❌ Failed to save settings:', err);
    }
}

// Listen for auth state changes
fb.onAuthStateChanged(fb.auth, async (user) => {
    const overlay = document.getElementById('login-overlay');
    if (user) {
        console.log('🔐 User authenticated:', user.email);
        if (overlay) overlay.style.display = 'none';
        try {
            await initUserSession(user.uid);
            // Load profile photo from Firebase Storage
            const photoURL = await fb.loadProfilePhoto(user.uid);
            if (photoURL) {
                const photoEl = document.getElementById('profile-photo');
                if (photoEl) {
                    photoEl.innerHTML = `<img src="${photoURL}" alt="Profile">`;
                }
                const headerAvatar = document.getElementById('profile-avatar');
                if (headerAvatar) {
                    headerAvatar.innerHTML = `<img src="${photoURL}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                }
                console.log('✅ Profile photo loaded from Firebase');
            }
        } catch (err) {
            console.error('⚠️ Data Sync Error:', err);
        }
        updateAuthUI(true, user.email);
    } else {
        console.log('🔓 User not authenticated');
        state.currentUser = null;
        // Skip login overlay in minimalist mode (Android apps handle auth separately)
        if (state.minimalistMode) return;
        // Delay showing login overlay to prevent flash on page load
        setTimeout(() => {
            if (!state.currentUser && overlay) {
                overlay.style.display = 'flex';
            }
        }, 300);
        updateAuthUI(false);
    }
});

function updateAuthUI(isLoggedIn, email = '') {
    const loginBtn = document.getElementById('firebase-login-btn');
    const registerBtn = document.getElementById('firebase-register-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileInitial = document.getElementById('profile-initial');

    if (isLoggedIn) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (googleLoginBtn) googleLoginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (profileAvatar) {
            profileAvatar.style.display = 'flex';
            // Set user initial from email
            if (profileInitial && email) {
                profileInitial.textContent = email.charAt(0).toUpperCase();
            }
        }
        // Store email for profile display
        state.userEmail = email;
    } else {
        if (loginBtn) loginBtn.style.display = 'flex';
        if (googleLoginBtn) googleLoginBtn.style.display = 'flex';
        if (registerBtn) registerBtn.style.display = 'flex';
        if (profileAvatar) profileAvatar.style.display = 'none';
        state.userEmail = null;
    }
}

// ============================================
// QUICK PROMPTS
// ============================================

const QUICK_PROMPTS_LIBRARY = [
    { label: 'DeFi Risk', text: 'Analyze the smart contract risks of Aave V3 on Arbitrum.' },
    { label: 'L2 Scaling', text: 'Compare the technical architecture of Optimism Bedrock vs Arbitrum Nitro.' },
    { label: 'ZK Tech', text: 'Explain zk-SNARKs vs zk-STARKs for a non-technical audience.' },
    { label: 'AI Code', text: 'Write a Python script to optimize portfolio allocation using Monte Carlo simulation.' },
    { label: 'Tokenomics', text: 'Critique the tokenomics of the latest EIGEN layer protocol.' },
    { label: 'Market', text: 'What are the macro tailwinds for RWA tokenization in 2026?' },
    { label: 'Security', text: 'How does account abstraction (ERC-4337) impact wallet security?' },
    { label: 'Privacy', text: 'Analyze the privacy implications of CBDCs vs private stablecoins.' },
    { label: 'Solidity', text: 'Write a secure ERC-20 token contract with permit functionality.' },
    { label: 'Rust', text: 'Explain the advantages of Rust for Solana program development.' },
    { label: 'NFTs', text: 'What is the future of dynamic NFTs beyond simple PFPs?' },
    { label: 'DAOs', text: 'Propose a governance framework for a decentralized lending protocol.' },
    { label: 'MEV', text: 'Explain Proposer-Builder Separation (PBS) and its impact on MEV.' },
    { label: 'Bridging', text: 'Analyze the security model of LayerZero vs Wormhole.' },
    { label: 'Identity', text: 'How can Zero-Knowledge proofs solve decentralized identity (DID)?' },
    { label: 'Stablecoins', text: 'Compare the stability mechanisms of DAI, FRAX, and LUSD.' },
    { label: 'Regulation', text: 'What are the implications of MiCA regulation for DeFi protocols?' },
    { label: 'Integration', text: 'How to integrate Chainlink Oracles into a prediction market?' },
    { label: 'Hypothesis', text: 'Formulate a hypothesis on the next major narrative in crypto.' },
    { label: 'Audit', text: 'What are the most common vulnerabilities found in DeFi hacks 2025?' }
];

// Global prompt setter for onclick handlers
window.setPrompt = function (mode, text) {
    // Find the active tab first to determine which prompt input to target if mode generic
    const activeTab = state.currentTab;
    const targetMode = mode || activeTab;
    const textarea = document.getElementById(`${targetMode}-prompt`);
    if (textarea) {
        textarea.value = text;
        textarea.focus();
        // Trigger auto-resize if implemented
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
};

function renderRandomQuickPrompts() {
    // Select 4 unique random prompts
    const shuffled = [...QUICK_PROMPTS_LIBRARY].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    const chipHtml = selected.map(p =>
        `<button class="quick-chip" onclick="setPrompt('council', '${p.text.replace(/'/g, "\\'")}')">${p.label}</button>`
    ).join('');

    document.querySelectorAll('.quick-prompts').forEach(container => {
        const label = container.querySelector('.quick-label');
        if (label) {
            container.innerHTML = '';
            container.appendChild(label);
            container.insertAdjacentHTML('beforeend', chipHtml);
        }
    });

    // window.setPrompt is now global
}

function initNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    state.currentTab = tabName;

    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Add active class only if page exists (council/history don't have pages)
    const targetPage = document.getElementById(`${tabName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// ============================================
// MODEL RENDERING
// ============================================

function renderCouncilModels() {
    const container = document.getElementById('council-models');
    if (!container) return;
    try {

        // Render Presets (System All + Custom)
        if (!document.getElementById('council-presets-container')) {
            const filterBar = document.querySelector('.model-filter-bar');
            if (filterBar) {
                const presetsContainer = document.createElement('div');
                presetsContainer.id = 'council-presets-container';
                presetsContainer.style = "display: flex; gap: 6px; margin: 0 16px 8px 16px; flex-wrap: wrap;";

                // Load custom presets
                let customPresets = {};
                try {
                    customPresets = JSON.parse(localStorage.getItem('satya_custom_presets') || '{}');
                } catch (e) { console.error(e); }

                const allPresets = { ...PRESET_DEFINITIONS, ...customPresets };

                presetsContainer.innerHTML = Object.keys(allPresets).map(preset => {
                    const isCustom = customPresets[preset];
                    const style = isCustom
                        ? "padding: 4px 10px; background: rgba(139, 92, 246, 0.2); border: 1px solid var(--primary-color); border-radius: 12px; color: var(--primary-light); cursor: pointer; font-size: 12px;"
                        : "padding: 4px 10px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-secondary); cursor: pointer; font-size: 12px;";
                    return `<button class="preset-chip" onclick="applyPreset('${preset}')" style="${style}">${preset}</button>`;
                }).join('');

                filterBar.parentNode.insertBefore(presetsContainer, filterBar);
            }
        }

        let baseModels = MODELS;

        if (state.ultraFreeMode) baseModels = ULTRA_FREE_MODELS;
        else if (state.freeMode) baseModels = ULTRA_FREE_MODELS; // freeMode now maps to Ultra Free

        // Apply Toyow mode filter first (if active, only show Toyow relevant models)
        let filteredModels = baseModels;
        if (typeof toyowModeActive !== 'undefined' && toyowModeActive) {
            // Show ONLY the 4 core Toyow institutional models
            const TOYOW_VISIBLE_MODELS = [
                'deepseek/deepseek-r1',
                'anthropic/claude-3.5-sonnet',
                'google/gemini-2.0-flash-exp:free',
                'perplexity/llama-3.1-sonar-small-128k-online'
            ];
            filteredModels = baseModels.filter(model =>
                TOYOW_VISIBLE_MODELS.includes(model.id)
            );
        }

        // Apply standard filters
        filteredModels = filteredModels.filter(model => {
            const metadata = MODEL_METADATA[model.id] || { tags: [], developer: '' };
            const searchTerm = filterState.council.search.toLowerCase();
            const activeTags = filterState.council.tags;

            // Search filter
            const matchesSearch = searchTerm === '' ||
                model.name.toLowerCase().includes(searchTerm) ||
                model.provider.toLowerCase().includes(searchTerm) ||
                metadata.developer.toLowerCase().includes(searchTerm);

            // Tag filter
            const matchesTags = activeTags.length === 0 ||
                activeTags.some(tag => metadata.tags.includes(tag));

            return matchesSearch && matchesTags;
        });

        // Mobile filter: Show only top 4 by default on mobile
        const isMobile = window.innerWidth < 768;
        const SHOW_LIMIT = 4;
        const shouldLimit = isMobile && !state.showAllModels && filteredModels.length > SHOW_LIMIT;
        const displayModels = shouldLimit ? filteredModels.slice(0, SHOW_LIMIT) : filteredModels;

        container.innerHTML = displayModels.map(model => {
            const metadata = MODEL_METADATA[model.id] || { tooltip: 'AI model', tags: [] };
            const tagBadges = metadata.tags ? metadata.tags.slice(0, 2).map(tag =>
                `<span class="model-tag">${tag}</span>`
            ).join('') : '';

            return `
        <div class="model-card ${state.selectedCouncilModels.includes(model.id) ? 'selected' : ''}" 
             onclick="toggleCouncilModel('${model.id}')"
             data-tooltip="${metadata.tooltip}">
            <div class="model-checkbox"></div>
            <div class="model-info">
                <h4>${model.name}</h4>
                <p>${model.provider}</p>
                <div class="model-tags">${tagBadges}</div>
            </div>
            <div class="model-tooltip">${metadata.tooltip}</div>
        </div>
    `}).join('');

        // Add Toggle Button for Mobile
        if (isMobile && filteredModels.length > SHOW_LIMIT) {
            const remainingCount = filteredModels.length - SHOW_LIMIT;
            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'model-show-more-btn';
            toggleBtn.innerHTML = state.showAllModels
                ? `Show Less <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>`
                : `Show All (${remainingCount} more) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
            toggleBtn.onclick = () => {
                state.showAllModels = !state.showAllModels;
                renderCouncilModels();
            };
            container.appendChild(toggleBtn);
        } else {
            // Reset state if not needed to avoid getting stuck
            if (!isMobile) state.showAllModels = false;
        }

        // Update selection counter
        updateSelectionCounter('council');
    } catch (e) {
        console.error("CRITICAL: renderCouncilModels failed", e);
        container.innerHTML = `<div class="error-message">Error loading models: ${e.message}</div>`;
    }
}

function renderEnsembleModels() {
    const container = document.getElementById('ensemble-models');
    let baseModels = MODELS;

    if (state.ultraFreeMode) baseModels = ULTRA_FREE_MODELS;
    else if (state.freeMode) baseModels = ULTRA_FREE_MODELS; // freeMode now maps to Ultra Free

    // Apply Toyow mode filter first (if active, only show Toyow relevant models)
    let filteredModels = baseModels;
    if (typeof toyowModeActive !== 'undefined' && toyowModeActive) {
        // Show ONLY the 4 core Toyow institutional models
        const TOYOW_VISIBLE_MODELS = [
            'deepseek/deepseek-r1',
            'anthropic/claude-3.5-sonnet',
            'google/gemini-2.0-flash-exp:free',
            'perplexity/llama-3.1-sonar-small-128k-online'
        ];
        filteredModels = baseModels.filter(model =>
            TOYOW_VISIBLE_MODELS.includes(model.id)
        );
    }

    // Apply standard filters
    filteredModels = filteredModels.filter(model => {
        const metadata = MODEL_METADATA[model.id] || { tags: [], developer: '' };
        const searchTerm = filterState.ensemble.search.toLowerCase();
        const activeTags = filterState.ensemble.tags;

        // Search filter
        const matchesSearch = searchTerm === '' ||
            model.name.toLowerCase().includes(searchTerm) ||
            model.provider.toLowerCase().includes(searchTerm) ||
            metadata.developer.toLowerCase().includes(searchTerm);

        // Tag filter
        const matchesTags = activeTags.length === 0 ||
            activeTags.some(tag => metadata.tags.includes(tag));

        return matchesSearch && matchesTags;
    });

    // Mobile filter: Show only top 4 by default on mobile
    const isMobile = window.innerWidth < 768;
    const SHOW_LIMIT = 4;
    const shouldLimit = isMobile && !state.showAllModelsEnsemble && filteredModels.length > SHOW_LIMIT;
    const displayModels = shouldLimit ? filteredModels.slice(0, SHOW_LIMIT) : filteredModels;

    container.innerHTML = displayModels.map(model => {
        const metadata = MODEL_METADATA[model.id] || { tooltip: 'AI model', tags: [] };
        const tagBadges = metadata.tags ? metadata.tags.slice(0, 2).map(tag =>
            `<span class="model-tag">${tag}</span>`
        ).join('') : '';

        return `
        <div class="model-card ${state.selectedEnsembleModels.includes(model.id) ? 'selected' : ''}" 
             onclick="toggleEnsembleModel('${model.id}')"
             data-tooltip="${metadata.tooltip}">
            <div class="model-checkbox"></div>
            <div class="model-info">
                <h4>${model.name}</h4>
                <p>${model.provider}</p>
                <div class="model-tags">${tagBadges}</div>
            </div>
            <div class="model-tooltip">${metadata.tooltip}</div>
        </div>
    `}).join('');

    // Add Toggle Button for Mobile
    if (isMobile && filteredModels.length > SHOW_LIMIT) {
        const remainingCount = filteredModels.length - SHOW_LIMIT;
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'model-show-more-btn';
        toggleBtn.style.gridColumn = "1 / -1"; // Make it span full width
        toggleBtn.innerHTML = state.showAllModelsEnsemble
            ? `Show Less <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>`
            : `Show All (${remainingCount} more) <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
        toggleBtn.onclick = () => {
            state.showAllModelsEnsemble = !state.showAllModelsEnsemble;
            renderEnsembleModels();
        };
        container.appendChild(toggleBtn);
    }

    document.getElementById('ensemble-count').textContent = `${state.selectedEnsembleModels.length} selected`;

    // Update selection counter
    updateSelectionCounter('ensemble');
}

// toggleFreeMode removed - only Ultra Free mode is now available

function toggleUltraFreeMode() {
    state.ultraFreeMode = !state.ultraFreeMode;
    if (state.ultraFreeMode) {
        state.freeMode = false;
    }

    localStorage.setItem('satya_free_mode', state.freeMode);
    localStorage.setItem('satya_ultra_mode', state.ultraFreeMode);

    // Only set a default selection if there are no existing selections
    if (state.ultraFreeMode && state.selectedCouncilModels.length === 0) {
        state.selectedCouncilModels = [ULTRA_FREE_MODELS[0].id, ULTRA_FREE_MODELS[1].id, ULTRA_FREE_MODELS[2].id];
        state.selectedEnsembleModels = [ULTRA_FREE_MODELS[0].id, ULTRA_FREE_MODELS[1].id, ULTRA_FREE_MODELS[2].id];
    }

    renderCouncilModels();
    renderEnsembleModels();
    renderRoles();
    hydrateModelSelects();
    updateFreeModeToggleUI();
    persistSettings(); // Save to Firebase
}

function updateFreeModeToggleUI() {
    const freeToggle = document.getElementById('free-mode-toggle');
    const ultraToggle = document.getElementById('ultra-mode-toggle');

    if (freeToggle) {
        if (state.freeMode) freeToggle.classList.add('active');
        else freeToggle.classList.remove('active');
    }

    if (ultraToggle) {
        if (state.ultraFreeMode) ultraToggle.classList.add('active');
        else ultraToggle.classList.remove('active');
    }
}

// ============================================
// ATTACHMENT MANAGEMENT
// ============================================

function triggerUpload(mode) {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,.pdf,.txt,.doc,.docx';
    input.onchange = (e) => handleFileUpload(mode, e.target.files);
    input.click();
}

async function handleFileUpload(mode, files) {
    const fileList = Array.from(files);
    for (const file of fileList) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const attachment = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result // Base64 or DataURL
            };
            state.attachments[mode].push(attachment);
            renderAttachments(mode);
        };

        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsDataURL(file);
        }
    }
}

function removeAttachment(mode, index) {
    state.attachments[mode].splice(index, 1);
    renderAttachments(mode);
}

function renderAttachments(mode) {
    const container = document.getElementById(`${mode}-attachments`);
    if (!container) return;

    container.innerHTML = state.attachments[mode].map((file, index) => `
        <div class="attachment-chip">
            <span class="attachment-name">${file.name}</span>
            <button class="remove-attachment" onclick="removeAttachment('${mode}', ${index})">×</button>
        </div>
    `).join('');
}

function handlePaste(event, mode) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (e) => {
                const attachment = {
                    name: `Pasted Image ${new Date().toLocaleTimeString()}`,
                    type: file.type,
                    size: file.size,
                    data: e.target.result
                };
                state.attachments[mode].push(attachment);
                renderAttachments(mode);
            };
            reader.readAsDataURL(file);
        }
    }
}

function setupKeyboardShortcuts() {
    const modes = ['council', 'dxo', 'ensemble', 'superchat'];
    modes.forEach(mode => {
        const textarea = document.getElementById(`${mode}-prompt`);
        if (textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    switch (mode) {
                        case 'council': startCouncil(); break;
                        case 'dxo': startDxO(); break;
                        case 'ensemble': startEnsemble(); break;
                        case 'superchat': startSuperChat(); break;
                    }
                }
            });
        }
    });
}

function setupPasteListeners() {
    const modes = ['council', 'dxo', 'ensemble', 'superchat'];
    modes.forEach(mode => {
        const textarea = document.getElementById(`${mode}-prompt`);
        if (textarea) {
            textarea.addEventListener('paste', (e) => handlePaste(e, mode));
        }
    });
}

function hydrateModelSelects() {
    const chairmanSelect = document.getElementById('chairman-select');
    const superchatSelect = document.getElementById('superchat-model');
    let filteredModels = MODELS;

    if (state.ultraFreeMode) filteredModels = ULTRA_FREE_MODELS;
    else if (state.freeMode) filteredModels = ULTRA_FREE_MODELS; // freeMode now maps to Ultra Free

    if (chairmanSelect) {
        chairmanSelect.innerHTML = filteredModels.map(m =>
            `<option value="${m.id}">${m.name} (${m.provider})</option>`
        ).join('');
        // TOYOW INSTITUTIONAL: Default to Claude 3.5 Sonnet as Chairman
        const claudeModel = filteredModels.find(m => m.id === 'anthropic/claude-3.5-sonnet');
        if (claudeModel) {
            chairmanSelect.value = claudeModel.id;
        }
    }

    if (superchatSelect) {
        superchatSelect.innerHTML = filteredModels.map(m =>
            `<option value="${m.id}">${m.name} (${m.provider})</option>`
        ).join('');
    }
}

// updateFreeModeToggleUI removed

function toggleCouncilModel(modelId) {
    const index = state.selectedCouncilModels.indexOf(modelId);
    if (index > -1) {
        state.selectedCouncilModels.splice(index, 1);
    } else {
        state.selectedCouncilModels.push(modelId);
    }
    renderCouncilModels();
}

function toggleEnsembleModel(modelId) {
    const index = state.selectedEnsembleModels.indexOf(modelId);
    if (index > -1) {
        state.selectedEnsembleModels.splice(index, 1);
    } else {
        state.selectedEnsembleModels.push(modelId);
    }
    renderEnsembleModels();
}

// ============================================
// FILTER & SEARCH FUNCTIONS
// ============================================

function filterCouncilModels() {
    const searchInput = document.getElementById('council-model-search');
    filterState.council.search = searchInput ? searchInput.value : '';
    renderCouncilModels();
}

function filterEnsembleModels() {
    const searchInput = document.getElementById('ensemble-model-search');
    filterState.ensemble.search = searchInput ? searchInput.value : '';
    renderEnsembleModels();
}

function toggleFilter(mode, tag, buttonEl) {
    const tags = filterState[mode].tags;
    const index = tags.indexOf(tag);

    if (index > -1) {
        tags.splice(index, 1);
        buttonEl.classList.remove('active');
    } else {
        tags.push(tag);
        buttonEl.classList.add('active');
    }

    if (mode === 'council') {
        renderCouncilModels();
    } else {
        renderEnsembleModels();
    }
}

function updateSelectionCounter(mode) {
    const selectedModels = mode === 'council' ? state.selectedCouncilModels : state.selectedEnsembleModels;
    const countEl = document.getElementById(`${mode}-selected-count`);
    const speedBadgeEl = document.getElementById(`${mode}-speed-badge`);
    const costBadgeEl = document.getElementById(`${mode}-cost-badge`);

    if (countEl) countEl.textContent = selectedModels.length;

    // Estimate speed based on model count and types
    let hasFast = selectedModels.some(id => {
        const meta = MODEL_METADATA[id];
        return meta && meta.tags && meta.tags.includes('Fast');
    });

    if (speedBadgeEl) {
        if (selectedModels.length <= 3 && hasFast) {
            speedBadgeEl.textContent = '⚡ Fast';
        } else if (selectedModels.length <= 5) {
            speedBadgeEl.textContent = '⏱️ Medium';
        } else {
            speedBadgeEl.textContent = '🐢 Slower';
        }
    }

    // Estimate cost based on free mode
    if (costBadgeEl) {
        if (state.freeMode || state.ultraFreeMode) {
            costBadgeEl.textContent = '💎 Free';
            costBadgeEl.classList.remove('paid');
        } else {
            // Rough heuristic
            const isExpensive = selectedModels.some(id => id.includes('opus') || id.includes('405b') || id.includes('gpt-5'));
            costBadgeEl.textContent = isExpensive ? '💰 High' : '💲 Low';
            if (isExpensive) costBadgeEl.classList.add('paid');
            else costBadgeEl.classList.remove('paid');
        }
    }
}

window.applyPreset = function (presetName) {
    const presetModels = PRESET_DEFINITIONS[presetName];
    if (!presetModels) return;

    // Filter to only models that exist in our definitions
    const validModels = presetModels.filter(id => findModelById(id));

    state.selectedCouncilModels = validModels;

    // Visual feedback
    document.querySelectorAll('.preset-chip').forEach(chip => {
        if (chip.textContent.trim() === presetName) {
            chip.style.borderColor = 'var(--teal-accent)';
            chip.style.color = 'var(--teal-accent)';
            chip.style.background = 'rgba(0, 221, 179, 0.1)';
        } else {
            chip.style.borderColor = 'var(--border-color)';
            chip.style.color = 'var(--text-secondary)';
            chip.style.background = 'var(--bg-tertiary)';
        }
    });

    renderCouncilModels();
};

window.initProfile = function () {
    try {
        const savedPhoto = localStorage.getItem('satya_profile_photo');
        if (savedPhoto && savedPhoto !== "null" && savedPhoto !== "undefined") {
            const headerAvatar = document.getElementById('profile-avatar');
            if (headerAvatar) {
                headerAvatar.innerHTML = `<img src="${savedPhoto}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            }
            const modalAvatar = document.getElementById('profile-photo');
            if (modalAvatar) {
                modalAvatar.innerHTML = `<img src="${savedPhoto}" alt="Profile">`;
            }
        }
    } catch (e) { console.error(e); }
};
setTimeout(window.initProfile, 1000); // Polling safety prompt


// ============================================
// CRYPTO RESEARCH & LEADERBOARD FUNCTIONS
// ============================================

async function conductPeerRanking(originalPrompt, modelResponses) {
    const peerRankingsContainer = document.getElementById('peer-rankings-container');
    const peerRankingsContent = document.getElementById('peer-rankings-content');
    if (peerRankingsContainer) peerRankingsContainer.classList.remove('hidden');
    if (peerRankingsContent) peerRankingsContent.innerHTML = '<div class="loading">Conducting Peer Ranking & Analysis...</div>';

    const scores = {};
    const participatingIds = Object.keys(modelResponses);
    participatingIds.forEach(id => scores[id] = 0);

    // Filter out models that failed
    const validIds = participatingIds.filter(id => modelResponses[id] && !modelResponses[id].startsWith('Error:'));
    if (validIds.length < 2) {
        if (peerRankingsContainer) peerRankingsContainer.classList.add('hidden');
        return null;
    }

    const rankingPromises = validIds.map(async (voterId) => {
        const others = validIds.filter(id => id !== voterId);
        const voterModel = findModelById(voterId);

        const peerPrompt = `You are an expert ${state.sessionTags.includes('crypto') ? 'crypto' : 'AI'} researcher. 
        Evaluate these responses to: "${originalPrompt}"
        
${others.map((id, i) => `[ID: ${id}] Response:\n${modelResponses[id]}\n---\n`).join('')}

Rank these ${others.length} responses from best to worst based on depth, accuracy, and utility.
Format your response exactly like this:
RANKING: [ID_OF_BEST, ID_OF_SECOND, ...]
CRITIQUE: A concise 2-sentence summary of what you learned or disagreed with across these samples.`;

        try {
            const reader = await streamResponse(voterId, peerPrompt, "You are an objective peer reviewer.");
            let fullText = '';
            await processStream(reader, () => { }, (full) => fullText = full);

            const match = fullText.match(/RANKING:\s*\[(.*?)\]/i);
            if (match) {
                const order = match[1].split(',').map(s => s.trim());
                order.forEach((targetId, index) => {
                    if (scores[targetId] !== undefined) {
                        scores[targetId] += (validIds.length - index);
                    }
                });
            }

            return { voter: voterModel.name, text: fullText };
        } catch (e) {
            console.error("Peer ranking error:", e);
            return null;
        }
    });

    const results = await Promise.all(rankingPromises);

    const finalRankings = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .map(([id, score], index) => ({
            id,
            name: findModelById(id).name,
            provider: findModelById(id).provider,
            score,
            rank: index + 1
        }));

    renderPeerRankings(finalRankings, results.filter(r => r));
    updateLeaderboard(finalRankings);
    return finalRankings;
}

function renderPeerRankings(rankings, critiques) {
    const peerRankingsContent = document.getElementById('peer-rankings-content');
    if (!peerRankingsContent) return;

    peerRankingsContent.innerHTML = `
        <div class="final-rankings-list">
            ${rankings.map(r => `
                <div class="rank-item rank-${r.rank}">
                    <div class="rank-number">${r.rank}</div>
                    <div class="rank-details">
                        <div class="rank-model-name">${r.name}</div>
                        <div class="rank-score">Aggregate Reputation Score: ${r.score}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="peer-critiques" style="margin-top: 20px; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
            <h4 style="color: var(--teal-accent); margin-bottom: 12px;">Expert Consensus Highlights</h4>
            ${critiques.slice(0, 3).map(c => {
        const critiquePart = c.text.split(/CRITIQUE:/i)[1] || "Analyzed peer perspectives for synthesis.";
        return `
                    <div class="critique-box" style="margin-bottom: 12px; font-size: 0.9rem;">
                        <strong style="color: var(--text-primary);">${c.voter}:</strong> 
                        <span style="color: var(--text-secondary); font-style: italic;">"${critiquePart.trim()}"</span>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function updateLeaderboard(finalRankings) {
    // We store the session data directly to allow post-hoc filtering by tags
    const sessionTags = document.getElementById('session-tags')?.value.split(',').map(t => t.trim()).filter(t => t !== '') || [];

    const sessionEntry = {
        timestamp: new Date().toISOString(),
        rankings: finalRankings,
        tags: sessionTags
    };

    state.leaderboardSessions.push(sessionEntry);
    localStorage.setItem('satya_leaderboard_sessions', JSON.stringify(state.leaderboardSessions));

    renderLeaderboard();
}

function renderLeaderboard() {
    const container = document.getElementById('leaderboard-body');
    const tagFilter = document.getElementById('leaderboard-tag-filter')?.value.toLowerCase();
    if (!container) return;

    // Filter sessions
    const filteredSessions = state.leaderboardSessions.filter(s => {
        if (!tagFilter) return true;
        return s.tags.some(t => t.toLowerCase().includes(tagFilter));
    });

    // Compute stats from filtered sessions
    const statsMap = {};
    filteredSessions.forEach(s => {
        s.rankings.forEach(r => {
            if (!statsMap[r.id]) {
                statsMap[r.id] = { name: r.name, wins: 0, topPicks: 0, sessions: 0, totalRank: 0 };
            }
            statsMap[r.id].sessions++;
            statsMap[r.id].totalRank += r.rank;
            if (r.rank === 1) statsMap[r.id].wins++;
            if (r.rank <= 2) statsMap[r.id].topPicks++;
        });
    });

    // Update total sessions count in UI
    const totalSessionsEl = document.getElementById('lb-total-sessions');
    if (totalSessionsEl) totalSessionsEl.textContent = filteredSessions.length;

    const data = Object.entries(statsMap)
        .map(([id, stats]) => ({
            id,
            ...stats,
            winRate: ((stats.wins / stats.sessions) * 100).toFixed(1),
            topPickRate: ((stats.topPicks / stats.sessions) * 100).toFixed(1),
            avgRank: (stats.totalRank / stats.sessions).toFixed(2)
        }))
        .sort((a, b) => b.winRate - a.winRate || a.avgRank - b.avgRank);

    container.innerHTML = data.map((d, i) => `
        <tr>
            <td>#${i + 1}</td>
            <td style="font-weight: 600;">${d.name}</td>
            <td>
                <div class="win-rate-bar"><div class="win-rate-fill" style="width: ${d.winRate}%"></div></div>
                ${d.winRate}%
            </td>
            <td>${d.topPickRate}%</td>
            <td>${d.sessions} sessions</td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-secondary);">No sessions found with these filters.</td></tr>';
}

function loadLeaderboardData() {
    renderLeaderboard();
}
function savePreset(mode) {
    const name = prompt('Enter a name for this custom setup:');
    if (!name) return;

    const presets = JSON.parse(localStorage.getItem('satya_presets') || '{}');
    if (!presets[mode]) presets[mode] = [];

    const newPreset = {
        id: Date.now(),
        name: name,
        timestamp: new Date().toISOString()
    };

    if (mode === 'council') {
        newPreset.models = [...state.selectedCouncilModels];
        newPreset.chairman = document.getElementById('chairman-select')?.value;
    } else if (mode === 'ensemble') {
        newPreset.models = [...state.selectedEnsembleModels];
    } else if (mode === 'dxo') {
        newPreset.roles = [...state.roles];
    }

    presets[mode].push(newPreset);
    localStorage.setItem('satya_presets', JSON.stringify(presets));
    loadPresetDropdowns();
    console.log(`✅ Setup "${name}" saved!`);
}

function continueSession() {
    // This allows manually running another round or continuing after an error
    const resultsPanel = document.getElementById('results-panel');
    if (resultsPanel.classList.contains('hidden')) return;

    // Get synthesis content for context (even if it's an error message)
    const synthesisContent = document.getElementById('synthesis-content');
    const synthesisText = synthesisContent ? synthesisContent.innerText : '';

    const resultsTitle = document.getElementById('results-title').textContent;

    // Store context for continuation
    const mode = resultsTitle.toLowerCase().includes('council') ? 'council' :
        resultsTitle.toLowerCase().includes('dxo') ? 'dxo' :
            resultsTitle.toLowerCase().includes('ensemble') ? 'ensemble' : 'superchat';

    // Collect current responses from DOM
    const responseCards = document.querySelectorAll('#model-responses .response-card');
    const currentResponses = {};
    responseCards.forEach(card => {
        const header = card.querySelector('.response-header h3, .response-header h4');
        const body = card.querySelector('.response-body, .response-content');
        if (header && body) {
            currentResponses[header.textContent] = body.innerText;
        }
    });

    // Store session context for follow-up
    lastSessionContext = {
        mode: mode,
        prompt: document.getElementById(`${mode}-prompt`)?.value || '',
        responses: currentResponses,
        synthesisText: synthesisText,
        timestamp: new Date().toISOString()
    };

    // Prompt user for follow-up question
    const continuePrompt = prompt('Enter follow-up question or leave empty to retry synthesis:');

    if (continuePrompt === null) return; // User cancelled

    if (continuePrompt.trim() === '') {
        // Retry synthesis only
        if (mode === 'council') {
            startCouncil(true);
        } else if (mode === 'dxo') {
            startDxO(true);
        } else if (mode === 'ensemble') {
            startEnsemble(true);
        }
    } else {
        // Follow-up question with context
        const basePrompt = document.getElementById(`${mode}-prompt`)?.value || '';

        const contextBuilder = Object.entries(currentResponses).map(([name, content]) =>
            `**${name}**: ${content.substring(0, 500)}...`
        ).join('\n\n');

        const fullPrompt = `Previous research context:
${contextBuilder}

${synthesisText ? `Previous synthesis:\n${synthesisText.substring(0, 1000)}...\n\n` : ''}---

Follow-up question: ${continuePrompt}

Please continue the analysis, building on the previous insights.`;

        // Set prompt and run
        if (mode === 'council') {
            document.getElementById('council-prompt').value = fullPrompt;
            startCouncil();
        } else if (mode === 'dxo') {
            document.getElementById('dxo-prompt').value = fullPrompt;
            startDxO();
        } else if (mode === 'ensemble') {
            document.getElementById('ensemble-prompt').value = fullPrompt;
            startEnsemble();
        }
    }
}

function loadPreset(mode, presetId) {
    if (!presetId) return;

    const presets = JSON.parse(localStorage.getItem('satya_presets') || '{}');
    const modePresets = presets[mode] || [];
    const preset = presetId === 'preset-thinking' ? {
        id: 'preset-thinking',
        name: 'Thinking Models (Reasoning)',
        models: ['openai/o1', 'x-ai/grok-4', 'google/gemini-3-flash-preview'],
        chairman: 'anthropic/claude-opus-4.5' // Claude 4.5 Opus Chair
    } : modePresets.find(p => p.id == presetId);

    if (!preset) return;

    if (mode === 'council') {
        state.selectedCouncilModels = [...preset.models];
        if (preset.chairman) {
            const chairmanSelect = document.getElementById('chairman-select');
            if (chairmanSelect) chairmanSelect.value = preset.chairman;
        }
        renderCouncilModels();
    } else if (mode === 'ensemble') {
        state.selectedEnsembleModels = [...preset.models];
        renderEnsembleModels();
    } else if (mode === 'dxo' && preset.roles) {
        state.roles = [...preset.roles];
        renderRoles();
    }

    // Reset dropdown
    const dropdown = document.getElementById(`${mode}-preset-select`);
    if (dropdown) dropdown.value = '';
}

function loadPresetDropdowns() {
    const presets = JSON.parse(localStorage.getItem('satya_presets') || '{}');

    ['council', 'ensemble'].forEach(mode => {
        const dropdown = document.getElementById(`${mode}-preset-select`);
        if (!dropdown) return;

        const modePresets = presets[mode] || [];
        let optionsHtml = '<option value="">Load Preset...</option>';

        // Inject "Thinking Models" preset for Council
        if (mode === 'council') {
            optionsHtml += `<option value="preset-thinking">🧠 Thinking Models (O1, Grok 4, Gemini 3)</option>`;
        }

        dropdown.innerHTML = optionsHtml + modePresets.map(p => `<option value="${p.id}">${p.name} (${p.models.length} models)</option>`).join('');
    });
}

// ============================================
// ROLE MANAGEMENT (DxO)
// ============================================

function renderRoles() {
    const container = document.getElementById('role-assignments');
    container.innerHTML = state.roles.map((role, index) => `
        <div class="role-card">
            <div class="role-card-header">
                <div class="role-field">
                    <label>Role Name</label>
                    <input type="text" value="${role.name}" onchange="updateRole(${index}, 'name', this.value)">
                </div>
                <div class="role-field">
                    <label>Assigned Model</label>
                    <select onchange="updateRole(${index}, 'model', this.value)">
                        ${(() => {
            let filtered;
            if (state.ultraFreeMode) filtered = ULTRA_FREE_MODELS;
            else if (state.freeMode) filtered = ULTRA_FREE_MODELS; // freeMode now maps to Ultra Free
            else filtered = MODELS;
            // Add Perplexity if not already present (for Toyow institutional mode)
            const perplexityModel = { id: 'perplexity/llama-3.1-sonar-small-128k-online', name: 'Perplexity Sonar Small' };
            if (!filtered.find(m => m.id === perplexityModel.id)) {
                filtered = [...filtered, perplexityModel];
            }
            return filtered.map(m => `<option value="${m.id}" ${role.model === m.id ? 'selected' : ''}>${m.name}</option>`).join('');
        })()}
                    </select>
                </div>
                <div class="role-field">
                    <label>Perspective/Focus</label>
                    <input type="text" value="${role.perspective}" onchange="updateRole(${index}, 'perspective', this.value)">
                </div>
                <button class="remove-role-btn" onclick="removeRole(${index})">×</button>
            </div>
            <div class="role-instructions">
                <label>Role Instructions (Optional)</label>
                <textarea onchange="updateRole(${index}, 'instructions', this.value)">${role.instructions}</textarea>
            </div>
        </div>
    `).join('');
}

function updateRole(index, field, value) {
    state.roles[index][field] = value;
}

function addRole() {
    let defaultModel;
    if (state.ultraFreeMode) defaultModel = ULTRA_FREE_MODELS[0].id;
    else if (state.freeMode) defaultModel = ULTRA_FREE_MODELS[0].id; // freeMode now maps to Ultra Free
    else defaultModel = MODELS[0].id;

    state.roles.push({
        name: 'New Role',
        model: defaultModel,
        perspective: 'Custom perspective',
        instructions: 'Describe this role\'s focus and responsibilities.'
    });
    renderRoles();
}

function removeRole(index) {
    state.roles.splice(index, 1);
    renderRoles();
}

function loadTemplate(templateName) {
    state.roles = [...TEMPLATES[templateName]];
    renderRoles();
}

// ============================================
// QUICK PROMPTS
// ============================================

// ============================================
// API CALLS & UTILITIES
// ============================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function streamResponse(model, prompt, systemPrompt = '', attachments = [], retryCount = 0) {
    const apiKey = localStorage.getItem('satya_api_key') || '';
    const localEnabled = document.getElementById('local-llm-toggle')?.classList.contains('active');

    // In minimalist mode, use server-side proxy (no API key required)
    const useProxy = state.minimalistMode;

    if (!useProxy && !localEnabled && !apiKey) {
        alert('🔑 Please configure your OpenRouter API Key in Settings to continue.');
        showSettings();
        throw new Error('No API key provided');
    }

    const localEndpoint = document.getElementById('local-endpoint-input')?.value || 'http://localhost:11434/v1';

    // Choose endpoint: local LLM > proxy (minimalist) > direct OpenRouter
    let url;
    if (localEnabled) {
        url = `${localEndpoint}/chat/completions`;
    } else if (useProxy) {
        url = '/api/openrouter/chat/completions';
    } else {
        url = 'https://openrouter.ai/api/v1/chat/completions';
    }

    const MAX_RETRIES = 3;

    try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });

        let content;
        if (attachments && attachments.length > 0) {
            content = [{ type: 'text', text: prompt }];
            for (const attachment of attachments) {
                if (attachment.type.startsWith('image/')) {
                    content.push({ type: 'image_url', image_url: { url: attachment.data } });
                } else {
                    content.push({ type: 'text', text: `[File Attachment: ${attachment.name}]` });
                }
            }
        } else {
            content = prompt;
        }

        messages.push({ role: 'user', content: content });

        // Build headers - proxy handles auth server-side
        const headers = {
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Satya AI Council'
        };

        if (!useProxy && !localEnabled) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: true,
                max_tokens: 4000
            })
        });

        if (response.status === 401) {
            localStorage.removeItem('satya_api_key');
            localStorage.removeItem('satya_auth');
            document.getElementById('login-overlay').style.display = 'flex';
            const errorMsg = document.getElementById('login-error');
            if (errorMsg) {
                errorMsg.textContent = 'Action Required: Your API Key is invalid or expired.';
                errorMsg.style.display = 'block';
            }
            throw new Error('API Key Invalid');
        }

        if (response.status === 429 && retryCount < MAX_RETRIES && !localEnabled) {
            const delay = Math.pow(2, retryCount) * 1000 + (Math.random() * 1000);
            await sleep(delay);
            return streamResponse(model, prompt, systemPrompt, attachments, retryCount + 1);
        }

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.body.getReader();
    } catch (error) {
        if (error.message.includes('API Key Invalid')) throw error;
        if (retryCount < MAX_RETRIES) {
            await sleep(1000);
            return streamResponse(model, prompt, systemPrompt, attachments, retryCount + 1);
        }
        throw error;
    }
}

async function processStream(reader, onChunk, onComplete) {
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const json = JSON.parse(data);
                        const content = json.choices?.[0]?.delta?.content;
                        if (content) {
                            fullContent += content;
                            onChunk(content, fullContent);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    } catch (error) {
        console.error('Stream error:', error);
    }

    onComplete(fullContent);
}

// ============================================
// COUNCIL MODE
// ============================================

async function startCouncil(isContinue = false) {
    const originalPrompt = document.getElementById('council-prompt').value.trim();
    if (!originalPrompt) {
        alert('Please enter a research prompt.');
        return;
    }

    if (state.selectedCouncilModels.length < 2) {
        alert('Please select at least 2 models for the council.');
        return;
    }

    // Refresh state from UI elements
    const roundsToRun = isContinue ? 1 : parseInt(document.getElementById('council-rounds')?.value || 1);
    state.peerRankingEnabled = document.getElementById('council-peer-ranking-toggle')?.classList.contains('active');
    const chairman = document.getElementById('chairman-select').value;

    if (!isContinue) showResults('Council Deliberation');
    else document.getElementById('results-panel').classList.remove('hidden');

    const responsesContainer = document.getElementById('model-responses');
    const existingSynthesis = document.getElementById('synthesis-content').textContent;

    let currentContext = isContinue ? `Initial Prompt: ${originalPrompt}\n\nPrevious Synthesis: ${existingSynthesis}\n\nTask: Continue the research, refine details, and address unexplored angles.` : originalPrompt;
    let finalModelResponses = {};
    let finalSynthesis = '';

    const totalRoundsToRun = roundsToRun;

    for (let round = 1; round <= totalRoundsToRun; round++) {
        // If continuing, we treat this as a new round offset by existing state if we tracked it, 
        // but for now let's just label it "Continued Research"
        const displayRound = isContinue ? 'Continuation' : round;
        const roundTitle = !isContinue && totalRoundsToRun > 1 ? ` (Round ${round}/${totalRoundsToRun})` : (isContinue ? ' (Continuation)' : '');
        document.getElementById('results-title').textContent = `Council Deliberation${roundTitle}`;

        const modelResponses = {};
        const responsesContainer = document.getElementById('model-responses');

        // Clear or prepare container for round
        if (round === 1) responsesContainer.innerHTML = '';

        // Add round header if multi-round
        if (state.roundsCount > 1) {
            const roundHeader = document.createElement('div');
            roundHeader.className = 'round-header';
            roundHeader.style = 'grid-column: 1 / -1; margin: 20px 0 10px; padding: 10px; background: var(--bg-tertiary); border-radius: 8px; font-weight: 700; color: var(--teal-accent);';
            roundHeader.innerHTML = `ROUND ${round}: ${round === 1 ? 'Initial Analysis' : 'Deepening Insights'}`;
            responsesContainer.appendChild(roundHeader);
        }

        // Create individual cards for this round
        state.selectedCouncilModels.forEach(modelId => {
            const model = findModelById(modelId);
            const cardId = `${modelId}-round-${round}`;
            const cardHtml = createResponseCard(model.name, model.provider, cardId);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHtml;
            responsesContainer.appendChild(tempDiv.firstElementChild);
        });

        const roundPromises = state.selectedCouncilModels.map(async (modelId) => {
            const cardId = `${modelId}-round-${round}`;
            const systemPrompt = `You are a member of an AI council. 
            ${round > 1 ? `This is Round ${round} of the deliberation. Build upon the previous synthesis to provide deeper technical insights.` : 'Provide your initial expert analysis.'}
            Focus on accuracy, edge cases, and verifiable facts.`;

            try {
                // If it's a retry, we might need to clear previous error
                updateResponseCard(cardId, '<br><span class="cursor"></span>', 'streaming');

                const reader = await streamResponse(modelId, currentContext, systemPrompt, state.attachments.council);
                await processStream(
                    reader,
                    (chunk, full) => updateResponseCard(cardId, full, 'streaming'),
                    (full) => {
                        modelResponses[modelId] = full;
                        updateResponseCard(cardId, full, 'complete');
                    }
                );
            } catch (error) {
                // Individual Retry Button
                const retryHtml = `
                    <div class="error-box" style="color: #ef4444; padding: 10px; border: 1px solid #ef4444; border-radius: 8px; margin-top: 10px;">
                        <p><strong>Error:</strong> ${error.message}</p>
                        <button onclick="retrySingleModel('${cardId}', '${modelId}', '${currentContext.replace(/'/g, "\\'")}', '${systemPrompt.replace(/'/g, "\\'")}')" 
                             style="margin-top: 8px; background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 6px; cursor: pointer; color: var(--text-primary); font-size: 12px; display: flex; align-items: center; gap: 6px;">
                            <span>🔄</span> Retry this model
                        </button>
                    </div>`;
                updateResponseCard(cardId, retryHtml, 'error');
            }
        });

        await Promise.all(roundPromises);
        finalModelResponses = modelResponses;

        // Conduct synthesis for the round
        // Save args for retry mechanism
        state.lastSynthesisArgs = { chairman, originalPrompt, modelResponses, round, totalRounds: state.roundsCount };
        const intermediateSynthesis = await synthesizeCouncil(chairman, originalPrompt, modelResponses, round, state.roundsCount);
        finalSynthesis = intermediateSynthesis;

        // If another round follows, update context
        if (round < state.roundsCount) {
            currentContext = `Original Question: ${originalPrompt}\n\nPrevious Council Synthesis (Round ${round}):\n${intermediateSynthesis}\n\nTask: Analyze the above synthesis. Identify what's missing, where deeper technical detail is needed, or if there are any subtle risks not yet addressed. Provide a deeper, more refined level of research.`;
        }
    }

    // After all rounds, conduct Peer Ranking if enabled
    if (state.peerRankingEnabled) {
        await conductPeerRanking(originalPrompt, finalModelResponses);
    }

    saveToHistory('council', originalPrompt, state.selectedCouncilModels.length, null, finalModelResponses, finalSynthesis);

    // Auto-send to Notion if configured
    autoSendToNotion();
}

async function synthesizeCouncil(chairmanModel, originalPrompt, responses, round = 1, totalRounds = 1) {
    const synthesisPanel = document.getElementById('synthesis-panel');
    const synthesisContent = document.getElementById('synthesis-content');
    synthesisPanel.classList.remove('hidden');
    synthesisContent.innerHTML = '<span class="cursor"></span>';

    const responseSummary = Object.entries(responses).map(([modelId, response]) => {
        const model = findModelById(modelId);
        return `## ${model.name}'s Analysis:\n${response}`;
    }).join('\n\n---\n\n');

    const isFinalRound = round === totalRounds;

    // TOYOW v2.1 INSTITUTIONAL CHAIRMAN PROMPT (THE JUDGE)
    const synthesisPrompt = `You are the Chairman of the Toyow Decision Council.
Your goal is TRUTH, not consensus.

GOVERNANCE SETTING: ${TOYOW_GOVERNANCE.MODE}
EPISTEMIC GATE: ${TOYOW_GOVERNANCE.EPISTEMIC_GATE}

NEGATIVE CONSTRAINTS (STRICT):
1. JUDGE THE EVIDENCE: Deliberate ONLY over the provided prompt context. You are OFFLINE.
2. DO NOT SMOOTH: List logical conflicts explicitly under 'The Conflict'.
3. FLAG GAP: Mark [DATA MISSING] if claims lack evidence in the context.
4. ZERO MARKETING: Be dry, direct, and academic.
5. PRIORITY: If the Adversarial Critic identifies a flaw, it MUST lead the 'Risks' section.

**Original Question:** ${originalPrompt}
${totalRounds > 1 ? `**Current Round:** ${round} of ${totalRounds}` : ''}

**Council Members' Responses:**
${responseSummary}

OUTPUT STRUCTURE:
- **The Consensus:** (Facts agreed upon by all - cite evidence)
- **The Conflict:** (Where models disagreed - list explicitly)
- **The Risks:** (Adversarial Critic's flaws FIRST, then other failure modes)
- **The Verdict:** (Decision-useful summary with [DATA MISSING] gaps noted)
${isFinalRound ? `
---
METADATA_START
TAGS: [3-5 comma separated tags]
SUMMARY: [1-2 sentence key takeaway]
METADATA_END` : ''}`;

    let synthesisText = '';
    try {
        const reader = await streamResponse(chairmanModel, synthesisPrompt);
        await processStream(
            reader,
            (chunk, full) => {
                synthesisText = full;
                const roundText = totalRounds > 1 ? `<h4>Synthesis - Round ${round}</h4>` : '';
                synthesisContent.innerHTML = roundText + formatMarkdown(full) + '<span class="cursor"></span>';
            },
            (full) => {
                synthesisText = full;
                const roundText = totalRounds > 1 ? `<h4>Synthesis - Round ${round}</h4>` : '';
                synthesisContent.innerHTML = roundText + formatMarkdown(full);
                if (isFinalRound) autoFillMetadata(full);
            }
        );
    } catch (error) {
        console.error('Synthesis Error:', error);
        synthesisText = `Error generating synthesis: ${error.message}`;
        synthesisContent.innerHTML = `
            <div class="error-box" style="color: #ef4444; padding: 10px; border: 1px solid #ef4444; border-radius: 8px; margin-top: 10px;">
                <p><strong>Synthesis Failed:</strong> ${error.message}</p>
                <div style="margin-top: 12px; display: flex; align-items: center; gap: 10px;">
                    <button onclick="retrySynthesis()" style="background: var(--teal-accent); color: white; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600;">
                        🔄 Retry Synthesis
                    </button>
                    <span style="font-size: 0.9em; color: var(--text-secondary);">Click to try again</span>
                </div>
            </div>`;
    }
    return synthesisText;
}

// Global Retry Function
// Global Retry Function (Full Synthesis)
window.retrySynthesis = async function () {
    if (!state.lastSynthesisArgs) return;
    const { chairman, originalPrompt, modelResponses, round, totalRounds } = state.lastSynthesisArgs;

    const synthesisContent = document.getElementById('synthesis-content');
    if (synthesisContent) {
        synthesisContent.innerHTML = '<div class="loading-spinner"></div> Retrying synthesis...';
    }

    try {
        const result = await synthesizeCouncil(chairman, originalPrompt, modelResponses, round, totalRounds);
        console.log('Retry executed');
    } catch (e) {
        console.error('Retry failed:', e);
    }
};

// Retry Individual Model
window.retrySingleModel = async function (cardId, modelId, prompt, systemPrompt) {
    updateResponseCard(cardId, '<br><span class="cursor"></span>', 'streaming');
    try {
        // Handle escaped quotes if passed as string
        const cleanPrompt = prompt.replace(/\\'/g, "'");
        // systemPrompt is optional for Council mode (uses default role? No, Council uses prompt as is, systemPrompt is mainly for DxO)
        // Actually startCouncil passes 'undefined' for systemPrompt usually.

        let reader;
        if (state.currentTab === 'dxo') {
            reader = await streamResponse(modelId, cleanPrompt, systemPrompt ? systemPrompt.replace(/\\'/g, "'") : undefined, state.attachments.dxo);
        } else {
            reader = await streamResponse(modelId, cleanPrompt, undefined, state.attachments.council);
        }

        await processStream(
            reader,
            (chunk, full) => updateResponseCard(cardId, full, 'streaming'),
            (full) => {
                // Update the response in state if possible (but state.lastSynthesisArgs.modelResponses is deep)
                if (state.lastSynthesisArgs && state.lastSynthesisArgs.modelResponses) {
                    state.lastSynthesisArgs.modelResponses[modelId] = full;
                }
                updateResponseCard(cardId, full, 'complete');
            }
        );
    } catch (error) {
        const retryHtml = `
            <div class="error-box" style="color: #ef4444; padding: 10px; border: 1px solid #ef4444; border-radius: 8px; margin-top: 10px;">
                <p><strong>Error:</strong> ${error.message}</p>
                <button onclick="retrySingleModel('${cardId}', '${modelId}', '${prompt}', '${systemPrompt || ''}')" 
                        style="margin-top: 8px; background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 4px 10px; border-radius: 6px; cursor: pointer; color: var(--text-primary); font-size: 12px; display: flex; align-items: center; gap: 6px;">
                    <span>🔄</span> Retry this model
                </button>
            </div>`;
        updateResponseCard(cardId, retryHtml, 'error');
    }
};

window.savePreset = function () {
    const name = prompt("Enter a name for this preset:");
    if (!name) return;

    try {
        const currentModels = state.selectedCouncilModels;
        if (!currentModels || currentModels.length === 0) {
            alert("No models selected to save.");
            return;
        }

        let customPresets = JSON.parse(localStorage.getItem('satya_custom_presets') || '{}');
        customPresets[name] = currentModels;
        localStorage.setItem('satya_custom_presets', JSON.stringify(customPresets));

        // Re-render to show new chip
        renderCouncilModels();
        console.log(`✅ Preset "${name}" saved!`);
    } catch (e) {
        console.error("Failed to save preset", e);
        alert("Error saving preset.");
    }
};

// ============================================
// DxO MODE
// ============================================

async function startDxO(isContinue = false) {
    const prompt = document.getElementById('dxo-prompt').value.trim();
    if (!prompt) {
        alert('Please enter a problem statement or research question.');
        return;
    }

    // TOYOW INSTITUTIONAL: Use hard-coded roles in STRATEGIC/COMPLIANCE mode
    const useToyowRoles = TOYOW_GOVERNANCE.MODE === 'STRATEGIC' || TOYOW_GOVERNANCE.MODE === 'COMPLIANCE';
    const activeRoles = useToyowRoles ? TOYOW_DXO_ROLES : state.roles;

    if (activeRoles.length === 0) {
        alert('Please add at least one role.');
        return;
    }

    const roundsToRun = isContinue ? 1 : parseInt(document.getElementById('dxo-rounds')?.value || 1);
    const existingSynthesis = document.getElementById('synthesis-content').textContent;

    if (!isContinue) showResults('DxO Decision Analysis');
    else document.getElementById('results-panel').classList.remove('hidden');

    let currentContext = isContinue ? existingSynthesis : '';
    let finalRoleResponses = {};
    let finalSynthesis = '';

    for (let round = 1; round <= roundsToRun; round++) {
        const displayRound = isContinue ? 'Continuation' : round;
        const totalDisplay = isContinue ? 'Continuation' : roundsToRun;

        if (!isContinue && roundsToRun > 1) {
            document.getElementById('results-title').textContent = `DxO Analysis - Round ${round} of ${roundsToRun}`;
        } else if (isContinue) {
            document.getElementById('results-title').textContent = `DxO Analysis - Continuation`;
        }

        const roleResponses = {};
        const responsesContainer = document.getElementById('model-responses');
        if (round === 1) responsesContainer.innerHTML = '';

        // Query all roles in parallel - using activeRoles (institutional or user-defined)
        const promises = activeRoles.map(async (role, index) => {
            const cardId = `${role.name.replace(/\s+/g, '-')}-round-${round}`;

            // Create a new card for this round
            const cardHtml = createResponseCard(role.name, role.perspective, cardId);
            responsesContainer.insertAdjacentHTML('beforeend', cardHtml);

            if (index > 0) await sleep(index * 1000); // Slight stagger

            let systemPrompt = `You are acting as the ${role.name} in a multi-perspective analysis team.
Your focus: ${role.perspective}
Your instructions: ${role.instructions}`;

            if (round > 1) {
                systemPrompt += `\n\n**Previous Iteration Synthesis:**\n${currentContext}\n\nBased on the synthesis above, refine your analysis. Focus on addressing any gaps or debating points identified.`;
            }

            systemPrompt += `\n\nAnalyze the following problem from your unique perspective. Be thorough but stay focused on your specific role.`;

            try {
                const reader = await streamResponse(role.model, prompt, systemPrompt, state.attachments.dxo);
                await processStream(
                    reader,
                    (chunk, full) => updateResponseCard(cardId, full, 'streaming'),
                    (full) => {
                        roleResponses[role.name] = { response: full, role: role };
                        updateResponseCard(cardId, full, 'complete');
                    }
                );
            } catch (error) {
                updateResponseCard(cardId, `Error: ${error.message}`, 'error');
            }
        });

        await Promise.all(promises);

        finalRoleResponses = { ...finalRoleResponses, ...roleResponses };
        finalSynthesis = await synthesizeDxO(prompt, roleResponses, round, totalRounds);
        currentContext = finalSynthesis;
    }

    // Save to history
    saveToHistory('dxo', prompt, state.roles.length, state.roles.map(r => r.name), finalRoleResponses, finalSynthesis);

    // Auto-send to Notion if configured
    autoSendToNotion();
}

async function synthesizeDxO(originalPrompt, responses, round = 1, totalRounds = 1) {
    const synthesisPanel = document.getElementById('synthesis-panel');
    const synthesisContent = document.getElementById('synthesis-content');
    synthesisPanel.classList.remove('hidden');
    synthesisContent.innerHTML = '<span class="cursor"></span>';

    const responseSummary = Object.entries(responses).map(([roleName, data]) => {
        return `## ${roleName} (${data.role.perspective}):\n${data.response}`;
    }).join('\n\n---\n\n');

    const isFinalRound = round === totalRounds;

    // TOYOW v2.1 INSTITUTIONAL CHAIRMAN PROMPT (THE JUDGE)
    const synthesisPrompt = `You are the Chairman of the Toyow Decision Council.
Your goal is TRUTH, not consensus.

GOVERNANCE SETTING: ${TOYOW_GOVERNANCE.MODE}
EPISTEMIC GATE: ${TOYOW_GOVERNANCE.EPISTEMIC_GATE}

NEGATIVE CONSTRAINTS (STRICT):
1. JUDGE THE EVIDENCE: Deliberate ONLY over the provided prompt context. You are OFFLINE.
2. DO NOT SMOOTH: List logical conflicts explicitly under 'The Conflict'.
3. FLAG GAP: Mark [DATA MISSING] if claims lack evidence in the context.
4. ZERO MARKETING: Be dry, direct, and academic.
5. PRIORITY: If the Adversarial Critic identifies a flaw, it MUST lead the 'Risks' section.

**Original Problem:** ${originalPrompt}
${totalRounds > 1 ? `**Current Round:** ${round} of ${totalRounds}` : ''}

**Role-Based Analyses:**
${responseSummary}

OUTPUT STRUCTURE:
- **The Consensus:** (Facts agreed upon by all roles - cite evidence)
- **The Conflict:** (Where the Critic/Auditor disagreed - list explicitly)
- **The Risks:** (Adversarial Critic's flaws FIRST, then other failure modes)
- **The Verdict:** (Decision-useful summary with [DATA MISSING] gaps noted)
${isFinalRound ? `
---
METADATA_START
TAGS: [3-5 comma separated tags]
SUMMARY: [1-2 sentence key takeaway]
METADATA_END` : ''}`;

    let synthesisText = '';
    const chairmanModel = document.getElementById('chairman-select')?.value || MODELS[0].id;

    try {
        const reader = await streamResponse(chairmanModel, synthesisPrompt);
        await processStream(
            reader,
            (chunk, full) => {
                synthesisText = full;
                const roundText = totalRounds > 1 ? `<h4>DxO Synthesis - Round ${round}</h4>` : '';
                synthesisContent.innerHTML = roundText + formatMarkdown(full) + '<span class="cursor"></span>';
            },
            (full) => {
                synthesisText = full;
                const roundText = totalRounds > 1 ? `<h4>DxO Synthesis - Round ${round}</h4>` : '';
                synthesisContent.innerHTML = roundText + formatMarkdown(full);
                if (isFinalRound) autoFillMetadata(full);
            }
        );
    } catch (error) {
        synthesisText = `Error generating synthesis: ${error.message}`;
        synthesisContent.innerHTML = `<p style="color: #ef4444;">${synthesisText}</p>`;
    }
    return synthesisText;
}

// ============================================
// ENSEMBLE MODE
// ============================================

async function startEnsemble(isContinue = false) {
    const prompt = document.getElementById('ensemble-prompt').value.trim();
    if (!prompt) {
        alert('Please enter a question or topic.');
        return;
    }

    if (state.selectedEnsembleModels.length < 2) {
        alert('Please select at least 2 models for the ensemble.');
        return;
    }

    const roundsToRun = isContinue ? 1 : parseInt(document.getElementById('ensemble-rounds')?.value || 1);
    const existingSynthesis = document.getElementById('synthesis-content').textContent;

    if (!isContinue) showResults('Ensemble Analysis');
    else document.getElementById('results-panel').classList.remove('hidden');

    let currentContext = isContinue ? existingSynthesis : '';
    let finalAnonymousResponses = {};
    let finalSynthesis = '';

    for (let round = 1; round <= roundsToRun; round++) {
        const displayRound = isContinue ? 'Continuation' : round;
        const roundTitle = !isContinue && roundsToRun > 1 ? ` (Round ${round}/${roundsToRun})` : (isContinue ? ' (Continuation)' : '');
        document.getElementById('results-title').textContent = `Ensemble${roundTitle}`;

        const anonymousResponses = {};
        const responsesContainer = document.getElementById('model-responses');
        if (round === 1) responsesContainer.innerHTML = '';

        // Shuffle models once at the start of the session to keep labels consistent
        const shuffledModels = [...state.selectedEnsembleModels];
        if (round === 1) shuffledModels.sort(() => Math.random() - 0.5);

        const promises = shuffledModels.map(async (modelId, index) => {
            const anonName = ANONYMOUS_NAMES[index] || `Agent ${index + 1}`;
            const cardId = `${anonName.toLowerCase()}-round-${round}`;

            const cardHtml = createResponseCard(anonName, 'Anonymous Perspective', cardId, anonName.toLowerCase());
            responsesContainer.insertAdjacentHTML('beforeend', cardHtml);

            if (index > 0) await sleep(index * 1000);

            let systemPrompt = `Provide your analysis and perspective on the following question. Be thorough, insightful, and focused on substance. Your response will be anonymized for unbiased evaluation.`;

            if (round > 1) {
                systemPrompt += `\n\n**Previous Iteration Synthesis:**\n${currentContext}\n\nBased on the collective synthesis, refine your position or address any specific critiques.`;
            }

            try {
                const reader = await streamResponse(modelId, prompt, systemPrompt, state.attachments.ensemble);
                await processStream(
                    reader,
                    (chunk, full) => updateResponseCard(cardId, full, 'streaming'),
                    (full) => {
                        anonymousResponses[anonName] = full;
                        updateResponseCard(cardId, full, 'complete');
                    }
                );
            } catch (error) {
                updateResponseCard(cardId, `Error: ${error.message}`, 'error');
            }
        });

        await Promise.all(promises);

        finalAnonymousResponses = { ...finalAnonymousResponses, ...anonymousResponses };
        finalSynthesis = await synthesizeEnsemble(prompt, anonymousResponses, round, totalRounds);
        currentContext = finalSynthesis;
    }

    saveToHistory('ensemble', prompt, state.selectedEnsembleModels.length, null, finalAnonymousResponses, finalSynthesis);

    // Auto-send to Notion if configured
    autoSendToNotion();
}

async function synthesizeEnsemble(originalPrompt, responses, round = 1, totalRounds = 1) {
    const synthesisPanel = document.getElementById('synthesis-panel');
    const synthesisContent = document.getElementById('synthesis-content');
    synthesisPanel.classList.remove('hidden');

    const responseSummary = Object.entries(responses).map(([anonName, response]) => {
        return `## Agent ${anonName}:\n${response}`;
    }).join('\n\n---\n\n');

    const isFinalRound = round === totalRounds;

    // TOYOW v2.1 INSTITUTIONAL CHAIRMAN PROMPT (THE JUDGE)
    const synthesisPrompt = `You are the Chairman of the Toyow Decision Council.
Your goal is TRUTH, not consensus.

GOVERNANCE SETTING: ${TOYOW_GOVERNANCE.MODE}
EPISTEMIC GATE: ${TOYOW_GOVERNANCE.EPISTEMIC_GATE}

NEGATIVE CONSTRAINTS (STRICT):
1. JUDGE THE EVIDENCE: Deliberate ONLY over the provided prompt context. You are OFFLINE.
2. DO NOT SMOOTH: List logical conflicts explicitly under 'The Conflict'.
3. FLAG GAP: Mark [DATA MISSING] if claims lack evidence in the context.
4. ZERO MARKETING: Be dry, direct, and academic.
5. PRIORITY: If any agent identifies a critical flaw, it MUST lead the 'Risks' section.

**Original Question:** ${originalPrompt}
${totalRounds > 1 ? `**Current Round:** ${round} of ${totalRounds}` : ''}

**Anonymous Agent Responses:**
${responseSummary}

OUTPUT STRUCTURE:
- **The Consensus:** (Facts agreed upon by all agents - cite evidence)
- **The Conflict:** (Where agents disagreed - list explicitly)
- **The Risks:** (Critical flaws FIRST, then other failure modes)
- **The Verdict:** (Decision-useful summary with [DATA MISSING] gaps noted)
${isFinalRound ? `
---
METADATA_START
TAGS: [3-5 comma separated tags]
SUMMARY: [1-2 sentence key takeaway]
METADATA_END` : ''}`;

    let synthesisText = '';
    const chairmanModel = document.getElementById('chairman-select')?.value || MODELS[0].id;

    try {
        const reader = await streamResponse(chairmanModel, synthesisPrompt);
        await processStream(
            reader,
            (chunk, full) => {
                synthesisText = full;
                const roundText = totalRounds > 1 ? `<h4>Ensemble Synthesis - Round ${round}</h4>` : '';
                synthesisContent.innerHTML = roundText + formatMarkdown(full) + '<span class="cursor"></span>';
            },
            (full) => {
                synthesisText = full;
                const roundText = totalRounds > 1 ? `<h4>Ensemble Synthesis - Round ${round}</h4>` : '';
                synthesisContent.innerHTML = roundText + formatMarkdown(full);
                if (isFinalRound) autoFillMetadata(full);
            }
        );
    } catch (error) {
        synthesisText = `Error generating synthesis: ${error.message}`;
        synthesisContent.innerHTML = `<p style="color: #ef4444;">${synthesisText}</p>`;
    }
    return synthesisText;
}

// ============================================
// SUPER CHAT MODE
// ============================================

async function startSuperChat() {
    const prompt = document.getElementById('superchat-prompt').value.trim();
    if (!prompt) {
        alert('Please enter a message.');
        return;
    }

    const modelId = document.getElementById('superchat-model').value;
    const model = findModelById(modelId);

    showResults('Super Chat');

    const responsesContainer = document.getElementById('model-responses');
    responsesContainer.innerHTML = createResponseCard(model.name, model.provider, 'superchat');

    // Hide synthesis panel for super chat
    document.getElementById('synthesis-panel').classList.add('hidden');

    try {
        const reader = await streamResponse(modelId, prompt, '', state.attachments.superchat);
        await processStream(
            reader,
            (chunk, full) => updateResponseCard('superchat', full, 'streaming'),
            (full) => {
                updateResponseCard('superchat', full, 'complete');
                saveToHistory('superchat', prompt, 1);
                // Auto-send to Notion if configured
                autoSendToNotion();
            }
        );
    } catch (error) {
        updateResponseCard('superchat', `Error: ${error.message}`, 'error');
    }
}

// ============================================
// UI HELPERS
// ============================================

function createResponseCard(name, subtitle, id, avatarClass = '') {
    return `
        <div class="response-card" id="response-${id}">
            <div class="response-header">
                <div class="response-avatar ${avatarClass}">${name.charAt(0)}</div>
                <div class="response-info">
                    <h4>${name}</h4>
                    <p>${subtitle}</p>
                </div>
                <span class="response-status streaming" id="status-${id}">Thinking...</span>
            </div>
            <div class="response-content" id="content-${id}">
                <span class="cursor"></span>
            </div>
        </div>
    `;
}

function updateResponseCard(id, content, status) {
    const contentEl = document.getElementById(`content-${id}`);
    const statusEl = document.getElementById(`status-${id}`);

    if (contentEl) {
        if (status === 'streaming') {
            contentEl.innerHTML = formatMarkdown(content) + '<span class="cursor"></span>';
        } else {
            contentEl.innerHTML = formatMarkdown(content);
        }
    }

    if (statusEl) {
        if (status === 'complete') {
            statusEl.textContent = 'Complete';
            statusEl.className = 'response-status complete';
        } else if (status === 'error') {
            statusEl.textContent = 'Error';
            statusEl.className = 'response-status error';
        }
    }
}

function autoFillMetadata(synthesisText) {
    if (!synthesisText) return;

    console.log('autoFillMetadata called with text length:', synthesisText.length);

    const tagsInput = document.getElementById('session-tags');
    const notesInput = document.getElementById('session-notes');

    // Try multiple patterns for TAGS
    // Pattern 1: TAGS: content (until next keyword or end)
    let tagsMatch = synthesisText.match(/TAGS:\s*([^\n]+?)(?=\n(?:SUMMARY:|METADATA_END|\n)|$)/i);
    if (!tagsMatch) {
        // Pattern 2: TAGS: [bracketed content]
        tagsMatch = synthesisText.match(/TAGS:\s*\[([^\]]+)\]/i);
    }

    if (tagsMatch && tagsMatch[1] && tagsInput) {
        const tags = tagsMatch[1].trim().replace(/[\[\]]/g, '');
        console.log('Found TAGS:', tags);
        tagsInput.value = tags;
    } else if (tagsInput && !tagsInput.value) {
        // Auto-generate tags from key terms in the synthesis
        const keyTerms = extractKeyTerms(synthesisText);
        if (keyTerms.length > 0) {
            tagsInput.value = keyTerms.slice(0, 5).join(', ');
            console.log('Auto-generated tags:', tagsInput.value);
        }
    }

    // Fallback logic continues below

    // Try multiple patterns for SUMMARY
    // Pattern 1: SUMMARY: content (until next keyword or end, can span lines)
    let summaryMatch = synthesisText.match(/SUMMARY:\s*(.+?)(?=\n(?:METADATA_END|TAGS:|\n\n)|$)/is);
    if (!summaryMatch) {
        // Pattern 2: SUMMARY: [bracketed content]
        summaryMatch = synthesisText.match(/SUMMARY:\s*\[([^\]]+)\]/i);
    }

    if (summaryMatch && summaryMatch[1] && notesInput) {
        const summary = summaryMatch[1].trim().replace(/[\[\]]/g, '');
        console.log('Found SUMMARY:', summary.substring(0, 100));
        notesInput.value = summary.substring(0, 500);
    } else if (notesInput && !notesInput.value) {
        // Auto-generate a brief summary from synthesis (skip metadata section)
        let cleanText = synthesisText.replace(/METADATA_START[\s\S]*?METADATA_END/gi, '').trim();
        const firstSentences = cleanText.split(/[.!?]/).slice(0, 2).join('. ').trim();
        if (firstSentences) {
            notesInput.value = firstSentences.substring(0, 200) + (firstSentences.length > 200 ? '...' : '');
            console.log('Auto-generated summary');
        }
    }


    // Always trigger the fallback auto-populator for notes and tags if still empty
    setTimeout(autoPopulateSessionMeta, 100);
}

function extractKeyTerms(text) {
    // Common stop words to filter out
    const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
        'and', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'by', 'for', 'with', 'about', 'against',
        'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
        'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'once', 'here', 'there',
        'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
        'same', 'so', 'than', 'too', 'very', 'just', 'can', 'this', 'that', 'these', 'those', 'it', 'its']);

    // Extract capitalized terms and technical words
    const words = text.match(/\b[A-Z][a-zA-Z0-9]+\b/g) || [];
    const uniqueTerms = [...new Set(words)]
        .filter(word => word.length > 3 && !stopWords.has(word.toLowerCase()))
        .slice(0, 10);

    // Also extract terms that appear multiple times
    const wordCounts = {};
    const allWords = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    allWords.forEach(word => {
        if (!stopWords.has(word)) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
    });

    const frequentTerms = Object.entries(wordCounts)
        .filter(([word, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);

    return [...new Set([...uniqueTerms, ...frequentTerms])].slice(0, 5);
}

function formatMarkdown(text) {
    if (!text) return '';

    // Basic markdown formatting
    let html = text
        // Headers
        .replace(/^### (.*$)/gm, '<h4>$1</h4>')
        .replace(/^## (.*$)/gm, '<h4>$1</h4>')
        .replace(/^# (.*$)/gm, '<h3>$1</h3>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Lists
        .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
        .replace(/^\s*(\d+)\.\s+(.*)$/gm, '<li>$2</li>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        // Line breaks
        .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');

    // Wrap consecutive li elements in ul
    html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');

    return html;
}

function showResults(title) {
    document.getElementById('results-title').textContent = title;
    document.getElementById('results-panel').classList.remove('hidden');
    document.getElementById('synthesis-panel').classList.add('hidden');
    document.getElementById('model-responses').innerHTML = '';
}

function closeResults() {
    document.getElementById('results-panel').classList.add('hidden');
}

// Store current results for copy/export
let currentResults = {
    title: '',
    responses: {},
    synthesis: ''
};

function copyAllResults() {
    const title = document.getElementById('results-title').textContent;
    let text = `# ${title}\n\n`;
    text += `Generated: ${new Date().toLocaleString()}\n\n`;
    text += `---\n\n`;

    // Get all response cards
    const responseCards = document.querySelectorAll('#model-responses .response-card');
    if (responseCards.length > 0) {
        text += `## Council Member Responses\n\n`;
        responseCards.forEach(card => {
            const header = card.querySelector('.response-header h3');
            const body = card.querySelector('.response-body');
            if (header && body) {
                text += `### ${header.textContent}\n\n`;
                text += `${body.innerText}\n\n`;
                text += `---\n\n`;
            }
        });
    }

    // Get synthesis
    const synthesisPanel = document.getElementById('synthesis-panel');
    const synthesisContent = document.getElementById('synthesis-content');
    if (synthesisPanel && !synthesisPanel.classList.contains('hidden') && synthesisContent) {
        text += `## ✨ Final Synthesis\n\n`;
        text += `${synthesisContent.innerText}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

function exportCurrentResults() {
    const title = document.getElementById('results-title').textContent;
    let markdown = `# ${title}\n\n`;
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    // Get all response cards  
    const responseCards = document.querySelectorAll('#model-responses .response-card');
    if (responseCards.length > 0) {
        markdown += `## Council Member Responses\n\n`;
        responseCards.forEach(card => {
            const header = card.querySelector('.response-header h3');
            const body = card.querySelector('.response-body');
            if (header && body) {
                markdown += `### ${header.textContent}\n\n`;
                markdown += `${body.innerText}\n\n`;
                markdown += `---\n\n`;
            }
        });
    }

    // Get synthesis
    const synthesisPanel = document.getElementById('synthesis-panel');
    const synthesisContent = document.getElementById('synthesis-content');
    if (synthesisPanel && !synthesisPanel.classList.contains('hidden') && synthesisContent) {
        markdown += `## ✨ Final Synthesis\n\n`;
        markdown += `${synthesisContent.innerText}\n`;
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satya-${title.replace(/\s/g, '_')}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
}

async function sendToNotion() {
    console.log('🔔 sendToNotion invoked');

    const apiKey = localStorage.getItem('satya_notion_api_key');
    const databaseId = localStorage.getItem('satya_notion_db_id');

    console.log('✅ Notion API Key present:', !!apiKey, 'length:', apiKey?.length);
    console.log('✅ Notion Database ID:', databaseId);

    if (!apiKey || !databaseId) {
        alert('⚙️ Please set your Notion API Key and Database ID in Settings first.');
        showSettings();
        return;
    }

    let title = 'Satya Session';
    let synthesisContent = '';
    let responses = [];

    if (state.minimalistMode) {
        // Construct snapshot from chat history
        title = state.chatHistory[0]?.content?.substring(0, 50) || 'Satya Lite Chat';
        synthesisContent = "Minimalist Chat Session:\n" + state.chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    } else {

        // Try to get a smart title from the prompt or synthesis
        const promptEl = document.querySelector('.prompt-input');
        const promptText = promptEl ? promptEl.value.trim() : '';
        const synthesisTitle = document.getElementById('results-title')?.textContent;

        if (promptText) {
            // Use first 5-8 words of prompt
            title = promptText.split(/\s+/).slice(0, 8).join(' ') + '...';
        } else if (synthesisTitle && !synthesisTitle.includes('Council Deliberation')) {
            title = synthesisTitle;
        } else {
            // Fallback to extraction from synthesis
            const synthesisText = document.getElementById('synthesis-content')?.innerText || '';
            const firstLine = synthesisText.split('\n')[0].replace(/^#+\s*/, '').trim();
            title = firstLine.length > 10 && firstLine.length < 60 ? firstLine : 'Deep Research Session';
        }

        synthesisContent = document.getElementById('synthesis-content')?.innerText ?? '';

        const responseCards = document.querySelectorAll('#model-responses .response-card');
        responses = Array.from(responseCards).map(card => {
            const name = card.querySelector('.response-header h3')?.textContent ||
                card.querySelector('.response-header h4')?.textContent ||
                card.querySelector('.response-header')?.textContent?.trim() || 'Agent';
            const content = card.querySelector('.response-body')?.innerText ||
                card.querySelector('.response-content')?.innerText || '';
            return { name: name.trim(), content: content.trim() };
        }).filter(r => r.content.length > 0);
    }

    let tags = (document.getElementById('session-tags')?.value ?? '').split(',').map(t => t.trim()).filter(t => t !== '');

    // Add current mode to tags automatically if not present
    const currentModeTag = state.currentTab ? state.currentTab.charAt(0).toUpperCase() + state.currentTab.slice(1) : 'Council';
    if (!tags.includes(currentModeTag)) {
        tags.push(currentModeTag);
    }
    // Ensure tags are unique
    tags = [...new Set(tags)];

    const notes = document.getElementById('session-notes')?.value?.trim() ?? '';

    console.log('📊 Data collected:', { title, tags, notesLength: notes.length, responsesCount: responses.length });

    showCopyFeedback('Sending to Notion...');

    // Notion API via CORS Proxy (corsproxy.io supports POST with proper encoding)
    const proxyUrl = 'https://corsproxy.io/?';
    const notionUrl = 'https://api.notion.com/v1/pages';

    const body = {
        parent: { database_id: databaseId },
        properties: {
            Name: { title: [{ text: { content: title } }] },
            Tags: { multi_select: tags.map(t => ({ name: t })) },
            Date: { date: { start: new Date().toISOString() } }
        },
        children: []
    };

    // Add notes block
    if (notes) {
        body.children.push({
            object: 'block',
            type: 'callout',
            callout: {
                rich_text: [{ text: { content: `Researcher Notes:\n${notes}` } }],
                icon: { emoji: '📝' }
            }
        });
    }

    // Add synthesis block
    if (synthesisContent) {
        body.children.push({
            object: 'block',
            type: 'heading_2',
            heading_2: { rich_text: [{ text: { content: 'Final Synthesis' } }] }
        });

        // Chunk synthesis if too long (2000 char limit per block)
        const chunks = synthesisContent.match(/.{1,2000}/g) || [];
        chunks.forEach(chunk => {
            body.children.push({
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [{ text: { content: chunk } }] }
            });
        });
    }

    // Add responses as blocks
    if (responses.length > 0) {
        body.children.push({
            object: 'block',
            type: 'heading_2',
            heading_2: { rich_text: [{ text: { content: 'Council Responses' } }] }
        });

        responses.forEach(r => {
            body.children.push({
                object: 'block',
                type: 'heading_3',
                heading_3: { rich_text: [{ text: { content: r.name.substring(0, 100) } }] }
            });

            // Chunk response content
            const rChunks = r.content.match(/.{1,2000}/g) || [];
            rChunks.forEach(chunk => {
                body.children.push({
                    object: 'block',
                    type: 'paragraph',
                    paragraph: { rich_text: [{ text: { content: chunk } }] }
                });
            });
        });
    }

    console.log('🌐 Sending request via Firebase Cloud Function');
    console.log('📦 Payload size:', JSON.stringify(body).length, 'bytes');

    // Use Firebase Cloud Function as proxy (more reliable than third-party CORS proxies)
    // If Cloud Function is deployed, use it. Otherwise fall back to corsproxy.io
    const cloudFunctionUrl = 'https://us-central1-satya-468b9.cloudfunctions.net/notionProxy';
    const fallbackProxyUrl = 'https://corsproxy.io/?';

    try {
        // Try Firebase Cloud Function first
        const response = await fetch(cloudFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: 'https://api.notion.com/v1/pages',
                method: 'POST',
                body: body
            })
        });

        console.log('📡 Response status:', response.status, response.statusText);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Notion page created:', data);
            showCopyFeedback('✅ Success! Saved to Notion. 🎉');
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.error('❌ Notion Error:', errorData);
            alert(`❌ Notion Transfer Failed (${response.status}): ${errorData.message || 'Check your API Key and Database ID'}`);
        }
    } catch (err) {
        console.error('🚨 Fetch Error:', err);
        alert('🚨 Network error. Please check your connection.\n\nError: ' + err.message);
    }
}

// Auto-send to Notion (silent - only sends if credentials are configured)
async function autoSendToNotion() {
    const apiKey = localStorage.getItem('satya_notion_api_key');
    const databaseId = localStorage.getItem('satya_notion_db_id');

    // Only auto-send if both credentials are configured
    if (!apiKey || !databaseId) {
        return; // Silently skip if not configured
    }

    // Small delay to ensure DOM is updated
    setTimeout(async () => {
        try {
            await sendToNotion();
        } catch (err) {
            console.error('Auto-send to Notion failed:', err);
        }
    }, 500);
}

function showCopyFeedback(message) {
    const existing = document.querySelector('.copy-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = 'copy-feedback';
    feedback.textContent = message;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.classList.add('fade-out');
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// ============================================
// HISTORY
// ============================================

// History functions defined earlier
function updateHistoryStatsWrapper() {
    updateHistoryStats();
}

function saveToHistory(type, prompt, modelCount, roles = null, responses = null, synthesis = null) {
    const entryId = Date.now();
    const entry = {
        id: entryId,
        type: type,
        prompt: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
        fullPrompt: prompt,
        modelCount: modelCount,
        roles: roles,
        responses: responses,
        synthesis: synthesis,
        timestamp: new Date().toISOString(),
        status: 'Completed',
        tags: [],
        notes: ''
    };

    state.currentSessionId = entryId;
    state.history.unshift(entry);
    if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
    }

    localStorage.setItem('satya_history', JSON.stringify(state.history));
    persistHistory(); // Save to Firebase
    updateHistoryStats();

    // Reset session meta inputs
    const tagsInput = document.getElementById('session-tags');
    const notesInput = document.getElementById('session-notes');
    if (tagsInput) tagsInput.value = '';
    if (notesInput) notesInput.value = '';
}

function saveSessionMeta() {
    if (!state.currentSessionId) {
        alert('No active session to tag. Run a deliberation first.');
        return;
    }

    const tagsInput = document.getElementById('session-tags');
    const notesInput = document.getElementById('session-notes');
    const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t !== '');
    const notes = notesInput.value.trim();

    const entryIndex = state.history.findIndex(h => h.id === state.currentSessionId);
    if (entryIndex !== -1) {
        state.history[entryIndex].tags = tags;
        state.history[entryIndex].notes = notes;

        localStorage.setItem('satya_history', JSON.stringify(state.history));
        updateHistoryStats();
        showCopyFeedback('Research metadata saved to history!');
    }
}

function updateHistoryStats() {
    const counts = {
        total: state.history.length,
        superchat: state.history.filter(h => h.type === 'superchat').length,
        council: state.history.filter(h => h.type === 'council').length,
        dxo: state.history.filter(h => h.type === 'dxo').length,
        ensemble: state.history.filter(h => h.type === 'ensemble').length
    };

    document.getElementById('stat-total').textContent = counts.total;
    document.getElementById('stat-superchat').textContent = counts.superchat;
    document.getElementById('stat-council').textContent = counts.council;
    document.getElementById('stat-dxo').textContent = counts.dxo;
    document.getElementById('stat-ensemble').textContent = counts.ensemble;
}

// History filter state
let historyFilterMode = null;

function filterHistory() {
    // Text search filter (from search input)
    renderHistory();
}

function filterHistoryByMode(mode) {
    historyFilterMode = mode === 'all' ? null : mode;

    // Update filter chip active states
    document.querySelectorAll('.history-filter-bar .filter-chip').forEach(btn => {
        const btnMode = btn.dataset.mode;
        btn.classList.toggle('active', btnMode === mode);
    });

    updateHistoryStats();
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return; // Prevent error if not in main UI

    // Apply mode filter
    let filteredHistory = state.history;
    if (historyFilterMode) {
        filteredHistory = state.history.filter(h => h.type === historyFilterMode);
    }

    const groupedHistory = {
        council: filteredHistory.filter(h => h.type === 'council'),
        dxo: filteredHistory.filter(h => h.type === 'dxo'),
        ensemble: filteredHistory.filter(h => h.type === 'ensemble'),
        superchat: filteredHistory.filter(h => h.type === 'superchat')
    };

    let html = '';

    if (groupedHistory.council.length > 0) {
        html += `
            <div class="history-section council">
                <div class="history-section-title">Council Research Sessions</div>
                ${groupedHistory.council.map(h => createHistoryItem(h)).join('')}
            </div>
        `;
    }

    if (groupedHistory.dxo.length > 0) {
        html += `
            <div class="history-section dxo">
                <div class="history-section-title">DxO Decision Analysis Sessions</div>
                ${groupedHistory.dxo.map(h => createHistoryItem(h)).join('')}
            </div>
        `;
    }

    if (groupedHistory.ensemble.length > 0) {
        html += `
            <div class="history-section ensemble">
                <div class="history-section-title">Ensemble Analysis Sessions</div>
                ${groupedHistory.ensemble.map(h => createHistoryItem(h)).join('')}
            </div>
        `;
    }

    if (groupedHistory.superchat.length > 0) {
        html += `
            <div class="history-section superchat">
                <div class="history-section-title">Super Chat Sessions</div>
                ${groupedHistory.superchat.map(h => createHistoryItem(h)).join('')}
            </div>
        `;
    }

    if (html === '') {
        const modeText = historyFilterMode ? ` for ${historyFilterMode.charAt(0).toUpperCase() + historyFilterMode.slice(1)}` : '';
        html = `<p style="text-align: center; color: var(--text-muted); padding: 40px;">No history${modeText} yet. Start a research session to see it here.</p>`;
    }

    container.innerHTML = html;
}

function createHistoryItem(item) {
    const date = new Date(item.timestamp).toLocaleString();
    const meta = item.roles
        ? `${item.modelCount} roles: ${item.roles.join(', ')}`
        : `${item.modelCount} models`;

    const tagBadges = item.tags && item.tags.length > 0
        ? `<div class="history-tags">${item.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}</div>`
        : '';

    return `
        <div class="history-item" onclick="viewHistoryItem(${item.id})">
            <div class="history-item-info">
                <h4>${item.prompt}</h4>
                <div class="history-item-meta">
                    <span>${date}</span>
                    <span class="status">● ${item.status}</span>
                    <span>${meta}</span>
                </div>
                ${tagBadges}
            </div>
            <button class="export-btn" onclick="exportHistoryItem(${item.id})">
                ↓ Export
            </button>
        </div>
    `;
}

function deleteSession(itemId) {
    // Maps to existing delete logic if any, or just removes from history
    state.history = state.history.filter(h => h.id !== itemId);
    localStorage.setItem('satya_history', JSON.stringify(state.history));
    renderHistory();
}

function loadSession(itemId) {
    if (state.minimalistMode) {
        // For now, just show a placeholder or reload the session content
        // In the future, this will populate the minimalist chat area
        console.log('Loading session in minimalist mode:', itemId);
        toggleMinimalistSidebar();
    } else {
        viewHistoryItem(itemId);
    }
}

function viewHistoryItem(itemId) {
    const item = state.history.find(h => h.id === itemId);
    if (!item) return;

    state.currentSessionId = item.id;
    showResults(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} - ${new Date(item.timestamp).toLocaleDateString()}`);

    // Populate meta inputs
    const tagsInput = document.getElementById('session-tags');
    const notesInput = document.getElementById('session-notes');
    if (tagsInput) tagsInput.value = item.tags ? item.tags.join(', ') : '';
    if (notesInput) notesInput.value = item.notes || '';

    // Show responses if available
    if (item.responses) {
        const responsesContainer = document.getElementById('model-responses');
        responsesContainer.innerHTML = Object.entries(item.responses).map(([name, response]) => {
            return `
                <div class="response-card complete">
                    <div class="response-header">
                        <h3>${name}</h3>
                    </div>
                    <div class="response-body">
                        ${formatMarkdown(response)}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Show synthesis if available
    if (item.synthesis) {
        const synthesisPanel = document.getElementById('synthesis-panel');
        const synthesisContent = document.getElementById('synthesis-content');
        synthesisPanel.classList.remove('hidden');
        synthesisContent.innerHTML = formatMarkdown(item.synthesis);
    }

    // RESTORE SESSION STATE for Continuation
    const type = item.type.toLowerCase();

    // 1. Restore Prompt
    if (item.prompt) {
        setPrompt(type, item.prompt);
    }

    // 2. Restore Selected Models
    if (item.responses) {
        const modelIds = Object.keys(item.responses);
        if (type === 'council') {
            state.selectedCouncilModels = modelIds;
            // Visual update for checkboxes would be ideal here, but state is critical
            // Try to check boxes if they exist
            document.querySelectorAll('.model-checkbox').forEach(cb => {
                cb.checked = modelIds.includes(cb.value);
                const card = cb.closest('.model-card');
                if (card) {
                    if (cb.checked) card.classList.add('selected');
                    else card.classList.remove('selected');
                }
            });
            updateSelectionCounter();
        } else if (type === 'ensemble') {
            state.selectedEnsembleModels = modelIds;
        }
    }
}

function exportHistoryItem(itemId) {
    const item = state.history.find(h => h.id === itemId);
    if (!item) return;

    // Build readable markdown export
    let markdown = `# Satya ${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Session\n\n`;
    markdown += `**Date:** ${new Date(item.timestamp).toLocaleString()}\n`;
    markdown += `**Mode:** ${item.type}\n`;
    markdown += `**Models:** ${item.modelCount}\n`;
    if (item.tags && item.tags.length > 0) markdown += `**Tags:** ${item.tags.join(', ')}\n`;
    markdown += `\n---\n\n`;

    markdown += `## Prompt\n\n${item.fullPrompt || item.prompt}\n\n`;

    if (item.notes) {
        markdown += `## Research Notes\n\n${item.notes}\n\n`;
    }

    markdown += `---\n\n`;

    // Add roles if present (DxO mode)
    if (item.roles && item.roles.length > 0) {
        markdown += `## Roles\n\n`;
        item.roles.forEach(role => {
            markdown += `- **${role.name}**: ${role.perspective}\n`;
        });
        markdown += `\n---\n\n`;
    }

    // Add responses
    if (item.responses) {
        markdown += `## Responses\n\n`;
        Object.entries(item.responses).forEach(([name, response]) => {
            markdown += `### ${name}\n\n${response}\n\n---\n\n`;
        });
    }

    // Add synthesis
    if (item.synthesis) {
        markdown += `## ✨ Final Synthesis\n\n${item.synthesis}\n`;
    }

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `satya-session-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
}

function exportAllHistory() {
    if (!state.history || state.history.length === 0) {
        alert('No history to export.');
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `satya_full_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// ============================================
// SETTINGS
// ============================================

function showSettings() {
    loadApiKey();

    // Populate profile section if logged in
    const profileSection = document.getElementById('settings-profile-section');
    const profileEmail = document.getElementById('settings-profile-email');
    const profileInitial = document.getElementById('settings-profile-initial');

    if (state.userEmail) {
        if (profileSection) profileSection.style.display = 'block';
        if (profileEmail) profileEmail.textContent = state.userEmail;
        if (profileInitial) profileInitial.textContent = state.userEmail.charAt(0).toUpperCase();
    } else {
        if (profileSection) profileSection.style.display = 'none';
    }

    document.getElementById('settings-modal').classList.remove('hidden');
}

function logout() {
    localStorage.removeItem('satya_auth');
    localStorage.removeItem('satya_api_key');
    window.location.reload();
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function loadApiKey() {
    const savedKey = localStorage.getItem('satya_api_key');
    if (savedKey) {
        document.getElementById('api-key-input').value = savedKey;
    }

    const notionKey = localStorage.getItem('satya_notion_api_key');
    const notionDb = localStorage.getItem('satya_notion_db_id');
    if (notionKey) document.getElementById('notion-api-key').value = notionKey;
    if (notionDb) document.getElementById('notion-db-id').value = notionDb;
}

async function saveSettings() {
    const apiKey = document.getElementById('api-key-input').value.trim();
    if (apiKey) {
        localStorage.setItem('satya_api_key', apiKey);
    } else {
        localStorage.removeItem('satya_api_key');
    }

    const notionKey = document.getElementById('notion-api-key').value.trim();
    const notionDb = document.getElementById('notion-db-id').value.trim();

    if (notionKey) localStorage.setItem('satya_notion_api_key', notionKey);
    else localStorage.removeItem('satya_notion_api_key');

    if (notionDb) localStorage.setItem('satya_notion_db_id', notionDb);
    else localStorage.removeItem('satya_notion_db_id');

    // Save to Firestore
    if (state.currentUser) {
        try {
            await fb.saveUserData(state.currentUser, "config", {
                apiKey,
                notionKey,
                notionDb
            });
            console.log('✅ Config saved to Firestore');
        } catch (e) {
            console.error('❌ Failed to save config:', e);
            alert('⚠️ Settings saved locally, but Cloud Sync failed.\nReason: ' + e.message + '\n\nPlease fix your Firestore Rules in Firebase Console!');
        }
    }

    closeSettings();
    showCopyFeedback('Settings saved!');
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeResults();
        closeHistory();
        closeSettings();
    }
});

// Close modals on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// ============================================
// BENCHMARK TESTS
// ============================================

const BENCHMARK_TESTS = {
    'blue-eyed': {
        name: 'Blue-Eyed Islanders',
        icon: '🧩',
        prompt: `Solve this logic puzzle step by step:

100 people live on an island. Some have blue eyes, some have brown eyes. They cannot see their own eye color, but can see everyone else's. If anyone ever figures out their own eye color, they must leave the island at midnight that same day. There are no mirrors, and they cannot directly communicate about eye colors.

One day, a visitor comes and announces to everyone: "At least one person on this island has blue eyes."

Everyone on the island is a perfect logician. They can deduce anything that is logically possible.

Key questions to answer:
1. Does anyone leave the island? If so, who and when?
2. What exactly happens if there are exactly K blue-eyed people?
3. Explain the step-by-step reasoning for how they figure this out.`,
        evaluationCriteria: ['Correctly identifies induction/recursion', 'Explains K=1 base case', 'Shows K-day departure for K blue-eyed people', 'Explains the "common knowledge" concept']
    },
    'three-gods': {
        name: 'Three Gods Puzzle',
        icon: '🔮',
        prompt: `Solve this famous logic puzzle:

Three gods A, B, and C are called, in some order, True, False, and Random.
- True always speaks truly
- False always speaks falsely  
- Random speaks randomly (sometimes true, sometimes false)

Your task is to determine the identities of A, B, and C by asking exactly three yes-no questions. Each question must be posed to exactly one god.

Additional complications:
- The gods understand English but answer in their own language with words "da" and "ja" - you don't know which word means yes and which means no
- Random's answers are determined by the flip of a fair coin

Provide:
1. The three questions to ask
2. Which god to ask each question
3. How to interpret the answers to determine all three identities`,
        evaluationCriteria: ['Handles the da/ja language barrier', 'Uses self-referential or counterfactual questions', 'Correctly eliminates Random first', 'Provides complete 3-question strategy']
    },
    'coding': {
        name: 'Coding Challenge',
        icon: '💻',
        prompt: `Implement Manacher's Algorithm in Python to find the longest palindromic substring in a given string.

Requirements:
1. Time complexity must be O(n)
2. Include clear comments explaining each step
3. Handle edge cases (empty string, single character, all same characters)
4. Include test cases demonstrating correctness

Explain:
1. Why the naive approach is O(n²) or O(n³)
2. How Manacher's algorithm achieves O(n) time
3. The key insight about palindrome symmetry that makes this possible`,
        evaluationCriteria: ['Correct O(n) implementation', 'Proper string transformation with separators', 'Correct center/radius expansion', 'Handles all edge cases', 'Clear explanation of the algorithm']
    },
    'debate': {
        name: 'AI Ethics Debate',
        icon: '⚖️',
        prompt: `Analyze the ethical implications of AI systems making autonomous decisions in three critical domains:

1. **Healthcare**: AI diagnosing diseases and recommending treatments
2. **Criminal Justice**: AI predicting recidivism and influencing sentencing
3. **Financial Lending**: AI determining loan approvals and credit limits

For each domain, address:
- Key ethical concerns (bias, accountability, transparency)
- Real-world examples of AI failures or successes
- Proposed safeguards and their limitations
- Your position on appropriate AI autonomy levels

Conclude with a framework for when AI should augment vs. replace human decision-making.`,
        evaluationCriteria: ['Balanced analysis of benefits and risks', 'Concrete real-world examples', 'Nuanced discussion of tradeoffs', 'Practical recommendations', 'Addresses accountability and bias']
    }
};

let selectedBenchmark = null;
let lastSessionContext = null;

function selectBenchmark(benchmarkId) {
    selectedBenchmark = benchmarkId;

    // Update UI
    document.querySelectorAll('.benchmark-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-benchmark="${benchmarkId}"]`)?.classList.add('selected');

    const benchmark = BENCHMARK_TESTS[benchmarkId];
    if (benchmark) {
        document.getElementById('benchmark-selected').classList.remove('hidden');
        document.getElementById('selected-benchmark-icon').textContent = benchmark.icon;
        document.getElementById('selected-benchmark-name').textContent = benchmark.name;
    }
}

function toggleBenchmarkSelection() {
    const toggle = document.getElementById('use-current-selection');
    toggle.classList.toggle('active');
}

async function startBenchmark() {
    if (!selectedBenchmark) {
        alert('Please select a benchmark test first.');
        return;
    }

    const benchmark = BENCHMARK_TESTS[selectedBenchmark];
    const mode = document.getElementById('benchmark-mode').value;

    // Set the prompt and run the appropriate mode
    if (mode === 'council') {
        document.getElementById('council-prompt').value = benchmark.prompt;
        switchTab('council');
        startCouncil();
    } else {
        document.getElementById('ensemble-prompt').value = benchmark.prompt;
        switchTab('ensemble');
        startEnsemble();
    }
}

// continueSession is defined above (around line 1020) with full context handling

// Store session context after each run
function storeSessionContext(mode, prompt, responses, synthesisText) {
    lastSessionContext = {
        mode,
        prompt,
        responses,
        synthesisText,
        timestamp: new Date().toISOString()
    };
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function toggleExportMenu() {
    const menu = document.getElementById('export-menu');
    menu.classList.toggle('hidden');

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeExportMenuOnOutsideClick, { once: true });
    }, 0);
}

function closeExportMenuOnOutsideClick(e) {
    const menu = document.getElementById('export-menu');
    const wrapper = document.querySelector('.export-dropdown-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        menu.classList.add('hidden');
    }
}

function exportAsPDF() {
    // Close menu
    document.getElementById('export-menu').classList.add('hidden');

    // Use browser print to PDF
    const title = document.getElementById('results-title').textContent;
    const resultsContent = document.querySelector('.results-content').innerHTML;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title} - Satya Export</title>
            <style>
                body { 
                    font-family: 'Inter', -apple-system, sans-serif; 
                    padding: 40px; 
                    max-width: 800px; 
                    margin: 0 auto;
                    color: #333;
                    line-height: 1.6;
                }
                h1 { color: #00DDB3; border-bottom: 2px solid #00DDB3; padding-bottom: 10px; }
                h2 { color: #8b5cf6; margin-top: 24px; }
                h3 { color: #666; }
                .response-card { 
                    border: 1px solid #ddd; 
                    border-radius: 8px; 
                    padding: 16px; 
                    margin: 16px 0; 
                    background: #f9f9f9;
                }
                .synthesis-panel {
                    border: 2px solid #8b5cf6;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 24px;
                    background: #faf5ff;
                }
                pre { background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; }
                code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <p><em>Generated: ${new Date().toLocaleString()}</em></p>
            ${resultsContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function generateShareableLink() {
    // Close menu
    document.getElementById('export-menu').classList.add('hidden');

    const title = document.getElementById('results-title').textContent;
    const synthesisContent = document.getElementById('synthesis-content').innerText;

    // Create a simplified, anonymized version for sharing
    const shareData = {
        title: title,
        synthesis: synthesisContent,
        timestamp: new Date().toISOString(),
        models: 'anonymized'
    };

    // Encode as base64 (simplified approach - in production use proper backend)
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const shareUrl = `${window.location.origin}${window.location.pathname}#share=${encoded}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
        showCopyFeedback('Shareable link copied to clipboard!');
    }).catch(err => {
        prompt('Copy this shareable link:', shareUrl);
    });
}

// ============================================
// CUSTOM ROLE STORAGE
// ============================================

function saveCustomRoles() {
    localStorage.setItem('satya_custom_roles', JSON.stringify(state.roles));
}

function loadCustomRoles() {
    const saved = localStorage.getItem('satya_custom_roles');
    if (saved) {
        try {
            state.roles = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load custom roles:', e);
        }
    }
}

// Add custom role with persistence
function addCustomRole(roleData = null) {
    let defaultModel;
    if (state.ultraFreeMode) defaultModel = ULTRA_FREE_MODELS[0].id;
    else if (state.beastFreeMode) defaultModel = BEAST_FREE_MODELS[0].id;
    else if (state.freeMode) defaultModel = ULTRA_FREE_MODELS[0].id; // freeMode now maps to Ultra Free
    else defaultModel = MODELS[0].id;

    const newRole = roleData || {
        name: 'Custom Role',
        model: defaultModel,
        perspective: 'Custom perspective',
        instructions: 'Define this role\'s focus and responsibilities.',
        isCustom: true
    };

    state.roles.push(newRole);
    saveCustomRoles();
    renderRoles();
}

// ============================================
// HISTORY FUNCTIONS (Global scope for window exports)
// ============================================
function showHistory() {
    switchTab('history');
    renderHistory();
}

function closeHistory() {
    switchTab('council');
}

// ============================================
// EXPOSE TO WINDOW (Required for module type)
// ============================================
window.loginWithGoogle = loginWithGoogle;
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.firebaseLogout = firebaseLogout;
window.showHistory = showHistory;
window.toggleUltraFreeMode = toggleUltraFreeMode;
window.showSettings = showSettings;
window.closeSettings = closeSettings;
window.closeHistory = closeHistory;
window.deleteSession = deleteSession;
window.loadSession = loadSession;
window.closeResults = closeResults;
window.sendToNotion = sendToNotion;
window.saveSettings = saveSettings;
window.toggleMobileMenu = toggleMobileMenu;
window.setPrompt = setPrompt;
window.toggleCouncilModel = toggleCouncilModel;
window.toggleEnsembleModel = toggleEnsembleModel;
window.removeAttachment = removeAttachment;
window.removeRole = removeRole;
window.viewHistoryItem = viewHistoryItem;
window.exportHistoryItem = exportHistoryItem;
window.startCouncil = startCouncil;
window.copyAllResults = copyAllResults;
window.exportCurrentResults = exportCurrentResults;
// Additional exposures for ALL onclick handlers
window.closeMobileMenu = closeMobileMenu;
window.logout = firebaseLogout; // alias
window.closeFullscreenReader = closeFullscreenReader;
window.triggerUpload = triggerUpload;
window.toggleFilter = toggleFilter;
window.savePreset = savePreset;
window.loadPreset = loadPreset;
window.filterHistory = filterHistory;
window.startDxO = startDxO;
window.addRole = addRole;
window.loadTemplate = loadTemplate;
window.startEnsemble = startEnsemble;
window.startSuperChat = startSuperChat;
window.selectBenchmark = selectBenchmark;
window.toggleBenchmarkSelection = toggleBenchmarkSelection;
window.startBenchmark = startBenchmark;
window.saveSessionMeta = saveSessionMeta;
// continueResearch was referenced but not defined - skip to prevent crash
window.renderLeaderboard = renderLeaderboard;
window.switchTab = switchTab;
window.filterHistoryByMode = filterHistoryByMode;

// TOYOW BUNDLE SELECTOR
// Institutional models for Council/Ensemble
const TOYOW_BUNDLE_MODELS = [
    'deepseek/deepseek-r1',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-2.0-flash-exp:free',
    'perplexity/llama-3.1-sonar-small-128k-online'
];

// Council members to auto-select (excluding Perplexity which is for DxO)
const TOYOW_COUNCIL_MODELS = [
    'deepseek/deepseek-r1',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-2.0-flash-exp:free'
];

// Toyow mode state
// Toyow mode state - ACTIVE BY DEFAULT (Institutional Default)
let toyowModeActive = true;

window.toggleToyowMode = function (btn) {
    toyowModeActive = !toyowModeActive;

    // Update button state
    if (btn) {
        btn.classList.toggle('active', toyowModeActive);
    }

    // Update the "Institutional Mode" badge
    const badge = document.getElementById('toyow-mode-badge');
    if (badge) {
        badge.style.display = toyowModeActive ? 'inline-flex' : 'none';
    }

    // Toggle persona chips visibility
    const personaSection = document.querySelector('#chairman-persona')?.closest('.card.prompt-card')?.querySelector('.quick-prompts');
    if (personaSection) {
        personaSection.style.display = toyowModeActive ? 'none' : 'flex';
    }

    // Toggle peer ranking visibility
    const peerRankingToggle = document.getElementById('council-peer-ranking-toggle')?.closest('.setting-header');
    if (peerRankingToggle) {
        peerRankingToggle.style.display = toyowModeActive ? 'none' : 'flex';
    }

    if (toyowModeActive) {
        // Auto-select the 3 Toyow Council models
        state.selectedCouncilModels = [...TOYOW_COUNCIL_MODELS];
        state.selectedEnsembleModels = [...TOYOW_BUNDLE_MODELS];

        // Set Chairman to Claude 3.5 Sonnet
        const chairmanSelect = document.getElementById('chairman-select');
        if (chairmanSelect) {
            chairmanSelect.value = 'anthropic/claude-3.5-sonnet';
        }

        // Clear persona textarea
        const personaTextarea = document.getElementById('chairman-persona');
        if (personaTextarea) {
            personaTextarea.value = '';
            personaTextarea.placeholder = '🔒 Institutional mode: Chairman uses constrained truth-seeking prompt';
        }
    } else {
        // Restore persona placeholder
        const personaTextarea = document.getElementById('chairman-persona');
        if (personaTextarea) {
            personaTextarea.placeholder = "Define the Chairman's synthesis style... e.g., 'Analytical and data-driven, focuses on consensus and actionable insights'";
        }
    }

    // Re-render models with filter
    renderCouncilModels();
    if (typeof renderEnsembleModels === 'function') renderEnsembleModels();
};

// Legacy function for backwards compatibility
window.selectToyowBundle = function () {
    const btn = document.querySelector('.toyow-filter');
    if (btn && !toyowModeActive) {
        toggleToyowMode(btn);
    }
};

// Chairman Persona helper
window.setChairmanPersona = function (persona) {
    const textarea = document.getElementById('chairman-persona');
    if (textarea) {
        textarea.value = persona;
        textarea.focus();
    }
};

// ============================================
// PROFILE PANEL FUNCTIONS
// ============================================

// Initialize profile from local storage on load
window.initProfile = function () {
    try {
        const savedPhoto = localStorage.getItem('satya_profile_photo');
        if (savedPhoto && savedPhoto !== "null" && savedPhoto !== "undefined") {
            const headerAvatar = document.getElementById('profile-avatar');
            if (headerAvatar) {
                headerAvatar.innerHTML = `<img src="${savedPhoto}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            }
            const photoEl = document.getElementById('profile-photo');
            if (photoEl) {
                photoEl.innerHTML = `<img src="${savedPhoto}" alt="Profile">`;
            }
        }
    } catch (e) {
        console.error("Profile init error:", e);
    }
};

// Polling safety check for profile photo (in case Firebase overwrites it)
setTimeout(() => { if (window.initProfile) window.initProfile(); }, 1000);
setTimeout(() => { if (window.initProfile) window.initProfile(); }, 3000);

function toggleProfilePanel() {
    const panel = document.getElementById('profile-modal');
    if (!panel) return;

    panel.classList.toggle('hidden');

    // If opening, populate with current data
    if (!panel.classList.contains('hidden')) {
        populateProfilePanel();
    }
}

// Initialize profile from local storage on load
window.initProfile = function () {
    const savedPhoto = localStorage.getItem('satya_profile_photo');
    if (savedPhoto) {
        const headerAvatar = document.getElementById('profile-avatar');
        if (headerAvatar) {
            headerAvatar.innerHTML = `<img src="${savedPhoto}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        }
        // Also update modal photo if it exists (though it might not be visible)
        const photoEl = document.getElementById('profile-photo');
        if (photoEl) {
            photoEl.innerHTML = `<img src="${savedPhoto}" alt="Profile">`;
        }
    }
};

function populateProfilePanel() {
    const emailDisplay = document.getElementById('profile-email-display');
    const nameInput = document.getElementById('profile-display-name');
    const photoInitial = document.getElementById('profile-photo-initial');
    const photoEl = document.getElementById('profile-photo');
    const apiKeyInput = document.getElementById('profile-api-key');
    const notionKeyInput = document.getElementById('profile-notion-key');
    const notionDbInput = document.getElementById('profile-notion-db');

    // Populate email
    if (emailDisplay && state.userEmail) {
        emailDisplay.textContent = state.userEmail;
    }

    // Populate photo initial
    if (photoInitial && state.userEmail) {
        photoInitial.textContent = state.userEmail.charAt(0).toUpperCase();
    }

    // Populate name from state or localStorage
    const savedName = localStorage.getItem('satya_display_name');
    if (nameInput && savedName) {
        nameInput.value = savedName;
    }

    // Populate saved photo
    const savedPhoto = localStorage.getItem('satya_profile_photo');
    if (savedPhoto && photoEl) {
        photoEl.innerHTML = `<img src="${savedPhoto}" alt="Profile">`;
    }

    // Populate API keys
    if (apiKeyInput) apiKeyInput.value = localStorage.getItem('satya_api_key') || '';
    if (notionKeyInput) notionKeyInput.value = localStorage.getItem('satya_notion_api_key') || '';
    if (notionDbInput) notionDbInput.value = localStorage.getItem('satya_notion_db_id') || '';
}

function triggerPhotoUpload() {
    document.getElementById('photo-upload')?.click();
}

async function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Limit file size to 2MB for Firebase Storage
    if (file.size > 2 * 1024 * 1024) {
        alert('Photo must be less than 2MB');
        return;
    }

    const photoEl = document.getElementById('profile-photo');
    if (photoEl) photoEl.innerHTML = '<div class="loading-spinner"></div> Uploading...';

    console.log('Starting photo upload...', file.name, file.size);

    try {
        // Check if user is logged in
        const user = fb.auth.currentUser;
        if (user) {
            try {
                // Upload to Firebase Storage
                const photoURL = await fb.uploadProfilePhoto(user.uid, file);

                // Update UI with cloud URL
                if (photoEl) {
                    photoEl.innerHTML = `<img src="${photoURL}" alt="Profile">`;
                }
                const headerAvatar = document.getElementById('profile-avatar');
                if (headerAvatar) {
                    const timestamp = Date.now();
                    headerAvatar.innerHTML = `<img src="${photoURL}?t=${timestamp}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                }
                console.log('✅ Profile photo uploaded to Firebase Storage');
            } catch (firebaseError) {
                console.error('Firebase upload failed, falling back to localStorage:', firebaseError);
                // Fallback to localStorage when Firebase upload fails
                const reader = new FileReader();
                reader.onload = function (e) {
                    const dataUrl = e.target.result;
                    if (photoEl) {
                        photoEl.innerHTML = `<img src="${dataUrl}" alt="Profile">`;
                    }
                    const headerAvatar = document.getElementById('profile-avatar');
                    if (headerAvatar) {
                        headerAvatar.innerHTML = `<img src="${dataUrl}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                    }
                    localStorage.setItem('satya_profile_photo', dataUrl);
                    console.log('✅ Profile photo saved to localStorage (Firebase fallback)');
                };
                reader.readAsDataURL(file);
            }
        } else {
            // Fallback to localStorage for non-logged users
            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target.result;
                if (photoEl) {
                    photoEl.innerHTML = `<img src="${dataUrl}" alt="Profile">`;
                }
                const headerAvatar = document.getElementById('profile-avatar');
                if (headerAvatar) {
                    headerAvatar.innerHTML = `<img src="${dataUrl}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
                }
                localStorage.setItem('satya_profile_photo', dataUrl);
            };
            reader.readAsDataURL(file);
        }
    } catch (error) {
        console.error('Photo upload error:', error);
        alert('Failed to upload photo. Please try again.');
        if (photoEl) {
            photoEl.innerHTML = `<span style="font-size:32px;">📷</span>`;
        }
    }
}

function saveProfileSettings() {
    const nameInput = document.getElementById('profile-display-name');
    const apiKeyInput = document.getElementById('profile-api-key');
    const notionKeyInput = document.getElementById('profile-notion-key');
    const notionDbInput = document.getElementById('profile-notion-db');

    // Save display name
    if (nameInput && nameInput.value.trim()) {
        localStorage.setItem('satya_display_name', nameInput.value.trim());
    }

    // Save API keys
    const apiKey = apiKeyInput?.value.trim() || '';
    const notionKey = notionKeyInput?.value.trim() || '';
    const notionDb = notionDbInput?.value.trim() || '';

    if (apiKey) localStorage.setItem('satya_api_key', apiKey);
    else localStorage.removeItem('satya_api_key');

    if (notionKey) localStorage.setItem('satya_notion_api_key', notionKey);
    else localStorage.removeItem('satya_notion_api_key');

    if (notionDb) localStorage.setItem('satya_notion_db_id', notionDb);
    else localStorage.removeItem('satya_notion_db_id');

    // Also save to Firestore if logged in
    if (state.currentUser) {
        fb.saveUserData(state.currentUser, "config", {
            apiKey,
            notionKey,
            notionDb,
            displayName: nameInput?.value.trim() || ''
        }).then(() => console.log('✅ Profile saved to cloud'))
            .catch(e => console.error('❌ Cloud save failed:', e));
    }

    showCopyFeedback('Settings saved!');
}

// Expose new functions
window.toggleProfilePanel = toggleProfilePanel;
window.toggleExportMenu = toggleExportMenu;
window.triggerPhotoUpload = triggerPhotoUpload;
window.handlePhotoUpload = handlePhotoUpload;
window.saveProfileSettings = saveProfileSettings;

// ============================================
// COMPREHENSIVE EVENT LISTENERS (DOM Ready)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Profile Panel
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) {
        profileAvatar.addEventListener('click', toggleProfilePanel);
        console.log('✅ Profile avatar click attached');
    }

    // Load saved profile photo from localStorage
    const savedPhoto = localStorage.getItem('satya_profile_photo');
    if (savedPhoto) {
        const photoEl = document.getElementById('profile-photo');
        if (photoEl) {
            photoEl.innerHTML = `<img src="${savedPhoto}" alt="Profile">`;
        }
        const headerAvatar = document.getElementById('profile-avatar');
        if (headerAvatar) {
            headerAvatar.innerHTML = `<img src="${savedPhoto}" alt="Profile" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        }
        console.log('✅ Profile photo restored from localStorage');
    }

    // Results panel buttons
    setTimeout(() => {
        const continueBtn = document.querySelector('[onclick*="continueSession"]');
        const copyBtn = document.querySelector('[onclick*="copyAllResults"]');
        const exportBtn = document.querySelector('[onclick*="exportCurrentResults"]');

        if (continueBtn) continueBtn.onclick = continueSession;
        if (copyBtn) copyBtn.onclick = copyAllResults;
        if (exportBtn) exportBtn.onclick = exportCurrentResults;

        console.log('✅ Results buttons patched');

        // TOYOW v2.1: Activate Toyow UI state on page load (institutional default)
        if (typeof toyowModeActive !== 'undefined' && toyowModeActive) {
            const toyowBtn = document.querySelector('.toyow-filter');
            if (toyowBtn) toyowBtn.classList.add('active');

            const badge = document.getElementById('toyow-mode-badge');
            if (badge) badge.style.display = 'inline-flex';

            // Hide personas and peer ranking in institutional mode
            const personaSection = document.querySelector('#chairman-persona')?.closest('.card.prompt-card')?.querySelector('.quick-prompts');
            if (personaSection) personaSection.style.display = 'none';

            const peerRankingToggle = document.getElementById('council-peer-ranking-toggle')?.closest('.setting-header');
            if (peerRankingToggle) peerRankingToggle.style.display = 'none';

            console.log('✅ Toyow Institutional Mode activated by default');
        }
    }, 1000);
});

// Additional missing exposures
window.continueSession = continueSession;
window.autoPopulateSessionMeta = autoPopulateSessionMeta;

// ============================================
// AUTO-POPULATE SESSION METADATA
// ============================================
function autoPopulateSessionMeta() {
    const synthesisContent = document.getElementById('synthesis-content')?.innerText || '';
    const tagsInput = document.getElementById('session-tags');
    const notesInput = document.getElementById('session-notes');

    if (!synthesisContent) return;

    // Extract key themes as tags (first 3-5 significant words)
    const words = synthesisContent.split(/\s+/).filter(w => w.length > 5);
    const uniqueWords = [...new Set(words)].slice(0, 5);
    const suggestedTags = uniqueWords.join(', ');

    // Generate a summary note
    const firstSentence = synthesisContent.split('.')[0]?.trim() || '';
    const summaryNote = firstSentence.length > 200
        ? firstSentence.substring(0, 200) + '...'
        : firstSentence;

    // Populate if fields are empty
    if (tagsInput && !tagsInput.value.trim()) {
        tagsInput.value = suggestedTags;
    }
    if (notesInput && !notesInput.value.trim()) {
        notesInput.value = `Key Finding: ${summaryNote}`;
    }

    console.log('✅ Session metadata auto-populated');
}

// Call autoPopulate after synthesis is complete
// Hook into the synthesis completion flow
const originalShowCopyFeedback = showCopyFeedback;
window.showCopyFeedback = function (msg) {
    originalShowCopyFeedback(msg);
    // Auto-populate after a short delay when results are shown
    if (msg.includes('Success') || msg.includes('Complete')) {
        setTimeout(autoPopulateSessionMeta, 500);
    }
};
// Event delegation system removed - caused double-toggle bug
// All onclick handlers now work natively via window.functionName exports
// Additional comprehensive function exposures
// FINAL COMPREHENSIVE WINDOW EXPOSURE
Object.assign(window, {
    showSettings, closeSettings, showHistory, closeHistory,
    loadSession, deleteSession, exportCurrentResults, copyAllResults,
    continueSession, sendToNotion, startCouncil,
    toggleUltraFreeMode, viewHistoryItem, exportHistoryItem,
    switchTab, toggleProfilePanel, logout, triggerPhotoUpload,
    handlePhotoUpload, saveProfileSettings, autoPopulateSessionMeta,
    handlePhotoUpload, saveProfileSettings, renderHistory,
    startDxO, startEnsemble, startSuperChat, startBenchmark,
    addRole, toggleFilter, filterCouncilModels,
    filterEnsembleModels, toggleBenchmarkSelection, selectBenchmark,
    toggleExportMenu, exportAsPDF, generateShareableLink,
    saveSessionMeta, formatMarkdown, closeResults,
    // Fix: Explicitly expose model toggles and prompts
    toggleCouncilModel, toggleEnsembleModel, savePreset, loadPreset,
    triggerUpload, setPrompt, loadTemplate
});

console.log('🚀 Satya App v126.3 - Global APIs Exposed');

// ============================================
// INVISIBLE COUNCIL MODE (Satya Lite / Pro)
// ============================================

/**
 * Helper to pick random models from ULTRA_FREE pool
 */
function pickRandomModels(count = 5) {
    const shuffled = [...ULTRA_FREE_MODELS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(m => m.id);
}

/**
 * Pick a random best chair from top free models
 */
function pickRandomChair() {
    const topChairs = [
        'nousresearch/hermes-3-llama-3.1-405b:free', // 405B reasoning
        'deepseek/deepseek-r1-0528:free', // DeepSeek R1
        'openai/gpt-oss-120b:free', // GPT-OSS
        'qwen/qwen3-coder:free' // Qwen3 Coder
    ];
    return topChairs[Math.floor(Math.random() * topChairs.length)];
}

/**
 * Run Invisible Council - for Android apps
 * Models deliberate in background, user only sees final synthesis
 * @param {string} prompt - User's input
 * @param {string} mode - 'lite' (random free) or 'pro' (premium fixed)
 */
async function runInvisibleCouncil(prompt, mode = 'lite') {
    const isPro = mode === 'pro';

    // Select models based on mode
    const councilModels = isPro ? PREMIUM_COUNCIL_MODELS : pickRandomModels(5);
    const chairModel = isPro ? PREMIUM_CHAIR : pickRandomChair();

    console.log(`🎭 Invisible Council [${mode}]:`, councilModels, `Chair: ${chairModel}`);

    // Update UI to show "thinking" state
    addMinimalistMessage('assistant', '⏳ Thinking...', true);

    const modelResponses = {};

    // Run council deliberation in parallel (silently)
    const promises = councilModels.map(async (modelId) => {
        const systemPrompt = `You are a member of an AI council. Provide your expert analysis on the user's question. Focus on accuracy, edge cases, and verifiable facts. Be concise but thorough.`;

        try {
            const reader = await streamResponse(modelId, prompt, systemPrompt, []);
            let fullResponse = '';

            await processStream(
                reader,
                (chunk, full) => { fullResponse = full; },
                (full) => { modelResponses[modelId] = full; }
            );
        } catch (error) {
            console.error(`Error from ${modelId}:`, error.message);
            modelResponses[modelId] = `[Error: ${error.message}]`;
        }
    });

    await Promise.all(promises);

    // Run synthesis with chairman
    const synthesisPrompt = `
USER'S QUESTION: ${prompt}

COUNCIL RESPONSES:
${Object.entries(modelResponses).map(([model, response], i) =>
        `\n--- Perspective ${i + 1} ---\n${response}`
    ).join('\n')}

YOUR TASK:
You are Satya, a premium AI research assistant specializing in Crypto and Web3. 
Synthesize these council perspectives into a single, natural, and conversational response.

GUIDELINES:
- Be direct and high-signal, like you're talking to a professional crypto researcher.
- Use a friendly but authoritative tone.
- Do NOT mention that you are a council or that you are synthesizing.
- Use markdown for readability (bolding key terms, lists for data).
- Keep it flowing like a real conversation. If there's conflicting data, mention it naturally (e.g., "While some analysts see X, others are pointing to Y").
- Focus on providing a unified, coherent answer.`;

    try {
        const reader = await streamResponse(chairModel, synthesisPrompt,
            'You are Satya, a helpful AI research assistant. You speak naturally and conversationally about complex topics.', []);

        let finalSynthesis = '';

        // Remove the "thinking" message
        removeThinkingMessage();

        // Add assistant response placeholder
        const assistantMsgId = addMinimalistMessage('assistant', '', false);

        await processStream(
            reader,
            (chunk, full) => {
                updateMinimalistMessage(assistantMsgId, full);
            },
            (full) => {
                finalSynthesis = full;
                state.chatHistory.push({ role: 'assistant', content: full });
            }
        );

        return finalSynthesis;
    } catch (error) {
        removeThinkingMessage();
        const errorMsg = `Sorry, I encountered an error: ${error.message}`;
        addMinimalistMessage('assistant', errorMsg, false);
        return errorMsg;
    }
}

/**
 * Initialize Minimalist Chat UI (for Android apps)
 * Designed to look exactly like ChatGPT with sidebar, tips, and history
 */
function initMinimalistUI() {
    if (!state.minimalistMode) return;

    // Expose functions to window
    window.sendMinimalistMessage = sendMinimalistMessage;
    window.runInvisibleCouncil = runInvisibleCouncil;
    window.toggleMinimalistSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    };
    window.startNewChat = () => {
        state.chatHistory = [];
        const chat = document.getElementById('minimalist-chat');
        if (chat) {
            // Pick new random tips on new chat
            const randomTips = cryptoTips.sort(() => 0.5 - Math.random()).slice(0, 4);
            chat.innerHTML = `<div class="welcome-screen">
                <img src="satya-logo.png" alt="Satya" class="welcome-logo-large" />
                <h1>What can I help with?</h1>
                <div class="tips-container">
                    ${randomTips.map(tip => `
                        <button class="tip-btn" onclick="insertTip('${tip.text}')">
                            <span>${tip.icon}</span> ${tip.text}
                        </button>
                    `).join('')}
                    <button class="tip-btn" onclick="window.location.reload()">💡 More tips</button>
                </div>
            </div>`;
        }
        // Always close sidebar after clicking New Chat
        document.getElementById('sidebar')?.classList.remove('active');
        document.getElementById('sidebar-overlay')?.classList.remove('active');
    };
    // Open History Tab
    function showHistory() {
        switchTab('history');
        renderHistory();
    }

    // Close History (Legacy - kept for compatibility if needed, but redirects to council)
    function closeHistory() {
        switchTab('council');
    }

    function renderHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;

        if (!state.history || state.history.length === 0) {
            list.innerHTML = '<div class="empty-state">No research history yet. Start a new session!</div>';
            return;
        }

        // Sort by timestamp desc
        const sorted = [...state.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        list.innerHTML = sorted.map(item => {
            const date = new Date(item.timestamp).toLocaleDateString();
            const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const summary = item.synthesis ? item.synthesis.substring(0, 120) + '...' : 'No synthesis available';
            const modelCount = item.modelResponses ? item.modelResponses.length : 0;

            return `
            <div class="history-item" onclick="viewHistoryItem('${item.id}')">
                <div class="history-header">
                    <span class="history-date">${date} • ${time}</span>
                    <span class="history-badge">${item.mode || 'Council'}</span>
                </div>
                <div class="history-prompt">${item.prompt}</div>
                <div class="history-summary">${summary}</div>
                <div class="history-meta">
                    <span>${modelCount} Models</span>
                    <div class="history-actions" onclick="event.stopPropagation()">
                        <button onclick="exportHistoryItem('${item.id}')" title="Export JSON">⬇</button>
                        <button class="delete-btn" onclick="deleteSession('${item.id}')" title="Delete">×</button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }

    // Fixed Export All History
    window.exportAllHistory = function () {
        if (!state.history || state.history.length === 0) {
            alert("No history to export.");
            return;
        }

        const dataStr = JSON.stringify(state.history, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `satya_full_history_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }; window.insertTip = (text) => {
        const input = document.getElementById('minimalist-input');
        if (input && text) input.value = text;
        input?.focus();
    };
    window.toggleProfilePopup = () => {
        document.getElementById('profile-popup')?.classList.toggle('hidden');
    };

    // List of crypto-specific research tips
    const cryptoTips = [
        { icon: '📈', text: 'Analyze BTC/ETH correlation' },
        { icon: '🗞️', text: 'Summarize latest DeFi news' },
        { icon: '🕵️', text: 'Research Solana ecosystem' },
        { icon: '📊', text: 'Check TVL for Layer 2s' },
        { icon: '💡', text: 'Investment strategy for AI tokens' },
        { icon: '🚀', text: 'Predict bull run narrative' },
        { icon: '💎', text: 'Find undervalued RWA projects' },
        { icon: '🛡️', text: 'Audit smart contract prompt' },
        { icon: '🌐', text: 'Modular vs Monolithic' },
        { icon: '🏦', text: 'Impact of Fed rate cuts' }
    ];

    // Pick 4 random tips
    const initialTips = cryptoTips.sort(() => 0.5 - Math.random()).slice(0, 4);

    // Load chat history
    const savedHistory = localStorage.getItem('satya_chat_history');
    const chatSessions = savedHistory ? JSON.parse(savedHistory) : [];

    // Build ChatGPT-style interface
    document.body.innerHTML = `
    <div id="minimalist-app">
        <!-- Sidebar Overlay -->
        <div id="sidebar-overlay" class="sidebar-overlay" onclick="toggleMinimalistSidebar()"></div>
        
        <!-- Sidebar Drawer -->
        <aside id="sidebar" class="sidebar">
            <div class="sidebar-header">
                <button class="new-chat-btn" onclick="startNewChat()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    New chat
                </button>
            </div>
            <div class="sidebar-chats" id="chat-history-list">
                <div class="chat-section-title">Your chats</div>
                ${chatSessions.length === 0 ? '<div class="no-history">No previous chats</div>' :
            chatSessions.slice(0, 10).map((s, i) => `<div class="chat-history-item" onclick="loadSession(${s.id || i})"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>${s.prompt?.substring(0, 24) || s.title || 'Chat'}</span></div>`).join('')}
            </div>
            <div class="sidebar-footer">
                <div class="profile-section" onclick="toggleProfilePopup()">
                    <div class="profile-avatar">V</div>
                    <span>Profile</span>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Header -->
            <header class="chat-header">
                <button class="menu-btn" onclick="toggleMinimalistSidebar()">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <div class="header-center">
                    <img src="satya-logo.png" alt="Satya" class="minimal-header-logo" />
                    ${state.minimalistMode === 'pro' ? '<span class="header-badge">Pro</span>' : ''}
                </div>
                <div class="header-right">
                    <div style="width: 40px;"></div> <!-- Spacer for symmetry -->
                </div>
            </header>
            
            <!-- Chat Area -->
            <main id="minimalist-chat" class="chat-main">
                <div class="welcome-screen">
                    <img src="satya-logo.png" alt="Satya" class="welcome-logo-large" />
                    <h1>What can I help with?</h1>
                    <div class="tips-container">
                        ${initialTips.map(tip => `
                            <button class="tip-btn" onclick="insertTip('${tip.text}')">
                                <span>${tip.icon}</span> ${tip.text}
                            </button>
                        `).join('')}
                        <button class="tip-btn" onclick="window.location.reload()">💡 More tips</button>
                    </div>
                </div>
            </main>
            
            <!-- Input Footer -->
            <footer class="chat-footer">
                <div class="input-wrapper">
                    <button class="attach-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
                    <textarea id="minimalist-input" placeholder="Ask Satya..." rows="1"></textarea>
                    <button class="mic-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg></button>
                    <button id="minimalist-send"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9-21-9v7l15 2-15 2z"/></svg></button>
                </div>
                <p class="footer-note">Satya can make mistakes. Consider checking important info.</p>
            </footer>
        </div>

        <!-- Profile Popup -->
        <div id="profile-popup" class="profile-popup hidden">
            <div class="popup-content">
                <div class="popup-header"><h3>Profile</h3><button class="close-popup" onclick="toggleProfilePopup()">×</button></div>
                <div class="popup-body">
                    <div class="profile-photo-section">
                        <div class="large-avatar">V</div>
                        <button class="change-photo-btn">Change photo</button>
                    </div>
                    <div class="profile-form"><label>Display name</label><input type="text" value="Venu" /></div>
                    <div class="profile-actions">
                        <button class="settings-btn">⚙️ Settings</button>
                        <button class="logout-btn">🚪 Log out</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #ececec;
            height: 100vh;
            overflow: hidden;
        }
        
        #minimalist-app { display: flex; height: 100vh; }

        /* Sidebar Overlay */
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 90; }
        .sidebar-overlay.active { display: block; }

        /* Sidebar */
        .sidebar {
            width: 260px; background: #171717; display: flex; flex-direction: column;
            position: fixed; left: -260px; top: 0; bottom: 0; z-index: 1000; transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-right: 1px solid #333;
        }
        .sidebar.active { left: 0; box-shadow: 10px 0 30px rgba(0,0,0,0.5); }
        .sidebar-header { padding: 12px; }
        .new-chat-btn {
            display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 14px;
            background: transparent; border: 1px solid #333; border-radius: 10px;
            color: #ececec; font-size: 14px; cursor: pointer; transition: background 0.2s;
        }
        .new-chat-btn:hover { background: #262626; }
        .sidebar-chats { flex: 1; overflow-y: auto; padding: 8px; }
        .chat-section-title { font-size: 12px; color: #777; padding: 12px 8px 8px; font-weight: 600; }
        .chat-history-item {
            display: flex; align-items: center; gap: 10px; padding: 10px 12px;
            border-radius: 8px; cursor: pointer; font-size: 14px; color: #ccc;
        }
        .chat-history-item:hover { background: #262626; }
        .no-history { color: #666; font-size: 14px; text-align: center; padding: 24px; }
        .sidebar-footer { padding: 12px; border-top: 1px solid #262626; }
        .profile-section { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; cursor: pointer; }
        .profile-section:hover { background: #262626; }
        .profile-avatar {
            width: 32px; height: 32px; background: linear-gradient(135deg, #ec4899, #8b5cf6);
            border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600;
        }

        /* Main Content */
        .main-content { flex: 1; display: flex; flex-direction: column; height: 100vh; background: #000; }

        /* Header */
        .chat-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: #000; }
        .menu-btn, .icon-btn { background: transparent; border: none; color: #ccc; padding: 8px; border-radius: 8px; cursor: pointer; }
        .menu-btn:hover, .icon-btn:hover { background: #262626; color: #fff; }
        .header-center { display: flex; align-items: center; gap: 6px; }
        .minimal-header-logo { height: 28px; width: auto; object-fit: contain; mix-blend-mode: lighten; filter: brightness(1.1); }
        .header-badge { font-size: 11px; background: #2a2a2a; padding: 2px 6px; border-radius: 4px; color: #8e8ea0; }
        .header-right { display: flex; gap: 4px; }

        /* Chat Area */
        .chat-main { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; }
        .welcome-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        .welcome-logo-large { height: 60px; width: auto; margin-bottom: 24px; opacity: 0.9; mix-blend-mode: lighten; filter: brightness(1.1); }
        .welcome-screen h1 { font-size: 26px; font-weight: 600; margin-bottom: 20px; color: #fff; }

        /* Tips */
        .tips-container { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 400px; }
        .tip-btn {
            display: flex; align-items: center; gap: 8px; padding: 10px 16px;
            background: #1a1a1a; border: 1px solid #333; border-radius: 20px;
            color: #ccc; font-size: 14px; cursor: pointer; transition: all 0.2s;
        }
        .tip-btn:hover { background: #262626; border-color: #444; color: #fff; }

        /* Messages */
        .chat-message { max-width: 85%; padding: 12px 16px; margin-bottom: 12px; line-height: 1.6; font-size: 15px; white-space: pre-wrap; animation: fadeIn 0.3s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .chat-message.user { align-self: flex-end; background: #262626; border-radius: 18px; color: #fff; }
        .chat-message.assistant { align-self: flex-start; background: transparent; color: #d1d5db; }
        .chat-message.thinking::after { content: '...'; animation: dots 1.5s infinite; }
        @keyframes dots { 0%,20% { content: '.'; } 40% { content: '..'; } 60%,100% { content: '...'; } }

        /* Footer */
        .chat-footer { padding: 12px 16px 24px; background: #000; }
        .input-wrapper {
            display: flex; flex-direction: row; align-items: center; gap: 4px; flex-wrap: nowrap;
            background: #262626; border: 1px solid #333; border-radius: 28px;
            padding: 2px 8px 2px 12px; max-width: 768px; width: 100%; margin: 0 auto; transition: border-color 0.2s;
        }
        .input-wrapper:focus-within { border-color: #f59e0b; }
        .attach-btn, .mic-btn { background: transparent; border: none; color: #777; padding: 6px; cursor: pointer; display: flex; align-items: center; flex-shrink: 0; }
        .attach-btn:hover, .mic-btn:hover { color: #fff; }
        #minimalist-input {
            flex: 1; background: transparent; border: none; color: #fff; font-size: 16px;
            line-height: normal; resize: none; outline: none; max-height: 200px; padding: 12px 0;
            margin: 0;
        }
        #minimalist-input::placeholder { color: #777; }
        #minimalist-send {
            width: 32px; height: 32px; border-radius: 50%; border: none;
            background: #f59e0b; color: #000; cursor: pointer;
            display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;
            margin-right: 2px;
        }
        #minimalist-send:hover { background: #d97706; }
        #minimalist-send:active { transform: scale(0.95); }
        .footer-note { text-align: center; font-size: 12px; color: #666; margin-top: 8px; }

        /* Profile Popup */
        .profile-popup { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 200; }
        .profile-popup.hidden { display: none; }
        .popup-content { background: #1a1a1a; border-radius: 16px; width: 90%; max-width: 380px; padding: 20px; }
        .popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .popup-header h3 { font-size: 18px; color: #fff; }
        .close-popup { background: transparent; border: none; color: #777; font-size: 28px; cursor: pointer; line-height: 1; }
        .profile-photo-section { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-bottom: 20px; }
        .large-avatar { width: 80px; height: 80px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 600; }
        .change-photo-btn { background: transparent; border: 1px solid #333; color: #ccc; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
        .profile-form { margin-bottom: 20px; }
        .profile-form label { display: block; font-size: 14px; color: #777; margin-bottom: 8px; }
        .profile-form input { width: 100%; padding: 12px; background: #262626; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 16px; }
        .profile-actions { display: flex; flex-direction: column; gap: 8px; }
        .settings-btn, .logout-btn { width: 100%; padding: 12px; background: #262626; border: none; border-radius: 8px; color: #ccc; font-size: 14px; cursor: pointer; text-align: left; }
        .settings-btn:hover, .logout-btn:hover { background: #333; }
        .logout-btn { color: #ef4444; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

        /* Responsive */
        @media (max-width: 768px) {
            .welcome-screen h1 { font-size: 20px; }
            .tip-btn { padding: 8px 12px; font-size: 13px; }
        }
        @media (min-width: 769px) {
            .sidebar { left: 0; position: relative; }
            .sidebar-overlay { display: none !important; }
            .menu-btn { display: none; }
        }
    </style>
    `;

    // Add event listeners after DOM is created
    const input = document.getElementById('minimalist-input');
    const sendBtn = document.getElementById('minimalist-send');

    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 200) + 'px';
    });

    // Send on Enter (Shift+Enter for newline)
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMinimalistMessage();
        }
    });

    // Send button click
    sendBtn.addEventListener('click', () => {
        sendMinimalistMessage();
    });

    console.log('✨ Minimalist UI Initialized (ChatGPT Style)');
}

/**
 * Add a message to the minimalist chat
 */
function addMinimalistMessage(role, content, isThinking = false) {
    const chat = document.getElementById('minimalist-chat');
    if (!chat) return;

    // Remove welcome message on first chat
    const welcome = chat.querySelector('.welcome-screen');
    if (welcome) welcome.remove();

    const msgId = `msg-${Date.now()}`;
    const msgDiv = document.createElement('div');
    msgDiv.id = msgId;
    msgDiv.className = `chat-message ${role}${isThinking ? ' thinking' : ''}`;
    msgDiv.textContent = content;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;

    return msgId;
}

/**
 * Update a minimalist message by ID
 */
function updateMinimalistMessage(msgId, content) {
    const msg = document.getElementById(msgId);
    if (msg) {
        msg.textContent = content;
        const chat = document.getElementById('minimalist-chat');
        if (chat) chat.scrollTop = chat.scrollHeight;
    }
}

/**
 * Remove thinking message
 */
function removeThinkingMessage() {
    const thinking = document.querySelector('.chat-message.thinking');
    if (thinking) thinking.remove();
}

/**
 * Send a message in minimalist mode
 */
async function sendMinimalistMessage() {
    const input = document.getElementById('minimalist-input');
    const prompt = input.value.trim();
    if (!prompt) return;

    // Clear input and reset height
    input.value = '';
    input.style.height = 'auto';

    // Add user message
    addMinimalistMessage('user', prompt);
    state.chatHistory.push({ role: 'user', content: prompt });

    // Run invisible council
    await runInvisibleCouncil(prompt, state.minimalistMode);

    // Auto-sync to Notion
    autoSendToNotion();
}

// Expose minimalist functions immediately
window.sendMinimalistMessage = sendMinimalistMessage;
window.runInvisibleCouncil = runInvisibleCouncil;
window.initMinimalistUI = initMinimalistUI;

console.log('🚀 Satya App v127.1 - Invisible Council Mode Ready');
