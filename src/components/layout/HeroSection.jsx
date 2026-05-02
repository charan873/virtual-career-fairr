import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Welcome to CareerConnect
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Connect with top companies, explore exciting career opportunities, and take the next step in your professional journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/events"
              className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Explore Events
            </Link>
            <Link
              to="/register"
              className="btn btn-secondary text-lg px-8 py-4 rounded-full border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-lg animate-pulse delay-500"></div>
    </section>
  );
};

export default HeroSection;