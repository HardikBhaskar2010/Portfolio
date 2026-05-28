import { motion } from 'framer-motion';

interface CinematicTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  once?: boolean;
}

const wordVariants = {
  hidden:  { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay:    i * 0.085,
      duration: 0.65,
      ease:     [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export function CinematicText({
  text,
  className,
  delay = 0,
  as: Tag = 'h1',
  once = true,
}: CinematicTextProps) {
  const words = text.split(' ');

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
          <motion.span
            className="inline-block"
            variants={wordVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once }}
            custom={i + delay / 0.085}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ── Multi-line heading with cumulative word-offset stagger ── */
interface CinematicHeadingProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  showCursor?: boolean;
  animate?: boolean; // if false, use whileInView
}

export function CinematicHeading({
  lines,
  className,
  lineClassName,
  showCursor = true,
  animate = true,
}: CinematicHeadingProps) {
  let wordOffset = 0;
  const totalWords = lines.reduce((acc, l) => acc + l.split(' ').length, 0);

  return (
    <div className={className} aria-label={lines.join(' ')}>
      {lines.map((line, li) => {
        const currentOffset = wordOffset;
        const words = line.split(' ');
        wordOffset += words.length;

        return (
          <div key={li} className={lineClassName ?? 'block'}>
            {words.map((word, wi) => (
              <span key={wi} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
                <motion.span
                  className="inline-block font-display italic text-heading leading-[0.87] tracking-tight"
                  variants={wordVariants}
                  initial="hidden"
                  {...(animate
                    ? { animate: 'visible' }
                    : { whileInView: 'visible', viewport: { once: true } })}
                  custom={currentOffset + wi}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </div>
        );
      })}

      {/* Blinking terminal cursor after last word */}
      {showCursor && (
        <motion.span
          className="inline-block w-[3px] h-[0.75em] bg-cyan align-middle ml-1"
          animate={{ opacity: [1, 0, 1, 0, 1, 0, 0] }}
          transition={{
            duration: 1.8,
            times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
            delay: totalWords * 0.085 + 0.3,
          }}
        />
      )}
    </div>
  );
}
