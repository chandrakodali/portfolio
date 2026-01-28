import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-colors overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                    <motion.div
                        key="moon"
                        initial={{ y: -20, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <Moon className="w-4 h-4" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ y: -20, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <Sun className="w-4 h-4 text-amber-400" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                    boxShadow: theme === 'light'
                        ? '0 0 20px rgba(251, 191, 36, 0.3)'
                        : '0 0 20px rgba(139, 92, 246, 0.2)'
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
}
