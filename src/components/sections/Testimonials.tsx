import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { testimonials } from '@/data/testimonials';
import { stagger, scaleIn, fadeUp } from '@/lib/motion';

export function Testimonials() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-10"
        >
          {/* Header */}
          <div className="flex flex-col gap-4">
            <motion.div variants={fadeUp}>
              <SectionLabel>Social proof</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display italic text-heading"
              style={{ fontSize: 'clamp(32px, 4.5vw, 64px)', lineHeight: '0.92' }}
            >
              What clients say.
            </motion.h2>
          </div>

          {/* Row 1: Two testimonials */}
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.slice(0, 2).map((t) => (
              <motion.div key={t.id} variants={scaleIn}>
                <QuoteCard {...t} />
              </motion.div>
            ))}
          </motion.div>

          {/* Stat banner 1 */}
          <motion.div
            variants={scaleIn}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <StatBanner
              value="97%"
              label="Positive Client Feedback"
              body="Collaborated with teams across SaaS & digital products. Every project delivered on time."
              accent="#00E5FF"
            />
            <StatBanner
              value="+42%"
              label="Average Conversion Uplift"
              body="Design & performance improvements that measurably move business metrics."
              accent="#7C3AED"
            />
          </motion.div>

          {/* Row 2: Two testimonials */}
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.slice(2, 4).map((t) => (
              <motion.div key={t.id} variants={scaleIn}>
                <QuoteCard {...t} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function QuoteCard({ quote, name, role, company, avatar }: typeof testimonials[0]) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-7 md:p-8 flex flex-col justify-between gap-6 h-full">
      {/* Quote mark */}
      <div>
        <span className="font-display italic text-6xl text-cyan/20 leading-none block mb-4">"</span>
        <p className="font-display italic text-heading text-lg md:text-xl leading-[1.5]">
          {quote}
        </p>
      </div>
      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border border-border"
        />
        <div>
          <p className="font-heading font-semibold text-sm text-heading">{name}</p>
          <p className="font-ui text-xs text-muted">{role} · {company}</p>
        </div>
      </div>
    </div>
  );
}

function StatBanner({
  value, label, body, accent,
}: { value: string; label: string; body: string; accent: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <p
          className="font-display italic leading-none"
          style={{ fontSize: 'clamp(56px, 8vw, 88px)', color: accent }}
        >
          {value}
        </p>
        <p className="font-ui text-sm text-muted mt-2 uppercase tracking-widest">{label}</p>
      </div>
      <p className="font-ui text-sm text-body leading-relaxed max-w-[220px]">{body}</p>
    </div>
  );
}
