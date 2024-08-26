import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CarAvailability.css'; // Ensure this file includes the updated styling

const BACKEND_URL = 'https://td-management-system-backend.onrender.com'; // Add your backend URL here

const CarAvailability = () => {
    const [bookings, setBookings] = useState([]);
    const [availableCars, setAvailableCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [startTime, setStartTime] = useState(getCurrentTime());
    const [endTime, setEndTime] = useState(getDefaultEndTime());

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
        const filterAvailableCars = () => {
            const dateFilter = selectedDate || getTodayDate();
            const startFilter = startTime || getCurrentTime();
            const endFilter = endTime || getDefaultEndTime();

            const available = bookings.filter(booking => {
                const bookingStartTime = new Date(`${booking.date}T${booking.startTime}`);
                const bookingEndTime = new Date(`${booking.date}T${booking.endTime}`);

                const isAvailable = bookingEndTime <= new Date(`${dateFilter}T${startFilter}`) ||
                                    bookingStartTime >= new Date(`${dateFilter}T${endFilter}`);

                return isAvailable;
            }).map(booking => booking.carModel);

            return [...new Set(available)]; // Remove duplicates
        };

        setAvailableCars(filterAvailableCars());
    }, [bookings, selectedDate, startTime, endTime]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const filteredCars = availableCars.filter(car =>
        car.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="car-availability">
            <h2>Check Car Availability</h2>
            <div className="filters">
                <label>
                    Date:
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="filter-input"
                    />
                </label>
                <label>
                    Start Time:
                    <input
                        type="time"
                        value={startTime}
                        onChange={handleStartTimeChange}
                        className="filter-input"
                    />
                </label>
                <label>
                    End Time:
                    <input
                        type="time"
                        value={endTime}
                        onChange={handleEndTimeChange}
                        className="filter-input"
                    />
                </label>
                <input
                    type="text"
                    placeholder="Search Car Model"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="car-table-container">
                {filteredCars.length > 0 ? (
                    <table className="car-table">
                        <thead>
                            <tr>
                                <th>Car Model</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCars.map((car, index) => (
                                <tr key={index}>
                                    <td>{car}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No cars available</p>
                )}
            </div>
        </div>
    );
};

// Helper functions to get default values
const getTodayDate = () => {
    const today = new Date().toISOString().split('T')[0];
    return today;
};

const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const getDefaultEndTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Default end time to one hour from now
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export default CarAvailability;
