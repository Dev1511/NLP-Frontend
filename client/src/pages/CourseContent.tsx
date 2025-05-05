import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/lib/accessibilityUtils';

// Components
import NavigationBar from '@/components/NavigationBar';
import AccessibilityAnnouncement from '@/components/AccessibilityAnnouncement';
import LessonSection from '@/components/LessonSection';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Static data
const staticCourses = {
  "1": {
    id: 1,
    title: "Introduction to Web Accessibility",
    description: "Learn the fundamentals of creating accessible web applications",
    lessons: [
      {
        id: 1,
        title: "Understanding Web Accessibility",
        sections: [
          {
            id: 1,
            title: "What is Web Accessibility?",
            content: "Web accessibility means that websites, tools, and technologies are designed and developed so that people with disabilities can use them. More specifically, people can perceive, understand, navigate, and interact with the Web.",
            type: "text"
          },
          {
            id: 2,
            title: "Why is Accessibility Important?",
            content: "Accessibility is essential for developers and organizations that want to create high-quality websites and web tools, and not exclude people from using their products and services.",
            type: "text"
          }
        ]
      },
      {
        id: 2,
        title: "WCAG Guidelines",
        sections: [
          {
            id: 3,
            title: "WCAG 2.1 Overview",
            content: "The Web Content Accessibility Guidelines (WCAG) 2.1 covers a wide range of recommendations for making Web content more accessible.",
            type: "text"
          },
          {
            id: 4,
            title: "Key Principles",
            content: "WCAG 2.1 is organized into four principles: Perceivable, Operable, Understandable, and Robust (POUR).",
            type: "text"
          }
        ]
      }
    ]
  }
};

const CourseContent: React.FC = () => {
  const { courseId, lessonId = '1' } = useParams();
  const navigate = useNavigate();
  const { announce } = useAccessibility();
  
  const course = staticCourses[courseId as keyof typeof staticCourses];
  const lesson = course?.lessons.find(l => l.id.toString() === lessonId);
  const sections = lesson?.sections || [];
  
  // Announce page on initial load
  useEffect(() => {
    // Stop any speech synthesis when the page loads
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    if (course && lesson) {
      announce(`Course content page loaded. ${course.title}: ${lesson.title}`);
    }
  }, [course, lesson]);
  
  // Navigation handlers
  const navigateToDashboard = () => {
    navigate('/');
  };
  
  const navigateToQuiz = () => {
    navigate(`/quiz/1`); // Assuming quiz ID 1 for this lesson
  };
  
  const navigateToPreviousLesson = () => {
    if (!course?.lessons) return;
    
    const currentIndex = course.lessons.findIndex(l => l.id.toString() === lessonId);
    if (currentIndex > 0) {
      navigate(`/course/${courseId}/${course.lessons[currentIndex - 1].id}`);
    }
  };
  
  const navigateToNextLesson = () => {
    if (!course?.lessons) return;
    
    const currentIndex = course.lessons.findIndex(l => l.id.toString() === lessonId);
    if (currentIndex < course.lessons.length - 1) {
      navigate(`/course/${courseId}/${course.lessons[currentIndex + 1].id}`);
    }
  };
  
  // Calculate the lesson number out of total lessons
  const lessonProgress = course?.lessons ? 
    `${course.lessons.findIndex(l => l.id.toString() === lessonId) + 1} of ${course.lessons.length} lessons completed` : 
    '';
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="course-content-heading" className="text-3xl font-bold mb-2">Course Content</h1>
      </header>

      {/* Main content area */}
      <main className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Course Content"
          navItems={[
            { text: "Back to Dashboard", path: "/" },
            { text: "Course Home", path: `/course/${courseId}` },
            { text: "Modules", path: `/course/${courseId}/modules` }
          ]}
        />

        {/* Course navigation instructions */}
        <AccessibilityAnnouncement 
          message="Course Navigation: Press Alt+M to navigate modules, Alt+N for next section, Alt+P for previous section."
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Course content main area */}
          <div className="md:w-2/3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">
                {course ? course.title : 'Loading...'}: {lesson ? lesson.title : 'Loading...'}
              </h2>
            
              {/* Course controls */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button 
                  className="bg-primary text-white"
                  onClick={() => {
                    // In a real implementation, this would start reading the entire lesson
                    announce("Reading lesson content");
                  }}
                >
                  Read Lesson
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.pause();
                      announce("Reading paused");
                    }
                  }}
                >
                  Pause Reading
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // This would replay the current section
                    announce("Replaying section");
                  }}
                >
                  Replay Section
                </Button>
                <Button 
                  variant="outline"
                  onClick={navigateToQuiz}
                >
                  Jump to Quiz
                </Button>
              </div>
            </div>

            {/* Lesson content sections */}
            {sections.map((section) => (
              <LessonSection key={section.id} section={section} />
            ))}

            {/* Comprehension Check */}
            <section className="mb-6 p-4 bg-gray-100 rounded-lg" aria-labelledby="section-comprehension">
              <h3 id="section-comprehension" className="text-xl font-bold mb-3">Comprehension Check</h3>
              <p className="mb-4">Ready to check your understanding?</p>
              <Button 
                className="w-full bg-primary text-white"
                onClick={navigateToQuiz}
              >
                Start Quiz
              </Button>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="md:w-1/3">
            {/* Progress section */}
            <section className="mb-6 p-4 bg-gray-200 rounded-lg" aria-labelledby="section-progress">
              <h3 id="section-progress" className="text-xl font-bold mb-3">Progress</h3>
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <span>{lessonProgress}</span>
                </div>
                <Progress 
                  value={course?.lessons ? 
                    ((course.lessons.findIndex(l => l.id.toString() === lessonId) + 1) / course.lessons.length) * 100 : 
                    0
                  } 
                  className="h-4" 
                />
              </div>
            </section>

            {/* Course navigation section */}
            <section className="mb-6 p-4 bg-gray-200 rounded-lg" aria-labelledby="section-course-nav">
              <h3 id="section-course-nav" className="text-xl font-bold mb-3">Course Navigation</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={navigateToPreviousLesson}
                  disabled={!course?.lessons || course.lessons.findIndex(l => l.id.toString() === lessonId) === 0}
                >
                  Previous Lesson
                </Button>
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={navigateToNextLesson}
                  disabled={!course?.lessons || course.lessons.findIndex(l => l.id.toString() === lessonId) === course.lessons.length - 1}
                >
                  Next Lesson
                </Button>
              </div>
            </section>

            {/* Help section */}
            <section className="mb-6 p-4 bg-gray-200 rounded-lg" aria-labelledby="section-help">
              <h3 id="section-help" className="text-xl font-bold mb-3">Need Help?</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={() => {
                    // This would open ask question dialog
                    announce("Opening ask question dialog");
                  }}
                >
                  Ask a Question
                </Button>
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={() => {
                    // This would open contact instructor dialog
                    announce("Opening contact instructor dialog");
                  }}
                >
                  Contact Instructor
                </Button>
              </div>
            </section>

            {/* Voice commands section */}
            <section className="p-4 bg-gray-200 rounded-lg" aria-labelledby="section-voice-commands">
              <h3 id="section-voice-commands" className="text-xl font-bold mb-3">Voice Commands</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>"Next Section"</li>
                <li>"Previous Section"</li>
                <li>"Repeat That"</li>
                <li>"Take Notes"</li>
              </ul>
            </section>
          </div>
        </div>
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
              announce("Opening keyboard shortcuts guide");
              window.location.href = "/keyboard-shortcuts-help";
            }}
          >
            Keyboard Shortcuts
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CourseContent;
