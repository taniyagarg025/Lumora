import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('readwise_theme') || 'newspaper';
  });

  useEffect(() => {
    localStorage.setItem('readwise_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-newspaper', 'theme-indigo', 'theme-emerald', 'theme-rose');
    
    // Map theme classes cleanly
    if (theme === 'dark') {
      root.classList.add('theme-dark');
    } else if (theme === 'newspaper') {
      root.classList.add('theme-newspaper');
    } else if (theme === 'indigo') {
      root.classList.add('theme-indigo', 'theme-light');
    } else if (theme === 'rose') {
      root.classList.add('theme-rose', 'theme-light');
    } else {
      root.classList.add('theme-emerald', 'theme-light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'emerald' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`theme-${theme} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
