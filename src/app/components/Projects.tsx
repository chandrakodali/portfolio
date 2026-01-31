import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Container, Cloud, GitBranch, Shield, Gauge, Network, ExternalLink } from 'lucide-react';
import { Section } from './Section';
import { useRef, useState } from 'react';

const projects = [
  {
    title: 'Kubernetes Platform',
    subtitle: 'Enterprise Internal Developer Platform',
    description: 'Built a self-service platform on Kubernetes enabling standardized deployments across 20+ microservices with GitOps workflows and zero-downtime releases.',
    icon: Container,
    metrics: { services: '20+', deploy: '-55%', uptime: '99.9%' },
    tags: ['Kubernetes', 'Helm', 'ArgoCD', 'Terraform'],
    featured: true,
  },
  {
    title: 'Multi-Cloud IaC',
    subtitle: 'Infrastructure Automation',
    description: 'Automated infrastructure provisioning using Terraform with drift detection, reducing manual effort by 30% while ensuring consistency across environments.',
    icon: Cloud,
    metrics: { envs: '15+', manual: '-30%', drift: '0%' },
    tags: ['Terraform', 'AWS', 'Azure', 'CloudFormation'],
    featured: false,
  },
  {
    title: 'CI/CD Framework',
    subtitle: 'Pipeline Optimization',
    description: 'Engineered optimized CI/CD pipelines with automated testing and security scanning, reducing deployment time from 45 to under 20 minutes.',
    icon: GitBranch,
    metrics: { time: '<20m', freq: '2-3x', failed: '-25%' },
    tags: ['Jenkins', 'GitLab CI', 'GitHub Actions'],
    featured: false,
  },
  {
    title: 'Observability Stack',
    subtitle: 'Monitoring & Alerting',
    description: 'Implemented centralized observability achieving 35% MTTD reduction with custom dashboards, intelligent alerting, and distributed tracing.',
    icon: Gauge,
    metrics: { mttd: '-35%', dashboards: '50+', alerts: '200+' },
    tags: ['Prometheus', 'Grafana', 'Datadog', 'Splunk'],
    featured: false,
  },
  {
    title: 'Secrets Management',
    subtitle: 'Security & Compliance',
    description: 'Enterprise secrets solution with HashiCorp Vault implementing HIPAA-compliant patterns for healthcare applications with automated rotation.',
    icon: Shield,
    metrics: { secrets: '1K+', compliance: 'HIPAA', rotation: 'Auto' },
    tags: ['HashiCorp Vault', 'OPA', 'IAM'],
    featured: false,
  },
  {
    title: 'Service Mesh',
    subtitle: 'Zero-Trust Networking',
    description: 'Distributed tracing and mTLS implementation for microservices architecture enabling secure service-to-service communication at scale.',
    icon: Network,
    metrics: { services: '50+', security: 'mTLS', traces: '1M/day' },
    tags: ['Istio', 'Envoy', 'Jaeger', 'Kiali'],
    featured: false,
  },
];

// 3D Tilt Card Component
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const isFeatured = project.featured;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
    >
      <motion.div
        className={`relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 overflow-hidden transition-colors duration-500 ${isFeatured ? 'bg-gradient-to-br from-primary/5 via-card/50 to-transparent' : ''
          }`}
        whileHover={{
          borderColor: 'hsl(var(--primary) / 0.3)',
          boxShadow: '0 25px 50px -12px hsl(var(--primary) / 0.15)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(var(--primary) / 0.06), transparent 40%)',
          }}
        />

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              Featured
            </span>
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <motion.div
            className="mb-6 w-fit"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="p-4 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <project.icon className="w-7 h-7" />
            </div>
          </motion.div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground font-medium mb-4">
            {project.subtitle}
          </p>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border/50">
            {Object.entries(project.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground capitalize">{key}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                className="px-3 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>


        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <Section id="projects" className="py-20 md:py-32 bg-secondary/20">
      <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Portfolio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]"
          >
            Infrastructure solutions that power mission-critical applications.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}
