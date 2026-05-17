export const CHARACTER = {
  name: 'Darryll',
  class: 'Builder',
  level: 1,
  title: 'The Architect of Worlds',
  lore: `Every great journey begins not with a destination, but with a question:
"What if I built that?" That question is where my story starts.`,
  stats: [
    { label: 'Frontend', value: 82, icon: '⚔️' },
    { label: 'Backend', value: 74, icon: '🛡️' },
    { label: 'AI / LLM', value: 78, icon: '✨' },
    { label: 'DevOps', value: 65, icon: '⚙️' },
    { label: 'Mobile', value: 60, icon: '📱' },
    { label: 'System Design', value: 70, icon: '🗺️' },
  ],
  abilities: [
    { name: 'Rapid Prototype', desc: 'Ship a working idea before the meeting ends.' },
    { name: 'Debug Vision', desc: 'See through errors others cannot.' },
    { name: 'Agent Summoning', desc: 'Call forth AI agents to handle the impossible.' },
    { name: 'Monorepo Mastery', desc: 'Manage many codebases as one.' },
  ],
};

export interface Feature {
  icon: string;
  title: string;
  desc: string;
  color: string;
  detail: string;
}

export const QUESTS = [
  {
    id: 'nexus-hub',
    name: 'Nexus Hub',
    world: 'The Digital Frontier',
    status: 'active' as const,
    type: 'Main Quest',
    tagline: 'A multi-agent AI hub',
    stack: ['TypeScript', 'React', 'Vite', 'Groq', 'Node'],
    githubUrl: 'https://github.com/Darryll2022/nexus-hub',
    liveUrl: 'https://nexus-hub-darryll2022-s-projects.vercel.app' as string | null,
    // Level 2 flag — set to true when Nexus Hub is deployed publicly
    demoReady: true,
    icon: '🤖',
    color: '#34D399',
    glow: 'rgba(52,211,153,0.3)',
    features: [
      {
        icon: '🧠',
        title: 'Multi-Agent Chat',
        color: '#34D399',
        desc: 'Switch between AI specialists mid-conversation.',
        detail: 'Each agent has its own system prompt, personality, and expertise. Built-in agents ship with Nexus Hub — but you can define your own. Name it, describe its role, give it a focus. The agent creator turns anyone into an AI architect.',
      },
      {
        icon: '🔍',
        title: 'Atlas PR Reviewer',
        color: '#4d8bff',
        desc: 'Automated GitHub PR reviews powered by Groq.',
        detail: 'Atlas connects to your GitHub repositories and reviews every pull request. Structured output covers correctness, performance, security, and SOLID principles. It never reviews the same PR twice — a deduplication system tracks every review it has posted.',
      },
    ] as Feature[],
    chapters: [
      {
        title: 'The Spark',
        text: `I was tired of switching between five different AI tools for five different tasks. There had to be a better way — one hub, multiple agents, each with their own expertise. That frustration became Nexus Hub.`,
      },
      {
        title: 'The Build',
        text: `I started with the web app — React, Vite, Tailwind. Got markdown rendering working, then syntax highlighting (which nearly killed the bundle size — 953KB to 149KB after code splitting). Built a custom agent creator so anyone could define their own AI persona.`,
      },
      {
        title: 'Phase 2 — Atlas Awakens',
        text: `I added Atlas, a code review agent that automatically scans my GitHub pull requests. Hooked it up to Groq's LLM API, built a deduplication system so it never reviews the same PR twice, and let it loose on my repos.`,
      },
      {
        title: "What's Next",
        text: `The foundation is solid. Next up: deeper agent orchestration, letting agents hand off tasks to each other, and a proper deployment so anyone can spin up their own Nexus Hub. The hub keeps growing.`,
      },
    ],
  },
  {
    id: 'neo-gaia',
    name: 'Neo Gaia',
    world: 'The Five Kingdoms',
    status: 'active' as const,
    type: 'Main Quest',
    tagline: 'A JRPG open-world realm',
    stack: ['TypeScript', 'React', 'SVG', 'CSS', 'Vite'],
    githubUrl: 'https://github.com/Darryll2022/portfolio',
    liveUrl: 'https://darryll2022.github.io/portfolio/quest/neo-gaia' as string | null,
    demoReady: true,
    icon: '🗺️',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    features: [] as Feature[],
    chapters: [
      {
        title: 'The World',
        text: `Neo Gaia is a dark fantasy realm inspired by Singapore's geography. Five sovereign territories — The Crown Dominion, Ironwild Frontier, Verdant Bloom, Frostveil Barrens, and the Azure Coastlands — each scarred by war, myth, and ambition. And beneath them all, the hidden Southern Isles.`,
      },
      {
        title: "Phase 1 — The Map Awakens",
        text: `Phase 1 is a fully interactive SVG world map. Six regions, 24 named locations, tooltips, lore panels, region progress bars, a compass rose, a legend, and MRT crystal travel lines. All rendered in pure SVG and React — no game engine, no canvas.`,
      },
      {
        title: "What's Coming",
        text: `Phase 2 brings character movement and fog of war — regions reveal as you explore. Phase 3 introduces turn-based encounters, inventory, and persistent save state via localStorage. The age of reckoning is coming.`,
      },
    ],
  },
  {
    id: 'fighting-game',
    name: 'The Fighting Game',
    world: 'The Arena',
    status: 'resting' as const,
    type: 'Side Quest',
    tagline: 'A canvas-based 2D fighter',
    stack: ['JavaScript', 'HTML5 Canvas', 'CSS', 'GSAP'],
    githubUrl: 'https://github.com/Darryll2022/fighting-game',
    // Live on GitHub Pages — deployed from gh-pages branch
    liveUrl: 'https://darryll2022.github.io/fighting-game/' as string | null,
    demoReady: true,
    icon: '⚔️',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    features: [] as Feature[],
    chapters: [
      {
        title: 'Enter the Arena',
        text: `I wanted to understand how game loops work at a fundamental level — no engine, no framework. Just a canvas, a context, and raw JavaScript. I built a 2D fighting game from scratch: gravity system, sprite animation, hit detection, health bars.`,
      },
      {
        title: 'What I Learned',
        text: `Game development teaches you to think in frames, not events. Every 60th of a second the whole world has to be redrawn. That mental shift changed how I think about rendering in web apps too.`,
      },
      {
        title: 'What\'s Next',
        text: `The arena is resting — but it won't be for long. A TypeScript rewrite, WebSocket multiplayer, and a proper deployment are on the horizon. The fighter will return.`,
      },
    ],
  },
];

// 🌑 Hidden world — FF7 CI/CD doc. Locked until dark mode ships.
export const HIDDEN_WORLD = {
  id: 'midgar',
  name: 'Midgar',
  subtitle: 'Sector 7 — Infrastructure Division',
  unlockCondition: 'dark_mode',
  lore: `Deep beneath the plate, where the reactors hum and the pipes run red with mako energy, the real infrastructure lives. This is where deployments are born and pipelines breathe.`,
  note: `This world unlocks when dark mode ships. Return then, traveller.`,
};
