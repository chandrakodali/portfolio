import { useEffect, useRef, useState } from 'react';

interface Firefly {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    angle: number;
    pulse: number;
    pulseSpeed: number;
    color: string;
}

interface Tree {
    x: number;
    height: number;
    width: number;
    layer: number; // 0 = front, 1 = mid, 2 = back
    hasGlow: boolean;
    glowPoints: { y: number; intensity: number }[];
}

// Check for reduced motion preference
function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
            // Draw static version
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawStaticForest(ctx, canvas.width, canvas.height);
            return;
        }

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Generate trees
        const trees: Tree[] = [];
        const treeCount = Math.floor(width / 40);

        for (let i = 0; i < treeCount; i++) {
            const layer = Math.floor(Math.random() * 3);
            const baseHeight = height * (0.3 + layer * 0.15);
            trees.push({
                x: (i / treeCount) * width + (Math.random() - 0.5) * 60,
                height: baseHeight + Math.random() * height * 0.2,
                width: 15 + Math.random() * 25 - layer * 5,
                layer,
                hasGlow: Math.random() > 0.6,
                glowPoints: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, () => ({
                    y: Math.random(),
                    intensity: Math.random(),
                })),
            });
        }

        // Sort trees by layer (back to front)
        trees.sort((a, b) => b.layer - a.layer);

        // Generate fireflies
        const fireflies: Firefly[] = [];
        const fireflyCount = Math.floor(width / 30);
        const colors = ['rgba(0, 229, 255, ', 'rgba(139, 92, 246, ', 'rgba(34, 211, 238, '];

        for (let i = 0; i < fireflyCount; i++) {
            fireflies.push({
                x: Math.random() * width,
                y: height * 0.3 + Math.random() * height * 0.6,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                speed: Math.random() * 0.3 + 0.1,
                angle: Math.random() * Math.PI * 2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                color: colors[Math.floor(Math.random() * colors.length)],
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

            // Clear canvas
            ctx.fillStyle = '#030014';
            ctx.fillRect(0, 0, width, height);

            // Draw gradient sky
            const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
            skyGradient.addColorStop(0, '#030014');
            skyGradient.addColorStop(0.4, '#050520');
            skyGradient.addColorStop(0.7, '#0a1628');
            skyGradient.addColorStop(1, '#0d1f1a');
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            // Draw subtle stars
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 50; i++) {
                const starX = (i * 137.5) % width;
                const starY = (i * 73.1) % (height * 0.4);
                const twinkle = Math.sin(time * 2 + i) * 0.3 + 0.7;
                ctx.globalAlpha = twinkle * 0.4;
                ctx.beginPath();
                ctx.arc(starX, starY, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Draw trees by layer
            trees.forEach((tree) => {
                const layerOpacity = 1 - tree.layer * 0.25;
                const layerColor = tree.layer === 0 ? '#050810' : tree.layer === 1 ? '#070d12' : '#091015';

                // Tree trunk
                ctx.fillStyle = layerColor;
                ctx.beginPath();
                ctx.moveTo(tree.x - tree.width / 2, height);
                ctx.lineTo(tree.x - tree.width / 4, height - tree.height * 0.3);
                ctx.lineTo(tree.x, height - tree.height);
                ctx.lineTo(tree.x + tree.width / 4, height - tree.height * 0.3);
                ctx.lineTo(tree.x + tree.width / 2, height);
                ctx.closePath();
                ctx.fill();

                // Pine branches (triangular sections)
                const sections = 4;
                for (let s = 0; s < sections; s++) {
                    const sectionY = height - tree.height * ((s + 1) / (sections + 1));
                    const sectionWidth = tree.width * (1 + s * 0.5);

                    ctx.beginPath();
                    ctx.moveTo(tree.x, sectionY - tree.height * 0.15);
                    ctx.lineTo(tree.x - sectionWidth, sectionY + tree.height * 0.08);
                    ctx.lineTo(tree.x + sectionWidth, sectionY + tree.height * 0.08);
                    ctx.closePath();
                    ctx.fill();
                }

                // Glowing veins on trees (only front layer)
                if (tree.hasGlow && tree.layer === 0) {
                    tree.glowPoints.forEach((point, i) => {
                        const glowY = height - tree.height * point.y;
                        const pulse = Math.sin(time * 1.5 + i) * 0.3 + 0.7;

                        ctx.strokeStyle = `rgba(0, 229, 255, ${point.intensity * pulse * 0.4})`;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(tree.x - 2, glowY);
                        ctx.lineTo(tree.x - 2, glowY + 30 + Math.random() * 20);
                        ctx.stroke();

                        // Glow effect
                        ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
                        ctx.shadowBlur = 8;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${point.intensity * pulse * 0.3})`;
                        ctx.beginPath();
                        ctx.moveTo(tree.x + 2, glowY + 10);
                        ctx.lineTo(tree.x + 2, glowY + 40);
                        ctx.stroke();
                        ctx.shadowBlur = 0;
                    });
                }
            });

            // Draw ground mist
            const mistGradient = ctx.createLinearGradient(0, height - 150, 0, height);
            mistGradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
            mistGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
            mistGradient.addColorStop(1, 'rgba(88, 28, 135, 0.15)');
            ctx.fillStyle = mistGradient;
            ctx.fillRect(0, height - 150, width, 150);

            // Animated mist waves
            ctx.fillStyle = 'rgba(139, 92, 246, 0.03)';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0, height);
                for (let x = 0; x <= width; x += 50) {
                    const waveY = height - 50 - i * 30 + Math.sin(x * 0.01 + time + i) * 20;
                    ctx.lineTo(x, waveY);
                }
                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fill();
            }

            // Draw and update fireflies
            fireflies.forEach((firefly) => {
                // Update position
                firefly.angle += (Math.random() - 0.5) * 0.1;
                firefly.x += Math.cos(firefly.angle) * firefly.speed;
                firefly.y += Math.sin(firefly.angle) * firefly.speed * 0.5;
                firefly.pulse += firefly.pulseSpeed;

                // Wrap around
                if (firefly.x < -10) firefly.x = width + 10;
                if (firefly.x > width + 10) firefly.x = -10;
                if (firefly.y < height * 0.3) firefly.y = height * 0.9;
                if (firefly.y > height) firefly.y = height * 0.3;

                // Draw firefly with glow
                const pulseOpacity = (Math.sin(firefly.pulse) * 0.5 + 0.5) * firefly.opacity;

                ctx.shadowColor = firefly.color + '0.8)';
                ctx.shadowBlur = 15;
                ctx.fillStyle = firefly.color + pulseOpacity + ')';
                ctx.beginPath();
                ctx.arc(firefly.x, firefly.y, firefly.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
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

// Static version for reduced motion
function drawStaticForest(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Draw gradient sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#030014');
    skyGradient.addColorStop(0.4, '#050520');
    skyGradient.addColorStop(0.7, '#0a1628');
    skyGradient.addColorStop(1, '#0d1f1a');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw static trees
    const treeCount = Math.floor(width / 50);
    for (let i = 0; i < treeCount; i++) {
        const x = (i / treeCount) * width + (Math.random() - 0.5) * 40;
        const treeHeight = height * 0.4 + Math.random() * height * 0.3;
        const treeWidth = 20 + Math.random() * 20;

        ctx.fillStyle = '#050810';
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, height - treeHeight);
        ctx.lineTo(x + treeWidth, height);
        ctx.closePath();
        ctx.fill();
    }

    // Draw ground mist
    const mistGradient = ctx.createLinearGradient(0, height - 100, 0, height);
    mistGradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
    mistGradient.addColorStop(1, 'rgba(88, 28, 135, 0.1)');
    ctx.fillStyle = mistGradient;
    ctx.fillRect(0, height - 100, width, 100);
}
