import { motion, useScroll } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-400 blur-sm"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
