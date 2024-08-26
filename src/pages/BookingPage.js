import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingPage.css';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import CarAvailability from '../components/CarAvailability'; // Import the new component

const BACKEND_URL = 'https://td-management-system-backend.onrender.com'; // Add your backend URL here

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/bookings`);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        fetchBookings(); // Fetch bookings when the component mounts
    }, []);

    const handleBookingSuccess = () => {
        fetchBookings(); // Re-fetch bookings when a new booking is made
    };

    return (
        <div className="booking-page">
            <h1 className="title">Book a Test Drive</h1>
            <div className="container">
                <div className="form-container">
                    <BookingForm onBookingSuccess={handleBookingSuccess} />
                </div>
                <div className="availability-container">
                    <CarAvailability />
                </div>
            </div>
            <div className="list-container">
                <BookingList bookings={bookings} />
            </div>
        </div>
    );
};

export default BookingPage;
