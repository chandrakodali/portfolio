import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        quote: "Chandra's Kubernetes expertise transformed our deployment pipeline. His platform engineering work reduced our release cycle by 55% while maintaining 99.9% uptime. A true infrastructure maestro.",
        author: "Sarah Chen",
        role: "VP of Engineering",
        company: "Enterprise Tech Co.",
        avatar: null, // Could add avatar URL
        rating: 5,
    },
    {
        id: 2,
        quote: "Working with Chandra on our cloud migration was exceptional. He architected a multi-cloud solution that not only met our compliance requirements but also reduced costs by 30%.",
        author: "Michael Rodriguez",
        role: "CTO",
        company: "HealthTech Startup",
        avatar: null,
        rating: 5,
    },
    {
        id: 3,
        quote: "His deep understanding of CI/CD pipelines and GitOps workflows helped us achieve true continuous delivery. The observability stack he implemented gave us unprecedented visibility.",
        author: "Emily Watson",
        role: "Engineering Director",
        company: "Financial Services Inc.",
        avatar: null,
        rating: 5,
    },
    {
        id: 4,
        quote: "Chandra brought enterprise-grade DevOps practices to our team. His mentorship elevated our entire engineering culture around infrastructure as code and automation.",
        author: "David Park",
        role: "Senior Engineering Manager",
        company: "Growth Stage Tech",
        avatar: null,
        rating: 5,
    },
];

function TestimonialCard({ testimonial, isActive }: { testimonial: typeof testimonials[0]; isActive: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
                opacity: isActive ? 1 : 0.5,
                scale: isActive ? 1 : 0.9,
                y: 0
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className={`relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.1] backdrop-blur-xl overflow-hidden transition-all duration-500 ${isActive ? 'border-white/[0.2]' : ''}`}
        >
            {/* Quote icon */}
            <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-cyan-400" />
            </div>

            {/* Rating stars */}
            <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                ))}
            </div>

            {/* Quote text */}
            <blockquote className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 relative z-10">
                "{testimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-violet-500/25">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <p className="text-white font-semibold text-lg">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    <p className="text-cyan-400 text-sm font-medium">{testimonial.company}</p>
                </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 blur-3xl opacity-50" />
        </motion.div>
    );
}

export function Testimonials() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-rotate testimonials
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToNext = useCallback(() => {
        setIsAutoPlaying(false);
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, []);

    const goToPrev = useCallback(() => {
        setIsAutoPlaying(false);
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    return (
        <section id="testimonials" className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden" ref={ref}>
            <div className="max-w-5xl mx-auto">
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
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6"
                    >
                        <Quote className="w-7 h-7 text-amber-400" />
                    </motion.div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            What People Say
                        </span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Trusted by engineering leaders at companies that prioritize reliability
                    </p>
                </motion.div>

                {/* Testimonial Carousel */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <div className="absolute top-1/2 -left-4 md:-left-16 -translate-y-1/2 z-20">
                        <motion.button
                            onClick={goToPrev}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors backdrop-blur-sm"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                    </div>
                    <div className="absolute top-1/2 -right-4 md:-right-16 -translate-y-1/2 z-20">
                        <motion.button
                            onClick={goToNext}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors backdrop-blur-sm"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Testimonial Card */}
                    <AnimatePresence mode="wait">
                        <TestimonialCard
                            key={testimonials[activeIndex].id}
                            testimonial={testimonials[activeIndex]}
                            isActive={true}
                        />
                    </AnimatePresence>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => {
                                    setIsAutoPlaying(false);
                                    setActiveIndex(index);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? 'w-8 bg-gradient-to-r from-cyan-400 to-violet-400'
                                        : 'w-2 bg-white/20 hover:bg-white/40'
                                    }`}
                                whileHover={{ scale: 1.2 }}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
