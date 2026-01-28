import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { useRef, useEffect } from 'react';

// Text reveal animation component
function TextReveal({ children, delay = 0 }: { children: string; delay?: number }) {
  const words = children.split(' ');

  return (
    <span className="inline-flex flex-wrap justify-center">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Animated gradient background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(217, 91%, 30%) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(280, 70%, 25%) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(217, 91%, 20%) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

// Magnetic button component
function MagneticButton({
  children,
  href,
  variant = 'primary',
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary';
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseStyles =
    'inline-flex h-14 items-center justify-center rounded-full px-8 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
  const variantStyles =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90'
      : 'border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground';

  return (
    <motion.a
      ref={ref}
      href={href}
      className={`${baseStyles} ${variantStyles}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.a>
  );
}

// Floating particles component
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            bottom: '-10px',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center py-20 overflow-hidden"
    >
      <AnimatedBackground />
      <FloatingParticles />

      <motion.div
        className="container px-[var(--container-padding)] z-10 w-full"
        style={{ opacity, scale, y }}
      >
        <div className="flex flex-col items-center text-center space-y-10 max-w-5xl mx-auto">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-medium text-primary backdrop-blur-md"
          >
            <motion.span
              className="flex h-2.5 w-2.5 rounded-full bg-primary mr-2.5"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Available for new opportunities
          </motion.div>

          {/* Main Heading with Text Reveal */}
          <div className="space-y-6">
            <h1 className="text-[length:var(--font-6xl)] font-bold tracking-tighter text-foreground leading-[1.1]">
              <TextReveal delay={0.2}>Chandra Koushik Kodali</TextReveal>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-[800px] text-muted-foreground text-[length:var(--font-xl)] leading-relaxed font-light"
            >
              Platform Engineer & Cloud Architect specialized in building scalable
              infrastructure, automating CI/CD pipelines, and enabling developer
              velocity.
            </motion.p>
          </div>

          {/* Actions with Magnetic Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
          >
            <MagneticButton href="#projects" variant="primary">
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#contact" variant="secondary">
              Contact Me
            </MagneticButton>
          </motion.div>

          {/* Social Links with Hover Effects */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center space-x-8 pt-12"
          >
            {[
              { href: 'https://github.com/chandrakodali', icon: Github, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/chandrakoushikkodali', icon: Linkedin, label: 'LinkedIn' },
              { href: 'mailto:chandrakoushik.kodali@gmail.com', icon: Mail, label: 'Email' },
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.label !== 'Email' ? '_blank' : undefined}
                rel={social.label !== 'Email' ? 'noopener noreferrer' : undefined}
                className="relative text-muted-foreground hover:text-foreground transition-colors p-2"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
              >
                <social.icon className="h-6 w-6" />
                <span className="sr-only">{social.label}</span>
                <motion.span
                  className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
