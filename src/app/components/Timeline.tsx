import { motion } from 'motion/react';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
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
    ]
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
    ]
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
    ]
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
    ]
  },
];

export function Timeline() {
  return (
    <Section id="experience" className="py-20 md:py-24">
      <div className="container max-w-5xl mx-auto px-[var(--container-padding)]">
        <div className="text-center mb-16">
          <h2 className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4">Professional Experience</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]">
            A journey of building resilient infrastructure across industries.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="relative border-l border-border ml-4 md:ml-0 md:pl-0 space-y-12"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="md:flex gap-8 relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[21px] top-0 md:static md:w-32 md:flex-shrink-0 md:text-right md:pr-8">
                <div className="md:hidden absolute w-3 h-3 bg-primary rounded-full border-2 border-background ring-4 ring-background left-[2px] top-2" />
                <span className="hidden md:block text-sm font-medium text-muted-foreground pt-1">
                  {exp.period}
                </span>
              </div>

              {/* Content Card */}
              <div className="pl-6 md:pl-0 flex-1">
                <div className="md:hidden text-sm font-medium text-muted-foreground mb-1 block">
                  {exp.period}
                </div>

                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  {exp.role}
                  {exp.current && (
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Current
                    </span>
                  )}
                </h3>

                <div className="flex items-center text-muted-foreground text-sm mb-4 mt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="font-medium mr-3">{exp.company}</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{exp.location}</span>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {exp.description}
                </p>

                <ul className="space-y-2">
                  {exp.achievements.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-foreground/80">
                      <ArrowRight className="w-4 h-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
