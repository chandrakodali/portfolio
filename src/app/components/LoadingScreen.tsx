import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 3;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[100] bg-[#030014] flex items-center justify-center overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)' }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 60%)' }}
              animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative mb-10"
            >
              {/* Outer ring */}
              <svg className="w-28 h-28" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, rotate: -90 }}
                  animate={{ pathLength: progress / 100, rotate: -90 }}
                  style={{ transformOrigin: 'center' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Initials */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  CK
                </motion.span>
              </div>
            </motion.div>

            {/* Progress text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-white mb-2 tabular-nums">
                {progress}%
              </p>
              <p className="text-gray-500 text-sm">
                {progress < 30 ? 'Initializing...' : progress < 70 ? 'Loading assets...' : progress < 100 ? 'Almost ready...' : 'Welcome!'}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
