import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items }) => {
  const location = useLocation();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-md transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;