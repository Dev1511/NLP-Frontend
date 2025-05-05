import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/accessibilityUtils';
import LessonSection from './LessonSection';
import QuizSection from './QuizSection';

interface Section {
  id: number;
  title: string;
  content: string;
  type: 'text' | 'video' | 'audio' | 'interactive';
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface CourseContentProps {
  title: string;
  description: string;
  sections: Section[];
  quiz: {
    questions: Question[];
  };
}

const CourseContent: React.FC<CourseContentProps> = ({
  title,
  description,
  sections,
  quiz,
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const { announce } = useAccessibility();

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      announce(`Moving to section ${currentSection + 2}`);
    } else {
      setShowQuiz(true);
      announce('Starting quiz');
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      announce(`Moving to section ${currentSection}`);
    }
  };

  const handleQuizComplete = (score: number) => {
    announce(`Quiz completed with score ${score} out of ${quiz.questions.length}`);
    // Here you could add logic to save the score or show a completion message
  };

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <QuizSection
          questions={quiz.questions}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-8">{description}</p>

      <div className="mb-8">
        <LessonSection section={sections[currentSection]} />
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handlePreviousSection}
          disabled={currentSection === 0}
          variant="outline"
        >
          Previous Section
        </Button>

        <Button
          onClick={handleNextSection}
          className="bg-primary text-white hover:bg-primary/90"
        >
          {currentSection < sections.length - 1 ? 'Next Section' : 'Start Quiz'}
        </Button>
      </div>
    </div>
  );
};

export default CourseContent; 