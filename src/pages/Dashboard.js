import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Calendar from 'react-calendar'; // Ensure correct import
import 'react-calendar/dist/Calendar.css'; // Import default styles
import './Dashboard.css';

const BACKEND_URL = 'https://td-management-system-backend.onrender.com'; // Add your backend URL here

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#d6a0ff', '#ff6f61'];

const Dashboard = ({ refreshTrigger }) => {
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // State to manage the selected date

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
    }, [refreshTrigger]);

    // Format date as YYYY-MM-DD for comparison
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const selectedDateString = formatDate(selectedDate);

    const filteredBookings = bookings.filter(booking => 
        formatDate(new Date(booking.date)) === selectedDateString
    );

    const graphData = filteredBookings.map(booking => {
        const startTime = new Date(`1970-01-01T${booking.startTime}:00`);
        const endTime = new Date(`1970-01-01T${booking.endTime}:00`);
        const startMinutes = startTime.getHours() * 60 + startTime.getMinutes() + 40;
        const endMinutes = endTime.getHours() * 60 + endTime.getMinutes() + 40;
        const duration = endMinutes - startMinutes;

        return {
            carModel: booking.carModel,
            startTimeMinutes: startMinutes,
            duration,
            startTimeLabel: startTime.toTimeString().slice(0, 5),
            endTimeLabel: endTime.toTimeString().slice(0, 5),
            bookedBy: booking.consultantName,
        };
    });

    // Create a map to store colors for each car model
    const colorMap = {};
    graphData.forEach((entry, index) => {
        if (!colorMap[entry.carModel]) {
            colorMap[entry.carModel] = colors[index % colors.length];
        }
    });

    return (
        <div className="dashboard">
            <h2>Bookings for {selectedDateString}</h2>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={graphData} layout="vertical" barCategoryGap="20%">
                    <XAxis 
                        type="number" 
                        domain={[0, 24 * 60]} 
                        tickFormatter={(tick) => {
                            const hours = Math.floor(tick / 60);
                            const minutes = tick % 60;
                            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                        }}
                        label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }}
                        ticks={Array.from({ length: 25 }, (_, i) => i * 60)}
                    />
                    <YAxis type="category" dataKey="carModel" />
                    <Tooltip 
                        content={({ payload }) => {
                            if (!payload || !payload.length) return null;
                            const { bookedBy, startTimeLabel, endTimeLabel } = payload[0].payload;
                            return (
                                <div className="custom-tooltip">
                                    <p className="label">{`Booked by: ${bookedBy}`}</p>
                                    <p className="desc">{`Time: ${startTimeLabel} - ${endTimeLabel}`}</p>
                                </div>
                            );
                        }}
                    />
                    <Bar 
                        dataKey="duration" 
                        fill="#8884d8"
                        background={{ fill: '#eee' }}
                        isAnimationActive={false}
                        barSize={20}
                    >
                        {graphData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={colorMap[entry.carModel]} // Assign color based on car model
                                x={entry.startTimeMinutes} // Adjust the x position by the start time
                                width={entry.duration} // Adjust the width by the duration
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="calendar-container">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                />
            </div>
        </div>
    );
};

export default Dashboard;
