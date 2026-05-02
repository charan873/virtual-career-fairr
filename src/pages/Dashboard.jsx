import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import EventSchedule from '../components/networking/EventSchedule';
import MatchCard from '../components/networking/MatchCard';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Header />
            <div className="dashboard-content">
                <Sidebar />
                <main>
                    <h1>Welcome to Your Dashboard</h1>
                    <EventSchedule />
                    <MatchCard />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;