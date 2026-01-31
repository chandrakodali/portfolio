// Site configuration - Personal information and social links
export const siteConfig = {
    name: 'Chandra Koushik Kodali',
    role: 'DevOps / Cloud Engineer',
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
        roles: ['DevOps Engineer', 'Cloud Engineer', 'Platform Engineer', 'Kubernetes Specialist'],
        description: 'Cross-stack problem solver who debugs application code AND infrastructure. Built platforms at JPMorgan, Humana, and Country Financial that survive 3 AM production incidents.',
        availability: 'Available for opportunities',
    },

    // About section
    about: {
        yearsExperience: '5+',
        certifications: 0,
        companies: ['Country Financial', 'Humana', 'Deloitte', 'J.P. Morgan'],
        education: {
            degree: 'MS Computer Science',
            school: 'Southern Illinois University',
        },
        certificationsList: [
            // Note: Add certifications here when earned
        ],
    },
};

// Skills/Tech stack data
export const skills = [
    {
        category: 'Cloud & Infrastructure',
        icon: 'Cloud',
        color: 'orange',
        items: [
            { name: 'AWS (EKS, EC2, VPC, IAM, RDS, Lambda)', level: 95 },
            { name: 'Azure (AKS, Azure SQL, ADF)', level: 85 },
            { name: 'Terraform', level: 92 },
            { name: 'Kubernetes', level: 95 },
        ],
    },
    {
        category: 'GitOps & CI/CD',
        icon: 'GitBranch',
        color: 'emerald',
        items: [
            { name: 'ArgoCD', level: 92 },
            { name: 'Azure DevOps (YAML)', level: 90 },
            { name: 'GitHub Actions', level: 90 },
            { name: 'Jenkins', level: 88 },
        ],
    },
    {
        category: 'Container & Orchestration',
        icon: 'Container',
        color: 'cyan',
        items: [
            { name: 'Kubernetes', level: 95 },
            { name: 'Docker', level: 95 },
            { name: 'Helm', level: 90 },
            { name: 'EKS/AKS', level: 92 },
        ],
    },
    {
        category: 'Scripting & Automation',
        icon: 'Terminal',
        color: 'violet',
        items: [
            { name: 'Python', level: 88 },
            { name: 'Bash', level: 90 },
            { name: 'Ansible', level: 85 },
            { name: 'PowerShell', level: 80 },
        ],
    },
    {
        category: 'Observability & Reliability',
        icon: 'Activity',
        color: 'pink',
        items: [
            { name: 'Prometheus/Grafana', level: 90 },
            { name: 'CloudWatch', level: 88 },
            { name: 'Datadog', level: 85 },
            { name: 'ELK Stack', level: 85 },
        ],
    },
    {
        category: 'Security & Compliance',
        icon: 'Shield',
        color: 'amber',
        items: [
            { name: 'PCI-DSS Hardening', level: 90 },
            { name: 'HIPAA Encryption (KMS/RDS)', level: 88 },
            { name: 'IAM Policy Management', level: 92 },
            { name: 'Trivy/SonarQube', level: 85 },
        ],
    },
];

