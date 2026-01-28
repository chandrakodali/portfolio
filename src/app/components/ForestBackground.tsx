import { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speedX: number;
    speedY: number;
    color: string;
    type: 'circle' | 'hexagon' | 'square';
}

interface FloatingShape {
    x: number;
    y: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    color: string;
    type: 'ring' | 'dottedCircle' | 'gradient';
}

// Check for reduced motion preference
function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: reduce)').matches;
}

export function ForestBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Skip for reduced motion
        if (prefersReducedMotion()) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawStaticBackground(ctx, canvas.width, canvas.height);
            return;
        }

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Color palette - Modern tech/professional look
        const colors = {
            primary: 'rgba(6, 182, 212, ', // Cyan
            secondary: 'rgba(139, 92, 246, ', // Violet
            accent: 'rgba(16, 185, 129, ', // Emerald
            soft: 'rgba(148, 163, 184, ', // Slate
        };

        // Generate floating particles
        const particles: Particle[] = [];
        const particleCount = Math.floor(width / 25);
        const particleColors = [colors.primary, colors.secondary, colors.accent, colors.soft];
        const particleTypes: Particle['type'][] = ['circle', 'hexagon', 'square'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.3 + 0.1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: -Math.random() * 0.2 - 0.05,
                color: particleColors[Math.floor(Math.random() * particleColors.length)],
                type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
            });
        }

        // Generate large floating shapes
        const shapes: FloatingShape[] = [];
        const shapeCount = 8;
        for (let i = 0; i < shapeCount; i++) {
            shapes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 150 + 80,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.002,
                opacity: Math.random() * 0.08 + 0.02,
                color: particleColors[Math.floor(Math.random() * particleColors.length)],
                type: ['ring', 'dottedCircle', 'gradient'][Math.floor(Math.random() * 3)] as FloatingShape['type'],
            });
        }

        // Resize handler
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
            }, 100);
        };
        window.addEventListener('resize', handleResize);

        // Animation
        let animationId: number;
        let lastTime = 0;
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        let time = 0;

        const animate = (currentTime: number) => {
            animationId = requestAnimationFrame(animate);

            const elapsed = currentTime - lastTime;
            if (elapsed < frameInterval) return;
            lastTime = currentTime - (elapsed % frameInterval);
            time += 0.016;

            // Draw gradient background - Light theme
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0f172a'); // Slate 900
            gradient.addColorStop(0.3, '#1e1b4b'); // Indigo 950
            gradient.addColorStop(0.6, '#0f172a'); // Slate 900
            gradient.addColorStop(1, '#042f2e'); // Teal 950
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw mesh gradient overlay
            const meshGradient = ctx.createRadialGradient(
                width * 0.2, height * 0.3, 0,
                width * 0.2, height * 0.3, width * 0.5
            );
            meshGradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
            meshGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = meshGradient;
            ctx.fillRect(0, 0, width, height);

            const meshGradient2 = ctx.createRadialGradient(
                width * 0.8, height * 0.7, 0,
                width * 0.8, height * 0.7, width * 0.4
            );
            meshGradient2.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
            meshGradient2.addColorStop(1, 'transparent');
            ctx.fillStyle = meshGradient2;
            ctx.fillRect(0, 0, width, height);

            // Draw floating shapes
            shapes.forEach((shape) => {
                shape.rotation += shape.rotationSpeed;

                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.rotate(shape.rotation);

                if (shape.type === 'ring') {
                    ctx.strokeStyle = shape.color + shape.opacity + ')';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                    ctx.stroke();

                    // Inner ring
                    ctx.beginPath();
                    ctx.arc(0, 0, shape.size * 0.7, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (shape.type === 'dottedCircle') {
                    ctx.fillStyle = shape.color + shape.opacity + ')';
                    const dotCount = 20;
                    for (let i = 0; i < dotCount; i++) {
                        const angle = (i / dotCount) * Math.PI * 2;
                        const x = Math.cos(angle) * shape.size;
                        const y = Math.sin(angle) * shape.size;
                        ctx.beginPath();
                        ctx.arc(x, y, 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else if (shape.type === 'gradient') {
                    const gradientShape = ctx.createRadialGradient(0, 0, 0, 0, 0, shape.size);
                    gradientShape.addColorStop(0, shape.color + (shape.opacity * 1.5) + ')');
                    gradientShape.addColorStop(0.5, shape.color + (shape.opacity * 0.5) + ')');
                    gradientShape.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradientShape;
                    ctx.beginPath();
                    ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            // Draw and update particles
            particles.forEach((particle) => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around
                if (particle.x < -10) particle.x = width + 10;
                if (particle.x > width + 10) particle.x = -10;
                if (particle.y < -10) particle.y = height + 10;

                // Pulse opacity
                const pulseOpacity = particle.opacity * (0.7 + Math.sin(time * 2 + particle.x * 0.01) * 0.3);

                ctx.fillStyle = particle.color + pulseOpacity + ')';
                ctx.beginPath();

                if (particle.type === 'circle') {
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                } else if (particle.type === 'hexagon') {
                    drawHexagon(ctx, particle.x, particle.y, particle.size);
                } else {
                    ctx.rect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
                }
                ctx.fill();

                // Add glow effect for some particles
                if (particle.size > 2) {
                    ctx.shadowColor = particle.color + '0.5)';
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            // Draw grid lines (subtle)
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.03)';
            ctx.lineWidth = 1;
            const gridSpacing = 100;
            for (let x = 0; x < width; x += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw connection lines between nearby particles
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.globalAlpha = (1 - distance / 150) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
        };

        animationId = requestAnimationFrame(animate);

        // Visibility API
        const handleVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                lastTime = performance.now();
                animationId = requestAnimationFrame(animate);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibility);
            cancelAnimationFrame(animationId);
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

// Helper function to draw hexagon
function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
}

// Static version for reduced motion
function drawStaticBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e1b4b');
    gradient.addColorStop(1, '#042f2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw some static shapes
    ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.3, 200, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.7, 150, 0, Math.PI * 2);
    ctx.fill();

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.03)';
    ctx.lineWidth = 1;
    const gridSpacing = 100;
    for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}
