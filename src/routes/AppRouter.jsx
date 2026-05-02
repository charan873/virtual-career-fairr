import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import CareerFair from '../pages/CareerFair';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import CompanyBooth from '../pages/CompanyBooths';
import Companies from '../pages/Companies';
import Profile from '../pages/Profile';
import Networking from '../pages/Networking';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/career-fair" element={<CareerFair />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company/:id" element={<CompanyBooth />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;