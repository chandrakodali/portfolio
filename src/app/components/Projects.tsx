import { motion } from 'motion/react';
import { Container, Cloud, GitBranch, Shield, Gauge, Network, Github, ExternalLink, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: 'Kubernetes Platform',
    subtitle: 'Enterprise Internal Developer Platform',
    description: 'Built a self-service platform on Kubernetes enabling standardized deployments across 20+ microservices with GitOps workflows and zero-downtime releases.',
    icon: Container,
    metrics: { services: '20+', deploy: '-55%', uptime: '99.9%' },
    tags: ['Kubernetes', 'Helm', 'ArgoCD', 'Terraform'],
    links: { github: 'https://github.com/chandrakodali/k8s-platform' },
  },
  {
    title: 'Multi-Cloud IaC',
    subtitle: 'Infrastructure Automation',
    description: 'Automated infrastructure provisioning using Terraform with drift detection, reducing manual effort by 30% while ensuring consistency across environments.',
    icon: Cloud,
    metrics: { envs: '15+', manual: '-30%', drift: '0%' },
    tags: ['Terraform', 'AWS', 'Azure', 'CloudFormation'],
    links: { github: 'https://github.com/chandrakodali/terraform-modules' },
  },
  {
    title: 'CI/CD Framework',
    subtitle: 'Pipeline Optimization',
    description: 'Engineered optimized CI/CD pipelines with automated testing and security scanning, reducing deployment time from 45 to under 20 minutes.',
    icon: GitBranch,
    metrics: { time: '<20m', freq: '2-3x', failed: '-25%' },
    tags: ['Jenkins', 'GitLab CI', 'GitHub Actions'],
  },
  {
    title: 'Observability Stack',
    subtitle: 'Monitoring & Alerting',
    description: 'Implemented centralized observability achieving 35% MTTD reduction with custom dashboards, intelligent alerting, and distributed tracing.',
    icon: Gauge,
    metrics: { mttd: '-35%', dashboards: '50+', alerts: '200+' },
    tags: ['Prometheus', 'Grafana', 'Datadog', 'Splunk'],
  },
  {
    title: 'Secrets Management',
    subtitle: 'Security & Compliance',
    description: 'Enterprise secrets solution with HashiCorp Vault implementing HIPAA-compliant patterns for healthcare applications with automated rotation.',
    icon: Shield,
    metrics: { secrets: '1K+', compliance: 'HIPAA', rotation: 'Auto' },
    tags: ['HashiCorp Vault', 'OPA', 'IAM'],
  },
  {
    title: 'Service Mesh',
    subtitle: 'Zero-Trust Networking',
    description: 'Distributed tracing and mTLS implementation for microservices architecture enabling secure service-to-service communication at scale.',
    icon: Network,
    metrics: { services: '50+', security: 'mTLS', traces: '1M/day' },
    tags: ['Istio', 'Envoy', 'Jaeger', 'Kiali'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

export function Projects() {
  return (
    <section id="projects" className="py-20 md:py-32 bg-secondary/30">
      <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]"
          >
            Infrastructure solutions that power mission-critical applications.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <project.icon className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-sm text-muted-foreground font-medium mb-4">{project.subtitle}</p>

              <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-border mt-auto">
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </a>
                )}
                {(project.links as any)?.demo && (
                  <a
                    href={(project.links as any).demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                )}
                <div className="ml-auto">
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
