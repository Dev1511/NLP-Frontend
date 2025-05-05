import React from 'react';
import { Button } from '@/components/ui/button';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
}

interface AssignmentCardProps {
  assignment: Assignment;
  onAction: () => void;
  actionText: string;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onAction, actionText }) => {
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
          <p className="text-gray-600 mb-2">{assignment.description}</p>
          <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
      </div>
      
      <Button
        onClick={onAction}
        className="w-full bg-primary text-white hover:bg-primary/90"
      >
        {actionText}
      </Button>
    </div>
  );
};

export default AssignmentCard;
