export const MODELS = [
  {
    id: 'llama-3.3-70b-versatile',
    label: 'Llama 3.3 70B',
    description: 'Meta · General purpose',
  },
  {
    id: 'llama-3.1-8b-instant',
    label: 'Llama 3.1 8B',
    description: 'Meta · Fastest',
  },
  {
    id: 'qwen/qwen3-32b',
    label: 'Qwen 3 32B',
    description: 'Alibaba · Multilingual reasoning',
  },
  {
    id: 'moonshotai/kimi-k2-instruct',
    label: 'Kimi K2',
    description: 'Moonshot · Long context',
  },
  {
    id: 'moonshotai/kimi-k2-instruct-0905',
    label: 'Kimi K2 0905',
    description: 'Moonshot · 262K context',
  },
  {
    id: 'groq/compound',
    label: 'Groq Compound',
    description: 'Groq · General AI tasks',
  },
  {
    id: 'groq/compound-mini',
    label: 'Groq Compound Mini',
    description: 'Groq · Lightweight',
  },
  {
    id: 'openai/gpt-oss-120b',
    label: 'GPT OSS 120B',
    description: 'OpenAI · Strong reasoning',
  },
  {
    id: 'openai/gpt-oss-20b',
    label: 'GPT OSS 20B',
    description: 'OpenAI · Fast',
  },
  {
    id: 'allam-2-7b',
    label: 'Allam 2 7B',
    description: 'SDAIA · Arabic focused',
  },
];

{
  "models"; [
    {
      "id": "whisper-large-v3-turbo",
      "owned_by": "OpenAI",
      "type": "audio",
      "description": "Fast speech-to-text model for transcription",
      "context_window": 448,
      "max_completion_tokens": 448
    },
    {
      "id": "whisper-large-v3",
      "owned_by": "OpenAI",
      "type": "audio",
      "description": "High accuracy speech-to-text transcription model",
      "context_window": 448,
      "max_completion_tokens": 448
    },

    {
      "id": "llama-3.3-70b-versatile",
      "owned_by": "Meta",
      "type": "llm",
      "description": "High-quality general-purpose model for chat, reasoning, and coding",
      "context_window": 131072,
      "max_completion_tokens": 32768
    },
    {
      "id": "llama-3.1-8b-instant",
      "owned_by": "Meta",
      "type": "llm",
      "description": "Very fast lightweight model optimized for low-latency chat applications",
      "context_window": 131072,
      "max_completion_tokens": 131072
    },

    {
      "id": "qwen/qwen3-32b",
      "owned_by": "Alibaba Cloud",
      "type": "llm",
      "description": "Strong reasoning model with good multilingual performance",
      "context_window": 131072,
      "max_completion_tokens": 40960
    },

    {
      "id": "moonshotai/kimi-k2-instruct",
      "owned_by": "Moonshot AI",
      "type": "llm",
      "description": "Long-context instruction-tuned model for complex reasoning tasks",
      "context_window": 131072,
      "max_completion_tokens": 16384
    },
    {
      "id": "moonshotai/kimi-k2-instruct-0905",
      "owned_by": "Moonshot AI",
      "type": "llm",
      "description": "Improved version of Kimi model with very large context window",
      "context_window": 262144,
      "max_completion_tokens": 16384
    },

    {
      "id": "groq/compound",
      "owned_by": "Groq",
      "type": "llm",
      "description": "Groq optimized compound model for general AI tasks",
      "context_window": 131072,
      "max_completion_tokens": 8192
    },
    {
      "id": "groq/compound-mini",
      "owned_by": "Groq",
      "type": "llm",
      "description": "Smaller, faster version of Groq compound model for lightweight tasks",
      "context_window": 131072,
      "max_completion_tokens": 8192
    },

    {
      "id": "openai/gpt-oss-120b",
      "owned_by": "OpenAI",
      "type": "llm",
      "description": "Large open-source style reasoning model with strong performance",
      "context_window": 131072,
      "max_completion_tokens": 65536
    },
    {
      "id": "openai/gpt-oss-20b",
      "owned_by": "OpenAI",
      "type": "llm",
      "description": "Smaller open-source style model optimized for speed and efficiency",
      "context_window": 131072,
      "max_completion_tokens": 65536
    },

    {
      "id": "openai/gpt-oss-safeguard-20b",
      "owned_by": "OpenAI",
      "type": "safeguard",
      "description": "Safety and moderation model used to filter harmful content",
      "context_window": 131072,
      "max_completion_tokens": 65536
    },

    {
      "id": "meta-llama/llama-prompt-guard-2-22m",
      "owned_by": "Meta",
      "type": "safeguard",
      "description": "Lightweight prompt safety classifier for detecting unsafe inputs",
      "context_window": 512,
      "max_completion_tokens": 512
    },
    {
      "id": "meta-llama/llama-prompt-guard-2-86m",
      "owned_by": "Meta",
      "type": "safeguard",
      "description": "Stronger prompt safety model for detecting malicious or unsafe prompts",
      "context_window": 512,
      "max_completion_tokens": 512
    },

    {
      "id": "allam-2-7b",
      "owned_by": "SDAIA",
      "type": "llm",
      "description": "Arabic-focused language model optimized for regional tasks",
      "context_window": 4096,
      "max_completion_tokens": 4096
    },

    {
      "id": "canopylabs/orpheus-v1-english",
      "owned_by": "Canopy Labs",
      "type": "special",
      "description": "Specialized English text generation model for voice and narration tasks",
      "context_window": 4000,
      "max_completion_tokens": 50000
    },
    {
      "id": "canopylabs/orpheus-arabic-saudi",
      "owned_by": "Canopy Labs",
      "type": "special",
      "description": "Arabic (Saudi) voice and text generation model for narration tasks",
      "context_window": 4000,
      "max_completion_tokens": 50000
    }
  ]
}