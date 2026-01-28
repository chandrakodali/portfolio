import { motion, useInView, Variants } from 'motion/react';
import { useRef, ReactNode } from 'react';
import { useReducedMotion } from '@/app/hooks/useReducedMotion';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

// Apple-style spring configuration
const springTransition = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 15,
  mass: 0.8,
};

// Container variants for staggered children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Child item variants
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springTransition,
  },
};

export function Section({ children, id, className = '', delay = 0 }: SectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animations
  if (prefersReducedMotion) {
    return (
      <section ref={ref} id={id} className={`relative ${className}`}>
        {children}
      </section>
    );
  }

  return (
    <section ref={ref} id={id} className={`relative ${className}`}>
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        transition={{ delay }}
        className="will-animate"
      >
        {children}
      </motion.div>
    </section>
  );
}

// Export item variants for use in child components
export { itemVariants, springTransition };
