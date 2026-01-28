import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Linkedin, Mail, ArrowDown, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/app/hooks/useReducedMotion';

const roles = ['Platform Engineer', 'Cloud Architect', 'DevOps Expert', 'Kubernetes Specialist'];

// Floating orb component with reduced motion support
function FloatingOrb({ delay, duration, size, color, blur, top, left, reducedMotion }: {
  delay: number; duration: number; size: number; color: string; blur: number; top: string; left: string; reducedMotion: boolean;
}) {
  // Skip animation entirely for reduced motion
  if (reducedMotion) {
    return (
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: size, height: size, top, left, background: color, filter: `blur(${blur}px)` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, top, left, background: color, filter: `blur(${blur}px)` }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 20, -10, 15, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  );
}

// Optimized Animated text reveal - uses CSS animation for reduced motion
function AnimatedText({ text, className, delay = 0, reducedMotion }: { text: string; className?: string; delay?: number; reducedMotion: boolean }) {
  // For reduced motion, just render static text immediately
  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  // For normal motion, animate each character
  return (
    <motion.span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.03, ease: [0.215, 0.61, 0.355, 1] }}
          className="inline-block"
          style={{ transformOrigin: 'center bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// 3D Tilt card effect with reduced motion support
function TiltCard({ children, reducedMotion }: { children: React.ReactNode; reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Skip tilt effect for reduced motion
  if (reducedMotion) {
    return <div className="relative">{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Refs for cleanup to prevent race conditions
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Fixed typing effect with proper cleanup to prevent race conditions
  useEffect(() => {
    isMountedRef.current = true;

    // Skip typing animation for reduced motion - show static role
    if (prefersReducedMotion) {
      setDisplayText(roles[currentRole]);
      return;
    }

    const role = roles[currentRole];

    const timeout = setTimeout(() => {
      if (!isMountedRef.current) return;

      if (!isDeleting) {
        if (displayText.length < role.length) {
          setDisplayText(role.slice(0, displayText.length + 1));
        } else {
          // Clear any existing pause timeout
          if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
          }
          // Start deleting after pause
          pauseTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setIsDeleting(true);
            }
          }, 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => {
      clearTimeout(timeout);
    };
  }, [displayText, isDeleting, currentRole, prefersReducedMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  const scrollToAbout = useCallback(() => {
    document.querySelector('#about')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [prefersReducedMotion]);

  return (
    <section ref={containerRef} id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb delay={0} duration={20} size={600} color="rgba(6, 182, 212, 0.08)" blur={80} top="10%" left="-10%" reducedMotion={prefersReducedMotion} />
        <FloatingOrb delay={2} duration={25} size={500} color="rgba(139, 92, 246, 0.1)" blur={100} top="50%" left="60%" reducedMotion={prefersReducedMotion} />
        <FloatingOrb delay={4} duration={22} size={400} color="rgba(236, 72, 153, 0.06)" blur={90} top="70%" left="20%" reducedMotion={prefersReducedMotion} />
        <FloatingOrb delay={1} duration={18} size={300} color="rgba(34, 211, 238, 0.08)" blur={70} top="20%" left="70%" reducedMotion={prefersReducedMotion} />
      </div>

      {/* Radial gradient center glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <motion.div style={{ opacity, scale, y }} className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-gray-300">Available for opportunities</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </motion.div>

          {/* Main heading */}
          <div className="mb-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-400 mb-4"
            >
              Hello, I'm
            </motion.p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none mb-4" style={{ fontFamily: "'Clash Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
              <AnimatedText
                text="Chandra"
                className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]"
                delay={0.4}
                reducedMotion={prefersReducedMotion}
              />
              <br className="sm:hidden" />
              <span className="sm:ml-4"> </span>
              <AnimatedText
                text="Koushik"
                className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]"
                delay={0.7}
                reducedMotion={prefersReducedMotion}
              />
            </h1>
          </div>

          {/* Role with typing effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="h-10 sm:h-12 flex items-center justify-center mb-8"
          >
            <span className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-light">
              {displayText}
              <motion.span
                className="inline-block w-[3px] h-6 sm:h-8 bg-cyan-400 ml-1 rounded-full"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Crafting <span className="text-cyan-400">scalable cloud infrastructure</span> and
            <span className="text-violet-400"> developer platforms</span> with 5+ years of expertise
            in Kubernetes, Terraform, and CI/CD automation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <TiltCard reducedMotion={prefersReducedMotion}>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-2xl text-white font-semibold text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">View My Work</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            </TiltCard>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold text-lg transition-colors"
            >
              Let's Connect
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="flex items-center justify-center gap-6"
          >
            {[
              { icon: Github, href: 'https://github.com/chandrakodali', label: 'GitHub', hoverColor: 'hover:text-white hover:border-white' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/chandrakoushikkodali', label: 'LinkedIn', hoverColor: 'hover:text-blue-400 hover:border-blue-400' },
              { icon: Mail, href: 'mailto:chandrakoushik.kodali@gmail.com', label: 'Email', hoverColor: 'hover:text-cyan-400 hover:border-cyan-400' },
            ].map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9 + i * 0.1 }}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 ${social.hoverColor}`}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group cursor-pointer"
      >
        <span className="text-xs text-gray-500 uppercase tracking-[0.2em] group-hover:text-cyan-400 transition-colors">
          Explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="p-2 rounded-full border border-white/10 group-hover:border-cyan-400/50 transition-colors"
        >
          <ArrowDown className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
        </motion.div>
      </motion.button>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030014] to-transparent pointer-events-none" />
    </section>
  );
}
