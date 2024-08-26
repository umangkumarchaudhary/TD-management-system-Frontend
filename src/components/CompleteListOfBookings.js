import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompleteListOfBookings.css';

const BACKEND_URL = 'https://td-management-system-backend.onrender.com'; // Add your backend URL here

const CompleteListOfBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [viewOption, setViewOption] = useState('today');
    const [sortOrder, setSortOrder] = useState('desc'); // Add state for sorting order

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/bookings`);
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        const now = new Date();
        const today = new Date().toISOString().split('T')[0];

        const filterBookings = () => {
            let filtered;
            switch (viewOption) {
                case 'today':
                    filtered = bookings.filter(booking => booking.date === today);
                    break;
                case 'ongoing':
                    filtered = bookings.filter(booking => {
                        const startTime = new Date(`${booking.date}T${booking.startTime}`);
                        const endTime = new Date(`${booking.date}T${booking.endTime}`);
                        return startTime <= now && endTime >= now;
                    });
                    break;
                case 'upcoming':
                    filtered = bookings.filter(booking => {
                        const startTime = new Date(`${booking.date}T${booking.startTime}`);
                        return startTime > now;
                    });
                    break;
                case 'complete':
                    filtered = bookings.filter(booking => {
                        const endTime = new Date(`${booking.date}T${booking.endTime}`);
                        return endTime < now;
                    });
                    break;
                default:
                    filtered = bookings;
            }

            // Sort the filtered bookings by date
            filtered.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.startTime}`);
                const dateB = new Date(`${b.date}T${b.startTime}`);
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });

            return filtered;
        };

        setFilteredBookings(filterBookings());
    }, [bookings, viewOption, sortOrder]); // Include sortOrder as a dependency

    const toggleSortOrder = () => {
        setSortOrder(prevSortOrder => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
    };

    return (
        <div className="complete-list-of-bookings">
            <h2>Complete List of Bookings</h2>
            <div className="tabs">
                <button onClick={() => setViewOption('today')}>Today's Test Drive</button>
                <button onClick={() => setViewOption('ongoing')}>Ongoing Test Drive</button>
                <button onClick={() => setViewOption('upcoming')}>Upcoming Test Drive</button>
                <button onClick={() => setViewOption('complete')}>Complete Bookings</button>
            </div>
            <button className="sort-button" onClick={toggleSortOrder}>
                Sort by Date: {sortOrder === 'desc' ? 'Newest to Oldest' : 'Oldest to Newest'}
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Consultant Name</th>
                        <th>Location</th>
                        <th>Car Model</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking.date}</td>
                                <td>{booking.startTime}</td>
                                <td>{booking.endTime}</td>
                                <td>{booking.consultantName}</td>
                                <td>{booking.location}</td>
                                <td>{booking.carModel}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No bookings available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CompleteListOfBookings;
