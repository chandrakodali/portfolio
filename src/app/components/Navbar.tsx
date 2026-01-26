import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Terminal, Zap } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  // Track active section with Intersection Observer
  useEffect(() => {
    const sectionIds = navLinks.map(link => link.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is in top 30% of viewport
      threshold: 0,
    };

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        }, observerOptions);

        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  const isActiveLink = (href: string) => {
    return activeSection === href.replace('#', '');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[#030014]/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#hero');
              }}
              className="flex items-center gap-2 sm:gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Go to home section"
            >
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                </div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  aria-hidden="true"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-base sm:text-lg font-bold text-white">
                  CK
                </span>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                  <Zap className="w-2.5 h-2.5" aria-hidden="true" />
                  <span>Platform Engineer</span>
                </div>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1" role="menubar">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  role="menuitem"
                  aria-current={isActiveLink(link.href) ? 'page' : undefined}
                  className={`px-3 lg:px-4 py-2 text-sm transition-colors rounded-lg relative ${isActiveLink(link.href)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.name}
                  {isActiveLink(link.href) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('#contact')}
              className="hidden md:flex items-center gap-2 px-4 lg:px-5 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-lg text-white font-medium text-sm"
            >
              <span>Let's Talk</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white rounded-lg hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 md:hidden"
        aria-hidden={!isMobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-64 sm:w-72 bg-[#0a0a0a] border-l border-white/5 p-6 pt-20"
        >
          <nav className="flex flex-col gap-2" role="menu">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                role="menuitem"
                aria-current={isActiveLink(link.href) ? 'page' : undefined}
                className={`text-left px-4 py-3 text-base rounded-lg transition-all ${isActiveLink(link.href)
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('#contact')}
              role="menuitem"
              className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-600 rounded-lg text-white font-semibold text-sm"
            >
              Let's Talk
            </button>
          </nav>
        </motion.div>
      </motion.div>
    </>
  );
}

