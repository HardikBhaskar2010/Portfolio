export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: "Hardik doesn't just build UIs — he crafts experiences. The motion design and performance on our SaaS dashboard exceeded every expectation. Truly elite frontend work.",
    name: 'Aryan Mehta',
    role: 'CTO',
    company: 'Pulse Analytics',
    avatar: '/images/avatar-1.png',
  },
  {
    id: 't2',
    quote: "Working with Hardik was like collaborating with someone who genuinely cares about the product. He pushed the design further than we imagined and delivered pixel-perfect results.",
    name: 'Priya Nair',
    role: 'Product Lead',
    company: 'STEM Idea Adventure',
    avatar: '/images/avatar-2.png',
  },
  {
    id: 't3',
    quote: "The Three.js experience he built for our product launch was jaw-dropping. I've worked with many developers — Hardik stands in a completely different league when it comes to interactive web.",
    name: 'Siddharth Rao',
    role: 'Creative Director',
    company: 'Void Studios',
    avatar: '/images/avatar-3.png',
  },
  {
    id: 't4',
    quote: "He shipped faster than our internal team and the code quality was impeccable. Clean TypeScript, perfect Tailwind architecture, and animations that made stakeholders gasp. 10/10.",
    name: 'Ananya Sharma',
    role: 'Engineering Manager',
    company: 'Folio Systems',
    avatar: '/images/avatar-4.png',
  },
];
