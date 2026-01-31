import { motion } from 'motion/react';
import { Building2, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { Section } from './Section';

const experiences = [
  {
    company: 'Country Financial Group',
    role: 'AWS DevOps Engineer',
    location: 'Bloomington, IL',
    period: 'Apr 2025 - Present',
    current: true,
    description: 'Modernizing customer-facing insurance infrastructure serving quote systems and policy management platforms.',
    achievements: [
      'Refactored Terraform monoliths into versioned modules reducing deployment time by 40%',
      'Migrated manual EKS deployments to ArgoCD-managed GitOps, reducing incidents by 60%',
      'Integrated AWS Secrets Manager with External Secrets Operator for PCI-DSS compliance',
      'Achieved 99.9% uptime SLA while deploying 3-4x weekly',
      'Reduced compute costs by 25% ($8K/month savings) using VPA recommendations',
    ],
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    company: 'Humana',
    role: 'AWS DevOps Engineer',
    location: 'Chicago, IL',
    period: 'Apr 2024 - Mar 2025',
    current: false,
    description: 'Supported MyHumana member portal and provider verification systems handling PHI for 5M+ members.',
    achievements: [
      'Deployed HIPAA-compliant infrastructure with AES-256 encrypted RDS instances',
      'Architected CI/CD pipelines reducing deployment time by 60%',
      'Established CloudWatch Alarms and PagerDuty escalation, improving MTTR by 35%',
      'Implemented auto-scaling policies achieving 20% reduction in compute costs ($12K/month)',
      'Developed Python Lambda functions reducing data sync failures from 12/month to 0',
    ],
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    company: 'Deloitte (Sherwin-Williams)',
    role: 'DevOps Engineer',
    location: 'Hyderabad, India',
    period: 'Aug 2022 - Dec 2023',
    current: false,
    description: 'Embedded with Sherwin-Williams manufacturing analytics team to modernize supply chain data pipelines.',
    achievements: [
      'Engineered Azure Data Factory pipelines processing 500GB+ daily manufacturing data',
      'Managed Jenkins-based release workflows for ColorSnap digital platform',
      'Standardized Azure resource provisioning using Terraform modules',
      'Reduced MTTR for data ingestion issues from 2 hours to 15 minutes with Datadog',
      'Established environment parity eliminating deployment failures by 80%',
    ],
    color: 'from-violet-500/20 to-purple-500/20',
  },
  {
    company: 'JPMorgan Chase & Co.',
    role: 'Software Development Engineer (Java)',
    location: 'Hyderabad, India',
    period: 'Apr 2020 - Jul 2022',
    current: false,
    description: 'Developed backend systems for internal trade reconciliation platform processing equity and fixed-income transactions.',
    achievements: [
      'Developed RESTful APIs processing 10M+ daily equity and fixed-income transactions',
      'Reduced p95 query latency from 800ms to 120ms through database optimization',
      'Implemented Redis caching reducing database load by 40%',
      'Led containerization of legacy Java monoliths to Docker-based microservices on AWS ECS',
      'Achieved 85% code coverage with JUnit/Mockito, reducing production defects by 30%',
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
      className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 ${index !== experiences.length - 1 ? 'pb-16' : ''
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
          className={`w-4 h-4 rounded-full border-2 border-background ${exp.current ? 'bg-primary' : 'bg-muted-foreground'
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
            className={`relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${isEven ? 'lg:ml-auto' : ''
              }`}
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              {/* Period badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm text-muted-foreground mb-4 ${isEven ? 'lg:ml-auto lg:flex lg:w-fit' : ''
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
