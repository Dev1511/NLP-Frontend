import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/accessibilityUtils';
import NavigationBar from '@/components/NavigationBar';
import AccessibilityAnnouncement from '@/components/AccessibilityAnnouncement';

interface ShortcutItemProps {
  keys: string[];
  description: string;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ keys, description }) => {
  return (
    <div className="flex items-center mb-3 gap-4">
      <div className="flex-shrink-0 w-1/3">
        <div className="flex flex-wrap gap-2">
          {keys.map((key, index) => (
            <kbd 
              key={index}
              className="px-2 py-1 bg-gray-200 border border-gray-300 rounded text-sm font-semibold"
            >
              {key}
            </kbd>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        <p>{description}</p>
      </div>
    </div>
  );
};

const KeyboardShortcutsHelp: React.FC = () => {
  const [, setLocation] = useLocation();
  const { announce } = useAccessibility();
  
  // Function to navigate to a path
  const navigate = (path: string) => {
    setLocation(path);
  };
  
  // Navigation shortcuts
  const navigationShortcuts = [
    { keys: ['Alt', 'D'], description: 'Go to dashboard' },
    { keys: ['Alt', 'C'], description: 'Go to courses page' },
    { keys: ['Alt', 'P'], description: 'Go to profile page' },
    { keys: ['Alt', 'A'], description: 'Go to accessibility settings' },
    { keys: ['Alt', 'H'], description: 'Open voice commands help' },
  ];
  
  // Reading shortcuts
  const readingShortcuts = [
    { keys: ['Alt', 'S'], description: 'Start reading content' },
    { keys: ['Alt', 'X'], description: 'Pause reading' },
    { keys: ['Alt', '.'], description: 'Read faster' },
    { keys: ['Alt', ','], description: 'Read slower' },
  ];
  
  // Navigation within content
  const contentNavigationShortcuts = [
    { keys: ['Alt', 'N'], description: 'Next section or lesson' },
    { keys: ['Alt', 'B'], description: 'Previous section or lesson' },
    { keys: ['Tab'], description: 'Move to next focusable element' },
    { keys: ['Shift', 'Tab'], description: 'Move to previous focusable element' },
    { keys: ['Space/Enter'], description: 'Activate focused element' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="keyboard-shortcuts-help-heading" className="text-3xl font-bold mb-2">Keyboard Shortcuts Guide</h1>
      </header>

      {/* Main content area */}
      <main className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Keyboard Shortcuts"
          navItems={[
            { text: "Back to Dashboard", path: "/" },
            { text: "Accessibility Settings", path: "/accessibility-settings", isActive: false },
            { text: "Voice Commands Help", path: "/voice-commands-help", isActive: false }
          ]}
        />

        {/* Accessibility announcement */}
        <AccessibilityAnnouncement 
          message="Keyboard Shortcuts Guide: Press Tab to navigate through sections, Alt+H to open voice commands help."
        />

        {/* Shortcuts sections */}
        <section className="mb-8" aria-labelledby="navigation-shortcuts-heading">
          <h2 id="navigation-shortcuts-heading" className="text-2xl font-bold mb-4">Navigation Shortcuts</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {navigationShortcuts.map((shortcut, index) => (
              <ShortcutItem 
                key={index} 
                keys={shortcut.keys} 
                description={shortcut.description} 
              />
            ))}
          </div>
        </section>
        
        <section className="mb-8" aria-labelledby="reading-shortcuts-heading">
          <h2 id="reading-shortcuts-heading" className="text-2xl font-bold mb-4">Reading Control Shortcuts</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {readingShortcuts.map((shortcut, index) => (
              <ShortcutItem 
                key={index} 
                keys={shortcut.keys} 
                description={shortcut.description} 
              />
            ))}
          </div>
        </section>
        
        <section className="mb-8" aria-labelledby="content-navigation-shortcuts-heading">
          <h2 id="content-navigation-shortcuts-heading" className="text-2xl font-bold mb-4">Content Navigation Shortcuts</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {contentNavigationShortcuts.map((shortcut, index) => (
              <ShortcutItem 
                key={index} 
                keys={shortcut.keys} 
                description={shortcut.description} 
              />
            ))}
          </div>
        </section>
        
        {/* Practice section */}
        <section className="mb-8" aria-labelledby="practice-shortcuts-heading">
          <h2 id="practice-shortcuts-heading" className="text-2xl font-bold mb-4">Practice Your Shortcuts</h2>
          <div className="p-6 bg-gray-200 rounded-lg">
            <p className="mb-4">
              Use this area to test and practice keyboard shortcuts. Press a shortcut combination to see it in action.
            </p>
            <div className="text-center p-6 border-2 border-dashed border-gray-400 rounded mb-4">
              <p className="text-xl font-bold">Shortcut Testing Area</p>
              <p className="text-gray-600">Try pressing Alt+S to activate text reading</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 rounded-lg text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={() => {
              announce("Going to accessibility settings");
              navigate('/accessibility-settings');
            }}
          >
            Accessibility Settings
          </Button>
          <span className="text-gray-500">|</span>
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={() => {
              announce("Going to voice commands help");
              navigate('/voice-commands-help');
            }}
          >
            Voice Commands Help
          </Button>
          <span className="text-gray-500">|</span>
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={() => {
              announce("Going back to home");
              navigate('/');
            }}
          >
            Return to Dashboard
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default KeyboardShortcutsHelp;