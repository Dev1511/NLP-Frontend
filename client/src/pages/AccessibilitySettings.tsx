import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/lib/accessibilityUtils';

// Components
import NavigationBar from '@/components/NavigationBar';
import AccessibilityAnnouncement from '@/components/AccessibilityAnnouncement';
import SettingsToggle from '@/components/SettingsToggle';
import SettingsSlider from '@/components/SettingsSlider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AccessibilitySettings: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings, announce } = useAccessibility();
  
  // Track if settings were modified to enable/disable save button
  const [settingsModified, setSettingsModified] = useState(false);
  
  // Announce page on initial load
  useEffect(() => {
    announce("Accessibility Settings page loaded. Use Tab to navigate between settings, Space to toggle options, and Enter to adjust sliders.");
  }, []);
  
  // Handle settings change
  const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
    updateSettings(newSettings);
    setSettingsModified(true);
  };
  
  // Handle color theme change
  const handleColorThemeChange = (value: string) => {
    updateSettings({ colorTheme: value as any });
    setSettingsModified(true);
    announce(`Color theme set to ${value}`);
  };
  
  // Handle voice type change
  const handleVoiceTypeChange = (value: string) => {
    updateSettings({ preferredVoice: value });
    setSettingsModified(true);
    announce(`Voice type set to ${value.replace('_', ' ')}`);
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    // Settings are already saved in local storage via the AccessibilityProvider
    announce("Settings successfully saved");
    setSettingsModified(false);
  };
  
  // Handle reset settings
  const handleResetSettings = () => {
    resetSettings();
    announce("All settings have been reset to default values");
    setSettingsModified(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="accessibility-settings-heading" className="text-3xl font-bold mb-2">Accessibility Settings Panel</h1>
      </header>

      {/* Main content area */}
      <main className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Accessibility Settings"
          navItems={[
            { text: "Back to Dashboard", path: "/" },
            { text: "Save Settings", path: "#", isActive: true }
          ]}
        />

        {/* Settings navigation instructions */}
        <AccessibilityAnnouncement 
          message="Settings Navigation: Use Tab to navigate between settings, Space to toggle, Enter to adjust sliders."
        />

        {/* Settings form */}
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
          {/* Visual settings */}
          <section className="p-6 bg-gray-100 rounded-lg" aria-labelledby="visual-settings-heading">
            <h2 id="visual-settings-heading" className="text-2xl font-bold mb-4">Visual Settings</h2>
            
            {/* High contrast mode */}
            <SettingsToggle 
              id="high-contrast-toggle"
              label="High Contrast Mode"
              settingKey="highContrast"
              description="Increases contrast between text and background for better readability"
            />
            
            {/* Text size */}
            <SettingsSlider
              id="text-size-slider"
              label="Text Size"
              min={1}
              max={5}
              step={1}
              settingKey="textSize"
              leftLabel="Smaller"
              rightLabel="Larger"
            />
            
            {/* Color theme */}
            <div className="mb-6 pb-4 border-b border-gray-300">
              <Label htmlFor="color-theme-select" className="block text-lg font-medium mb-2">
                Color Theme
              </Label>
              <div className="relative">
                <Select 
                  value={settings.colorTheme} 
                  onValueChange={handleColorThemeChange}
                >
                  <SelectTrigger id="color-theme-select" className="w-full bg-white">
                    <SelectValue placeholder="Select a color theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                    <SelectItem value="blue-light-filter">Blue Light Filter</SelectItem>
                    <SelectItem value="sepia">Sepia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Audio settings */}
          <section className="p-6 bg-gray-100 rounded-lg" aria-labelledby="audio-settings-heading">
            <h2 id="audio-settings-heading" className="text-2xl font-bold mb-4">Audio Settings</h2>
            
            {/* Reading speed */}
            <SettingsSlider
              id="reading-speed-slider"
              label="Reading Speed"
              min={1}
              max={5}
              step={1}
              settingKey="readingSpeed"
              leftLabel="Slow"
              rightLabel="Fast"
            />
            
            {/* Voice type */}
            <div className="mb-6 pb-4 border-b border-gray-300">
              <Label htmlFor="voice-type-select" className="block text-lg font-medium mb-2">
                Voice Type
              </Label>
              <div className="relative">
                <Select 
                  value={settings.preferredVoice} 
                  onValueChange={handleVoiceTypeChange}
                >
                  <SelectTrigger id="voice-type-select" className="w-full bg-white">
                    <SelectValue placeholder="Select a voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female_standard">Female (Standard)</SelectItem>
                    <SelectItem value="male_standard">Male (Standard)</SelectItem>
                    <SelectItem value="female_enhanced">Female (Enhanced)</SelectItem>
                    <SelectItem value="male_enhanced">Male (Enhanced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Audio descriptions */}
            <SettingsToggle 
              id="audio-descriptions-toggle"
              label="Audio Descriptions for Images"
              settingKey="audioDescriptions"
              description="Provides spoken descriptions of images and visual elements"
            />
          </section>

          {/* Navigation settings */}
          <section className="p-6 bg-gray-100 rounded-lg" aria-labelledby="navigation-settings-heading">
            <h2 id="navigation-settings-heading" className="text-2xl font-bold mb-4">Navigation Settings</h2>
            
            {/* Keyboard navigation */}
            <SettingsToggle 
              id="keyboard-navigation-toggle"
              label="Keyboard Navigation"
              settingKey="keyboardNavigation"
              description="Enables comprehensive keyboard shortcuts for navigation"
            />
            
            {/* Voice command sensitivity */}
            <SettingsSlider
              id="voice-sensitivity-slider"
              label="Voice Command Sensitivity"
              min={1}
              max={5}
              step={1}
              settingKey="voiceSensitivity"
              leftLabel="Less Sensitive"
              rightLabel="More Sensitive"
            />
          </section>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetSettings}
            >
              Reset to Defaults
            </Button>
            <Button
              type="submit"
              disabled={!settingsModified}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AccessibilitySettings;
