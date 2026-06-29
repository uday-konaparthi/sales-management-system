import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react'; // You can install lucide-react icons if not already

const ThemeButton = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check localStorage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Default to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="h-9 w-9 rounded-md border border-muted-foreground/20 bg-background p-1 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-background/80 dark:hover:bg-accent dark:hover:text-accent-foreground"
    >
      {theme === 'light' ? <Sun className="size-6" /> : <Moon className="size-6" />}
    </button>
  );
};

export default ThemeButton;
