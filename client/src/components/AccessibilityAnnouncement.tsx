import React from 'react';
import { useAccessibility } from '@/lib/accessibilityUtils';

interface AccessibilityAnnouncementProps {
  message: string;
}

const AccessibilityAnnouncement: React.FC<AccessibilityAnnouncementProps> = ({ message }) => {
  const { announce } = useAccessibility();

  React.useEffect(() => {
    announce(message);
  }, [message, announce]);

  return (
    <div
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

export default AccessibilityAnnouncement;
