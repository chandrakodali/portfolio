import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Articles', href: '#articles' },
  { name: 'Contact', href: '#contact' },
];

// Active section indicator
function useActiveSection() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    navLinks.forEach((link) => {
      const element = document.querySelector(link.href);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

// Magnetic nav link component
function MagneticNavLink({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  const ref = useState<HTMLAnchorElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref[0]) return;
    const rect = ref[0].getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref[1]}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="activeSection"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.a>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const activeSection = useActiveSection();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  // Scale scroll progress for the indicator
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-violet-500 to-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-2xl saturate-150 border-b border-border/30 shadow-lg shadow-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-[var(--container-padding)]">
          <div className="flex items-center justify-between h-16">
            {/* Logo with animation */}
            <motion.a
              href="#hero"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                whileHover={{ rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Terminal className="w-5 h-5" />
              </motion.div>
              <span className="font-bold text-lg tracking-tight">CK</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <MagneticNavLink
                  key={link.name}
                  href={link.href}
                  isActive={activeSection === link.href.slice(1)}
                >
                  {link.name}
                </MagneticNavLink>
              ))}
              <div className="flex items-center gap-4 pl-4 border-l border-border/50">
                <ThemeToggle />
                <motion.a
                  href="#contact"
                  className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg shadow-primary/20"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  Hire Me
                </motion.a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <motion.button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl md:hidden pt-24 px-[var(--container-padding)]"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  variants={itemVariants}
                  href={link.href}
                  className={`text-2xl font-medium py-4 border-b border-border/20 transition-colors ${
                    activeSection === link.href.slice(1)
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileTap={{ scale: 0.98, x: 10 }}
                >
                  <span className="text-muted-foreground text-sm mr-4">
                    0{index + 1}
                  </span>
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                variants={itemVariants}
                href="#contact"
                className="mt-8 w-full py-4 rounded-xl bg-primary text-primary-foreground text-center text-lg font-medium shadow-xl shadow-primary/20"
                onClick={() => setIsMobileMenuOpen(false)}
                whileTap={{ scale: 0.98 }}
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
