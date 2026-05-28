import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Mail, Phone, ExternalLink } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { stagger, fadeUp, scaleIn } from '@/lib/motion';
import { track } from '@/lib/analytics';

export function ContactSection() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formStarted, setFormStarted] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    if (!formStarted) { track.contactFormStart(); setFormStarted(true); }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Something went wrong');
      }

      setSent(true);
      track.contactFormSubmit(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send. Please try again.';
      setError(msg);
      track.contactFormSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  const socials = [
    { label: 'Twitter / X', href: 'https://x.com/kitsune_luna05' },
    { label: 'LinkedIn',    href: 'https://www.linkedin.com/in/luna-kitsune-8a107a3bb/' },
    { label: 'GitHub',      href: 'https://github.com/HardikBhaskar2010/' },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left */}
          <div className="flex flex-col gap-8">
            <motion.div variants={fadeUp}>
              <SectionLabel>Get in touch</SectionLabel>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-display italic text-heading"
              style={{ fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: '0.9' }}
            >
              Let's<br />connect.
            </motion.h2>

            <motion.p variants={fadeUp} className="font-ui text-body text-base leading-relaxed max-w-[360px]">
              Have a project in mind? Want to collaborate? Or just want to say hi?
              I'd love to hear from you. Let's build something remarkable together.
            </motion.p>

            <motion.div variants={fadeUp}>
              <a href="mailto:hardik.bhaskar2010@gmail.com">
                <Button variant="primary" size="lg" icon={<ArrowRight size={14} />}>
                  Let's begin
                </Button>
              </a>
            </motion.div>

            {/* Avatar + socials */}
            <motion.div variants={fadeUp} className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border">
                  <img src="/images/avatar.png" alt="Hardik Bhaskar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-heading text-sm">Hardik Bhaskar</p>
                  <p className="font-ui text-xs text-cyan">Available for new projects</p>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-4 flex-wrap">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-ui text-sm text-muted hover:text-heading transition-colors duration-200 link-underline"
                  >
                    {s.label}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>

              {/* Contact details */}
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:hardik.bhaskar2010@gmail.com"
                  className="flex items-center gap-2 font-ui text-sm text-muted hover:text-heading transition-colors duration-200"
                >
                  <Mail size={13} />
                  hardik.bhaskar2010@gmail.com
                </a>
                <a
                  href="tel:+919599891970"
                  className="flex items-center gap-2 font-ui text-sm text-muted hover:text-heading transition-colors duration-200"
                  onClick={() => track.emailClick('contact-section')}
                >
                  <Phone size={13} />
                  +91 9599891970
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right — Form */}
          <motion.div variants={scaleIn}>
            <div className="bg-surface border border-border rounded-2xl p-8 md:p-10">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-5 text-center"
                >
                  <motion.span
                    className="text-5xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    ✦
                  </motion.span>
                  <h3 className="font-display italic text-3xl text-heading">Message sent!</h3>
                  <p className="font-ui text-sm text-body max-w-[280px]">
                    Thanks, <span className="text-heading">{form.name.split(' ')[0]}</span>!
                    I'll reply to <span className="text-cyan">{form.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
                    className="font-ui text-xs text-muted hover:text-heading transition-colors underline underline-offset-4 mt-2"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="font-ui text-[10px] uppercase tracking-widest text-tagText block mb-2">
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => handleFieldChange('name', e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3.5 font-ui text-sm text-heading placeholder:text-muted transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="font-ui text-[10px] uppercase tracking-widest text-tagText block mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => handleFieldChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3.5 font-ui text-sm text-heading placeholder:text-muted transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="font-ui text-[10px] uppercase tracking-widest text-tagText block mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => handleFieldChange('message', e.target.value)}
                      placeholder="Tell me about your project..."
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3.5 font-ui text-sm text-heading placeholder:text-muted resize-none transition-all duration-200"
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-ui text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-center"
                    >
                      ⚠ {error}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-accent text-bg font-ui font-medium text-sm py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-60"
                  >
                    {loading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full block"
                      />
                    ) : (
                      <>Send message <ArrowRight size={14} /></>
                    )}
                  </motion.button>

                  <p className="font-ui text-[10px] text-center text-muted">
                    Typically responds within 24 hours. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
