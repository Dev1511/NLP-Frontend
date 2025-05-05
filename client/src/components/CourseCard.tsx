import React from 'react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-2">{course.title}</h3>
      <p className="text-gray-600 mb-4">{course.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
      </div>
      
      <Link
        to={`/course/${course.id}`}
        className="block w-full text-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
      >
        Continue Learning
      </Link>
    </div>
  );
};

export default CourseCard;
