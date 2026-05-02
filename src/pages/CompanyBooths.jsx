import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ChatBox from '../components/common/ChatBox';
import { companies } from '../data/companies';

const CompanyBooth = () => {
  const { id } = useParams();
  const company = companies.find(c => c.id === parseInt(id));

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Company Not Found</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            <span className="text-white text-6xl font-bold">{company.name.charAt(0)}</span>
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{company.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{company.description}</p>
            <p className="text-gray-700 mb-6">{company.boothDescription}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Open Positions */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>
            <div className="space-y-4">
              {company.openPositions.map((position, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                  <p className="text-gray-600 mb-3">{position.type}</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chat and Actions */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect with Us</h2>
              <div className="space-y-4">
                <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                  Submit Resume
                </button>
                <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                  Schedule Interview
                </button>
              </div>
            </div>

            <ChatBox companyName={company.name} />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyBooth;