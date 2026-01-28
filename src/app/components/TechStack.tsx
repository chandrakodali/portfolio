import { motion } from 'motion/react';
import { Cloud, Container, Terminal, Database, Code2, Settings } from 'lucide-react';
import { Section } from './Section';

const skillCategories = [
  {
    title: 'Cloud Platforms',
    icon: Cloud,
    skills: ['AWS (Solutions Architect)', 'Azure', 'Google Cloud Platform', 'Hybrid Cloud', 'Cloud Migration']
  },
  {
    title: 'Containerization & Orchestration',
    icon: Container,
    skills: ['Kubernetes (CKA)', 'Docker', 'Helm', 'Istio Service Mesh', 'OpenShift', 'EKS', 'AKS', 'GKE']
  },
  {
    title: 'Infrastructure as Code',
    icon: Terminal,
    skills: ['Terraform', 'Ansible', 'CloudFormation', 'Pulumi', 'Terragrunt']
  },
  {
    title: 'CI/CD & DevOps',
    icon: Settings,
    skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'ArgoCD', 'Azure DevOps', 'CircleCI']
  },
  {
    title: 'Observability & Monitoring',
    icon: Database,
    skills: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog', 'Splunk', 'CloudWatch']
  },
  {
    title: 'Languages & Scripting',
    icon: Code2,
    skills: ['Python', 'Go', 'Bash/Shell', 'TypeScript', 'HCL', 'Groovy']
  }
];

export function TechStack() {
  return (
    <Section id="skills" className="py-20 md:py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
        <div className="text-center mb-16">
          <h2 className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4">Technical Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]">
            A comprehensive toolset for building robust, scalable, and secure infrastructure.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mr-3">
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg">{category.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
