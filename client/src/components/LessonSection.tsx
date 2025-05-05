import React from 'react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/accessibilityUtils';

interface Section {
  id: number;
  title: string;
  content: string;
  type: 'text' | 'video' | 'audio' | 'interactive';
}

interface LessonSectionProps {
  section: Section;
}

const LessonSection: React.FC<LessonSectionProps> = ({ section }) => {
  const { announce } = useAccessibility();

  const handleReadSection = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(section.content);
      window.speechSynthesis.speak(utterance);
      announce('Reading section content');
    }
  };

  const handlePauseReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      announce('Reading paused');
    }
  };

  return (
    <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
      
      <div className="prose max-w-none mb-6">
        <p>{section.content}</p>
      </div>
      
      <div className="flex gap-4">
        <Button
          onClick={handleReadSection}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Read Section
        </Button>
        <Button
          onClick={handlePauseReading}
          variant="outline"
        >
          Pause Reading
        </Button>
      </div>
    </section>
  );
};

export default LessonSection;
