import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Container, Cloud, GitBranch, Activity, Database, Shield, Layers } from 'lucide-react';
import { useReducedMotion } from '@/app/hooks/useReducedMotion';

const skills = [
  {
    category: 'Container & Orchestration',
    icon: Container,
    color: 'cyan',
    items: [
      { name: 'Kubernetes', level: 95 },
      { name: 'Docker', level: 95 },
      { name: 'Helm', level: 90 },
      { name: 'ArgoCD', level: 88 },
    ],
  },
  {
    category: 'Cloud Platforms',
    icon: Cloud,
    color: 'orange',
    items: [
      { name: 'AWS', level: 92 },
      { name: 'Azure', level: 85 },
      { name: 'GCP', level: 80 },
    ],
  },
  {
    category: 'Infrastructure as Code',
    icon: Database,
    color: 'violet',
    items: [
      { name: 'Terraform', level: 90 },
      { name: 'CloudFormation', level: 85 },
      { name: 'Ansible', level: 82 },
    ],
  },
  {
    category: 'CI/CD & Automation',
    icon: GitBranch,
    color: 'emerald',
    items: [
      { name: 'Jenkins', level: 93 },
      { name: 'GitHub Actions', level: 90 },
      { name: 'GitLab CI', level: 88 },
    ],
  },
  {
    category: 'Observability',
    icon: Activity,
    color: 'pink',
    items: [
      { name: 'Prometheus', level: 88 },
      { name: 'Grafana', level: 90 },
      { name: 'Datadog', level: 85 },
    ],
  },
  {
    category: 'Security & Compliance',
    icon: Shield,
    color: 'amber',
    items: [
      { name: 'HashiCorp Vault', level: 85 },
      { name: 'OPA', level: 80 },
      { name: 'HIPAA', level: 88 },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', bar: 'from-cyan-500 to-cyan-400' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', bar: 'from-orange-500 to-amber-400' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', bar: 'from-violet-500 to-purple-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', bar: 'from-emerald-500 to-green-400' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', bar: 'from-pink-500 to-rose-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', bar: 'from-amber-500 to-yellow-400' },
};

function SkillBar({ name, level, color, delay, reducedMotion }: { name: string; level: number; color: string; delay: number; reducedMotion: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const colors = colorMap[color];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.5, delay }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{name}</span>
        <span className={`text-xs font-mono ${colors.text}`}>{level}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: reducedMotion ? `${level}%` : 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={reducedMotion ? { duration: 0 } : { duration: 1, delay: delay + 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className={`h-full bg-gradient-to-r ${colors.bar} rounded-full relative`}
        >
          {/* Only animate shimmer on hover and when not reduced motion */}
          {!reducedMotion && isHovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}


export function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="skills" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8" ref={ref}>
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-6"
          >
            <Layers className="w-7 h-7 text-violet-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Tech Stack
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Battle-tested tools for building resilient systems at scale
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {skills.map((category, categoryIndex) => {
            const colors = colorMap[category.color];
            const isHovered = hoveredCategory === category.category;

            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                onHoverStart={() => setHoveredCategory(category.category)}
                onHoverEnd={() => setHoveredCategory(null)}
                className={`relative p-6 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl overflow-hidden transition-all duration-500 ${isHovered ? 'border-white/[0.15] scale-[1.02]' : ''}`}
              >
                {/* Background glow on hover */}
                <motion.div
                  className={`absolute inset-0 ${colors.bg} opacity-0`}
                  animate={{ opacity: isHovered ? 0.5 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <category.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category.category}</h3>
                </div>

                {/* Skill bars */}
                <div className="space-y-4 relative z-10">
                  {category.items.map((skill, skillIndex) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      color={category.color}
                      delay={categoryIndex * 0.1 + skillIndex * 0.05}
                      reducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional tools */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-gray-500 text-sm mb-6">Also experienced with</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Linux', 'Python', 'Bash', 'Git', 'Nginx', 'Redis', 'PostgreSQL', 'MongoDB', 'PagerDuty', 'Backstage', 'Splunk'].map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.03 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 text-sm font-medium hover:text-white transition-all cursor-default"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
