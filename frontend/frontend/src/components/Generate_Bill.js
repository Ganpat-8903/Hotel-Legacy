import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../styles/generate_bill.css"; // Ensure you have CSS for styling

const Generate_Bill = () => {
    const { bookingId } = useParams(); // Assuming you're using React Router to get bookingId from URL
    const [bill, setBill] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/generate_bill/?booking_id=${bookingId}`);
                setBill(response.data);
            } catch (err) {
                setError('Error fetching bill details.');
                console.error('Error:', err);
            }
        };

        fetchBill();
    }, [bookingId]);

    return (
        <div className="bill-page">
            <h2>Generate Bill</h2>
            {error && <p className="error-message">{error}</p>}
            {bill ? (
                <div className="bill-details">
                    <h3>Customer Details</h3>
                    <p><strong>Name:</strong> {bill.customer_name}</p>
                    <p><strong>Email:</strong> {bill.customer_email}</p>
                    <h3>Room Details</h3>
                    <p><strong>Room Number:</strong> {bill.room_number}</p>
                    <p><strong>Room Type:</strong> {bill.room_type}</p>
                    <p><strong>Amount Per Day:</strong> Rs {bill.amount_per_day}</p>
                    <p><strong>Number of Days:</strong> {bill.number_of_days}</p>
                    <p><strong>Total Amount:</strong> Rs {bill.total_amount}</p>
                    <h3>Stay Duration</h3>
                    <p><strong>Check-In Date:</strong> {bill.check_in_date}</p>
                    <p><strong>Check-Out Date:</strong> {bill.check_out_date}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Generate_Bill;
