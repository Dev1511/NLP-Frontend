import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAccessibility } from '@/lib/accessibilityUtils';

// Components
import NavigationBar from '@/components/NavigationBar';
import AccessibilityAnnouncement from '@/components/AccessibilityAnnouncement';
import CommandCategory from '@/components/CommandCategory';
import { Button } from '@/components/ui/button';

const VoiceCommandsHelp: React.FC = () => {
  const [, navigate] = useLocation();
  const { announce } = useAccessibility();
  
  // Announce page on initial load
  useEffect(() => {
    announce("Voice Command Help Center loaded. This page lists all available voice commands.");
  }, []);
  
  // Navigation commands
  const navigationCommands = [
    '"Go to dashboard"',
    '"Open [course name]"',
    '"Next/previous lesson"',
    '"Skip to quiz"',
    '"Go back"'
  ];
  
  // Reading commands
  const readingCommands = [
    '"Start reading"',
    '"Pause reading"',
    '"Read slower"',
    '"Read faster"'
  ];
  
  // Quiz commands
  const quizCommands = [
    '"Select option [A/B/C/D]"',
    '"Submit answer"',
    '"Next question"',
    '"Previous question"'
  ];
  
  // Practice mode
  const startPracticeMode = () => {
    announce("Practice mode started. Say a command to test it.");
    // This would start the voice command practice mode
  };
  
  // Keyboard shortcuts
  const viewKeyboardShortcuts = () => {
    announce("Keyboard shortcuts guide opened.");
    window.location.href = '/keyboard-shortcuts-help';
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="voice-commands-help-heading" className="text-3xl font-bold mb-2">Voice Command Help Center</h1>
      </header>

      {/* Main content area */}
      <main className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Voice Command Help"
          navItems={[
            { text: "Back to Dashboard", path: "/" },
            { text: "Practice Commands", path: "#practice", isActive: false },
            { text: "Customize Commands", path: "#customize", isActive: false }
          ]}
        />

        {/* Voice help instructions */}
        <AccessibilityAnnouncement 
          message="Voice Help: Say 'Practice commands' to enter training mode or 'List commands' for a full reference."
        />

        {/* Voice commands reference */}
        <section className="mb-8" aria-labelledby="available-commands-heading">
          <h2 id="available-commands-heading" className="text-2xl font-bold mb-4">Available Voice Commands</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CommandCategory title="Navigation Commands" commands={navigationCommands} />
            <CommandCategory title="Reading Commands" commands={readingCommands} />
            <CommandCategory title="Quiz Commands" commands={quizCommands} />
          </div>
        </section>
        
        {/* Practice section */}
        <section id="practice" className="mb-8" aria-labelledby="practice-commands-heading">
          <h2 id="practice-commands-heading" className="text-2xl font-bold mb-4">Practice Voice Commands</h2>
          
          <div className="p-4 bg-gray-200 rounded-lg">
            <p className="mb-4">Enter our practice mode to test and fine-tune voice recognition for your voice.</p>
            <Button 
              className="w-full bg-primary text-white"
              onClick={startPracticeMode}
            >
              Start Practice Mode
            </Button>
          </div>
        </section>
        
        {/* Keyboard shortcuts section */}
        <section id="keyboard" className="mb-8" aria-labelledby="keyboard-shortcuts-heading">
          <h2 id="keyboard-shortcuts-heading" className="text-2xl font-bold mb-4">Keyboard Shortcuts Alternative</h2>
          
          <div className="p-4 bg-gray-200 rounded-lg">
            <p className="mb-4">All voice commands have keyboard equivalents. View the full keyboard shortcuts guide.</p>
            <Button 
              className="w-full bg-gray-300 hover:bg-gray-400 text-black"
              onClick={viewKeyboardShortcuts}
            >
              View Keyboard Shortcuts
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 rounded-lg text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={() => navigate('/accessibility-settings')}
          >
            Accessibility Settings
          </Button>
          <span className="text-gray-500">|</span>
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={() => {
              // This would open contact support dialog
              announce("Opening contact support dialog");
            }}
          >
            Contact Support
          </Button>
          <span className="text-gray-500">|</span>
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={() => {
              // This would open voice command troubleshooting guide
              announce("Opening voice command troubleshooting guide");
            }}
          >
            Voice Command Troubleshooting
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default VoiceCommandsHelp;
