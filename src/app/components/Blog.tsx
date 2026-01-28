import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { BookOpen, Clock, ArrowUpRight, Tag } from 'lucide-react';

const articles = [
    {
        id: 1,
        title: 'Building a Self-Service Kubernetes Platform',
        excerpt: 'How to design and implement an internal developer platform that empowers teams while maintaining security and compliance.',
        category: 'Platform Engineering',
        readTime: '8 min read',
        gradient: 'from-cyan-500 to-blue-600',
        link: '/portfolio/blog/kubernetes-platform.html',
    },
    {
        id: 2,
        title: 'GitOps Best Practices with ArgoCD',
        excerpt: 'A comprehensive guide to implementing GitOps workflows for Kubernetes deployments with zero-downtime strategies.',
        category: 'DevOps',
        readTime: '6 min read',
        gradient: 'from-violet-500 to-purple-600',
        link: '/portfolio/blog/gitops-argocd.html',
    },
    {
        id: 3,
        title: 'Terraform at Scale: Module Design Patterns',
        excerpt: 'Learn how to design reusable Terraform modules, implement state management strategies, and build scalable infrastructure-as-code.',
        category: 'Infrastructure',
        readTime: '10 min read',
        gradient: 'from-emerald-500 to-teal-600',
        link: '/portfolio/blog/terraform-modules.html',
    },
];

function ArticleCard({ article, index }: { article: typeof articles[0]; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.article
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl overflow-hidden hover:border-white/[0.15] transition-all duration-500"
        >
            {/* Gradient header bar */}
            <div className={`h-2 bg-gradient-to-r ${article.gradient}`} />

            <div className="p-6 md:p-8">
                {/* Category and read time */}
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-gray-400">
                        <Tag className="w-3 h-3" />
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {article.excerpt}
                </p>

                {/* Read more link */}
                <motion.a
                    href={article.link}
                    className="inline-flex items-center gap-2 text-cyan-400 font-medium text-sm group/link"
                    whileHover={{ x: 5 }}
                >
                    <span>Read article</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                </motion.a>
            </div>

            {/* Hover glow effect */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            />
        </motion.article>
    );
}

export function Blog() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="blog" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8" ref={ref}>
            <div className="max-w-6xl mx-auto">
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
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6"
                    >
                        <BookOpen className="w-7 h-7 text-emerald-400" />
                    </motion.div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Insights & Articles
                        </span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Thoughts on platform engineering, cloud architecture, and DevOps practices
                    </p>
                </motion.div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <ArticleCard key={article.id} article={article} index={index} />
                    ))}
                </div>

                {/* View all link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <motion.a
                        href="#"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-gray-400 hover:text-white hover:border-white/[0.2] transition-all text-sm font-medium"
                    >
                        <span>View all articles</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
