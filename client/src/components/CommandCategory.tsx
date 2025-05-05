import React from 'react';

interface CommandCategoryProps {
  title: string;
  commands: string[];
}

const CommandCategory: React.FC<CommandCategoryProps> = ({ title, commands }) => {
  return (
    <div className="p-4 bg-gray-200 rounded-lg">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <ul className="list-disc pl-5 space-y-2">
        {commands.map((command, index) => (
          <li key={index}>{command}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommandCategory;
