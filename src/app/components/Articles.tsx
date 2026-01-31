import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Server, GitMerge, Box, Clock, BookOpen, ChevronDown, Sparkles } from 'lucide-react';
import { Section } from './Section';
import { useRef, useState } from 'react';

const articles = [
    {
        title: 'Building a Kubernetes Platform',
        description: 'A deep dive into designing and implementing a scalable, self-service Kubernetes platform for enterprise teams. Covers control plane architecture, worker node scaling, and multi-tenancy.',
        excerpt: 'Learn how to build an enterprise-grade Kubernetes platform that enables self-service deployments, implements proper multi-tenancy, and scales to handle production workloads...',
        date: 'Dec 15, 2024',
        readTime: '20+ min read',
        icon: Server,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10 dark:bg-black',
        borderColor: 'border-blue-500/20',
        difficulty: 'Advanced',
        tags: ['Kubernetes', 'Platform Engineering', 'DevOps'],
        link: '/portfolio/blog/kubernetes-platform.html'
    },
    {
        title: 'GitOps with ArgoCD',
        description: 'Implementing GitOps workflows to automate deployments and ensure configuration consistency. Best practices for repository structure, drift detection, and secret management.',
        excerpt: 'Discover how GitOps transforms your deployment workflow by using Git as the single source of truth for declarative infrastructure and applications...',
        date: 'Nov 28, 2024',
        readTime: '20+ min read',
        icon: GitMerge,
        color: 'from-violet-500 to-purple-500',
        bgColor: 'bg-violet-500/10 dark:bg-black',
        borderColor: 'border-violet-500/20',
        difficulty: 'Intermediate',
        tags: ['GitOps', 'ArgoCD', 'CI/CD'],
        link: '/portfolio/blog/gitops-argocd.html'
    },
    {
        title: 'Terraform Module Patterns',
        description: 'Strategies for writing reusable, testable, and maintainable Terraform modules. How to structure infrastructure as code for large-scale multi-cloud environments.',
        excerpt: 'Master the art of creating composable, well-tested Terraform modules that scale across teams and multiple cloud providers...',
        date: 'Oct 12, 2024',
        readTime: '20+ min read',
        icon: Box,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-500/10 dark:bg-black',
        borderColor: 'border-amber-500/20',
        difficulty: 'Intermediate',
        tags: ['Terraform', 'IaC', 'Multi-Cloud'],
        link: '/portfolio/blog/terraform-modules.html'
    }
];

// Article Card with 3D Tilt Effect
function ArticleCard({ article, index }: { article: typeof articles[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / rect.width - 0.5;
        const yPct = mouseY / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const difficultyColors = {
        'Beginner': 'bg-green-500/10 text-green-400 border-green-500/20',
        'Intermediate': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        'Advanced': 'bg-red-500/10 text-red-400 border-red-500/20'
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
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
            className="group relative"
        >
            <motion.div
                className={`relative h-full rounded-2xl border ${article.borderColor} ${article.bgColor} backdrop-blur-xl overflow-hidden transition-all duration-500`}
                whileHover={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                    borderColor: 'hsl(var(--primary) / 0.4)',
                }}
            >
                {/* Animated gradient overlay */}
                <motion.div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br ${article.color}`}
                    style={{ opacity: isHovered ? 0.05 : 0 }}
                />

                {/* Glowing orb effect */}
                <motion.div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                    style={{
                        background: `linear-gradient(135deg, ${article.color.includes('blue') ? 'hsl(217, 91%, 60%)' : article.color.includes('violet') ? 'hsl(280, 70%, 60%)' : 'hsl(35, 90%, 60%)'} 0%, transparent 70%)`,
                        opacity: isHovered ? 0.4 : 0.1,
                    }}
                    animate={{
                        scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                />

                <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Header with Icon and Badges */}
                    <div className="flex items-start justify-between mb-4">
                        <motion.div
                            className={`p-3 rounded-xl bg-gradient-to-br ${article.color} shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <article.icon className="w-6 h-6 text-white" />
                        </motion.div>

                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyColors[article.difficulty as keyof typeof difficultyColors]}`}>
                                {article.difficulty}
                            </span>
                        </div>
                    </div>

                    {/* Reading Time & Progress Indicator */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">{article.readTime}</span>
                        </div>
                        <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full bg-gradient-to-r ${article.color}`}
                                initial={{ width: '0%' }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: index * 0.2, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {article.title}
                    </h3>

                    {/* Description with Expandable Preview */}
                    <div className="mb-4 flex-grow">
                        <motion.p
                            className="text-muted-foreground text-sm leading-relaxed"
                            animate={{ height: isExpanded ? 'auto' : '4.5rem' }}
                            style={{ overflow: 'hidden' }}
                        >
                            {isExpanded ? article.description : article.excerpt}
                        </motion.p>
                        <motion.button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsExpanded(!isExpanded);
                            }}
                            className="flex items-center gap-1 text-xs text-primary font-medium mt-2 hover:gap-2 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isExpanded ? 'Show less' : 'Read more'}
                            <motion.span
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-3.5 h-3.5" />
                            </motion.span>
                        </motion.button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {article.tags.map((tag, i) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="px-2.5 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default"
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </div>

                    {/* Footer with Date and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="font-medium">{article.date}</span>
                        </div>

                        <motion.a
                            href={article.link}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                            whileHover={{ scale: 1.05, gap: '0.75rem' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>Read Article</span>
                            <ArrowRight className="w-4 h-4" />
                        </motion.a>
                    </div>
                </div>

                {/* Shimmer effect on hover */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
                        backgroundSize: '200% 100%',
                    }}
                    animate={{
                        backgroundPosition: isHovered ? ['200% 0', '-200% 0'] : '200% 0',
                    }}
                    transition={{
                        duration: 1.5,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

export function Articles() {
    return (
        <Section id="articles" className="py-20 md:py-32 bg-gradient-to-b from-background via-secondary/10 to-background">
            <div className="container max-w-7xl mx-auto px-[var(--container-padding)]">
                {/* Header with animated badge */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Technical Deep Dives</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[length:var(--font-3xl)] font-bold tracking-tight mb-4"
                    >
                        Latest Articles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-2xl mx-auto text-[length:var(--font-lg)]"
                    >
                        Thoughts on platform engineering, cloud architecture, and DevOps practices.
                    </motion.p>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <ArticleCard key={article.title} article={article} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-muted-foreground text-sm mb-4">
                        More articles coming soon. Stay tuned for insights on cloud-native technologies.
                    </p>
                </motion.div>
            </div>
        </Section>
    );
}
