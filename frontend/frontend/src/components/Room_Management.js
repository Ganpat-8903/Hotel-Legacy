import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/room_management.css";

const Room_Management = () => {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ room_type: '', room_number: '', price: '', quantity: '', room_type_custom: '', image: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    // Define available room types
    const [roomTypes, setRoomTypes] = useState(['Single', 'Suite', 'Deluxe', 'Family', 'Custom']);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/get_rooms/');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRoom({ ...newRoom, [name]: value });
    };

    const handleEditInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentRoom({ ...currentRoom, [name]: value });
    };

    const handleEditImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentRoom({ ...currentRoom, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddRoom = async (e) => {
        try {
            e.preventDefault();
            
            if (parseInt(newRoom.price) < 0) {
                setErrorMessage('price must not be negative!');
                return;
            }
            if (parseInt(newRoom.quantity) <= 0) {
                setErrorMessage('quantity must not be negative or zero!');
                return;
            }
            const quantity = parseInt(newRoom.quantity, 10);
            const startingRoomNumber = parseInt(newRoom.room_number, 10);

            if (isNaN(quantity) || isNaN(startingRoomNumber)) {
                setErrorMessage('Enter quantity or room number');
                return;
            }

            const roomsToAdd = [];
            for (let i = 0; i < quantity; i++) {
                const room = {
                    room_type: newRoom.room_type === "Custom" ? newRoom.room_type_custom : newRoom.room_type,
                    room_number: (startingRoomNumber + i).toString(),
                    price: newRoom.price,
                    image: newRoom.image
                };
                roomsToAdd.push(room);
            }

            const responses = await Promise.all(
                roomsToAdd.map(room => axios.post('http://localhost:8000/add_room/', room))
            );

            const successResponses = responses.filter(response => response.data.message === "Room added successfully");

            if (successResponses.length > 0) {
                const roomsWithId = successResponses.map((response, index) => ({
                    ...roomsToAdd[index],
                    room_id: response.data.room_id
                }));
                setRooms([...rooms, ...roomsWithId]);
                setNewRoom({ room_type: '', room_number: '', price: '', quantity: '', image: '' });
                setErrorMessage('');
            } else {
                setErrorMessage('Some rooms could not be added');
            }
            e.target.reset();
        } catch (error) {
            if (error.response && error.response.data.message === 'Room number already exists') {
                setErrorMessage('This room already exists');
            } else {
                setErrorMessage('Error adding rooms');
            }
        }
    };

    const handleEditRoom = async (e) => {
        e.preventDefault();
        if (currentRoom && currentRoom.room_id) {
            const response = await axios.put(`http://localhost:8000/edit_room/${currentRoom.room_id}/`, currentRoom);

            if (response.data.message === "Room updated successfully") {
                setRooms(rooms.map(room =>
                    room.room_id === currentRoom.room_id ? { ...currentRoom, ...response.data } : room
                ));
                setCurrentRoom(null);
            }
        }
        e.target.reset();
    };

    const handleDeleteRoom = async (room_id) => {
        try {
            await axios.delete(`http://localhost:8000/delete_room/${room_id}/`);
            setRooms(rooms.filter(room => room.room_id !== room_id));
        } catch (error) {
            setErrorMessage('Error deleting room');
        }
    };

    const handleFilter = () => {
        if (searchTerm === "") {
            return rooms;
        }
        const filteredRooms = rooms.filter(room =>
            room.room_number && room.room_number.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredRooms;
    }
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewRoom({ ...newRoom, image: reader.result });  // This is base64 encoded
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container">
            <h2>Room Management</h2>

            <div className="add-room-container">
                <form className="add-room" onSubmit={handleAddRoom}>
                    <h3>Add New Room</h3>
                    <label htmlFor="room_type">Room Type</label>
                    <select
                        name="room_type"
                        required
                        value={newRoom.room_type}
                        onChange={handleInputChange}
                    >
                        <option value="" hidden>Select Room Type</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {newRoom.room_type === 'Custom' && (
                        <input
                            type="text"
                            required
                            name="room_type_custom"
                            placeholder="Custom Room Type"
                            value={newRoom.room_type_custom || ''}
                            onChange={handleInputChange}
                        />
                    )}
                    <label htmlFor="room_number">Room Number</label>
                    <input
                        type="number"
                        name="room_number"
                        placeholder="Starting Room Number"
                        value={newRoom.room_number}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newRoom.price}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={newRoom.quantity}
                        onChange={handleInputChange}
                        required
                    />
                    <label htmlFor="image">Image</label>
                    <input
                        required
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button type="submit">Add Room</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>

            {/* Search Room */}
            <div className="search-room">
                <input
                    type="text"
                    placeholder="Search Room by Room Number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Edit Room */}
            {currentRoom && (
                <div className="edit-room-container">
                    <form className="edit-room" onSubmit={handleEditRoom}>
                        <h3>Edit Room</h3>
                        <label htmlFor="room_type">Room Type</label>
                        <select
                            name="room_type"
                            value={currentRoom.room_type}
                            onChange={handleEditInputChange}
                        >
                            <option value="" hidden>Select Room Type</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        {currentRoom.room_type === 'Custom' && (
                            <input
                                type="text"
                                name="room_type_custom"
                                placeholder="Custom Room Type"
                                value={currentRoom.room_type_custom || ''}
                                onChange={handleEditInputChange}
                            />
                        )}

                        <label htmlFor="room_number">Room Number</label>
                        <input
                            type="number"
                            name="room_number"
                            placeholder="Room Number"
                            value={currentRoom.room_number}
                            onChange={handleEditInputChange}
                        />

                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={currentRoom.price}
                            onChange={handleEditInputChange}
                        />

                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                        />
                        <button type='submit' >Save</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            )}

            <div className="rooms-list">
                <h3>Rooms List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Room Type</th>
                            <th>Room Number</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {handleFilter().map(room => (
                            <tr key={room.room_id}>
                                <td>{room.room_type}</td>
                                <td>{room.room_number}</td>
                                <td>{room.price}</td>
                                <td>
                                    {room.image && <img src={room.image} alt={room.room_number} style={{ width: '100px', height: 'auto' }} />}
                                </td>
                                <td>
                                    <button className="edit" onClick={() => setCurrentRoom(room)}>Edit</button>
                                    <button className="delete" onClick={() => handleDeleteRoom(room.room_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Room_Management;