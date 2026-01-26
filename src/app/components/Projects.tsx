import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Container, Cloud, GitBranch, Shield, Gauge, Network, Sparkles, Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Kubernetes Platform',
    subtitle: 'Enterprise Internal Developer Platform',
    description: 'Built a self-service platform on Kubernetes enabling standardized deployments across 20+ microservices with GitOps workflows and zero-downtime releases.',
    icon: Container,
    image: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
    metrics: { services: '20+', deploy: '-55%', uptime: '99.9%' },
    tags: ['Kubernetes', 'Helm', 'ArgoCD', 'Terraform'],
    featured: true,
    links: { github: 'https://github.com/chandrakodali/k8s-platform' },
  },
  {
    title: 'Multi-Cloud IaC',
    subtitle: 'Infrastructure Automation',
    description: 'Automated infrastructure provisioning using Terraform with drift detection, reducing manual effort by 30% while ensuring consistency across environments.',
    icon: Cloud,
    image: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #eab308 100%)',
    metrics: { envs: '15+', manual: '-30%', drift: '0%' },
    tags: ['Terraform', 'AWS', 'Azure', 'CloudFormation'],
    links: { github: 'https://github.com/chandrakodali/terraform-modules' },
  },
  {
    title: 'CI/CD Framework',
    subtitle: 'Pipeline Optimization',
    description: 'Engineered optimized CI/CD pipelines with automated testing and security scanning, reducing deployment time from 45 to under 20 minutes.',
    icon: GitBranch,
    image: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    metrics: { time: '<20m', freq: '2-3x', failed: '-25%' },
    tags: ['Jenkins', 'GitLab CI', 'GitHub Actions'],
  },
  {
    title: 'Observability Stack',
    subtitle: 'Monitoring & Alerting',
    description: 'Implemented centralized observability achieving 35% MTTD reduction with custom dashboards, intelligent alerting, and distributed tracing.',
    icon: Gauge,
    image: 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%)',
    metrics: { mttd: '-35%', dashboards: '50+', alerts: '200+' },
    tags: ['Prometheus', 'Grafana', 'Datadog', 'Splunk'],
  },
  {
    title: 'Secrets Management',
    subtitle: 'Security & Compliance',
    description: 'Enterprise secrets solution with HashiCorp Vault implementing HIPAA-compliant patterns for healthcare applications with automated rotation.',
    icon: Shield,
    image: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
    metrics: { secrets: '1K+', compliance: 'HIPAA', rotation: 'Auto' },
    tags: ['HashiCorp Vault', 'OPA', 'IAM'],
  },
  {
    title: 'Service Mesh',
    subtitle: 'Zero-Trust Networking',
    description: 'Distributed tracing and mTLS implementation for microservices architecture enabling secure service-to-service communication at scale.',
    icon: Network,
    image: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0ea5e9 100%)',
    metrics: { services: '50+', security: 'mTLS', traces: '1M/day' },
    tags: ['Istio', 'Envoy', 'Jaeger', 'Kiali'],
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group ${project.featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.3 }}
        className="h-full p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl overflow-hidden hover:border-white/[0.15] transition-colors duration-300"
      >
        {/* Background gradient on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: project.image, opacity: isHovered ? 0.05 : 0 }}
        />

        {/* Featured badge */}
        {project.featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">Featured</span>
          </motion.div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: project.image }}
          >
            <project.icon className="w-7 h-7 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{project.subtitle}</p>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-lg font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500 capitalize">{key}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-400 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Project Links */}
          {project.links && (
            <div className="flex gap-3">
              {(project.links as { github?: string; demo?: string }).github && (
                <a
                  href={(project.links as { github?: string }).github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              )}
              {(project.links as { github?: string; demo?: string }).demo && (
                <a
                  href={(project.links as { demo?: string }).demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-400 hover:text-white transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  aria-label={`View ${project.title} live demo`}
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          )}

        </div>

        {/* Decorative corner gradient */}
        <div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ background: project.image }}
        />
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8" ref={ref}>
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/30 mb-6"
          >
            <Sparkles className="w-7 h-7 text-fuchsia-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Infrastructure solutions that power mission-critical applications
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
