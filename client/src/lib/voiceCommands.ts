// Type definitions for speech recognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// Window augmentation for speech recognition
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface VoiceCommandsOptions {
  onCommand: (command: string) => void;
  onError: (error: string) => void;
  onListening: (isListening: boolean) => void;
  sensitivity?: number; // 1-5, where 5 is most sensitive
}

export class VoiceCommandManager {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private options: VoiceCommandsOptions;
  private commands: Map<string, () => void> = new Map();
  
  constructor(options: VoiceCommandsOptions) {
    this.options = options;
    
    // Set default sensitivity if not provided
    if (!this.options.sensitivity) {
      this.options.sensitivity = 3;
    }
    
    // Initialize speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      this.options.onError('Speech recognition is not supported in this browser.');
    }
  }
  
  private setupRecognition() {
    if (!this.recognition) return;
    
    // Configure speech recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    
    // Set confidence threshold based on sensitivity (1-5)
    const confidenceThreshold = 0.5 + ((5 - this.options.sensitivity!) * 0.1);
    
    // Event handlers
    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      const confidence = event.results[last][0].confidence;
      
      // Check if confidence meets the threshold
      if (confidence >= confidenceThreshold) {
        this.handleCommand(command);
      }
    };
    
    this.recognition.onerror = (event) => {
      this.options.onError(`Error occurred in recognition: ${event.error}`);
    };
    
    this.recognition.onend = () => {
      // Auto restart if was listening
      if (this.isListening) {
        this.recognition?.start();
      } else {
        this.options.onListening(false);
      }
    };
  }
  
  public start() {
    if (!this.recognition) {
      this.options.onError('Speech recognition is not supported or not initialized.');
      return;
    }
    
    try {
      this.recognition.start();
      this.isListening = true;
      this.options.onListening(true);
    } catch (error) {
      this.options.onError(`Could not start speech recognition: ${error}`);
    }
  }
  
  public stop() {
    if (!this.recognition) return;
    
    try {
      this.recognition.stop();
      this.isListening = false;
      this.options.onListening(false);
    } catch (error) {
      this.options.onError(`Could not stop speech recognition: ${error}`);
    }
  }
  
  public toggle() {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }
  
  public isActive() {
    return this.isListening;
  }
  
  public setSensitivity(level: number) {
    if (level < 1 || level > 5) {
      this.options.onError('Sensitivity must be between 1 and 5.');
      return;
    }
    
    this.options.sensitivity = level;
  }
  
  public registerCommand(phrase: string, callback: () => void) {
    this.commands.set(phrase.toLowerCase(), callback);
  }
  
  public registerCommands(commandMap: Record<string, () => void>) {
    Object.entries(commandMap).forEach(([phrase, callback]) => {
      this.registerCommand(phrase, callback);
    });
  }
  
  public clearCommands() {
    this.commands.clear();
  }
  
  public getRegisteredCommands(): string[] {
    return Array.from(this.commands.keys());
  }
  
  private handleCommand(spokenText: string) {
    let commandExecuted = false;
    
    // Check for exact matches
    if (this.commands.has(spokenText)) {
      this.commands.get(spokenText)!();
      commandExecuted = true;
    } else {
      // Check for partial matches or contained phrases
      for (const [registeredCommand, callback] of this.commands.entries()) {
        if (spokenText.includes(registeredCommand)) {
          callback();
          commandExecuted = true;
          break;
        }
      }
    }
    
    if (commandExecuted) {
      this.options.onCommand(spokenText);
    }
  }
  
  // Text-to-speech functionality
  public speak(text: string, rate: number = 1, pitch: number = 1, voice: string = '') {
    if (!('speechSynthesis' in window)) {
      this.options.onError('Text-to-speech is not supported in this browser.');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Set voice based on preference
    const setSpeechVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      
      // If female voice is specified
      if (voice && (voice.toLowerCase().includes('female') || voice.toLowerCase().includes('woman'))) {
        // Find English female voices
        selectedVoice = voices.find(v => 
          (v.name.toLowerCase().includes('female') || 
           v.name.toLowerCase().includes('woman') || 
           v.name.includes('Samantha') || 
           v.name.includes('Victoria')) && 
          v.lang.startsWith('en')
        );
      } 
      // Specific voice name requested
      else if (voice) {
        selectedVoice = voices.find(v => v.name === voice || v.voiceURI === voice);
      }
      
      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith('en'));
      }
      
      // Set voice and speak
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    };
    
    // Get voices - handle async loading of voices
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setSpeechVoice();
    } else {
      // Wait for voices to be loaded if not available immediately
      speechSynthesis.onvoiceschanged = setSpeechVoice;
    }
  }
  
  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
  
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }
}

// Define command categories for organization
export const NavigationCommands = {
  GO_TO_DASHBOARD: "go to dashboard",
  OPEN_COURSE: "open course",
  NEXT_LESSON: "next lesson",
  PREVIOUS_LESSON: "previous lesson",
  SKIP_TO_QUIZ: "skip to quiz",
  GO_BACK: "go back"
};

export const ReadingCommands = {
  START_READING: "start reading",
  PAUSE_READING: "pause reading",
  READ_SLOWER: "read slower",
  READ_FASTER: "read faster"
};

export const QuizCommands = {
  SELECT_OPTION_A: "select option a",
  SELECT_OPTION_B: "select option b",
  SELECT_OPTION_C: "select option c",
  SELECT_OPTION_D: "select option d",
  SUBMIT_ANSWER: "submit answer",
  NEXT_QUESTION: "next question",
  PREVIOUS_QUESTION: "previous question"
};

// Helper to simulate keyboard events for accessibility
export const simulateKeyPress = (key: string, modifiers: { ctrl?: boolean, alt?: boolean, shift?: boolean } = {}) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ctrlKey: modifiers.ctrl || false,
    altKey: modifiers.alt || false,
    shiftKey: modifiers.shift || false
  });
  document.dispatchEvent(event);
};
