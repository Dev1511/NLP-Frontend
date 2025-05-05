import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { VoiceCommandManager } from '@/lib/voiceCommands';
import { useAccessibility } from '@/lib/accessibilityUtils';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommandControlsProps {
  onHelp: () => void;
}

const VoiceCommandControls: React.FC<VoiceCommandControlsProps> = ({ onHelp }) => {
  const [, navigate] = useLocation();
  const { settings } = useAccessibility();
  const { toast } = useToast();
  const [voiceManager, setVoiceManager] = useState<VoiceCommandManager | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  // Register click commands for all buttons on the page
  const registerClickCommands = (manager: VoiceCommandManager) => {
    // Get all buttons on the page
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
      const buttonText = button.textContent?.trim().toLowerCase();
      if (buttonText) {
        // Register command for each button: "click [button text]"
        manager.registerCommand(`click ${buttonText}`, () => {
          (button as HTMLElement).click();
        });
      }
    });
  };
  
  // Initialize voice command manager
  useEffect(() => {
    if (!voiceManager) {
      const manager = new VoiceCommandManager({
        onCommand: (command) => {
          toast({
            title: "Voice Command",
            description: command,
            duration: 2000
          });
        },
        onError: (error) => {
          toast({
            title: "Voice Error",
            description: error,
            variant: "destructive",
            duration: 3000
          });
        },
        onListening: (listening) => {
          setIsListening(listening);
        },
        sensitivity: settings.voiceSensitivity
      });
      
      // Register common navigation commands
      manager.registerCommands({
        "go to dashboard": () => navigate("/"),
        "go home": () => navigate("/"),
        "open dashboard": () => navigate("/"),
        "show courses": () => navigate("/courses"),
        "open courses": () => navigate("/courses"),
        "open settings": () => navigate("/accessibility-settings"),
        "accessibility settings": () => navigate("/accessibility-settings"),
        "help": () => onHelp(),
        "go back": () => window.history.back(),
        
        // Course specific commands - these will work when on the appropriate pages
        "open course introduction to programming": () => navigate("/course/1"),
        "next lesson": () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true })),
        "previous lesson": () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true })),
        
        // Audio controls
        "start reading": () => {
          // Find first readable content based on page context
          const currentPath = window.location.pathname;
          let contentToRead = '';
          let element = null;
          
          // Quiz page - read the question
          if (currentPath.includes('/quiz')) {
            element = document.querySelector('.question-text, [aria-label="quiz question"]');
          } 
          // Course page - read the first lesson content
          else if (currentPath.includes('/course')) {
            element = document.querySelector('.section-content, main p, main div[role="article"]');
          }
          // Dashboard or other page - read the first paragraph or heading
          else {
            element = document.querySelector('main h1, main h2, main p');
          }
          
          if (element && manager) {
            manager.speak(element.textContent || '', 
                          settings.readingSpeed / 3, // Convert 1-5 scale to reasonable rate
                          1, // Default pitch
                          settings.preferredVoice);
          }
        },
        "pause reading": () => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.pause();
          }
        },
        "pause": () => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.pause();
          }
        },
        "resume": () => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.resume();
          }
        },
        "stop": () => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        }
      });
      
      // Register click commands for all buttons
      registerClickCommands(manager);
      
      // Start voice recognition automatically
      manager.start();
      
      setVoiceManager(manager);
    }
  }, [navigate, onHelp, settings.readingSpeed, settings.preferredVoice, settings.voiceSensitivity, toast]);
  
  // Re-register click commands when the DOM changes
  useEffect(() => {
    // Function to handle DOM changes
    const handleDomChanges = () => {
      if (voiceManager) {
        registerClickCommands(voiceManager);
      }
    };
    
    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(handleDomChanges);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Clean up
    return () => {
      observer.disconnect();
    };
  }, [voiceManager]);
  
  // Update sensitivity when settings change
  useEffect(() => {
    if (voiceManager && settings.voiceSensitivity) {
      voiceManager.setSensitivity(settings.voiceSensitivity);
    }
  }, [voiceManager, settings.voiceSensitivity]);
  
  const toggleVoiceNavigation = () => {
    if (voiceManager) {
      voiceManager.toggle();
    } else {
      toast({
        title: "Voice Commands Unavailable",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button 
        className={`flex items-center gap-2 ${isListening ? 'bg-accent hover:bg-accent/80' : 'bg-primary hover:bg-primary/80'}`}
        onClick={toggleVoiceNavigation}
        aria-pressed={isListening}
        aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
      >
        {isListening ? (
          <>
            <MicOff className="h-5 w-5" />
            <span>Stop Voice Commands</span>
          </>
        ) : (
          <>
            <Mic className="h-5 w-5" />
            <span>Start Voice Commands</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default VoiceCommandControls;
