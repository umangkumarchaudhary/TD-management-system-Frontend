// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import CompleteListOfBookings from './components/CompleteListOfBookings';
import TestDriveDashboard from './pages/TestDriveDashboard'; // Import TestDriveDashboard here
import Header from './components/Header'; // Import the Header component

const App = () => {
    return (
        <Router>
            <Header /> {/* Add the Header component here */}
            <Routes>
                <Route path="/" element={<BookingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complete-list" element={<CompleteListOfBookings />} />
                <Route path="/test-drive-dashboard" element={<TestDriveDashboard />} /> {/* Add this route */}
            </Routes>
        </Router>
    );
};

export default App;
