import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the user prefers reduced motion
 * Respects the prefers-reduced-motion media query for accessibility
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        // Set initial value
        setPrefersReducedMotion(mediaQuery.matches);

        // Listen for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersReducedMotion;
}

/**
 * Returns animation values based on reduced motion preference
 * Use this to conditionally disable or simplify animations
 */
export function useMotionConfig() {
    const prefersReducedMotion = useReducedMotion();

    return {
        prefersReducedMotion,
        // Return simpler animation values when reduced motion is preferred
        animationProps: prefersReducedMotion
            ? { initial: {}, animate: {}, transition: { duration: 0 } }
            : undefined,
        // Duration multiplier (0 for reduced motion)
        durationMultiplier: prefersReducedMotion ? 0 : 1,
        // Whether to show decorative animations like particles
        showDecorativeAnimations: !prefersReducedMotion,
    };
}
