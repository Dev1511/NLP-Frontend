import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/accessibilityUtils';
import CourseCard from './CourseCard';
import AssignmentCard from './AssignmentCard';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
}

const Dashboard: React.FC = () => {
  const { announce } = useAccessibility();

  // Static data for demonstration
  const courses: Course[] = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Master React hooks, context, and performance optimization',
      progress: 30,
      totalLessons: 10,
      completedLessons: 3,
    },
  ];

  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'Build a Todo App',
      description: 'Create a todo application using React and TypeScript',
      dueDate: '2024-03-15',
      status: 'pending',
    },
    {
      id: 2,
      title: 'CSS Grid Layout',
      description: 'Implement a responsive layout using CSS Grid',
      dueDate: '2024-03-20',
      status: 'pending',
    },
  ];

  const handleAssignmentAction = (assignmentId: number) => {
    announce(`Starting assignment ${assignmentId}`);
    // Here you would typically navigate to the assignment
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={() => announce('Navigating to profile')}
          variant="outline"
          asChild
        >
          <Link to="/profile">View Profile</Link>
        </Button>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Upcoming Assignments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onAction={() => handleAssignmentAction(assignment.id)}
              actionText="Start Assignment"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 