import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { MapPin, Briefcase, Award, GraduationCap, Zap, Code2, Cloud, Container, ArrowUpRight } from 'lucide-react';

// Animated counter component
function Counter({ value, suffix = '' }: { value: string; suffix?: string }) {
  return (
    <span className="tabular-nums">{value}{suffix}</span>
  );
}

// Bento card component
function BentoCard({ children, className = '', delay = 0 }: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={`relative rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl overflow-hidden group hover:border-white/[0.15] transition-colors duration-500 ${className}`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
      </div>
      {children}
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 mb-6"
          >
            <Zap className="w-7 h-7 text-cyan-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Building the infrastructure that powers tomorrow's applications
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          
          {/* Large intro card */}
          <BentoCard className="md:col-span-2 lg:col-span-2 p-8" delay={0.1}>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-violet-500/25">
                  CK
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Chandra Koushik Kodali</h3>
                  <p className="text-cyan-400 font-medium">Platform Engineer</p>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Illinois, USA</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                I architect <span className="text-white">cloud-native infrastructure</span> and 
                build <span className="text-white">self-service developer platforms</span> that 
                enable teams to ship faster. With experience at <span className="text-cyan-400">J.P. Morgan</span>, 
                <span className="text-violet-400"> Humana</span>, <span className="text-cyan-400">Deloitte</span>, and 
                <span className="text-violet-400"> Country Financial</span>.
              </p>
              <motion.a
                href="#contact"
                whileHover={{ gap: '1rem' }}
                className="inline-flex items-center gap-2 text-cyan-400 font-medium group"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.a>
            </div>
          </BentoCard>

          {/* Stats cards */}
          <BentoCard className="p-6" delay={0.2}>
            <div className="h-full flex flex-col justify-between relative z-10">
              <Briefcase className="w-8 h-8 text-cyan-400 mb-4" />
              <div>
                <div className="text-5xl font-bold text-white mb-2">
                  <Counter value="5" suffix="+" />
                </div>
                <p className="text-gray-500 text-sm">Years of Experience</p>
              </div>
            </div>
          </BentoCard>

          <BentoCard className="p-6" delay={0.25}>
            <div className="h-full flex flex-col justify-between relative z-10">
              <Award className="w-8 h-8 text-violet-400 mb-4" />
              <div>
                <div className="text-5xl font-bold text-white mb-2">
                  <Counter value="3" />
                </div>
                <p className="text-gray-500 text-sm">Certifications</p>
              </div>
            </div>
          </BentoCard>

          {/* Tech focus cards */}
          <BentoCard className="p-6" delay={0.3}>
            <div className="relative z-10">
              <Cloud className="w-8 h-8 text-orange-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Cloud Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {['AWS', 'Azure', 'GCP'].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard className="p-6" delay={0.35}>
            <div className="relative z-10">
              <Container className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Orchestration</h4>
              <div className="flex flex-wrap gap-2">
                {['Kubernetes', 'Docker', 'Helm'].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard className="p-6" delay={0.4}>
            <div className="relative z-10">
              <Code2 className="w-8 h-8 text-emerald-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">IaC & CI/CD</h4>
              <div className="flex flex-wrap gap-2">
                {['Terraform', 'Jenkins', 'ArgoCD'].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          <BentoCard className="p-6" delay={0.45}>
            <div className="relative z-10">
              <GraduationCap className="w-8 h-8 text-fuchsia-400 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Education</h4>
              <p className="text-white font-medium">MS Computer Science</p>
              <p className="text-gray-500 text-sm">Southern Illinois University</p>
            </div>
          </BentoCard>

          {/* Certifications card - spans 2 columns */}
          <BentoCard className="md:col-span-2 p-6" delay={0.5}>
            <div className="relative z-10">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Certifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'AWS Solutions Architect', color: 'from-orange-500 to-amber-500' },
                  { name: 'Kubernetes Administrator (CKA)', color: 'from-blue-500 to-cyan-500' },
                  { name: 'Azure DevOps AZ-400', color: 'from-blue-600 to-violet-500' },
                ].map((cert, i) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  >
                    <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${cert.color} mb-3`} />
                    <p className="text-white text-sm font-medium">{cert.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Companies card - spans 2 columns */}
          <BentoCard className="md:col-span-2 p-6" delay={0.55}>
            <div className="relative z-10">
              <h4 className="text-lg font-semibold text-white mb-4">Trusted by Industry Leaders</h4>
              <div className="flex flex-wrap gap-4 items-center">
                {['J.P. Morgan', 'Humana', 'Deloitte', 'Country Financial'].map((company, i) => (
                  <motion.div
                    key={company}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 font-medium hover:text-white hover:border-white/[0.12] transition-all"
                  >
                    {company}
                  </motion.div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
