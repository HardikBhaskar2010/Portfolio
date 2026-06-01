export interface FAQ {
  q: string;
  a: string;
}

export const faqs: Record<string, FAQ[]> = {
  'Pricing & Timeline': [
    {
      q: 'What does a project with you cost?',
      a: 'Interactive web experiences (animated landing pages, 3D product viewers) start from $800. AI-powered web apps start from $1,500. Full-stack SaaS products start from $3,000. Exact quotes depend on scope — book a 20-minute call and I\'ll give you a number within 24 hours.',
    },
    {
      q: 'How long does a typical project take?',
      a: 'Interactive web experiences: 7–14 days. AI-powered apps: 14–21 days. Full-stack SaaS: 4–8 weeks. Complex integrations or custom design systems may take longer — I\'ll give you an honest timeline before we start, not after.',
    },
    {
      q: 'Do you offer ongoing maintenance or retainers?',
      a: 'Yes. After project delivery, I offer monthly retainer packages for feature development, bug fixes, performance monitoring, and content updates. Retainer clients get priority response times. Rates start at $400/month.',
    },
    {
      q: "What's your revision policy?",
      a: 'All projects include two rounds of revisions after the initial delivery. Changes outside the agreed scope are quoted separately and transparently — no surprise invoices. I document scope clearly upfront so we rarely hit edge cases.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'I work with 50% upfront, 50% on delivery for most projects. Payments via bank transfer, PayPal, or crypto. Retainer clients are billed monthly in advance.',
    },
  ],
  'Working Together': [
    {
      q: 'Do you work with clients outside India?',
      a: 'Yes — the majority of my clients are in the US, UK, and EU. I work fully async and am flexible with timezones. For US clients, I\'m available for overlap during early morning IST (which is US evening). Timezone has never been a blocker.',
    },
    {
      q: 'What information do you need to get started?',
      a: 'To give you an accurate quote, I need: a brief description of what you want to build, your design assets or direction (Figma file, reference sites, or just a vibe board), target launch date, and rough budget range. That\'s it — we can figure out the rest on a call.',
    },
    {
      q: 'How do you communicate during a project?',
      a: 'I use Slack or email for async updates, Loom for video walkthroughs of progress, and Notion for shared project docs. I send a progress update every 2–3 days so you\'re never in the dark. No endless meetings — just clear, documented communication.',
    },
    {
      q: 'Do you work freelance or full-time?',
      a: 'I work as an independent freelance developer. I take on 2–3 projects at a time to ensure deep focus on each one. If you need an exclusive engagement, that can be arranged as a dedicated retainer.',
    },
    {
      q: 'Can you work with our existing design system or codebase?',
      a: 'Absolutely. I can audit, extend, or build on top of existing design systems and codebases. I\'m deeply familiar with component-driven architecture, Tailwind, styled-components, and Storybook. I\'ve joined teams mid-sprint and shipped the same day.',
    },
  ],
};
