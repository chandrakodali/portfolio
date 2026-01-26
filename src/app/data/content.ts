// Site configuration - Personal information and social links
export const siteConfig = {
    name: 'Chandra Koushik Kodali',
    role: 'Platform Engineer',
    email: import.meta.env.VITE_CONTACT_EMAIL || 'chandrakoushik.kodali@gmail.com',
    phone: '618-453-6722',
    location: 'Illinois, USA',

    // Social links
    social: {
        github: 'https://github.com/chandrakodali',
        linkedin: 'https://www.linkedin.com/in/chandrakoushikkodali',
    },

    // Hero section
    hero: {
        greeting: "Hello, I'm",
        roles: ['Platform Engineer', 'Cloud Architect', 'DevOps Expert', 'Kubernetes Specialist'],
        description: 'Crafting scalable cloud infrastructure and developer platforms with 5+ years of expertise in Kubernetes, Terraform, and CI/CD automation.',
        availability: 'Available for opportunities',
    },

    // About section
    about: {
        yearsExperience: '5+',
        certifications: 3,
        companies: ['J.P. Morgan', 'Humana', 'Deloitte', 'Country Financial'],
        education: {
            degree: 'MS Computer Science',
            school: 'Southern Illinois University',
        },
        certificationsList: [
            { name: 'AWS Solutions Architect', color: 'from-orange-500 to-amber-500' },
            { name: 'Kubernetes Administrator (CKA)', color: 'from-blue-500 to-cyan-500' },
            { name: 'Azure DevOps AZ-400', color: 'from-blue-600 to-violet-500' },
        ],
    },
};

// Skills/Tech stack data
export const skills = [
    {
        category: 'Container & Orchestration',
        icon: 'Container',
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
        icon: 'Cloud',
        color: 'orange',
        items: [
            { name: 'AWS', level: 92 },
            { name: 'Azure', level: 85 },
            { name: 'GCP', level: 80 },
        ],
    },
    {
        category: 'Infrastructure as Code',
        icon: 'Database',
        color: 'violet',
        items: [
            { name: 'Terraform', level: 90 },
            { name: 'CloudFormation', level: 85 },
            { name: 'Ansible', level: 82 },
        ],
    },
    {
        category: 'CI/CD & Automation',
        icon: 'GitBranch',
        color: 'emerald',
        items: [
            { name: 'Jenkins', level: 93 },
            { name: 'GitHub Actions', level: 90 },
            { name: 'GitLab CI', level: 88 },
        ],
    },
    {
        category: 'Observability',
        icon: 'Activity',
        color: 'pink',
        items: [
            { name: 'Prometheus', level: 88 },
            { name: 'Grafana', level: 90 },
            { name: 'Datadog', level: 85 },
        ],
    },
    {
        category: 'Security & Compliance',
        icon: 'Shield',
        color: 'amber',
        items: [
            { name: 'HashiCorp Vault', level: 85 },
            { name: 'OPA', level: 80 },
            { name: 'HIPAA', level: 88 },
        ],
    },
];

export const additionalTools = [
    'Linux', 'Python', 'Bash', 'Git', 'Nginx', 'Redis',
    'PostgreSQL', 'MongoDB', 'PagerDuty', 'Backstage', 'Splunk'
];

// Projects data
export interface Project {
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    gradient: string;
    metrics: Record<string, string>;
    tags: string[];
    featured?: boolean;
    links?: {
        github?: string;
        demo?: string;
    };
}

