import React from 'react';
import { useAccessibility } from '@/lib/accessibilityUtils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SettingsSliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  settingKey: keyof Pick<
    ReturnType<typeof useAccessibility>['settings'],
    'textSize' | 'readingSpeed' | 'voiceSensitivity'
  >;
  leftLabel?: string;
  rightLabel?: string;
  description?: string;
}

const SettingsSlider: React.FC<SettingsSliderProps> = ({
  id,
  label,
  min,
  max,
  step,
  settingKey,
  leftLabel,
  rightLabel,
  description
}) => {
  const { settings, updateSettings, announce } = useAccessibility();
  
  const value = settings[settingKey] as number;
  
  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    updateSettings({ [settingKey]: newValue });
    announce(`${label} set to ${newValue} out of ${max}`);
  };
  
  return (
    <div className="mb-6 pb-4 border-b border-gray-300">
      <Label htmlFor={id} className="block text-lg font-medium mb-2">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <div className="flex items-center">
        {leftLabel && <span className="mr-3 text-sm">{leftLabel}</span>}
        <Slider
          id={id}
          defaultValue={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleValueChange}
          className="flex-grow"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        />
        {rightLabel && <span className="ml-3 text-sm">{rightLabel}</span>}
      </div>
    </div>
  );
};

export default SettingsSlider;
