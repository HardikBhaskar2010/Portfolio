import { useEffect, useRef } from 'react';
import type { ReactNode, ElementType } from 'react';
import { useHighlightStore } from '@/store/highlightStore';

interface HighlightPointProps {
  id: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  color?: string;
  label?: string;
}

/**
 * Wraps an element and registers its bounding box and story metadata with the HighlightStore.
 * The ScrollOrb will track the nearest HighlightPoint as you scroll.
 */
export function HighlightPoint({
  id,
  children,
  className,
  as: Component = 'div',
  color,
  label,
}: HighlightPointProps) {
  const ref = useRef<HTMLElement>(null);
  const addHighlight = useHighlightStore((state) => state.addHighlight);
  const removeHighlight = useHighlightStore((state) => state.removeHighlight);

  useEffect(() => {
    if (ref.current) {
      addHighlight(id, ref.current, color, label);
    }
    return () => removeHighlight(id);
  }, [id, color, label, addHighlight, removeHighlight]);

  // Use type assertion to allow dynamic component rendering
  const Tag = Component as any;

  return (
    <Tag ref={ref} className={className} data-highlight-id={id}>
      {children}
    </Tag>
  );
}