export const projects: Project[] = [
    {
        title: 'Kubernetes Platform',
        subtitle: 'Enterprise Internal Developer Platform',
        description: 'Built a self-service platform on Kubernetes enabling standardized deployments across 20+ microservices with GitOps workflows and zero-downtime releases.',
        icon: 'Container',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
        metrics: { services: '20+', deploy: '-55%', uptime: '99.9%' },
        tags: ['Kubernetes', 'Helm', 'ArgoCD', 'Terraform'],
        featured: true,
        links: {
            github: 'https://github.com/chandrakodali/k8s-platform',
        },
    },
    {
        title: 'Multi-Cloud IaC',
        subtitle: 'Infrastructure Automation',
        description: 'Automated infrastructure provisioning using Terraform with drift detection, reducing manual effort by 30% while ensuring consistency across environments.',
        icon: 'Cloud',
        gradient: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #eab308 100%)',
        metrics: { envs: '15+', manual: '-30%', drift: '0%' },
        tags: ['Terraform', 'AWS', 'Azure', 'CloudFormation'],
        links: {
            github: 'https://github.com/chandrakodali/terraform-modules',
        },
    },
    {
        title: 'CI/CD Framework',
        subtitle: 'Pipeline Optimization',
        description: 'Engineered optimized CI/CD pipelines with automated testing and security scanning, reducing deployment time from 45 to under 20 minutes.',
        icon: 'GitBranch',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        metrics: { time: '<20m', freq: '2-3x', failed: '-25%' },
        tags: ['Jenkins', 'GitLab CI', 'GitHub Actions'],
    },
    {
        title: 'Observability Stack',
        subtitle: 'Monitoring & Alerting',
        description: 'Implemented centralized observability achieving 35% MTTD reduction with custom dashboards, intelligent alerting, and distributed tracing.',
        icon: 'Gauge',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%)',
        metrics: { mttd: '-35%', dashboards: '50+', alerts: '200+' },
        tags: ['Prometheus', 'Grafana', 'Datadog', 'Splunk'],
    },
    {
        title: 'Secrets Management',
        subtitle: 'Security & Compliance',
        description: 'Enterprise secrets solution with HashiCorp Vault implementing HIPAA-compliant patterns for healthcare applications with automated rotation.',
        icon: 'Shield',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        metrics: { secrets: '1K+', compliance: 'HIPAA', rotation: 'Auto' },
        tags: ['HashiCorp Vault', 'OPA', 'IAM'],
    },
    {
        title: 'Service Mesh',
        subtitle: 'Zero-Trust Networking',
        description: 'Distributed tracing and mTLS implementation for microservices architecture enabling secure service-to-service communication at scale.',
        icon: 'Network',
        gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0ea5e9 100%)',
        metrics: { services: '50+', security: 'mTLS', traces: '1M/day' },
        tags: ['Istio', 'Envoy', 'Jaeger', 'Kiali'],
    },
];

// Experience/Timeline data
export interface Experience {
    title: string;
    company: string;
    location: string;
    period: string;
    type: 'work' | 'education';
    description: string[];
    technologies?: string[];
}

export const experiences: Experience[] = [
    {
        title: 'Platform Engineer',
        company: 'J.P. Morgan',
        location: 'Columbus, OH',
        period: 'Oct 2024 - Present',
        type: 'work',
        description: [
            'Architected cloud-native developer platform serving 200+ engineers',
            'Implemented GitOps workflows with ArgoCD for zero-downtime deployments',
            'Built self-service infrastructure provisioning reducing onboarding time by 60%',
        ],
        technologies: ['Kubernetes', 'ArgoCD', 'Terraform', 'AWS'],
    },
    {
        title: 'DevOps Engineer',
        company: 'Humana',
        location: 'Chicago, IL',
        period: 'Oct 2023 - Oct 2024',
        type: 'work',
        description: [
            'Managed HIPAA-compliant infrastructure for healthcare applications',
            'Implemented HashiCorp Vault for secrets management across 50+ services',
            'Reduced deployment time by 55% through CI/CD pipeline optimization',
        ],
        technologies: ['Azure', 'HashiCorp Vault', 'Jenkins', 'Kubernetes'],
    },
    {
        title: 'Cloud Engineer',
        company: 'Deloitte',
        location: 'Remote',
        period: 'Aug 2022 - Sep 2023',
        type: 'work',
        description: [
            'Designed multi-cloud infrastructure solutions for enterprise clients',
            'Created reusable Terraform modules reducing provisioning time by 40%',
            'Led migration of legacy applications to containerized architectures',
        ],
        technologies: ['AWS', 'GCP', 'Terraform', 'Docker'],
    },
    {
        title: 'Systems Engineer',
        company: 'Country Financial',
        location: 'Bloomington, IL',
        period: 'May 2021 - Jul 2022',
        type: 'work',
        description: [
            'Built centralized observability stack with Prometheus and Grafana',
            'Automated infrastructure provisioning with Ansible and CloudFormation',
            'Improved system reliability achieving 99.9% uptime',
        ],
        technologies: ['AWS', 'Prometheus', 'Grafana', 'Ansible'],
    },
];
