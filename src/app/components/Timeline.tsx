import { motion } from 'motion/react';
import { Building2, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { Section } from './Section';

const experiences = [
  {
    company: 'Country Financial',
    role: 'Platform Engineer',
    location: 'Bloomington, IL',
    period: 'Apr 2025 - Present',
    current: true,
    description: 'Designing Kubernetes platforms supporting 20+ microservices and optimizing deployment workflows.',
    achievements: [
      'Designed Kubernetes platform supporting 20+ microservices',
      'Reduced deployment time from 45 min to under 20 min (-55%)',
      'Achieved 35% reduction in mean time to detect issues',
      'Zero downtime during Kubernetes version upgrades',
    ],
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    company: 'Humana',
    role: 'DevOps Engineer',
    location: 'Chicago, IL',
    period: 'Apr 2024 - Mar 2025',
    current: false,
    description: 'Managed HIPAA-compliant cloud infrastructure and automated CI/CD pipelines for PHI data systems.',
    achievements: [
      'Managed HIPAA-compliant cloud infrastructure for PHI data',
      'Reduced failed deployments by 25% through automation',
      'Built monitoring dashboards improving issue detection',
      'Cut environment setup time by 30%',
    ],
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    company: 'Deloitte',
    role: 'DevOps Consultant',
    location: 'Hyderabad, India',
    period: 'Aug 2022 - Dec 2023',
    current: false,
    description: 'Delivered DevOps transformation solutions for enterprise clients, focusing on cost optimization and velocity.',
    achievements: [
      'Delivered DevOps solutions for enterprise clients',
      'Increased deployment frequency 2-3x with CI/CD pipelines',
      'Achieved 20-30% infrastructure cost optimization',
      'Led architecture discussions for target-state DevOps',
    ],
    color: 'from-violet-500/20 to-purple-500/20',
  },
  {
    company: 'J.P. Morgan',
    role: 'Cloud Engineer',
    location: 'India (Remote)',
    period: 'Apr 2020 - Jul 2022',
    current: false,
    description: 'Engineered high-availability AWS infrastructure and automated build workflows.',
    achievements: [
      'Engineered AWS infrastructure with 99.9%+ uptime SLA',
      'Reduced incident response time by 25%',
      'Automated build and deployment workflows',
      'Received Appreciation Award for cloud excellence',
    ],
    color: 'from-orange-500/20 to-amber-500/20',
  },
];

function TimelineCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 ${
        index !== experiences.length - 1 ? 'pb-16' : ''
      }`}
    >
      {/* Timeline line */}
      {index !== experiences.length - 1 && (
        <motion.div
          className="absolute left-8 lg:left-1/2 top-16 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ transformOrigin: 'top' }}
        />
      )}

      {/* Timeline dot */}
      <motion.div
        className="absolute left-8 lg:left-1/2 top-8 -translate-x-1/2 z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
      >
        <div
          className={`w-4 h-4 rounded-full border-2 border-background ${
            exp.current ? 'bg-primary' : 'bg-muted-foreground'
          }`}
        >
          {exp.current && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className={`lg:${isEven ? 'pr-16 text-right' : 'col-start-2 pl-16'} pl-20 lg:pl-0`}>
        <motion.div
          className="group relative"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Card */}
          <div
            className={`relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${
              isEven ? 'lg:ml-auto' : ''
            }`}
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              {/* Period badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm text-muted-foreground mb-4 ${
                  isEven ? 'lg:ml-auto lg:flex lg:w-fit' : ''
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {exp.period}
                {exp.current && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    Current
                  </span>
                )}
              </div>

              {/* Company & Role */}
              <div className={`mb-4 ${isEven ? 'lg:text-right' : ''}`}>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  {exp.company}
                </h3>
                <p className="text-primary font-medium">{exp.role}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {exp.location}
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {exp.description}
              </p>

              {/* Achievements */}
              <ul className={`space-y-2 ${isEven ? 'lg:text-right' : ''}`}>
                {exp.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Empty space for alternating layout */}
      <div className={`hidden lg:block ${isEven ? 'col-start-2' : ''}`} />
    </motion.div>
  );
}

export function Timeline() {
  return (
    <Section id="experience" className="py-20 md:py-32 bg-secondary/20">
      <div className="container max-w-6xl mx-auto px-[var(--container-padding)]">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Building2 className="w-4 h-4" />
            <span>Experience</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4"
          >
            Professional Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]"
          >
            A journey of building resilient infrastructure across industries.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {experiences.map((exp, index) => (
            <TimelineCard key={exp.company} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}
