import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EventCard from '../components/common/EventCard';
import { events } from '../data/events';

const Events = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Fair Events</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover upcoming virtual career fairs and connect with leading companies in your field.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;