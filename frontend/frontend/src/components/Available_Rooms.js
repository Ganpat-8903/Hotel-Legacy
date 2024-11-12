import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../styles/available_rooms.css'
const Available_Rooms = () => {
    const [availableRooms, setAvailableRooms] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchAvailableRooms();
    }, []);

    const fetchAvailableRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get_available_rooms/');
            setAvailableRooms(response.data);
        } catch (error) {
            setErrorMessage('Error fetching available rooms');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Available Rooms</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="row">
                {availableRooms.length === 0 ? (
                    <p>No available rooms at the moment</p>
                ) : (
                    availableRooms.map(room => (
                        <div key={room.room_id} className="col-md-4 mb-4">
                            <div className="card">
                               { room.image && <img src={room.image} alt={`Room ${room.room_number}`} className="card-img-top" />}
                                <div className="card-body">
                                    <h5 className="card-title custom-card-title">{room.room_type}</h5>
                                    <p className="card-text custom-card-text">Room Number: {room.room_number}</p>
                                    <p className="card-text custom-card-text">Price: Rs {room.price} per day</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Available_Rooms;
