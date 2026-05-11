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

export const QUESTS = [
  {
    id: 'nexus-hub',
    name: 'Nexus Hub',
    world: 'The Digital Frontier',
    status: 'active' as const,
    type: 'Main Quest',
    tagline: 'A multi-agent AI hub',
    stack: ['TypeScript', 'React', 'Vite', 'Expo', 'Groq', 'Node'],
    githubUrl: 'https://github.com/Darryll2022/nexus-hub',
    liveUrl: null,
    icon: '🤖',
    color: '#34D399',
    glow: 'rgba(52,211,153,0.3)',
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
        title: 'Phase 3 — Going Mobile',
        text: `The web version wasn't enough. I restructured the whole thing into a monorepo — shared TypeScript core, React for web, Expo for mobile. Same agents, same logic, different canvas. The journey continues.`,
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
    stack: ['JavaScript', 'HTML5 Canvas', 'CSS'],
    githubUrl: 'https://github.com/Darryll2022/fighting-game',
    liveUrl: null,
    icon: '⚔️',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
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
