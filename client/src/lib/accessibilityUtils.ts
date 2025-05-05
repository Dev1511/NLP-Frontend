import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  announce: (message: string) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
  announce: (message: string) => void;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children, announce }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedFontSize = Number(localStorage.getItem('fontSize')) || 16;

    setIsHighContrast(savedHighContrast);
    setIsDarkMode(savedDarkMode);
    setFontSize(savedFontSize);

    // Apply saved preferences
    if (savedHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    document.documentElement.style.fontSize = `${savedFontSize}px`;
  }, []);

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
    document.documentElement.classList.toggle('high-contrast');
    announce(`High contrast mode ${newValue ? 'enabled' : 'disabled'}`);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    document.documentElement.classList.toggle('dark');
    announce(`Dark mode ${newValue ? 'enabled' : 'disabled'}`);
  };

  // Font size controls
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    localStorage.setItem('fontSize', String(newSize));
    document.documentElement.style.fontSize = `${newSize}px`;
    announce(`Font size increased to ${newSize}px`);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    localStorage.setItem('fontSize', String(newSize));
    document.documentElement.style.fontSize = `${newSize}px`;
    announce(`Font size decreased to ${newSize}px`);
  };

  const resetFontSize = () => {
    setFontSize(16);
    localStorage.setItem('fontSize', '16');
    document.documentElement.style.fontSize = '16px';
    announce('Font size reset to default');
  };

  return (
    <AccessibilityContext.Provider
      value={{
        announce,
        isHighContrast,
        toggleHighContrast,
        isDarkMode,
        toggleDarkMode,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
