import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import NavigationBar from '@/components/NavigationBar';
import VoiceCommandControls from '@/components/VoiceCommandControls';
import CourseCard from '@/components/CourseCard';
import AssignmentCard from '@/components/AssignmentCard';
import { Button } from '@/components/ui/button';

// Static data
const staticCourses = [
  {
    id: 1,
    title: "Introduction to Web Accessibility",
    description: "Learn the fundamentals of creating accessible web applications",
    progress: 75,
    totalLessons: 12,
    completedLessons: 9
  },
  {
    id: 2,
    title: "Advanced Screen Reader Techniques",
    description: "Master the use of screen readers for testing and development",
    progress: 30,
    totalLessons: 8,
    completedLessons: 2
  },
  {
    id: 3,
    title: "Accessible Design Patterns",
    description: "Common patterns and best practices for accessible UI design",
    progress: 0,
    totalLessons: 10,
    completedLessons: 0
  }
];

const staticAssignments = [
  {
    id: 1,
    title: "Quiz: Web Accessibility Basics",
    description: "Test your knowledge of web accessibility fundamentals",
    dueDate: "2024-03-15",
    status: "pending"
  },
  {
    id: 2,
    title: "Quiz: Screen Reader Navigation",
    description: "Demonstrate your screen reader navigation skills",
    dueDate: "2024-03-20",
    status: "pending"
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Reset speech synthesis on page load
  useEffect(() => {
    // Stop any speech synthesis when the page loads
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);
  
  // Helper functions
  const navigateToVoiceCommands = () => {
    navigate('/voice-commands-help');
  };
  
  const startAssignment = (assignmentId: number) => {
    // This would navigate to the assignment page
    console.log(`Starting assignment ${assignmentId}`);
  };
  
  const prepareForQuiz = (assignmentId: number) => {
    // This would navigate to the quiz preparation page
    console.log(`Preparing for quiz ${assignmentId}`);
  };
  
  // Footer links
  const openAccessibilitySettings = () => {
    navigate('/accessibility-settings');
  };
  
  const contactSupport = () => {
    // This would open a contact form
    console.log('Contact support clicked');
  };
  
  const openKeyboardShortcuts = () => {
    navigate('/keyboard-shortcuts-help');
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="dashboard-heading" className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-lg mb-4">Welcome to AudioLearn. Press Alt+H to hear available voice commands.</p>
      </header>

      {/* Main content area */}
      <main id="main-content" className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Dashboard"
          navItems={[
            { text: "Dashboard", path: "/", isActive: true },
            { text: "My Courses", path: "/courses" },
            { text: "Profile", path: "/profile" }
          ]}
        />

        {/* Voice command controls */}
        <VoiceCommandControls onHelp={navigateToVoiceCommands} />

        {/* Courses section */}
        <section className="mb-8" aria-labelledby="current-courses-heading">
          <h2 id="current-courses-heading" className="text-2xl font-bold mb-4">My Current Courses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staticCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>

        {/* Quiz section */}
        <section className="mb-8" aria-labelledby="quizzes-heading">
          <h2 id="quizzes-heading" className="text-2xl font-bold mb-4">Available Quizzes</h2>
          
          {staticAssignments.map((quiz) => (
            <AssignmentCard 
              key={quiz.id}
              assignment={quiz}
              onAction={() => prepareForQuiz(quiz.id)}
              actionText="Start Quiz"
            />
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 rounded-lg text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={openAccessibilitySettings}
          >
            Accessibility Settings
          </Button>
          <span className="text-gray-500">|</span>
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={contactSupport}
          >
            Contact Support
          </Button>
          <span className="text-gray-500">|</span>
          <Button 
            variant="link"
            className="text-primary hover:underline"
            onClick={openKeyboardShortcuts}
          >
            Keyboard Shortcuts
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
