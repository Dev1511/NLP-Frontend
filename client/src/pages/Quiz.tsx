import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/lib/accessibilityUtils';

// Components
import NavigationBar from '@/components/NavigationBar';
import AccessibilityAnnouncement from '@/components/AccessibilityAnnouncement';
import QuizQuestion from '@/components/QuizQuestion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Static data
const staticQuizzes = {
  "1": {
    id: 1,
    title: "Web Accessibility Basics Quiz",
    description: "Test your knowledge of web accessibility fundamentals",
    questions: [
      {
        id: 1,
        question: "What does WCAG stand for?",
        options: [
          "Web Content Accessibility Guidelines",
          "Web Content Access Guidelines",
          "World Content Accessibility Guidelines",
          "Web Content Accessibility Goals"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which of the following is NOT one of the four principles of WCAG 2.1?",
        options: [
          "Perceivable",
          "Operable",
          "Understandable",
          "Accessible"
        ],
        correctAnswer: 3
      },
      {
        id: 3,
        question: "What is the purpose of alt text for images?",
        options: [
          "To make images load faster",
          "To provide a text alternative for screen readers",
          "To improve image quality",
          "To make images more visible"
        ],
        correctAnswer: 1
      }
    ]
  }
};

const Quiz: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { announce } = useAccessibility();
  
  // State for tracking current question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  
  const quiz = staticQuizzes[quizId as keyof typeof staticQuizzes];
  const questions = quiz?.questions || [];
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          announce("Time's up! The quiz will be submitted automatically.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} minutes`;
  };
  
  // Navigate back to lesson
  const navigateToLesson = () => {
    navigate('/course/1/1'); // Back to lesson 1
  };
  
  // Navigation handlers
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      announce(`Moving to question ${currentQuestionIndex}`);
    } else {
      announce("This is the first question");
    }
  };
  
  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      announce(`Moving to question ${currentQuestionIndex + 2}`);
    } else {
      announce("This is the last question");
    }
  };
  
  const handleSubmitAnswer = (selectedAnswerIndex: number) => {
    // In a real implementation, this would submit the answer to the server
    announce(`Answer submitted. ${
      questions && questions[currentQuestionIndex].correctAnswer === selectedAnswerIndex
        ? "That is correct!"
        : "That is incorrect."
    }`);
    
    // Move to next question after a brief delay
    setTimeout(() => {
      if (questions && currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        announce("Quiz completed! Thank you for your submission.");
      }
    }, 2000);
  };
  
  // Handle review previous questions
  const reviewPreviousQuestions = () => {
    announce("Reviewing previous questions");
    // This would show a summary of previous answers
  };
  
  // Handle skip to specific question
  const skipToQuestion = () => {
    announce("Skip to question dialog opened");
    // This would open a dialog to select a specific question
  };
  
  // Handle request extra time
  const requestExtraTime = () => {
    announce("Request for extra time submitted");
    setTimeRemaining(prev => prev + 5 * 60); // Add 5 minutes
  };
  
  // Handle report issue
  const reportIssue = () => {
    announce("Issue report dialog opened");
    // This would open a dialog to report issues with the quiz
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="quiz-heading" className="text-3xl font-bold mb-2">Interactive Quiz</h1>
      </header>

      {/* Main content area */}
      <main className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Quiz"
          navItems={[
            { text: "Back to Lesson", path: "/course/1/1" },
            { text: "Quiz Progress", path: "#quiz-progress" },
            { text: "Help", path: "/help" }
          ]}
        />

        {/* Quiz navigation instructions */}
        <AccessibilityAnnouncement 
          message="Quiz Navigation: Press Space to hear question again, 1-4 to select answers, Enter to submit."
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Quiz content main area */}
          <div className="md:w-2/3">
            {questions.length > 0 ? (
              <QuizQuestion 
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onNext={handleNextQuestion}
                onPrevious={handlePreviousQuestion}
                onSkip={handleNextQuestion}
                onSubmit={handleSubmitAnswer}
              />
            ) : (
              <p>No questions available.</p>
            )}
          </div>

          {/* Right sidebar */}
          <div className="md:w-1/3">
            {/* Quiz progress section */}
            <section id="quiz-progress" className="mb-6 p-4 bg-gray-200 rounded-lg" aria-labelledby="section-quiz-progress">
              <h3 id="section-quiz-progress" className="text-xl font-bold mb-3">Quiz Progress</h3>
              <p className="mb-2">
                {questions.length > 0 ? `${currentQuestionIndex + 1} of ${questions.length} questions answered` : 'Loading...'}
              </p>
              <p className="mb-4">Time Remaining</p>
              <p className="text-xl font-bold mb-4">{formatTime(timeRemaining)}</p>
              
              <h4 className="font-bold mb-2">Quiz Navigation</h4>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={reviewPreviousQuestions}
                >
                  Review Previous Questions
                </Button>
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={skipToQuestion}
                >
                  Skip to Question...
                </Button>
              </div>
            </section>

            {/* Help section */}
            <section className="p-4 bg-gray-200 rounded-lg" aria-labelledby="section-quiz-help">
              <h3 id="section-quiz-help" className="text-xl font-bold mb-3">Need Help?</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={requestExtraTime}
                >
                  Request Extra Time
                </Button>
                <Button 
                  className="w-full bg-gray-300 hover:bg-gray-400 text-black"
                  onClick={reportIssue}
                >
                  Report an Issue
                </Button>
              </div>
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
              // This would open keyboard shortcuts guide
              announce("Opening keyboard shortcuts guide");
            }}
          >
            Keyboard Shortcuts
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Quiz;
