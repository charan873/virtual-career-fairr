import React from 'react';
import Sidebar from './Sidebar';
import Header from '../layout/Header';

const DashboardLayout = ({ children, sidebarItems }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;