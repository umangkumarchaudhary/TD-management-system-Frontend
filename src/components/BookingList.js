import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingList.css';

const BACKEND_URL = 'https://td-management-system-backend.onrender.com'; // Add your backend URL here

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [passkey, setPasskey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order is descending

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/bookings`);

                // Filter out past bookings
                const now = new Date();
                const futureBookings = data.filter(booking => {
                    const bookingEndTime = new Date(`${booking.date}T${booking.endTime}`);
                    return bookingEndTime >= now;
                });

                // Sort bookings by date and time in descending order by default
                const sortedBookings = futureBookings.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.startTime}`);
                    const dateB = new Date(`${b.date}T${b.startTime}`);
                    return dateB - dateA; // Latest bookings first
                });

                setBookings(sortedBookings);
                setFilteredBookings(sortedBookings); // Initialize with all bookings
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        // Filter bookings based on search query
        const filtered = bookings.filter(booking =>
            (booking.carModel ? booking.carModel.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
            (booking.consultantName ? booking.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) : false)
        );
        setFilteredBookings(filtered);
    }, [searchQuery, bookings]);

    const handleSortOrderChange = (event) => {
        const newSortOrder = event.target.value;
        setSortOrder(newSortOrder);

        const sortedBookings = [...filteredBookings].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setFilteredBookings(sortedBookings);
    };

    const handleCancel = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowModal(true);
    };

    const handleCancelBooking = async () => {
        if (!passkey) {
            setError('Please enter the passkey.');
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/cancel-booking`, {
                bookingId: selectedBookingId,
                passkey,
            });

            if (data.success) {
                setError('');
                alert(data.message); // Display the success message
                setShowModal(false);
                setBookings(prevBookings => prevBookings.filter(booking => booking._id !== selectedBookingId));
                setFilteredBookings(prevBookings => prevBookings.filter(booking => booking._id !== selectedBookingId));
            } else {
                setError(data.message); // Display the error message from backend
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            setError('Error canceling booking. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-list-container">
            <h1>Booking List</h1>
            
            {/* Search and Sort Inputs */}
            <div className="search-sort-container">
                <input 
                    type="text" 
                    placeholder="Search by Car Model or Sales Consultant" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <select value={sortOrder} onChange={handleSortOrderChange} className="sort-select">
                    <option value="desc">Latest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            {/* Bookings List */}
            <ul className="booking-list">
                {filteredBookings.map(booking => (
                    <li key={booking._id} className="booking-item">
                        <div className="booking-time">
                            <span className="booking-start-end">
                                {booking.startTime} - {booking.endTime}
                            </span>
                        </div>
                        <div className="booking-date">
                            Date: {booking.date}
                        </div>
                        <div className="booking-details">
                            <span>Car Model: {booking.carModel}</span>
                            <span>Sales Consultant: {booking.consultantName}</span>
                            <span>Location: {booking.location}</span>
                        </div>
                        <button onClick={() => handleCancel(booking._id)} className="cancel-button">
                            Cancel
                        </button>
                    </li>
                ))}
            </ul>

            {/* Modal for cancellation */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Cancel Booking</h2>
                        <input
                            type="password"
                            value={passkey}
                            onChange={(e) => setPasskey(e.target.value)}
                            placeholder="Enter your Passkey"
                        />
                        <button onClick={handleCancelBooking} disabled={loading}>
                            {loading ? 'Canceling...' : 'Confirm Cancellation'}
                        </button>
                        <button onClick={() => setShowModal(false)}>Close</button>
                        {error && <div className="error">{error}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
