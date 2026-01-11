
export interface PromptFormData {
  APP_TYPE: string;
  MARKET_INDUSTRY: string;
  TARGET_AUDIENCE: string;
  VIBE_STYLE: string;
  AESTHETIC_PRIORITY: string;
  COLORS: string;
  ACCENT_COLORS: string;
  UX_EMOTION: string;
  KEY_FEATURES: string;
}

export interface PromptTemplate {
  template_name: string;
  description: string;
  prompt_template: string;
  placeholders: Record<string, string>;
  example_usage: string;
}

export const DEFAULT_TEMPLATE: PromptTemplate = {
  template_name: "Ultimate Design & Architecture Prompt for Google Stitch",
  description: "A comprehensive, high-productivity template designed to generate detailed app or website blueprints, UI structures, and design systems.",
  prompt_template: "Act as an expert UI/UX Designer and Lead Systems Architect. Your goal is to design a high-fidelity conceptual framework for a [APP_TYPE]. The target market is [MARKET_INDUSTRY], specifically catering to [TARGET_AUDIENCE]. The visual identity and 'vibe' must be [VIBE_STYLE] with a strong emphasis on [AESTHETIC_PRIORITY]. Use a primary color palette of [COLORS] with [ACCENT_COLORS] for highlights. The interface should feel [UX_EMOTION]. Please outline the structural layout for the following key features: [KEY_FEATURES]. For each feature, describe the component logic, the interactive state transitions, and the CSS/styling parameters that ensure the design remains cohesive across the [MARKET_INDUSTRY] landscape. Finally, suggest a layout grid and typography scale that complements the [VIBE_STYLE] aesthetic.",
  placeholders: {
    "APP_TYPE": "The nature of the project (e.g., 'B2B SaaS Dashboard', 'Lifestyle Mobile App', 'E-commerce Landing Page')",
    "MARKET_INDUSTRY": "The specific sector (e.g., 'Fintech', 'Renewable Energy', 'Luxury Real Estate')",
    "TARGET_AUDIENCE": "Who the product is for (e.g., 'Beginner investors', 'Enterprise-level CTOs', 'Urban plant enthusiasts')",
    "VIBE_STYLE": "The design movement or mood (e.g., 'Brutalist', 'Neumorphic', 'Modern Corporate', 'Organic & Soft')",
    "AESTHETIC_PRIORITY": "What the design focuses on visually (e.g., 'white space', 'vibrant gradients', 'sharp edges')",
    "COLORS": "The main colors (e.g., 'Deep Slate and Arctic White')",
    "ACCENT_COLORS": "Secondary/Action colors (e.g., 'Electric Purple and Gold')",
    "UX_EMOTION": "How the user should feel (e.g., 'secure and calm', 'energized and fast', 'curious and guided')",
    "KEY_FEATURES": "Core functionalities (e.g., 'Dynamic data charts, a multi-step onboarding wizard, and a real-time notification feed')"
  },
  example_usage: "Act as an expert UI/UX Designer... for a Fintech Mobile App. The target market is Personal Finance, catering to Gen Z students. The vibe must be Cyberpunk-Minimalist with an emphasis on high-contrast neon elements. Use a primary color palette of Charcoal Black and Neon Cyan with Hot Pink accents. The interface should feel gamified and fast..."
};
