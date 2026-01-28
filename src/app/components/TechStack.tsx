import { motion } from 'motion/react';
import { Cloud, Container, Terminal, Database, Code2, Settings, Layers } from 'lucide-react';
import { Section } from './Section';

const skillCategories = [
  {
    title: 'Cloud Platforms',
    icon: Cloud,
    color: 'from-blue-500/20 to-cyan-500/20',
    skills: ['AWS (Solutions Architect)', 'Azure', 'Google Cloud Platform', 'Hybrid Cloud', 'Cloud Migration'],
  },
  {
    title: 'Containerization',
    icon: Container,
    color: 'from-emerald-500/20 to-teal-500/20',
    skills: ['Kubernetes (CKA)', 'Docker', 'Helm', 'Istio Service Mesh', 'OpenShift', 'EKS', 'AKS', 'GKE'],
  },
  {
    title: 'Infrastructure as Code',
    icon: Terminal,
    color: 'from-violet-500/20 to-purple-500/20',
    skills: ['Terraform', 'Ansible', 'CloudFormation', 'Pulumi', 'Terragrunt'],
  },
  {
    title: 'CI/CD & DevOps',
    icon: Settings,
    color: 'from-orange-500/20 to-amber-500/20',
    skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'ArgoCD', 'Azure DevOps', 'CircleCI'],
  },
  {
    title: 'Observability',
    icon: Database,
    color: 'from-pink-500/20 to-rose-500/20',
    skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog', 'Splunk', 'CloudWatch'],
  },
  {
    title: 'Languages & Scripting',
    icon: Code2,
    color: 'from-indigo-500/20 to-blue-500/20',
    skills: ['Python', 'Go', 'Bash/Shell', 'TypeScript', 'HCL', 'Groovy'],
  },
];

function SkillCard({
  category,
  index,
}: {
  category: (typeof skillCategories)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div
        className={`relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 overflow-hidden transition-all duration-500 hover:border-primary/30`}
      >
        {/* Gradient background on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="mb-6 w-fit"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-3 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <category.icon className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-4 group-hover:text-primary transition-colors duration-300">
            {category.title}
          </h3>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.03 }}
                className="inline-flex items-center rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5 text-xs font-medium hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TechStack() {
  return (
    <Section id="skills" className="py-20 md:py-32 bg-muted/20">
      <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Layers className="w-4 h-4" />
            <span>Technical Skills</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4"
          >
            Technical Expertise
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]"
          >
            A comprehensive toolset for building robust, scalable, and secure infrastructure.
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}
