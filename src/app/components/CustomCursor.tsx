import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Premium Custom Cursor Component for 2026
 * Features:
 * - Smooth follow-along animation
 * - Interactive hover states
 * - GPU-accelerated transforms
 * - Respects reduced motion preferences
 */
export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const followerX = useMotionValue(0);
  const followerY = useMotionValue(0);

  const followerSpringConfig = { damping: 30, stiffness: 200, mass: 0.6 };
  const followerXSpring = useSpring(followerX, followerSpringConfig);
  const followerYSpring = useSpring(followerY, followerSpringConfig);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Check if device has fine pointer (not touch)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || !hasFinePointer) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      followerX.set(e.clientX);
      followerY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Check if element is interactive
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.getAttribute('role') === 'button' ||
        target.closest('a, button, [role="button"]') !== null;

      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, followerX, followerY]);

  // Don't render on touch devices or if reduced motion is preferred
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || !hasFinePointer) {
      return null;
    }
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovering ? 0.5 : 1,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Follower ring */}
      <motion.div
        className={`custom-cursor-follower ${isHovering ? 'hovering' : ''}`}
        style={{
          x: followerXSpring,
          y: followerYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
