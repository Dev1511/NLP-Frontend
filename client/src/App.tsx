import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Pages
import Dashboard from "@/pages/Dashboard";
import CourseContent from "@/pages/CourseContent";
import Quiz from "@/pages/Quiz";
import VoiceCommandsHelp from "@/pages/VoiceCommandsHelp";
import KeyboardShortcutsHelp from "@/pages/KeyboardShortcutsHelp";
import AccessibilitySettings from "@/pages/AccessibilitySettings";
import Courses from "@/pages/Courses";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

// Context for accessibility settings
import { AccessibilityProvider } from "@/lib/accessibilityUtils";
import Layout from "@/components/Layout";

function App() {
  // Focus outline for keyboard navigation
  useEffect(() => {
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };
    window.addEventListener('keydown', handleFirstTab);
    
    return () => {
      window.removeEventListener('keydown', handleFirstTab);
    };
  }, []);

  return (
    <Router>
      <AccessibilityProvider announce={(message: string) => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(message);
          window.speechSynthesis.speak(utterance);
        }
      }}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-6 py-3 z-50"
        >
          Skip to main content
        </a>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/course/:courseId/:lessonId?" element={<CourseContent />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/voice-commands-help" element={<VoiceCommandsHelp />} />
            <Route path="/keyboard-shortcuts-help" element={<KeyboardShortcutsHelp />} />
            <Route path="/accessibility-settings" element={<AccessibilitySettings />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AccessibilityProvider>
    </Router>
  );
}

export default App;
