import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/accessibilityUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question } from '@shared/schema';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onSubmit: (selectedAnswer: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  onPrevious,
  onSkip,
  onSubmit
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { settings, announce } = useAccessibility();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read question aloud when it changes
  useEffect(() => {
    if (settings.audioDescriptions) {
      readQuestionAloud();
    }
  }, [question.id]);

  const readQuestionAloud = () => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const optionsText = question.options
      .map((option, index) => `Option ${String.fromCharCode(65 + index)}: ${option}`)
      .join(". ");
    
    const fullText = `Question ${questionNumber} of ${totalQuestions}. ${question.question}. ${optionsText}`;
    
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.5 + ((settings.readingSpeed - 1) * 0.25);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const handleOptionSelect = (index: number) => {
    setSelectedAnswer(index);
    announce(`Selected option ${String.fromCharCode(65 + index)}`);
  };
  
  const handleSubmit = () => {
    if (selectedAnswer === null) {
      announce("Please select an answer before submitting");
      return;
    }
    
    setIsSubmitting(true);
    announce("Submitting your answer");
    
    // Call parent component's submit handler
    onSubmit(selectedAnswer);
    
    // Reset selected answer after submission
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Keyboard handlers for number keys 1-4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-4 for selecting options A-D
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (index < question.options.length) {
          handleOptionSelect(index);
        }
      }
      
      // Enter to submit
      if (e.key === 'Enter' && selectedAnswer !== null) {
        handleSubmit();
      }
      
      // Space to hear question again
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault(); // Prevent page scroll
        readQuestionAloud();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [question, selectedAnswer]);
  
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Quiz: {question.question}</h2>
      
      {/* Progress indicator */}
      <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
        <div 
          className="bg-primary h-4 rounded-full" 
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="mb-6">Question {questionNumber} of {totalQuestions}</p>
      
      {/* Question container */}
      <div className="p-4 bg-gray-100 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">
          Question {questionNumber}: {question.question}
        </h3>
        
        {/* Audio controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant="outline"
            onClick={readQuestionAloud}
            className="flex items-center gap-2"
          >
            Hear Question Again (Space)
          </Button>
          
          <Button 
            variant="outline"
            onClick={onPrevious}
            className="flex items-center gap-2"
            disabled={questionNumber === 1}
          >
            Previous Question (P)
          </Button>
          
          <Button 
            variant="outline"
            onClick={onSkip}
            className="flex items-center gap-2"
          >
            Skip Question (S)
          </Button>
        </div>
        
        {/* Answer options */}
        <RadioGroup 
          value={selectedAnswer !== null ? selectedAnswer.toString() : undefined} 
          onValueChange={(value) => handleOptionSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div 
              key={index}
              className={`p-3 bg-white border-2 rounded-lg hover:border-primary cursor-pointer flex items-start ${
                selectedAnswer === index ? 'border-primary' : 'border-gray-300'
              }`}
            >
              <RadioGroupItem 
                value={index.toString()} 
                id={`option-${index}`} 
                className="mr-3"
              />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)})</span>
                <span>{option}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {/* Submit instruction and button */}
        <div className="mt-6">
          <p className="mb-3">Say "Option A", "Option B", etc. to select your answer or press 1-4.</p>
          <Button 
            className="w-full bg-primary text-white px-4 py-3 rounded-lg font-bold"
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Answer (Enter)"}
          </Button>
        </div>
      </div>
      
      {/* Audio feedback section */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-bold mb-3">Audio Feedback</h3>
        <p>After answering, you'll receive audio feedback on your answer.</p>
      </div>
    </div>
  );
};

export default QuizQuestion;
