import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{event.name.charAt(0)}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Companies:</span> {event.participatingCompanies.join(', ')}
          </p>
        </div>
        <Link
          to={`/events/${event.id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;