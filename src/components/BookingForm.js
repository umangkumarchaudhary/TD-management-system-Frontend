import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BACKEND_URL = 'https://td-management-system-backend.onrender.com';

const BookingForm = ({ onBookingSuccess }) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [carModel, setCarModel] = useState('');
    const [consultantName, setConsultantName] = useState('');
    const [location, setLocation] = useState(''); 
    const [passkey, setPasskey] = useState('');
    const [carOptions] = useState([
        'A200', 'A200d', 'C200', 'C220d', 'E200', 
        'E220d', 'E350d', 'S350d', 'S450', 'GLA200', 'GLA220d', 'GLC220d', 'GLC300', 'GLE300d', 'GLE450d', 'GLE450', 'GLS450', 'GLS450D'
    ]);
    const [bookedCars, setBookedCars] = useState([]);
    const [timeOptions, setTimeOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hardcoded passkeys for each consultant
    const consultantPasskeys = {
        'Umang': 'umang1234',
        'King': 'king1234',
        'Harsh': 'harsh1234',
        'Aditya': 'aditya1234',
        'Shefali Jain': 'shefali1234',
        'Amogh': 'amogh1234',
        'Nidhi': 'nidhi1234',
        'Imaad': 'imaad1234',
        'Durgesh': 'durgesh1234',
        'Vaibhav': 'vaibhav1234',
        'Sushil': 'sushil1234',
        'Ajinkya': 'ajinkya1234',
        'Bhagyesh': 'bhagyesh1234'
    };

    useEffect(() => {
        const generateTimeOptions = () => {
            const options = [];
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const selectedDate = new Date(date);

            let startHour = 9;
            let endHour = 19;

            if (selectedDate.toDateString() === now.toDateString()) {
                startHour = currentHour;
                if (currentMinute >= 30) {
                    startHour += 1;
                }
            }

            for (let hour = startHour; hour <= endHour; hour++) {
                options.push(`${hour < 10 ? '0' + hour : hour}:00`);
                if (hour !== endHour) {
                    options.push(`${hour < 10 ? '0' + hour : hour}:30`);
                }
            }

            setTimeOptions(options);
        };

        if (date) {
            generateTimeOptions();
        }
    }, [date]);

    useEffect(() => {
        if (date && startTime && endTime) {
            const fetchAvailableCars = async () => {
                try {
                    const { data } = await axios.get(`${BACKEND_URL}/api/bookings`);
                    const bookedCars = data.filter(
                        booking => booking.date === date &&
                        (booking.startTime < endTime && booking.endTime > startTime)
                    ).map(booking => ({
                        carModel: booking.carModel,
                        consultantName: booking.consultantName,
                        startTime: booking.startTime,
                        endTime: booking.endTime,
                    }));
                    
                    setBookedCars(bookedCars);
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                }
            };
            fetchAvailableCars();
        }
    }, [date, startTime, endTime]);

    const submitHandler = async (e) => {
        e.preventDefault();

        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            alert('You cannot book a car for a past date.');
            return;
        }

        if (startTime >= endTime) {
            alert('End time must be later than start time.');
            return;
        }

        // Validate passkey
        if (consultantName && passkey !== consultantPasskeys[consultantName]) {
            alert('Enter correct passkey.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${BACKEND_URL}/api/bookings`, {
                date,
                startTime,
                endTime,
                carModel,
                consultantName,
                location,  // Include Location
                passkey,   // Include Passkey
            });
            setLoading(false);
            alert('Booking successful!');
            onBookingSuccess();
        } catch (error) {
            setLoading(false);
            console.error('Error submitting booking:', error);
            alert('Car is already booked for this time.');
        }
    };

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Date</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>
            <div className="form-group">
                <label>Start Time</label>
                <select 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    required
                    disabled={!date}
                >
                    <option value="">Select Start Time</option>
                    {timeOptions.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>End Time</label>
                <select 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    required
                    disabled={!startTime}
                >
                    <option value="">Select End Time</option>
                    {timeOptions.filter(time => time > startTime).map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Car Model</label>
                <select value={carModel} onChange={(e) => setCarModel(e.target.value)} required>
                    <option value="">Select Car Model</option>
                    {carOptions.map((car) => {
                        const booking = bookedCars.find(b => b.carModel === car);
                        return (
                            <option 
                                key={car} 
                                value={car} 
                                disabled={!!booking}
                            >
                                {car} 
                                {booking 
                                    ? ` (unavailable - booked by ${booking.consultantName} from ${booking.startTime} to ${booking.endTime})`
                                    : ''
                                }
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="form-group">
                <label>Consultant Name</label>
                <select value={consultantName} onChange={(e) => setConsultantName(e.target.value)} required>
                    <option value="">Select Consultant</option>
                    <option value="Umang">Umang</option>
                    <option value="King">King</option>
                    <option value="Harsh">Harsh</option>
                    <option value="Aditya">Aditya</option>
                    <option value="Shefali Jain">Shefali Jain</option>
                    <option value="Amogh">Amogh</option>
                    <option value="Nidhi">Nidhi</option>
                    <option value="Imaad">Imaad</option>
                    <option value="Durgesh">Durgesh</option>
                    <option value="Vaibhav">Vaibhav</option>
                    <option value="Sushil">Sushil</option>
                    <option value ="Ajinkya"> Ajinkya</option>
                    <option value = "Bhagyesh">Bhagyesh</option>
                </select>
            </div>
            <div className="form-group">
                <label>Location</label> {/* New field for Location */}
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter test drive location"
                    required
                />
            </div>
            <div className="form-group">
                <label>Passkey</label> {/* New field for Passkey */}
                <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter your unique Passkey"
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Booking...' : 'Book Test Drive'}
            </button>
            {loading && <p>Loading...</p>}
        </form>
    );
};

export default BookingForm;
