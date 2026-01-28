import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Default to dark if no preference, or if saved is dark
        // If saved is light, set light
        // If no saved and system prefers light, set light? 
        // The requirement implies default is dark (portfolio style), but toggleable.

        if (savedTheme === 'light') {
            setTheme('light');
            document.documentElement.classList.add('light');
        } else {
            setTheme('dark');
            document.documentElement.classList.remove('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
                <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            )}
        </button>
    );
}
