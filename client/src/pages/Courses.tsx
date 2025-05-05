import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAccessibility } from '@/lib/accessibilityUtils';

// Components
import NavigationBar from '@/components/NavigationBar';
import AccessibilityAnnouncement from '@/components/AccessibilityAnnouncement';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';

const Courses: React.FC = () => {
  const [, navigate] = useLocation();
  const { announce } = useAccessibility();
  
  // Fetch courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });
  
  // Announce page on initial load and stop any ongoing speech
  useEffect(() => {
    // Stop any speech synthesis when the page loads
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    announce("Courses page loaded. Browse all available courses.");
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Page header */}
      <header className="mb-6 border-b border-gray-300 pb-4">
        <h1 id="courses-heading" className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-lg mb-4">Browse and access all your courses</p>
      </header>

      {/* Main content area */}
      <main className="mb-8">
        {/* Top navigation bar */}
        <NavigationBar 
          pageTitle="Courses"
          navItems={[
            { text: "Dashboard", path: "/" },
            { text: "My Courses", path: "/courses", isActive: true },
            { text: "Profile", path: "/profile" }
          ]}
        />

        {/* Accessibility announcement bar */}
        <AccessibilityAnnouncement 
          message="Course Catalog: Browse all your enrolled courses. Press Tab to navigate between courses."
        />

        {/* Courses section */}
        <section className="mb-8" aria-labelledby="available-courses-heading">
          <h2 id="available-courses-heading" className="text-2xl font-bold mb-4">Available Courses</h2>
          
          {coursesLoading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
        
        {/* Categories section */}
        <section className="mb-8 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Course Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Filtering by Programming courses");
                // This would filter courses
              }}
            >
              Programming
            </Button>
            <Button 
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Filtering by Mathematics courses");
                // This would filter courses
              }}
            >
              Mathematics
            </Button>
            <Button 
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Filtering by Science courses");
                // This would filter courses
              }}
            >
              Science
            </Button>
            <Button 
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Filtering by Language courses");
                // This would filter courses
              }}
            >
              Languages
            </Button>
            <Button 
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Filtering by Arts courses");
                // This would filter courses
              }}
            >
              Arts
            </Button>
            <Button 
              className="bg-gray-300 hover:bg-gray-400 text-black"
              onClick={() => {
                announce("Filtering by History courses");
                // This would filter courses
              }}
            >
              History
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

export default Courses;