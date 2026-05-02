import React from 'react';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-slate-100/90 border border-slate-200/70 rounded-3xl shadow-lg shadow-slate-900/10 overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="h-32 bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{company.name.charAt(0)}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{company.name}</h3>
        <p className="text-slate-600 mb-4 line-clamp-3">{company.description}</p>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Open Positions:</span> {company.openPositions.length}
          </p>
        </div>
        <Link
          to={`/company/${company.id}`}
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Visit Booth
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;