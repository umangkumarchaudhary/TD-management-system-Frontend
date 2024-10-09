import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BACKEND_URL = 'https://td-management-system-backend.onrender.com';

const BookingForm = ({ onBookingSuccess }) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const [date, setDate] = useState(today);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [carModel, setCarModel] = useState('');
    const [consultantName, setConsultantName] = useState('');
    const [location, setLocation] = useState('');
    const [passkey, setPasskey] = useState('');

    const [carOptions] = useState([
        'A200 : Spectral Blue', 'A200d : cosmos Black', 'A200 : indium Silver','C220d : Mojave Silver', 'C220d : Opalite White','c200 : white', 'C 300 : Sodalite Blue',
        'E220d : Graphite Grey','E220d : Polar white(workshop)','E200 : Polar White','E 350d : Graphite Grey','GLA220d 4 matic(AMG LINE): Mountain Grey','GLA 200 : Cosmos Black',
        'GLC220d : Obsidian Black','GLC 300 4M : Polar white','GLE 300d : Sodalite Blue','GLE 300d : Hitech Silver',
        'GLS450d : Blue',
        'GLS450 : Selenite Grey','EQA250+ : Black','EQB 350 4Matic : Digital White', 'EQE 500 : Diamond White', 'AMG GLE 53 : Obsidian Black', 'EQS 580 : Graphite Grey'
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
        'Anmol': 'anmol1234',
        'Durgesh': 'durgesh1234',
        'Vaibhav': 'vaibhav1234',
        'Sushil': 'sushil1234',
        'Ajinkya': 'ajinkya1234',
        'Bhagyesh': 'bhagyesh1234',
        'Hemant GM sales': 'hemant1234',
        'Ankit Biswal': 'ankit1234',
        'Rachana': 'rachana1234',
        'Vikram': 'vikram1234',
        'Chauffer': 'chauffer1234',
        'Ashish' : 'ashish1234',
        'Zakir' : 'zakir1234',
        'Vishal' :'vishal1234',
        'OtherTaskLikeFuelingorWashing' : 'other1234',
    };

    useEffect(() => {
        const generateTimeOptions = () => {
            const options = [];
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const selectedDate = new Date(date);

            let startHour = 1;
            let endHour = 23;

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

        generateTimeOptions();
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
                    min={today} // Ensure the minimum date is today
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
                                    ? ` (Unavailable - Booked by ${booking.consultantName} from ${booking.startTime} to ${booking.endTime})`
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
                    {/* ...Consultant options */}
                    <option value="Umang">Umang</option>
                    <option value="King">King</option>
                    <option value="Harsh">Harsh</option>
                    <option value="Aditya">Aditya</option>
                    <option value="Shefali Jain">Shefali Jain</option>
                    <option value="Amogh">Amogh</option>
                    <option value= "Anmol"> Anmol</option>
                    <option value="Nidhi">Nidhi</option>
                    <option value="Imaad">Imaad</option>
                    <option value="Durgesh">Durgesh</option>
                    <option value="Vaibhav">Vaibhav</option>
                    <option value="Sushil">Sushil</option>
                    <option value ="Ajinkya"> Ajinkya</option>
                    <option value = "Bhagyesh">Bhagyesh</option>
                    <option value = "Hemant GM sales"> Hemant GM sales</option>
                    <option value = "Ankit Biswal"> Ankit </option>
                    <option value = "Rachana">Rachana Bagav</option>
                    <option value = "Vikram">Vikram</option>
                    <option value = "Vishal">Vishal</option>
                    <option value = "Zakir">Zakir</option>
                    <option value = "Abhijeet">Abhijeet</option>
                    <option value = "Ashish">Ashish</option>
                    <option value = "Chauffer">Chauffer</option>
                    <option value = "OtherTaskLikeFuelingorWashing">Fueling/Washing</option>
                </select>
            </div>
            <div className="form-group">
                <label>Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter test drive location"
                    required
                />
            </div>
            <div className="form-group">
                <label>Passkey</label>
                <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter passkey"
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Booking'}
            </button>
        </form>
    );
};

export default BookingForm;
