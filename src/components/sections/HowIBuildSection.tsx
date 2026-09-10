import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { stagger, fadeUp, scaleIn } from '@/lib/motion';

/* ─── Workflow step data — 9 stages ─────────────────────────── */
const steps = [
  {
    num: '01',
    label: 'Problem',
    heading: 'What exists',
    body: 'What is the actual problem? Not the feature request — the underlying friction that makes the problem real.',
    accent: '#00E5FF',
  },
  {
    num: '02',
    label: 'Validate',
    heading: 'Is it worth solving',
    body: 'Is my understanding of the problem correct? Is this worth building? Pull on it before committing to it.',
    accent: '#00E5FF',
  },
  {
    num: '03',
    label: 'Specify',
    heading: 'Requirements & edge cases',
    body: 'What must the system do, and what must it never do? Written down before architecture, not after.',
    accent: '#F59E0B',
  },
  {
    num: '04',
    label: 'Architect',
    heading: 'System design',
    body: 'What does the structure look like? Which tradeoffs am I making and why? This is where most real engineering happens.',
    accent: '#F59E0B',
  },
  {
    num: '05',
    label: 'Implement',
    heading: 'Build the system',
    body: 'Writing the code — with AI where it accelerates the work: typed interfaces, test scaffolding, boilerplate, documentation.',
    accent: '#8B5CF6',
  },
  {
    num: '06',
    label: 'Review',
    heading: 'Against the specification',
    body: 'Does the implementation match what was specified? Read critically, not just to confirm it runs.',
    accent: '#8B5CF6',
  },
  {
    num: '07',
    label: 'Test',
    heading: 'Manual & automated',
    body: 'Edge cases, failure modes, regression. Both kinds of testing, not as ceremony — as engineering.',
    accent: '#10B981',
  },
  {
    num: '08',
    label: 'Iterate',
    heading: 'Improve on feedback',
    body: 'What did testing and real use reveal? Go back. Fix it. Not until it passes — until it is right.',
    accent: '#10B981',
  },
  {
    num: '09',
    label: 'Ship',
    heading: 'Deliberate release',
    body: 'Put the system into use. Own what happens next. Shipping is not the end of the responsibility — it is where it begins.',
    accent: '#00E5FF',
  },
] as const;

/* ─── Step Card ─────────────────────────────────────────────── */
function StepCard({
  step,
  index,
  inView,
  reduceMotion,
}: {
  step: (typeof steps)[number];
  index: number;
  inView: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      aria-label={`Step ${step.num}: ${step.heading}`}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, transform: 'translateY(20px) scale(0.96)' }
      }
      animate={
        inView
          ? reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, transform: 'translateY(0px) scale(1)' }
          : {}
      }
      transition={
        reduceMotion
          ? { duration: 0.3 }
          : {
              duration: 0.55,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.04 + index * 0.048,
            }
      }
      className="group relative flex flex-col gap-3 bg-surface border border-border rounded-2xl p-6 overflow-hidden h-full"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Top accent line — color per step group */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-50 group-hover:opacity-90 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Number + label */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[11px] font-bold tracking-[0.15em]"
          style={{ color: step.accent }}
          aria-hidden="true"
        >
          {step.num}
        </span>
        <span className="font-ui text-[9px] uppercase tracking-[0.18em] text-tagText border border-border rounded-full px-2.5 py-1">
          {step.label}
        </span>
      </div>

      {/* Heading */}
      <h3 className="font-heading font-semibold text-heading text-[14px] leading-tight group-hover:text-white transition-colors duration-200">
        {step.heading}
      </h3>

      {/* Body */}
      <p className="font-ui text-xs text-body leading-relaxed">{step.body}</p>
    </motion.article>
  );
}

/* ─── Main Section ──────────────────────────────────────────── */
export function HowIBuildSection() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 border-b border-border"
      aria-labelledby="how-i-build-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-14"
        >

          {/* ── Header ── */}
          <div className="flex flex-col gap-5 max-w-[680px]">
            <motion.div variants={fadeUp}>
              <SectionLabel>Process</SectionLabel>
            </motion.div>

            <motion.h2
              id="how-i-build-heading"
              variants={fadeUp}
              className="font-display italic text-heading"
              style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: '0.92' }}
            >
              How I Build.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="font-ui text-body text-base leading-[1.85] max-w-[560px]"
            >
              AI has changed how I build software, but it hasn't changed who owns the engineering
              decisions.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="font-ui text-body text-base leading-[1.85] max-w-[560px]"
            >
              I use AI where it accelerates the work — implementation, exploration, test
              generation, documentation. The decisions that determine whether a system is correct —
              problem definition, requirements, architecture, constraints, review, and final
              ownership — are engineering decisions. They stay with me.
            </motion.p>
          </div>

          {/* ── 9-step grid — 3 col on desktop, 2 on tablet, 1 on mobile ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label="Engineering workflow — 9 stages"
          >
            {steps.map((step, i) => (
              <div key={step.num} role="listitem">
                <StepCard
                  step={step}
                  index={i}
                  inView={inView}
                  reduceMotion={reduceMotion}
                />
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4"
            aria-hidden="true"
          >
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              In practice
            </span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* ── Vectoris callout ── */}
          <motion.div
            variants={scaleIn}
            className="relative bg-surface border border-border rounded-2xl p-8 md:p-10 overflow-hidden"
          >
            {/* Decorative ambient glow */}
            <div
              className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-[0.05] blur-3xl"
              style={{ background: '#E11D48' }}
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-5 max-w-[680px]">
              {/* Label */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#E11D48' }}
                  aria-hidden="true"
                />
                <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-tagText">
                  Vectoris — AI-Native Engineering Workstation
                </span>
              </div>

              {/* Story — progression, not metrics */}
              <p className="font-ui text-sm text-body leading-[1.9]">
                The problem wasn't "build an AI tool." It was: electrical estimators spend hundreds
                of hours manually tracing circuit paths across 400+ blueprint sheets, introducing
                costly measurement errors that affect real project bids. Validating that problem
                — understanding the actual workflow, the failure modes, and the edge cases —
                took weeks before the first line of architecture was written.
              </p>
              <p className="font-ui text-sm text-body leading-[1.9]">
                From there came requirements: local-first by necessity (blueprint IP can't leave
                the machine), deterministic geometry extraction, no cloud dependency during active
                work. Then system architecture — Tauri v2, Rust, on-device vision models — chosen
                for those constraints specifically, not as defaults. AI accelerated the
                implementation: typed interfaces, test scaffolding, documentation. Then review,
                then testing, then iteration on what testing revealed.
              </p>
              <p className="font-ui text-sm text-body leading-[1.9]">
                That sequence is what every project here followed. The technology changes. The
                process doesn't.
              </p>

              {/* CTA */}
              <Link
                to="/projects/vectoris"
                className="inline-flex items-center gap-2 font-ui text-sm text-heading link-underline group w-fit mt-1"
                aria-label="View the Vectoris project"
              >
                View the Vectoris build
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
