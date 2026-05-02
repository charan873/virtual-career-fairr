import React from 'react';

const BoothCard = ({ company }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white text-xl font-bold">{company.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
          <p className="text-gray-600">{company.description}</p>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Open Positions:</h4>
        <ul className="space-y-1">
          {company.openPositions.slice(0, 3).map((position, index) => (
            <li key={index} className="text-sm text-gray-600">
              {position.title} ({position.type})
            </li>
          ))}
        </ul>
        {company.openPositions.length > 3 && (
          <p className="text-sm text-gray-500 mt-2">And {company.openPositions.length - 3} more...</p>
        )}
      </div>
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
          Submit Resume
        </button>
        <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200">
          Chat with Recruiter
        </button>
      </div>
    </div>
  );
};

export default BoothCard;