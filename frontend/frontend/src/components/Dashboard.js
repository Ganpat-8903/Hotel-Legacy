import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css'; // Import the CSS file

const Dashboard = () => {
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <h2>Dashboard</h2>
                <ul>
                    <li><Link to="/room_management">Room Management</Link></li>
                    <li><Link to="/get_available_rooms">Display Available Rooms</Link></li>
                    <li><Link to="/booked_rooms">Display Booked Rooms</Link></li>
                    <li><Link to="/booking_management">Booking Management</Link></li>
                    <li><Link to="/staff_management">Staff Management</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
