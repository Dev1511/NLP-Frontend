import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/accessibilityUtils';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { announce } = useAccessibility();

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    announce(`Selected answer ${answerIndex + 1}`);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      announce('Correct answer!');
    } else {
      announce('Incorrect answer');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0));
    }
  };

  if (isComplete) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
        <p className="text-lg mb-4">
          Your score: {score} out of {questions.length}
        </p>
        <Button
          onClick={() => {
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setScore(0);
            setIsComplete(false);
          }}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Retry Quiz
        </Button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Question {currentQuestion + 1} of {questions.length}</h3>
      
      <p className="text-lg mb-6">{question.text}</p>
      
      <div className="space-y-4 mb-6">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full text-left p-4 ${
              selectedAnswer === index
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {option}
          </Button>
        ))}
      </div>
      
      <Button
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        className="bg-primary text-white hover:bg-primary/90"
      >
        {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </Button>
    </div>
  );
};

export default QuizSection; 