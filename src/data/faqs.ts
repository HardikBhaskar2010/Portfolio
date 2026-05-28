export interface FAQ {
  q: string;
  a: string;
}

export const faqs: Record<string, FAQ[]> = {
  'Working Together': [
    {
      q: 'What types of projects do you take on?',
      a: "I specialize in premium frontend development, AI-integrated web applications, interactive 3D experiences, and full-stack SaaS products. If it involves React, TypeScript, animation, or AI — I'm the right person for the job.",
    },
    {
      q: 'Do you work freelance or full-time?',
      a: 'I work as an independent freelance developer, taking on selective project collaborations. I prioritize quality over quantity — typically working with 2-3 clients at a time to ensure deep focus on each project.',
    },
    {
      q: 'How do you typically collaborate with teams?',
      a: "I integrate seamlessly into existing workflows. Whether it's a design-to-dev handoff from Figma or joining a team mid-sprint, I adapt quickly. I'm async-first but available for syncs in IST timezone.",
    },
    {
      q: 'Can you work with our existing design system?',
      a: "Absolutely. I can adopt, extend, or audit existing design systems. I'm deeply familiar with component-driven architecture, token systems, and Storybook-based documentation.",
    },
    {
      q: 'What tools do you use for communication?',
      a: 'Slack for async communication, Notion for docs and planning, Linear for task tracking, and Loom for async video walkthroughs. I document everything so the team stays aligned without endless meetings.',
    },
  ],
  'Process & Approach': [
    {
      q: 'What does your design process look like?',
      a: "I start with deep discovery — understanding the user, the business goal, and the technical constraints. Then I move through wireframing → high-fidelity design → prototype → development → testing. I treat each phase as iterative, not linear.",
    },
    {
      q: 'How do you approach design systems?',
      a: "I build design systems as living documents — starting with tokens, then atoms, molecules, organisms. Every component gets its variants, states, and accessibility considerations documented. The system should scale without breaking.",
    },
    {
      q: 'Do you conduct user research?',
      a: "Yes, especially for product-stage projects. I conduct user interviews, competitive audits, and usability testing. Data informs design decisions, not just aesthetics.",
    },
    {
      q: 'How do you ensure smooth developer handoff?',
      a: "I use Figma with Auto Layout, variables, and component properties for precise spec. I write detailed handoff notes, document edge cases, and often review initial implementation to ensure fidelity. The gap between design and code should be invisible.",
    },
    {
      q: 'How do you measure design success?',
      a: "Success is tied to outcomes — conversion rate, task completion, engagement metrics, and user satisfaction scores. Beautiful design that doesn't perform is just art. I care about both.",
    },
  ],
};
