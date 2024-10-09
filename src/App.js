// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import CompleteListOfBookings from './components/CompleteListOfBookings';
import TestDriveDashboard from './pages/TestDriveDashboard'; // Import TestDriveDashboard here
import Header from './components/Header'; // Import the Header component

const BACKEND_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : 'https://td-management-system-backend.onrender.com';
const socket = io(BACKEND_URL); // Initialize Socket.IO connection

const App = () => {
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        // Listen for new booking notifications
        socket.on('newBooking', (bookingDetails) => {
            setNotification(`New booking made: ${bookingDetails.carModel} by ${bookingDetails.consultantName}`);
            setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
        });

        // Cleanup the socket connection when component unmounts
        return () => {
            socket.off('newBooking');
        };
    }, []);

    return (
        <Router>
            <Header /> {/* Add the Header component here */}
            {notification && <div className="notification">{notification}</div>} {/* Display notification */}
            <Routes>
                <Route path="/" element={<BookingPage socket={socket} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complete-list" element={<CompleteListOfBookings />} />
                <Route path="/test-drive-dashboard" element={<TestDriveDashboard />} /> {/* Add this route */}
            </Routes>
        </Router>
    );
};

export default App;
