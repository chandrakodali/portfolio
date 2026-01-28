import { motion, useInView } from 'motion/react';
import { useRef, ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    id?: string;
    className?: string;
    delay?: number;
}

export function Section({ children, id, className = '', delay = 0 }: SectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <section
            ref={ref}
            id={id}
            className={`relative ${className}`}
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: delay,
                    staggerChildren: 0.1
                }}
            >
                {children}
            </motion.div>
        </section>
    );
}