export const additionalTools = [
    'Linux', 'Java (Spring Boot)', 'RESTful APIs', 'PostgreSQL', 'Redis',
    'Vault', 'KMS', 'Secrets Manager', 'PagerDuty', 'Velero', 'Karpenter'
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
        title: 'Production-Grade EKS Platform',
        subtitle: 'Terraform & Kubernetes Infrastructure',
        description: 'Designed modular EKS infrastructure with Terraform featuring IAM/RBAC integration, multi-AZ VPC, EFS persistent storage, and remote state management. Reduced infrastructure provisioning time from 4 hours to 15 minutes.',
        icon: 'Container',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
        metrics: { deploy: '15min', uptime: '99.9%', savings: '$8K/mo' },
        tags: ['Terraform', 'Kubernetes', 'AWS EKS', 'ArgoCD'],
        featured: true,
        links: {
            github: 'https://github.com/chandrakodali/terraform-aws-eks-platform',
        },
    },
    {
        title: 'AWS Cost Anomaly Detection',
        subtitle: 'Serverless Cost Monitoring',
        description: 'Built serverless cost monitoring system with automated Slack alerts for AWS billing anomalies using Lambda, Cost Explorer API, and EventBridge scheduling.',
        icon: 'Gauge',
        gradient: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #eab308 100%)',
        metrics: { alerts: 'Real-time', savings: '20%', coverage: '100%' },
        tags: ['Python', 'AWS Lambda', 'CloudFormation', 'EventBridge'],
        links: {
            github: 'https://github.com/chandrakodali/aws-cost-anomaly-detector',
        },
    },
    {
        title: 'GitOps Workflow Automation',
        subtitle: 'ArgoCD Multi-Environment Management',
        description: 'Migrated manual EKS cluster deployments to ArgoCD-managed declarative workflows across Dev/Staging/Prod. Eliminated configuration drift and reduced environment-specific incidents by 60%.',
        icon: 'GitBranch',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        metrics: { drift: '0%', incidents: '-60%', deploy: '3x/week' },
        tags: ['ArgoCD', 'Kubernetes', 'GitOps', 'Helm'],
    },
    {
        title: 'HIPAA-Compliant Infrastructure',
        subtitle: 'Healthcare Data Platform',
        description: 'Deployed PHI-secure infrastructure for MyHumana portal utilizing AES-256 encrypted RDS instances, private API Gateways with VPC Link, and 6-year backup retention with cross-region replication.',
        icon: 'Shield',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        metrics: { compliance: 'HIPAA', encryption: 'AES-256', retention: '6yr' },
        tags: ['AWS', 'RDS', 'KMS', 'VPC', 'CloudWatch'],
    },
    {
        title: 'CI/CD Security Hardening',
        subtitle: 'Shift-Left Security Pipeline',
        description: 'Re-engineered Azure DevOps YAML pipelines with SonarQube code quality gates and Trivy container vulnerability scanning. Blocked Critical/High CVEs at build stage.',
        icon: 'Lock',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #a855f7 100%)',
        metrics: { quality: 'Enforced', vulns: 'Blocked', coverage: '85%' },
        tags: ['Azure DevOps', 'SonarQube', 'Trivy', 'Security'],
    },
    {
        title: 'Disaster Recovery Engineering',
        subtitle: 'Cross-Region Backup Strategy',
        description: 'Architected cross-region backup strategy utilizing AWS Backup and Velero for EKS cluster state and persistent volumes. Achieved RPO of 4 hours and RTO of 2 hours.',
        icon: 'Database',
        gradient: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0ea5e9 100%)',
        metrics: { RPO: '4hrs', RTO: '2hrs', coverage: '100%' },
        tags: ['AWS Backup', 'Velero', 'EKS', 'S3'],
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
        title: 'AWS DevOps Engineer',
        company: 'Country Financial Group',
        location: 'Bloomington, IL',
        period: 'Apr 2025 - Present',
        type: 'work',
        description: [
            'Refactored Terraform monoliths into versioned, reusable modules reducing deployment time by 40%',
            'Migrated manual EKS deployments to ArgoCD-managed GitOps, reducing incidents by 60%',
            'Integrated AWS Secrets Manager with External Secrets Operator for PCI-DSS compliance',
            'Achieved 99.9% uptime SLA for production quote engine while deploying 3-4x weekly',
            'Reduced over-provisioned compute by 25% ($8K/month savings) using VPA recommendations',
        ],
        technologies: ['AWS EKS', 'Terraform', 'ArgoCD', 'Azure DevOps', 'Kubernetes'],
    },
    {
        title: 'AWS DevOps Engineer',
        company: 'Humana',
        location: 'Chicago, IL',
        period: 'Apr 2024 - Mar 2025',
        type: 'work',
        description: [
            'Deployed HIPAA-compliant infrastructure for MyHumana portal serving 5M+ members',
            'Architected CI/CD pipelines with GitHub Actions and AWS CodePipeline, reducing deploy time by 60%',
            'Established CloudWatch Alarms and PagerDuty escalation, improving MTTR by 35%',
            'Implemented auto-scaling policies achieving 20% reduction in compute costs ($12K/month)',
            'Developed Python Lambda functions reducing data sync failures from 12/month to 0',
        ],
        technologies: ['AWS', 'CloudFormation', 'Python', 'Ansible', 'GitHub Actions'],
    },
    {
        title: 'DevOps Engineer',
        company: 'Deloitte (Sherwin-Williams)',
        location: 'Hyderabad, India',
        period: 'Aug 2022 - Dec 2023',
        type: 'work',
        description: [
            'Engineered Azure Data Factory pipelines processing 500GB+ daily manufacturing data',
            'Managed Jenkins-based release workflows for ColorSnap digital platform',
            'Standardized Azure resource provisioning using Terraform modules',
            'Reduced MTTR for data ingestion issues from 2 hours to 15 minutes with Datadog monitoring',
            'Established environment parity eliminating "works on my machine" failures by 80%',
        ],
        technologies: ['Azure', 'Terraform', 'Jenkins', 'Datadog', 'Docker'],
    },
    {
        title: 'Software Development Engineer (Java)',
        company: 'JPMorgan Chase & Co.',
        location: 'Hyderabad, India',
        period: 'Apr 2020 - Jul 2022',
        type: 'work',
        description: [
            'Developed RESTful APIs for trade reconciliation processing 10M+ daily transactions',
            'Reduced p95 query latency from 800ms to 120ms through database optimization',
            'Implemented Redis caching reducing database load by 40% and improving response times by 60%',
            'Led containerization of legacy Java monoliths to Docker-based microservices on AWS ECS',
            'Achieved 85% code coverage with JUnit/Mockito, reducing production defects by 30%',
        ],
        technologies: ['Java 11', 'Spring Boot', 'PostgreSQL', 'Redis', 'AWS ECS', 'Docker'],
    },
];
