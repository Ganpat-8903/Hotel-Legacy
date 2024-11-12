import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../styles/available_rooms.css'; // Assuming this is your CSS file for booked rooms

const Booked_Rooms = () => {
    const [bookedRooms, setBookedRooms] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchBookedRooms();
    }, []);

    const fetchBookedRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get_bookings/');
            setBookedRooms(response.data);
        } catch (error) {
            setErrorMessage('Error fetching booked rooms');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Booked Rooms</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="row">
                {bookedRooms.length === 0 ? (
                    <p>No booked rooms at the moment</p>
                ) : (
                    bookedRooms.map(booking => (
                        <div key={booking.room.room_id} className="col-md-4 mb-4">
                            <div className="card">
                                {booking.room.image && (
                                    <img
                                        src={booking.room.image}
                                        alt={`Room ${booking.room.room_number}`}
                                        className="card-img-top"
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title custom-card-title">{booking.room.room_type}</h5>
                                    <p className="card-text custom-card-text">Room Number: {booking.room.room_number}</p>
                                    <p className="card-text custom-card-text">Price: Rs {booking.room.price} per day</p>
                                    <p className="card-text custom-card-text">Customer: {booking.customer_name}</p>
                                    <p className="card-text custom-card-text">
                                        Check-in: {new Date(booking.check_in_date).toLocaleDateString()}
                                    </p>
                                    <p className="card-text custom-card-text">
                                        Check-out: {new Date(booking.check_out_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Booked_Rooms;
