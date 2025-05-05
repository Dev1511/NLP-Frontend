import React from 'react';
import { useAccessibility } from '@/lib/accessibilityUtils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingsToggleProps {
  id: string;
  label: string;
  settingKey: keyof Pick<
    ReturnType<typeof useAccessibility>['settings'],
    'highContrast' | 'audioDescriptions' | 'keyboardNavigation' | 'autoAdvance' | 'notificationSounds'
  >;
  description?: string;
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({
  id,
  label,
  settingKey,
  description
}) => {
  const { settings, updateSettings, announce } = useAccessibility();
  
  const value = settings[settingKey] as boolean;
  
  const handleToggle = () => {
    updateSettings({ [settingKey]: !value });
    announce(`${label} turned ${!value ? 'on' : 'off'}`);
  };
  
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-300">
      <div>
        <Label htmlFor={id} className="text-lg font-medium block">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <Switch 
        id={id}
        checked={value}
        onCheckedChange={handleToggle}
        aria-label={label}
      />
    </div>
  );
};

export default SettingsToggle;
