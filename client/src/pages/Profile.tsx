import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAccessibility } from '@/lib/accessibilityUtils';

// Components
import NavigationBar from '@/components/NavigationBar';
import AccessibilityAnnouncement from '@/components/AccessibilityAnnouncement';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const [, navigate] = useLocation();
  const { announce } = useAccessibility();
  
  // Announce page on initial load
  useEffect(() => {
    announce("Profile page loaded. View and update your personal information here.");
    
    // Stop any speech synthesis when the page loads
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="profile-heading" className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-lg mb-4">View and manage your profile information</p>
      </header>

      {/* Main content area */}
      <main className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Profile"
          navItems={[
            { text: "Dashboard", path: "/" },
            { text: "My Courses", path: "/courses" },
            { text: "Profile", path: "/profile", isActive: true }
          ]}
        />

        {/* Accessibility announcement bar */}
        <AccessibilityAnnouncement 
          message="Profile Information: Your personal information and settings."
        />

        {/* Profile information */}
        <section className="mb-8 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-medium">Name:</span>
              <span className="text-lg">John Doe</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-medium">Email:</span>
              <span className="text-lg">john.doe@example.com</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-medium">User ID:</span>
              <span className="text-lg">123456</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-medium">Role:</span>
              <span className="text-lg">Student</span>
            </div>
          </div>
        </section>
        
        {/* Account settings */}
        <section className="mb-8 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-primary text-white"
              onClick={() => navigate('/accessibility-settings')}
            >
              Accessibility Settings
            </Button>
            
            <Button 
              className="w-full bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Password change form opened");
                // This would open a password change form
              }}
            >
              Change Password
            </Button>
            
            <Button 
              className="w-full bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Notification preferences form opened");
                // This would open notification preferences
              }}
            >
              Notification Preferences
            </Button>
          </div>
        </section>
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
        </div>
      </footer>
    </div>
  );
};

export default Profile;