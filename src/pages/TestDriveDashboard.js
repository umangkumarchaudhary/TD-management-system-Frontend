import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Cell } from 'recharts';
import './TestDriveDashboard.css';

// Function to generate a color based on the index
const getColor = (index) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57', '#f45b5b', '#3cba9f'];
    return colors[index % colors.length];
};

const BACKEND_URL = 'https://td-management-system-backend.onrender.com'; // Add your backend URL here

const TestDriveDashboard = () => {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [months, setMonths] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/bookings`); // Adjust endpoint as needed
                setData(data);
                const uniqueMonths = Array.from(new Set(data.map(item => new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' }))));
                setMonths(uniqueMonths);
                if (uniqueMonths.length > 0) {
                    setSelectedMonth(uniqueMonths[0]);
                }
            } catch (error) {
                console.error('Error fetching test drive data:', error);
            }
        };

        fetchData();
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const filteredData = data.filter(item => new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' }) === selectedMonth);

    // Prepare data for Total Test Drives by Consultant graph
    const totalTestDrivesData = filteredData.reduce((acc, item) => {
        const consultantName = item.consultantName;
        if (!acc[consultantName]) acc[consultantName] = 0;
        acc[consultantName]++;
        return acc;
    }, {});

    const totalTestDrivesGraphData = Object.keys(totalTestDrivesData || {}).map((consultantName, index) => ({
        consultantName,
        count: totalTestDrivesData[consultantName],
        fill: getColor(index), // Assign a color to each consultant
    }));

    // Prepare data for Car Models graph
    const carModelsData = filteredData.reduce((acc, item) => {
        const carModel = item.carModel;
        if (!acc[carModel]) acc[carModel] = 0;
        acc[carModel]++;
        return acc;
    }, {});

    const carModelsGraphData = Object.keys(carModelsData || {}).map((carModel, index) => ({
        carModel,
        count: carModelsData[carModel],
        fill: getColor(index), // Assign a color to each car model
    }));

    return (
        <div className="test-drive-dashboard">
            <div className="month-selector">
                <label htmlFor="month">Select Month:</label>
                <select id="month" value={selectedMonth} onChange={handleMonthChange}>
                    {months.map(month => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <h2>Total Test Drives by Consultant</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={totalTestDrivesGraphData} margin={{ top: 20, right: 50, bottom: 60, left: 60 }}>
                    <XAxis 
                        dataKey="consultantName" 
                        angle={-45} 
                        textAnchor="end"
                        height={100} // Increase space for labels
                        tickFormatter={(value) => value} // Ensure full name is shown
                    >
                        <Label value="Consultant Name" position="insideBottomRight" offset={-10} />
                    </XAxis>
                    <YAxis>
                        <Label value="Total Test Drives" angle={-90} position="insideLeft" offset={10} />
                    </YAxis>
                    <Tooltip />
                    <Bar dataKey="count">
                        {totalTestDrivesGraphData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <h2>Total Test Drives by Car Model</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={carModelsGraphData} margin={{ top: 20, right: 50, bottom: 60, left: 60 }}>
                    <XAxis 
                        dataKey="carModel" 
                        angle={-45} 
                        textAnchor="end"
                        height={100} // Increase space for labels
                        tickFormatter={(value) => value} // Ensure full name is shown
                    >
                        <Label value="Car Model" position="insideBottomRight" offset={-10} />
                    </XAxis>
                    <YAxis>
                        <Label value="Total Test Drives" angle={-90} position="insideLeft" offset={10} />
                    </YAxis>
                    <Tooltip />
                    <Bar dataKey="count">
                        {carModelsGraphData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TestDriveDashboard;
