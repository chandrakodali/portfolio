import { motion, useScroll, useTransform } from 'motion/react';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center py-20 overflow-hidden"
    >
      {/* Background pattern - subtle and professional */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <div className="container px-[var(--container-padding)] z-10 w-full">
        <motion.div
          style={{ opacity, scale, y }}
          className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Available for new opportunities
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <h1 className="text-[length:var(--font-6xl)] font-bold tracking-tighter text-foreground leading-[1.1]">
              Chandra Koushik Kodali
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground text-[length:var(--font-xl)] leading-relaxed font-light">
              Platform Engineer & Cloud Architect specialized in building scalable infrastructure,
              automating CI/CD pipelines, and enabling developer velocity.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4"
          >
            <a
              href="#projects"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-base font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Contact Me
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex items-center space-x-8 pt-12"
          >
            <a href="https://github.com/chandrakodali" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200">
              <Github className="h-7 w-7" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/chandrakoushikkodali" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200">
              <Linkedin className="h-7 w-7" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="mailto:chandrakoushik.kodali@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-110 duration-200">
              <Mail className="h-7 w-7" />
              <span className="sr-only">Email</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
