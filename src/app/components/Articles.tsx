import { motion } from 'motion/react';
import { ArrowRight, Server, GitMerge, Box } from 'lucide-react';
import { Section } from './Section';

const articles = [
    {
        title: 'Building a Kubernetes Platform',
        description: 'A deep dive into designing and implementing a scalable, self-service Kubernetes platform for enterprise teams. Covers control plane architecture, worker node scaling, and multi-tenancy.',
        date: 'Dec 15, 2024',
        readTime: '8 min read',
        icon: Server,
        color: 'text-blue-400',
        link: '/portfolio/blog/kubernetes-platform.html'
    },
    {
        title: 'GitOps with ArgoCD',
        description: 'Implementing GitOps workflows to automate deployments and ensure configuration consistency. Best practices for repository structure, drift detection, and secret management.',
        date: 'Nov 28, 2024',
        readTime: '6 min read',
        icon: GitMerge,
        color: 'text-violet-400',
        link: '/portfolio/blog/gitops-argocd.html'
    },
    {
        title: 'Terraform Module Patterns',
        description: 'Strategies for writing reusable, testable, and maintainable Terraform modules. How to structure infrastructure as code for large-scale multi-cloud environments.',
        date: 'Oct 12, 2024',
        readTime: '10 min read',
        icon: Box,
        color: 'text-amber-400',
        link: '/portfolio/blog/terraform-modules.html'
    }
];

export function Articles() {
    return (
        <Section id="articles" className="py-20 md:py-24">
            <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
                <div className="text-center mb-16">
                    <h2 className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4">Latest Articles</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]">
                        Thoughts on platform engineering, cloud architecture, and DevOps practices.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {articles.map((article) => (
                        <motion.a
                            key={article.title}
                            href={article.link}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-all hover:-translate-y-1 block duration-300"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`p-2 rounded-lg bg-secondary ${article.color}`}>
                                    <article.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">{article.readTime}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                                {article.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                <span className="text-xs text-muted-foreground font-medium">{article.date}</span>
                                <div className="flex items-center text-sm font-medium text-primary">
                                    Read Article
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </Section>
    );
}
