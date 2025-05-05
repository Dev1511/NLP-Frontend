import React, { useEffect } from 'react';
import { useAccessibility } from '@/lib/accessibilityUtils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { announce } = useAccessibility();

  // Set up accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if focus is not in an input, textarea, or other form element
      const isFormElement = e.target instanceof HTMLInputElement || 
                           e.target instanceof HTMLTextAreaElement || 
                           e.target instanceof HTMLSelectElement;
      
      // Alt key shortcuts
      if (e.altKey && !isFormElement) {
        e.preventDefault(); // Prevent default behavior for our shortcuts
        
        switch(e.key) {
          // Navigation shortcuts
          case 'd':
          case 'D':
            announce('Going to dashboard');
            window.location.href = '/';
            break;
          case 'c':
          case 'C':
            announce('Going to courses page');
            window.location.href = '/courses';
            break;
          case 'p':
          case 'P':
            announce('Going to profile page');
            window.location.href = '/profile';
            break;
          case 'a':
          case 'A':
            announce('Going to accessibility settings');
            window.location.href = '/accessibility-settings';
            break;
            
          // Reading control shortcuts  
          case 's':
          case 'S':
            announce('Start reading content');
            document.dispatchEvent(new CustomEvent('start-reading'));
            break;
          case 'x':
          case 'X':
            announce('Pause reading');
            document.dispatchEvent(new CustomEvent('pause-reading'));
            break;
          case '>':
          case '.':
            announce('Reading faster');
            document.dispatchEvent(new CustomEvent('read-faster'));
            break;
          case '<':
          case ',':
            announce('Reading slower');
            document.dispatchEvent(new CustomEvent('read-slower'));
            break;
            
          // Navigation within content  
          case 'n':
          case 'N':
            announce('Next section or lesson');
            document.dispatchEvent(new CustomEvent('navigate-next'));
            break;
          case 'b':
          case 'B':
            announce('Previous section or lesson');
            document.dispatchEvent(new CustomEvent('navigate-previous'));
            break;
          case 'h':
          case 'H':
            announce('Voice commands help opened');
            window.location.href = '/voice-commands-help';
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [announce]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;
