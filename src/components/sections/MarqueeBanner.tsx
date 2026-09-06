import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';

const images = projects.map(p => ({
  slug: p.slug,
  src: p.image,
  fallbackSrc: p.fallbackImage,
  title: p.title,
  category: p.category
}));
const doubled = [...images, ...images]; // Seamless loop

export function MarqueeBanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax: section lifts slightly as you scroll past it
  const sectionY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  return (
    <motion.section
      id="marquee"
      ref={sectionRef}
      style={{ y: sectionY }}
      className="relative py-8 border-y border-border overflow-hidden"
    >
      {/* Gradient masks for fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #080808 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #080808 0%, transparent 100%)' }} />

      {/* Top label */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 mb-6">
        <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-tagText">Selected work</span>
      </div>

      {/* Marquee Track */}
      <div className="overflow-hidden">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <MarqueeCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function MarqueeCard({ item, index }: { item: { slug: string; src: string; fallbackSrc?: string; title: string; category: string }; index: number }) {
  const FALLBACK = '/images/project-placeholder.webp';
  const [imgSrc, setImgSrc] = useState(item.src || item.fallbackSrc || FALLBACK);
  useEffect(() => {
    setImgSrc(item.src || item.fallbackSrc || FALLBACK);
  }, [item.src, item.fallbackSrc]);

  return (
    <Link to={`/project/${item.slug}`} className="block focus:outline-none">
      <div className="relative flex-shrink-0 w-[340px] md:w-[420px] group cursor-pointer">
        {/* Image with parallax scale on hover */}
        <div className="aspect-video rounded-xl overflow-hidden border border-border group-hover:border-cyan/40 bg-surface parallax-container transition-colors duration-300">
          <motion.img
            src={imgSrc}
            alt={item.title}
            width={420}
            height={236}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onError={() => {
              if (item.fallbackSrc && imgSrc !== item.fallbackSrc) {
                setImgSrc(item.fallbackSrc);
              } else {
                setImgSrc(FALLBACK);
              }
            }}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
            <div>
              <span className="font-ui text-[10px] uppercase tracking-widest text-cyan font-medium">{item.category}</span>
              <p className="font-display italic text-lg text-heading mt-0.5">{item.title}</p>
            </div>
            <span className="font-ui text-xs text-cyan flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity delay-75">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
