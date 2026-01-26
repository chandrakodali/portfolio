import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

// Configuration for different performance levels
const PERFORMANCE_CONFIG = {
  high: { particleCount: 80, maxConnections: 5, connectionDistance: 150, targetFPS: 60 },
  medium: { particleCount: 50, maxConnections: 3, connectionDistance: 120, targetFPS: 30 },
  low: { particleCount: 25, maxConnections: 2, connectionDistance: 100, targetFPS: 24 },
  reduced: { particleCount: 0, maxConnections: 0, connectionDistance: 0, targetFPS: 0 },
};

function getPerformanceLevel(): keyof typeof PERFORMANCE_CONFIG {
  if (typeof window === 'undefined') return 'medium';

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'reduced';
  }

  // Check for mobile devices or low-end devices
  const isMobile = window.innerWidth < 768;
  const isLowEndDevice = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;

  if (isMobile || isLowEndDevice) return 'low';
  if (window.innerWidth < 1200) return 'medium';
  return 'high';
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Get performance configuration
    const perfLevel = getPerformanceLevel();
    const config = PERFORMANCE_CONFIG[perfLevel];

    // Skip rendering entirely for reduced motion
    if (perfLevel === 'reduced') {
      setIsVisible(false);
      return;
    }

    // Set canvas size
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();

    // Throttled resize handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };
    window.addEventListener('resize', handleResize);

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation loop with FPS limiting
    let animationFrameId: number;
    let lastFrameTime = 0;
    const frameInterval = 1000 / config.targetFPS;

    // Pre-calculate values for optimization
    const connectionDistanceSquared = config.connectionDistance * config.connectionDistance;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // FPS limiting
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = currentTime - (elapsed % frameInterval);

      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections (limited per particle for performance)
        let connectionCount = 0;
        for (let j = i + 1; j < particles.length && connectionCount < config.maxConnections; j++) {
          const otherParticle = particles[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;

          // Use squared distance to avoid expensive sqrt
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < connectionDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            const opacity = (1 - distance / config.connectionDistance) * 0.2;

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            connectionCount++;
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Visibility API - pause when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

