import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { MapPin, Briefcase, Award, GraduationCap, Code2, Cloud, ArrowUpRight, Sparkles } from 'lucide-react';
import { Section } from './Section';
import { useRef, useState } from 'react';

// 3D Tilt Card Component
function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      <motion.div
        className="relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 overflow-hidden transition-all duration-500"
        whileHover={{
          borderColor: 'hsl(var(--primary) / 0.3)',
          boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.1)',
        }}
      >
        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onViewportEnter={() => {
        let start = 0;
        const end = value;
        const duration = 1500;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }}
      className="tabular-nums"
    >
      {count}
      {suffix}
    </motion.span>
  );
}

export function About() {
  return (
    <Section id="about" className="py-20 md:py-32 bg-muted/20">
      <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>About Me</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4"
          >
            Building Tomorrow's Infrastructure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]"
          >
            Focused on reliability, scalability, and developer experience.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Main Info Card - Large */}
          <TiltCard className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <motion.h3
                    className="text-2xl font-bold mb-1"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    Chandra Koushik Kodali
                  </motion.h3>
                  <p className="text-primary font-medium">Platform Engineer</p>
                </div>
                <motion.div
                  className="flex items-center text-muted-foreground text-sm px-3 py-1.5 rounded-full bg-secondary/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <MapPin className="w-4 h-4 mr-1.5" />
                  Illinois, USA
                </motion.div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                I architect cloud-native infrastructure and build self-service developer platforms
                that enable teams to ship faster. With experience at major enterprises including
                J.P. Morgan, Humana, and Deloitte.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="p-4 rounded-xl bg-secondary/30">
                  <div className="text-3xl font-bold text-primary mb-1">
                    <AnimatedCounter value={5} suffix="+" />
                  </div>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30">
                  <div className="text-3xl font-bold text-primary mb-1">
                    <AnimatedCounter value={20} suffix="+" />
                  </div>
                  <p className="text-sm text-muted-foreground">Projects Delivered</p>
                </div>
              </div>

              <motion.a
                href="#contact"
                className="inline-flex items-center mt-6 text-sm font-medium text-primary group w-fit"
                whileHover={{ x: 5 }}
              >
                Get in touch
                <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.a>
            </div>
          </TiltCard>

          {/* Certifications Card */}
          <TiltCard className="flex flex-col justify-center items-center text-center">
            <motion.div
              className="p-4 rounded-2xl bg-primary/10 text-primary mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Award className="w-8 h-8" />
            </motion.div>
            <div className="text-4xl font-bold mb-1">
              <AnimatedCounter value={3} />
            </div>
            <p className="text-sm text-muted-foreground">Key Certifications</p>
            <div className="mt-3 text-xs text-muted-foreground">
              CKA • AWS SAA • Terraform
            </div>
          </TiltCard>

          {/* Experience Card */}
          <TiltCard className="flex flex-col justify-center items-center text-center">
            <motion.div
              className="p-4 rounded-2xl bg-primary/10 text-primary mb-4"
              whileHover={{ scale: 1.1, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Briefcase className="w-8 h-8" />
            </motion.div>
            <div className="text-4xl font-bold mb-1">
              <AnimatedCounter value={4} />
            </div>
            <p className="text-sm text-muted-foreground">Companies</p>
            <div className="mt-3 text-xs text-muted-foreground">
              Enterprise Experience
            </div>
          </TiltCard>

          {/* Cloud Skills */}
          <TiltCard className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Cloud className="w-5 h-5 text-primary mr-2" />
              <h4 className="font-semibold">Cloud & Infrastructure</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker', 'Helm', 'OpenShift'].map(
                (tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="inline-flex items-center rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {tech}
                  </motion.span>
                )
              )}
            </div>
          </TiltCard>

          {/* CI/CD Skills */}
          <TiltCard className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Code2 className="w-5 h-5 text-primary mr-2" />
              <h4 className="font-semibold">CI/CD & Automation</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Jenkins', 'GitHub Actions', 'ArgoCD', 'GitLab CI', 'Ansible', 'Python', 'Go'].map(
                (tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="inline-flex items-center rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {tech}
                  </motion.span>
                )
              )}
            </div>
          </TiltCard>

          {/* Education */}
          <TiltCard className="md:col-span-2 lg:col-span-2">
            <div className="flex items-start gap-4">
              <motion.div
                className="p-3 rounded-xl bg-primary/10 text-primary"
                whileHover={{ scale: 1.1 }}
              >
                <GraduationCap className="w-6 h-6" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-lg">Master of Science in Computer Science</h4>
                <p className="text-muted-foreground">Southern Illinois University</p>
                <p className="text-sm text-muted-foreground mt-1">GPA: 3.8/4.0</p>
              </div>
            </div>
          </TiltCard>

          {/* Companies */}
          <TiltCard className="md:col-span-2 lg:col-span-2">
            <p className="text-sm text-muted-foreground mb-4 font-medium">Trusted by Industry Leaders</p>
            <div className="flex flex-wrap gap-3">
              {['J.P. Morgan', 'Humana', 'Deloitte', 'Country Financial'].map((company, i) => (
                <motion.span
                  key={company}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-2 rounded-lg bg-secondary/30 text-foreground font-medium text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  whileHover={{ scale: 1.05 }}
                >
                  {company}
                </motion.span>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </Section>
  );
}
