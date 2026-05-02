import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CompanyCard from '../components/common/CompanyCard';
import { events } from '../data/events';
import { companies } from '../data/companies';

const EventDetails = () => {
  const { id } = useParams();
  const event = events.find(e => e.id === parseInt(id));

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <Link to="/events" className="text-blue-600 hover:text-blue-800">
              Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const participatingCompanies = companies.filter(company =>
    event.participatingCompanies.includes(company.name)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-6xl font-bold">{event.name.charAt(0)}</span>
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{event.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Details</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span> 10:00 AM - 5:00 PM EST
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Participating Companies</h3>
                <p className="text-gray-600">{event.participatingCompanies.length} companies</p>
                <ul className="text-gray-600 mt-2">
                  {event.participatingCompanies.map((company, index) => (
                    <li key={index} className="inline-block mr-2 mb-1">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {company}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                Register for Event
              </button>
              <Link
                to="/events"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>

        {/* Participating Companies */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Participating Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {participatingCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;