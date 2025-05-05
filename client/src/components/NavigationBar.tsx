import React from 'react';
import { Link } from 'react-router-dom';
import { useAccessibility } from '@/lib/accessibilityUtils';

interface NavItem {
  text: string;
  path: string;
  isActive?: boolean;
}

interface NavigationBarProps {
  pageTitle: string;
  navItems: NavItem[];
}

const NavigationBar: React.FC<NavigationBarProps> = ({ pageTitle, navItems }) => {
  const { announce } = useAccessibility();

  return (
    <nav className="bg-white shadow-sm mb-6" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Page title */}
          <h2 className="text-xl font-semibold">{pageTitle}</h2>

          {/* Navigation items */}
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  item.isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => announce(`Navigating to ${item.text}`)}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
