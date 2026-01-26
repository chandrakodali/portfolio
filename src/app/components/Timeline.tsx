import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Building2, Calendar, MapPin, Trophy, TrendingUp, Zap } from 'lucide-react';

const experiences = [
  {
    company: 'Country Financial',
    role: 'Platform Engineer',
    location: 'Bloomington, IL',
    period: 'Apr 2025 - Present',
    type: 'current',
    color: 'cyan',
    achievements: [
      'Designed Kubernetes platform supporting 20+ microservices',
      'Reduced deployment time from 45 min to under 20 min (-55%)',
      'Achieved 35% reduction in mean time to detect issues',
      'Zero downtime during Kubernetes version upgrades',
    ],
    tech: ['Kubernetes', 'Terraform', 'Helm', 'ArgoCD', 'GitOps'],
  },
  {
    company: 'Humana',
    role: 'DevOps Engineer',
    location: 'Chicago, IL',
    period: 'Apr 2024 - Mar 2025',
    type: 'past',
    color: 'violet',
    achievements: [
      'Managed HIPAA-compliant cloud infrastructure for PHI data',
      'Reduced failed deployments by 25% through automation',
      'Built monitoring dashboards improving issue detection',
      'Cut environment setup time by 30%',
    ],
    tech: ['Jenkins', 'Docker', 'Kubernetes', 'AWS', 'HIPAA'],
  },
  {
    company: 'Deloitte',
    role: 'DevOps Consultant',
    location: 'Hyderabad, India',
    period: 'Aug 2022 - Dec 2023',
    type: 'past',
    color: 'emerald',
    achievements: [
      'Delivered DevOps solutions for enterprise clients',
      'Increased deployment frequency 2-3x with CI/CD pipelines',
      'Achieved 20-30% infrastructure cost optimization',
      'Led architecture discussions for target-state DevOps',
    ],
    tech: ['Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'AWS'],
  },
  {
    company: 'J.P. Morgan',
    role: 'Cloud Engineer',
    location: 'India (Remote)',
    period: 'Apr 2020 - Jul 2022',
    type: 'past',
    color: 'amber',
    achievements: [
      'Engineered AWS infrastructure with 99.9%+ uptime SLA',
      'Reduced incident response time by 25%',
      'Automated build and deployment workflows',
      'Received Appreciation Award for cloud excellence',
    ],
    tech: ['AWS', 'Jenkins', 'Docker', 'Python', 'CloudWatch'],
    award: true,
  },
];

const colorMap: Record<string, { gradient: string; border: string; dot: string; glow: string }> = {
  cyan: { gradient: 'from-cyan-500 to-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-400', glow: 'shadow-cyan-500/50' },
  violet: { gradient: 'from-violet-500 to-violet-400', border: 'border-violet-500/30', dot: 'bg-violet-400', glow: 'shadow-violet-500/50' },
  emerald: { gradient: 'from-emerald-500 to-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/50' },
  amber: { gradient: 'from-amber-500 to-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400', glow: 'shadow-amber-500/50' },
};

function ExperienceCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const colors = colorMap[exp.color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`relative ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
    >
      {/* Timeline dot */}
      <div className={`absolute top-8 ${index % 2 === 0 ? 'md:-right-3' : 'md:-left-3'} left-0 md:left-auto`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.4, type: 'spring' }}
          className={`w-6 h-6 rounded-full ${colors.dot} shadow-lg ${colors.glow} ring-4 ring-[#030014]`}
        />
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`ml-10 md:ml-0 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border ${colors.border} backdrop-blur-xl overflow-hidden group hover:border-white/[0.15] transition-all duration-300`}
      >
        {/* Hover glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        {/* Header */}
        <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'} relative z-10`}>
          <div className="flex items-center gap-3 mb-2">
            {exp.award && <Trophy className="w-5 h-5 text-amber-400" />}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${exp.type === 'current' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'}`}>
              {exp.type === 'current' ? 'Current' : exp.period.split(' - ')[1]}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-1">{exp.company}</h3>
          <p className={`text-lg font-medium bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mb-2`}>
            {exp.role}
          </p>
          
          <div className={`flex items-center gap-4 text-sm text-gray-500 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {exp.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {exp.period}
            </span>
          </div>
        </div>

        {/* Achievements */}
        <ul className={`space-y-2 mb-6 relative z-10 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
          {exp.achievements.slice(0, 3).map((achievement, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-2 text-gray-400 text-sm"
              style={{ flexDirection: index % 2 === 0 ? 'row-reverse' : 'row' }}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{achievement}</span>
            </motion.li>
          ))}
        </ul>

        {/* Tech stack */}
        <div className={`flex flex-wrap gap-2 relative z-10 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
          {exp.tech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-400 text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Timeline() {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8" ref={ref}>
      <div className="max-w-5xl mx-auto" ref={containerRef}>
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6"
          >
            <Building2 className="w-7 h-7 text-amber-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            A journey of building resilient infrastructure across industries
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line - desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 via-violet-400 to-amber-400"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline line - mobile */}
          <div className="md:hidden absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

          {/* Experience cards */}
          <div className="space-y-8 md:space-y-0">
            {experiences.map((exp, index) => (
              <div
                key={exp.company}
                className={`md:flex ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} md:py-8`}
              >
                <div className="md:w-1/2">
                  <ExperienceCard exp={exp} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
